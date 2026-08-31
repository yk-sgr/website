import { SITE } from '../consts';

/**
 * Anchor attributes for a link that leaves the site. Internal paths, `mailto:`
 * and the feed stay in the current tab, so callers can spread this on every
 * link without checking first.
 */
export function external(href: string) {
  const leavesSite = /^https?:\/\//i.test(href) && !href.startsWith(SITE.url);
  return leavesSite
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};
}
