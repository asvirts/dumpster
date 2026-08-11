import type { APIRoute } from 'astro';

const SITE_FALLBACK = 'https://findadumpster.net';

/**
 * robots.txt — allow public crawl surface, block private surfaces, point to sitemap.
 * Keep in sync with noIndex routes (compare, 404, admin layout, portal layout).
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() || SITE_FALLBACK).replace(/\/$/, '');

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

# Faceted search URLs are thin duplicates of /search — crawl the hub only
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
};
