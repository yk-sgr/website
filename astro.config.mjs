// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

const SITE_URL = 'https://yseeger.me';

/**
 * Links in a post that leave the site open in their own tab, matching what
 * `external()` does for the links rendered by components.
 */
const externalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      if (!/^https?:\/\//i.test(href) || href.startsWith(SITE_URL)) return;
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', 'noopener noreferrer');
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [sitemap()],
  // The old site published posts under /posts/. Keep those URLs alive.
  redirects: {
    '/posts/[...slug]': '/blog/[...slug]',
  },
  // Self-hosted at build time. No third-party font requests, which also keeps
  // the site clean under GDPR.
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: ['300 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    {
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      provider: fontProviders.fontsource(),
      weights: ['400 500'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  ],
  markdown: {
    // A quiet highlighter, so code sits at the same volume as the prose.
    shikiConfig: {
      theme: 'vitesse-light',
    },
    processor: satteri({ hastPlugins: [externalLinks] }),
  },
});
