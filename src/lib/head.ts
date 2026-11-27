import type { HeadConfig } from 'void';
import { ADSENSE_CLIENT, BRAND } from './constants';
import { safeJsonLdStringify } from './urls';

/** Canonical origin for canonicals, OG URLs and JSON-LD (Astro's `site`). */
export const SITE_ORIGIN = 'https://findadumpster.net';

export type SeoHeadInput = {
  /** Request path, used for the default canonical. */
  path: string;
  title?: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
  ogImage?: string;
  /** Load AdSense auto ads (informational pages only). */
  ads?: boolean;
  /** Open Graph type; guides are articles. */
  ogType?: 'website' | 'article';
  /** ISO date for article:modified_time (articles only). */
  modifiedTime?: string;
};

const GA_ID = 'G-1EZY6X8XCW';

/**
 * Per-page <head> matching the Astro BaseLayout, including the analytics scripts (public pages
 * only; portal and admin don't load them). Charset, icons and fonts live in void.config.ts
 * `head`. Set the canonical here only: links concatenate.
 */
export function seoHead(input: SeoHeadInput): HeadConfig {
  const title = input.title ?? BRAND.name;
  const description = input.description ?? BRAND.description;
  const canonical = input.canonical ?? new URL(input.path, SITE_ORIGIN).toString();
  const ogImage = input.ogImage ?? new URL('/og-image.png', SITE_ORIGIN).toString();
  const jsonLd = input.jsonLd ? (Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd]) : [];

  const meta: NonNullable<HeadConfig['meta']> = [{ name: 'description', content: description }];
  // follow: links on a noindexed page (empty city, compare, 404) still pass to real pages.
  if (input.noIndex) meta.push({ name: 'robots', content: 'noindex, follow' });
  meta.push(
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: input.ogType ?? 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: ogImage },
    { property: 'og:site_name', content: BRAND.name },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  );

  if (input.ogType === 'article' && input.modifiedTime) {
    meta.push({ property: 'article:modified_time', content: input.modifiedTime });
  }

  const script: NonNullable<HeadConfig['script']> = jsonLd.map((item) => ({
    type: 'application/ld+json',
    innerHTML: safeJsonLdStringify(item),
  }));
  script.push(
    { src: 'https://analytics.ahrefs.com/analytics.js', 'data-key': 'iwCcxXUCA2L1/PCyM0NfZA', async: '' },
    { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: '' },
    {
      innerHTML: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\n\ngtag('config', '${GA_ID}');`,
    },
  );
  if (input.ads) {
    script.push({
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
      async: '',
      crossorigin: 'anonymous',
    });
  }

  return { title, titleTemplate: '', meta, link: [{ rel: 'canonical', href: canonical }], script };
}
