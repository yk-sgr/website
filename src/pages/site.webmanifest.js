import { SITE } from '../consts.ts';

/** Generated rather than kept in `public/`, so the strings track `consts.ts`. */
export function GET() {
  const manifest = {
    name: SITE.title,
    short_name: 'Yannick',
    description: SITE.description,
    start_url: '/',
    display: 'minimal-ui',
    background_color: '#fcfcfc',
    theme_color: '#fcfcfc',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
