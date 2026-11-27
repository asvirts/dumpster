import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../../../src/lib/db';
import { SITE_ORIGIN, seoHead } from '../../../src/lib/head';
import { getCityWithOperators } from '../../../src/lib/search';
import { stateName } from '../../../src/lib/states';
import {
  breadcrumbJsonLd,
  cityPageDescription,
  cityPageTitle,
  faqJsonLd,
  itemListJsonLd,
} from '../../../src/lib/seo';
import { quoteFormContext, submitQuote, turnstileHead } from '../../../src/server/quote';
import { notFound } from '../../../src/server/not-found';
import { withShared } from '../../../src/server/shared';

export const revalidate = 300;

export const loader = defineHandler(withShared, async (c) => {
  const state = c.req.param('state');
  const citySlug = c.req.param('city');
  if (!state || !citySlug) return c.redirect('/search');

  const data = await getCityWithOperators(getDb(), state.toLowerCase(), citySlug.toLowerCase());
  if (!data) return notFound(c);
  const { city, operators: ops } = data;

  const faqs = [
    {
      question: `How much does dumpster rental cost in ${city.name}?`,
      answer:
        city.typicalPricingNotes ||
        `Pricing in ${city.name} varies by size, weight, dump fees, and rental length. Compare ranges on local operator profiles and always confirm an all-in quote before booking.`,
    },
    {
      question: `Do I need a permit for a dumpster in ${city.name}?`,
      answer:
        city.localPermitSummary ||
        `Street placement in ${city.name} often requires a municipal right-of-way permit. Private driveway placement is usually simpler — confirm with the city and your operator.`,
    },
    {
      question: 'What dumpster size should I rent?',
      answer:
        'Most residential cleanouts and remodels use 10–20 yard roll-offs. Roofing, heavy debris, and large construction jobs may need 20–40 yards or dedicated concrete/dirt boxes. See our size guide for project-based recommendations.',
    },
    {
      question: `What should I know before delivery in ${city.name}?`,
      answer:
        city.specialRules ||
        `Share driveway width, overhead clearance, and placement preference with the operator. Ask about plywood protection, weight limits, and prohibited materials before the drop.`,
    },
  ];

  const markers = ops
    .filter((o) => o.hqLat != null && o.hqLng != null)
    .map((o) => ({ id: o.id, name: o.name, slug: o.slug, lat: o.hqLat as number, lng: o.hqLng as number }));

  const quote = quoteFormContext(c, { hash: 'quote' });
  // Not on the render after a quote submit, which shows this visitor's form result (flash cookie).
  if (!quote.feedback) {
    c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  }

  return {
    city: {
      id: city.id,
      name: city.name,
      state: city.state,
      stateName: stateName(city.state),
      slug: city.slug,
      stateSlug: city.stateSlug,
      lat: city.lat,
      lng: city.lng,
      typicalPricingNotes: city.typicalPricingNotes,
      localPermitSummary: city.localPermitSummary,
      specialRules: city.specialRules,
    },
    operators: ops,
    markers,
    faqs,
    quote,
  };
});

export type Props = InferProps<typeof loader>;

export const actions = {
  submitQuote: defineHandler(withShared, (c) => submitQuote(c, 'quote')),
};

export const head = defineHead<Props>((c, props) => {
  const { city, operators: ops, faqs } = props;
  const head = seoHead({
    path: new URL(c.req.url).pathname,
    title: cityPageTitle(city.name, city.state),
    description: cityPageDescription({
      cityName: city.name,
      state: city.state,
      pricingNotes: city.typicalPricingNotes,
    }),
    // No verified operators yet: thin page, kept out of the index (and the sitemap) until it has some.
    noIndex: ops.length === 0,
    jsonLd: [
      itemListJsonLd(
        ops.map((o) => ({ name: o.name, url: `${SITE_ORIGIN}/operator/${o.slug}` })),
        `Dumpster rentals in ${city.name}, ${city.state}`,
      ),
      breadcrumbJsonLd([
        { name: 'Home', url: SITE_ORIGIN },
        { name: city.stateName, url: `${SITE_ORIGIN}/dumpster-rental/${city.stateSlug}` },
        { name: city.name, url: `${SITE_ORIGIN}/dumpster-rental/${city.stateSlug}/${city.slug}` },
      ]),
      faqJsonLd(faqs),
    ],
  });
  return { ...head, script: [...(head.script ?? []), ...turnstileHead(props.quote)] };
});
