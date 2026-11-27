import { defineHandler } from 'void';
import { SITE_ORIGIN } from '../src/lib/head';

/**
 * robots.txt — allow public crawl surface, block private surfaces, point to sitemap.
 * Keep in sync with noIndex routes (compare, search, 404, admin layout, portal layout).
 */
export const GET = defineHandler(() => {
  const base = SITE_ORIGIN;

  const body = `# Find A Dumpster
User-agent: *
Allow: /

# Private / non-indexable surfaces
Disallow: /admin
Disallow: /admin/
Disallow: /portal
Disallow: /portal/
Disallow: /compare
Disallow: /compare?

# Faceted search URLs are thin duplicates; /search itself is noindex, follow
Disallow: /search?

Sitemap: ${base}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
});
