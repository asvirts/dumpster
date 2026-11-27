import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../../src/lib/db';
import { SITE_ORIGIN, seoHead } from '../../src/lib/head';
import { getAreaPriceAverage, getOperatorBySlug } from '../../src/lib/search';
import { breadcrumbJsonLd, operatorJsonLd, pageTitle } from '../../src/lib/seo';
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
  // When the company doesn't publish prices, show what other local companies
  // publish instead, clearly labeled as an area average (never as this company's price).
  const primaryCityId = op.serviceAreas.find((a) => a.cityId)?.cityId ?? null;
  const areaAverage =
    !hasPublishedPrice && primaryCityId ? await getAreaPriceAverage(db, primaryCityId, op.id) : null;

  const cities = op.serviceAreas
    .map((a) => (a.city ? `${a.city.name}, ${a.city.state}` : null))
    .filter(Boolean) as string[];

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
    cities: [...new Set(cities)],
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
  const { op } = props;
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
        { name: 'Search', url: `${SITE_ORIGIN}/search` },
        { name: op.name, url: `${SITE_ORIGIN}/operator/${op.slug}` },
      ]),
    ],
  });
  return { ...head, script: [...(head.script ?? []), ...turnstileHead(props.quote)] };
});
