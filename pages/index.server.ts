import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../src/lib/db';
import { faqs } from '../src/lib/home-faqs';
import { SITE_ORIGIN, seoHead } from '../src/lib/head';
import { getPriorityCities } from '../src/lib/search';
import { faqJsonLd, organizationJsonLd, pageTitle, webSiteJsonLd } from '../src/lib/seo';
import { withShared } from '../src/server/shared';

export const revalidate = 300;

export const loader = defineHandler(withShared, async () => {
  const cities = await getPriorityCities(getDb());
  return {
    cities: cities.map((c) => ({ name: c.name, state: c.state, slug: c.slug, stateSlug: c.stateSlug })),
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() =>
  seoHead({
    path: '/',
    title: pageTitle('Dumpster Rentals Near You'),
    description:
      'Compare verified local dumpster rentals near you. Transparent pricing ranges, real operators, permit notes, and driveway-safe options — brokers hidden by default.',
    jsonLd: [organizationJsonLd(SITE_ORIGIN), webSiteJsonLd(SITE_ORIGIN), faqJsonLd(faqs)],
  }),
);
