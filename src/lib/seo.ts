import { BRAND } from './constants';

export function pageTitle(parts: string | string[]): string {
  const list = Array.isArray(parts) ? parts : [parts];
  return [...list, BRAND.name].join(' | ');
}

export function operatorJsonLd(op: {
  name: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  hqCity: string | null;
  hqState: string | null;
  slug: string;
  siteUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: op.name,
    description: op.description ?? undefined,
    telephone: op.phone ?? undefined,
    url: op.website ?? `${op.siteUrl}/operator/${op.slug}`,
    address:
      op.hqCity && op.hqState
        ? {
            '@type': 'PostalAddress',
            addressLocality: op.hqCity,
            addressRegion: op.hqState,
            addressCountry: 'US',
          }
        : undefined,
  };
}

export function itemListJsonLd(
  items: { name: string; url: string }[],
  listName: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    url: siteUrl,
    logo: `${siteUrl}/logo-mark.png`,
    description: BRAND.description,
  };
}

export function webSiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND.name,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  siteUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    mainEntityOfPage: article.url,
    author: {
      '@type': 'Organization',
      name: BRAND.name,
      url: article.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND.name,
      url: article.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${article.siteUrl}/logo-mark.png`,
      },
    },
  };
}
