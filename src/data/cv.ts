export interface Position {
  role: string;
  company: string;
  href?: string;
  /** Contract shape, e.g. 'self-employed', 'full-time'. */
  employment?: string;
  location?: string;
  mode?: 'remote' | 'hybrid' | 'on-site';
  /** Calendar month the role started, `YYYY-MM`. */
  from: string;
  /** Calendar month it ended. Omit while the role is current. */
  to?: string;
}

/**
 * Newest first, current roles ahead of finished ones, which is why WebPX sits
 * below Cloo despite starting later.
 */
export const POSITIONS: Position[] = [
  {
    role: 'CEO & Co-Founder',
    company: 'Cloo GmbH',
    href: 'https://cloo-gmbh.de',
    employment: 'self-employed',
    location: 'Auerbach/Vogtland, Germany',
    mode: 'hybrid',
    from: '2024-11',
  },
  {
    role: 'Software Developer',
    company: 'WebPX',
    href: 'https://webpx.de',
    employment: 'part-time',
    location: 'Auerbach/Vogtland, Germany',
    mode: 'hybrid',
    from: '2025-07',
    to: '2025-08',
  },
  {
    role: 'Software Developer',
    company: '2peaches',
    href: 'https://www.2peaches.de',
    employment: 'full-time',
    location: 'Reichenbach im Vogtland, Germany',
    mode: 'on-site',
    from: '2024-03',
    to: '2025-04',
  },
  {
    role: 'Software Developer',
    company: 'Homedia',
    href: 'https://www.homedia.com',
    mode: 'remote',
    from: '2020-12',
    to: '2024-03',
  },
];
