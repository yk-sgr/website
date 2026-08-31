import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { CONTRIBUTIONS } from '../consts';

export interface ContributionDay {
  /** ISO calendar date, `YYYY-MM-DD`. */
  date: string;
  github: number;
  gitlab: number;
  total: number;
}

export interface ContributionData {
  /** Contiguous days from `from` to `to`, oldest first. */
  days: ContributionDay[];
  total: number;
  from: string;
  to: string;
  /** Which sources actually answered. A missing source means "no token", not "no activity". */
  sources: { github: boolean; gitlab: boolean };
  fetchedAt: string;
}

const CACHE_FILE = resolve(process.cwd(), '.cache/contributions.json');
const WINDOW_DAYS = 365;
const REQUEST_TIMEOUT = 15_000;

const DAY_MS = 86_400_000;

/**
 * Astro loads `.env` into `import.meta.env` but not into `process.env`, while a
 * CI or Coolify build only sets real shell variables. Check both.
 */
function env(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[name];
  return process.env[name] || fromMeta || undefined;
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Every date from `from` to `to` inclusive. */
function dateRange(from: Date, to: Date): string[] {
  const dates: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) dates.push(toISODate(d));
  return dates;
}

/**
 * The `gh` CLI keeps a token in the system keyring, which makes `pnpm dev` work
 * on a developer machine without any manual setup. Never available in CI.
 */
function githubTokenFromCLI(): string | undefined {
  try {
    return execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || undefined;
  } catch {
    return undefined;
  }
}

function githubToken(): string | undefined {
  return env('GITHUB_TOKEN') || env('GH_TOKEN') || githubTokenFromCLI();
}

const GITHUB_QUERY = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

async function fetchGitHub(
  from: Date,
  to: Date,
): Promise<Map<string, number> | undefined> {
  const token = githubToken();
  if (!token) return undefined;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: GITHUB_QUERY,
      variables: {
        login: CONTRIBUTIONS.githubLogin,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`GitHub responded ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(`GitHub: ${payload.errors[0].message}`);
  }

  const weeks =
    payload.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks) {
    throw new Error(`GitHub returned no calendar for ${CONTRIBUTIONS.githubLogin}`);
  }

  const counts = new Map<string, number>();
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) counts.set(day.date, day.contributionCount);
    }
  }
  return counts;
}

/**
 * GitLab has no contribution-calendar API, so we roll our own from the event
 * stream. A push event stands for however many commits it carried; anything
 * else (merge request, issue, comment, ...) counts once, which lines up with
 * how GitHub tallies a day.
 */
async function fetchGitLab(
  from: Date,
  to: Date,
): Promise<Map<string, number> | undefined> {
  const token = env('GITLAB_TOKEN');
  if (!token) return undefined;

  const host = (env('GITLAB_HOST') || CONTRIBUTIONS.gitlabHost).replace(/\/$/, '');
  const counts = new Map<string, number>();

  // `after` and `before` are both exclusive, so widen the window by a day.
  const params = new URLSearchParams({
    after: toISODate(addDays(from, -1)),
    before: toISODate(addDays(to, 1)),
    per_page: '100',
  });

  // Guard against an unbounded loop if the instance ignores our pagination.
  for (let page = 1; page <= 60; page++) {
    params.set('page', String(page));
    const response = await fetch(`${host}/api/v4/events?${params}`, {
      headers: { 'private-token': token },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(
        `GitLab responded ${response.status} ${response.statusText}`,
      );
    }

    const events = await response.json();
    for (const event of events) {
      const date = event.created_at?.slice(0, 10);
      if (!date) continue;
      const weight = event.push_data?.commit_count ?? 1;
      counts.set(date, (counts.get(date) ?? 0) + weight);
    }

    if (!response.headers.get('x-next-page')) break;
  }

  return counts;
}

function readCache(): ContributionData | undefined {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8')) as ContributionData;
  } catch {
    return undefined;
  }
}

function writeCache(data: ContributionData): void {
  try {
    mkdirSync(dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, `${JSON.stringify(data, null, 2)}\n`);
  } catch {
    // A read-only build environment is not a reason to fail the build.
  }
}

async function settle<T>(
  name: string,
  work: Promise<T | undefined>,
): Promise<T | undefined> {
  try {
    return await work;
  } catch (error) {
    console.warn(
      `[contributions] ${name} failed: ${error instanceof Error ? error.message : error}`,
    );
    return undefined;
  }
}

/**
 * Merged GitHub + GitLab activity for the trailing year.
 *
 * Sources that have no token, or that fail outright, are skipped rather than
 * failing the build. If nothing at all can be reached we fall back to the last
 * successful fetch on disk, and to an empty calendar after that.
 */
export async function getContributions(): Promise<ContributionData> {
  const to = new Date(`${toISODate(new Date())}T00:00:00Z`);
  const from = addDays(to, -(WINDOW_DAYS - 1));

  const [github, gitlab] = await Promise.all([
    settle('GitHub', fetchGitHub(from, to)),
    settle('GitLab', fetchGitLab(from, to)),
  ]);

  if (!github && !gitlab) {
    const cached = readCache();
    if (cached) {
      console.warn('[contributions] no source reachable, serving cached data');
      return cached;
    }
    console.warn('[contributions] no source reachable and no cache, hiding graph');
  }

  const days = dateRange(from, to).map((date) => {
    const gh = github?.get(date) ?? 0;
    const gl = gitlab?.get(date) ?? 0;
    return { date, github: gh, gitlab: gl, total: gh + gl };
  });

  const data: ContributionData = {
    days,
    total: days.reduce((sum, day) => sum + day.total, 0),
    from: toISODate(from),
    to: toISODate(to),
    sources: { github: Boolean(github), gitlab: Boolean(gitlab) },
    fetchedAt: new Date().toISOString(),
  };

  if (github || gitlab) writeCache(data);
  return data;
}
