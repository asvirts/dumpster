import type { CloudContext, HeadConfig } from 'void';
import { seoHead } from '../lib/head';
import { pageTitle } from '../lib/seo';

/**
 * Head of the 404 page: title and noindex, no canonical.
 * Void renders `pages/_not-found.vue` with config head + middleware `headDefaults` only (error
 * boundaries have no `head()`), so loaders set this before returning a 404.
 */
export function notFoundHead(): HeadConfig {
  return seoHead({ path: '/404/', title: pageTitle('Page not found'), noIndex: true });
}

/**
 * `return notFound(c)` from a page loader: renders `_not-found` with a 404 and the Astro 404 head
 * (title, noindex). Plain `c.notFound()` also works but gets Void's default "Not Found" title.
 */
export function notFound(c: CloudContext): Response | Promise<Response> {
  c.set('headDefaults', { ...c.get('headDefaults'), ...notFoundHead() });
  return c.notFound();
}
