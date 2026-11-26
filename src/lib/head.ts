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
};

/**
 * Per-page <head> matching the Astro BaseLayout. Site-wide tags (charset, icons, fonts,
 * analytics) live in void.config.ts `head`. Set the canonical here only: links concatenate.
 */
export function seoHead(input: SeoHeadInput): HeadConfig {
  const title = input.title ?? BRAND.name;
  const description = input.description ?? BRAND.description;
  const canonical = input.canonical ?? new URL(input.path, SITE_ORIGIN).toString();
  const ogImage = input.ogImage ?? new URL('/og-image.png', SITE_ORIGIN).toString();
  const jsonLd = input.jsonLd ? (Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd]) : [];

  const meta: NonNullable<HeadConfig['meta']> = [{ name: 'description', content: description }];
  if (input.noIndex) meta.push({ name: 'robots', content: 'noindex, nofollow' });
  meta.push(
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: ogImage },
    { property: 'og:site_name', content: BRAND.name },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  );

  const script: NonNullable<HeadConfig['script']> = jsonLd.map((item) => ({
    type: 'application/ld+json',
    innerHTML: safeJsonLdStringify(item),
  }));
  if (input.ads) {
    script.push({
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
      async: '',
      crossorigin: 'anonymous',
    });
  }

  return { title, titleTemplate: '', meta, link: [{ rel: 'canonical', href: canonical }], script };
}
