# yseeger.me

A small, simple personal blog. Astro static site, markdown-authored.

## Writing a post

Create a new file in `src/content/posts/<slug>.md`:

```md
---
title: Your post title
pubDate: 2026-05-14
---

Body content in markdown.
```

The filename becomes the URL slug. `pubDate` is required.

To draft without publishing, add `draft: true` to the frontmatter. Drafts are
hidden in production builds and visible in `pnpm dev`.

## Development

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # output: dist/
pnpm preview   # serve the production build locally
```

## Deployment

Coolify Static Site application.

- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Publish directory: `dist`
- Auto-deploy on push to `main`.

## Stack

- Astro 6 (static output)
- Content Collections (markdown + Zod schema)
- `@astrojs/rss` for the feed at `/rss.xml`
- System serif typography, plain CSS
