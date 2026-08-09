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
