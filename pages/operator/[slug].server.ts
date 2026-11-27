import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../../src/lib/db';
import { SITE_ORIGIN, seoHead } from '../../src/lib/head';
import { formatCurrency } from '../../src/lib/geo';
import { getAreaPriceAverage, getOperatorBySlug, searchOperators } from '../../src/lib/search';
import { breadcrumbJsonLd, operatorJsonLd, pageTitle } from '../../src/lib/seo';
import { stateName } from '../../src/lib/states';
import { withUtm } from '../../src/lib/utm';
import { claimFormContext, claimListing } from '../../src/server/claim';
import { quoteFormContext, submitQuote, turnstileHead } from '../../src/server/quote';
import { notFound } from '../../src/server/not-found';
import { withShared } from '../../src/server/shared';

export const revalidate = 300;

export const loader = defineHandler(withShared, async (c) => {
  const slug = c.req.param('slug');
  if (!slug) return notFound(c);

  const db = getDb();
  const op = await getOperatorBySlug(db, slug);
  if (!op) return notFound(c);

  const hasPublishedPrice = op.pricingMin != null && op.pricingMax != null;

  // Service areas as links to their city pages, deduplicated by city.
  const serviceCities = [
    ...new Map(
      op.serviceAreas
        .flatMap((a) => (a.city ? [a.city] : []))
        .map((city) => [city.id, city] as const),
    ).values(),
  ];
  // The HQ city when the company serves it, else its first service area. Drives the breadcrumb,
  // the area price average and the "other companies" list.
  const primaryCity =
    serviceCities.find(
      (city) =>
        city.name.toLowerCase() === op.hqCity?.toLowerCase() &&
        (!op.hqState || city.state === op.hqState.toUpperCase()),
    ) ??
    serviceCities[0] ??
    null;

  // When the company doesn't publish prices, show what other local companies
  // publish instead, clearly labeled as an area average (never as this company's price).
  const [areaAverage, nearbyResult] = await Promise.all([
    !hasPublishedPrice && primaryCity ? getAreaPriceAverage(db, primaryCity.id, op.id) : null,
    primaryCity
      ? searchOperators(db, {
          state: primaryCity.state,
          citySlug: primaryCity.slug,
          verifiedOnly: true,
          excludeBrokers: true,
          sort: 'quality',
        })
      : null,
  ]);
  const otherOperators = (nearbyResult?.operators ?? [])
    .filter((other) => other.id !== op.id)
    .slice(0, 4)
    .map((other) => ({
      name: other.name,
      slug: other.slug,
      price:
        other.pricingMin != null && other.pricingMax != null
          ? `${formatCurrency(other.pricingMin)}–${formatCurrency(other.pricingMax)}`
          : null,
    }));

  return {
    op: {
      id: op.id,
      name: op.name,
      slug: op.slug,
      description: op.description,
      phone: op.phone,
      website: op.website,
      hqCity: op.hqCity,
      hqState: op.hqState,
      pricingMin: op.pricingMin,
      pricingMax: op.pricingMax,
      pricingNotes: op.pricingNotes,
      includedTonnage: op.includedTonnage,
      overageRate: op.overageRate,
      drivewaySuitable: op.drivewaySuitable,
      drivewayNotes: op.drivewayNotes,
      sameDayCapable: op.sameDayCapable,
      verificationStatus: op.verificationStatus,
      lastVerifiedAt: op.lastVerifiedAt,
      insuranceVerified: op.insuranceVerified,
      licenseNotes: op.licenseNotes,
      isBroker: op.isBroker,
      isDemo: op.isDemo,
      updatedAt: op.updatedAt,
      claimStatus: op.claimStatus ?? 'unclaimed',
    },
    hasPublishedPrice,
    areaAverage,
    sizes: op.sizes.map((s) => s.yards).sort((a, b) => a - b),
    materials: op.materials.map((m) => m.material),
    cities: serviceCities
      .map((city) => ({
        label: `${city.name}, ${city.state}`,
        href: `/dumpster-rental/${city.stateSlug}/${city.slug}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    primaryCity: primaryCity
      ? {
          name: primaryCity.name,
          state: primaryCity.state,
          stateName: stateName(primaryCity.state),
          href: `/dumpster-rental/${primaryCity.stateSlug}/${primaryCity.slug}`,
          stateHref: `/dumpster-rental/${primaryCity.stateSlug}`,
        }
      : null,
    otherOperators,
    websiteUrl: withUtm(op.website),
    defaults: {
      zip: c.req.query('zip') ?? '',
      size: c.req.query('size') ?? '',
      material: c.req.query('material') ?? '',
    },
    quote: quoteFormContext(c, { hash: 'quote' }),
    claim: claimFormContext(c),
  };
});

export type Props = InferProps<typeof loader>;

export const actions = {
  submitQuote: defineHandler(withShared, (c) => submitQuote(c, 'quote')),
  claimListing: defineHandler(withShared, claimListing),
};

export const head = defineHead<Props>((c, props) => {
  const { op, primaryCity } = props;
  const locationLabel = op.hqCity && op.hqState ? ` in ${op.hqCity}, ${op.hqState}` : '';
  const head = seoHead({
    path: new URL(c.req.url).pathname,
    title: pageTitle([op.name, `Dumpster Rental${locationLabel}`]),
    description:
      op.description?.slice(0, 155) ||
      `${op.name} — verified dumpster rental${op.hqCity ? ` in ${op.hqCity}, ${op.hqState}` : ''}.`,
    jsonLd: [
      operatorJsonLd({
        name: op.name,
        pricingMin: op.pricingMin,
        pricingMax: op.pricingMax,
        areaServed: props.cities.map((city) => city.label),
        description: op.description,
        phone: op.phone,
        website: op.website,
        hqCity: op.hqCity,
        hqState: op.hqState,
        slug: op.slug,
        siteUrl: SITE_ORIGIN,
      }),
      breadcrumbJsonLd([
        { name: 'Home', url: SITE_ORIGIN },
        ...(primaryCity
          ? [
              { name: primaryCity.stateName, url: `${SITE_ORIGIN}${primaryCity.stateHref}` },
              { name: primaryCity.name, url: `${SITE_ORIGIN}${primaryCity.href}` },
            ]
          : []),
        { name: op.name, url: `${SITE_ORIGIN}/operator/${op.slug}` },
      ]),
    ],
  });
  return { ...head, script: [...(head.script ?? []), ...turnstileHead(props.quote)] };
});
