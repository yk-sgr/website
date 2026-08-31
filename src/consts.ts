export const SITE = {
  title: 'Yannick Seeger',
  description: 'Notes on building software and running a business.',
  author: 'Yannick Seeger',
  url: 'https://yseeger.me',
  lang: 'en',
} as const;

export const NAV = [
  { href: '/blog/', label: 'blog' },
  { href: '/projects/', label: 'projects' },
  { href: '/cv/', label: 'cv' },
] as const;

export const LINKS = [
  { href: 'https://github.com/yk-sgr', label: 'github' },
  { href: 'https://git.cloo-gmbh.de/yannick', label: 'gitlab' },
  { href: 'mailto:yannick@cloo-solutions.de', label: 'email' },
  { href: '/rss.xml', label: 'rss' },
] as const;

/** Where contribution data is pulled from. Tokens come from the environment. */
export const CONTRIBUTIONS = {
  githubLogin: 'yk-sgr',
  gitlabHost: 'https://git.cloo-gmbh.de',
} as const;
