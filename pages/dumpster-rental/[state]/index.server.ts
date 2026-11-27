import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../../../src/lib/db';
import { formatCurrency } from '../../../src/lib/geo';
import { SITE_ORIGIN, seoHead } from '../../../src/lib/head';
import { getStateDirectory } from '../../../src/lib/search';
import { breadcrumbJsonLd, itemListJsonLd, pageTitle } from '../../../src/lib/seo';
import { stateName } from '../../../src/lib/states';
import { notFound } from '../../../src/server/not-found';
import { withShared } from '../../../src/server/shared';

export const revalidate = 300;

export const loader = defineHandler(withShared, async (c) => {
  const stateSlug = c.req.param('state');
  if (!stateSlug) return notFound(c);

  const data = await getStateDirectory(getDb(), stateSlug.toLowerCase());
  if (!data) return notFound(c);

  const name = stateName(data.state);
  return {
    state: { abbr: data.state, slug: data.stateSlug, name },
    // Cities with listings first (biggest lineup first), then the ones still being built out.
    cities: data.cities
      .map((city) => ({ name: city.name, slug: city.slug, operatorCount: city.operatorCount }))
      .sort((a, b) => b.operatorCount - a.operatorCount || a.name.localeCompare(b.name)),
    operators: data.operators.map((op) => ({
      name: op.name,
      slug: op.slug,
      hq: op.hqCity && op.hqState ? `${op.hqCity}, ${op.hqState}` : null,
      price:
        op.pricingMin != null && op.pricingMax != null
          ? `${formatCurrency(op.pricingMin)}–${formatCurrency(op.pricingMax)}`
          : null,
      cityNames: op.cityNames,
    })),
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>((_c, { state, cities, operators }) => {
  const listed = cities.filter((city) => city.operatorCount > 0);
  const topCities = listed
    .slice(0, 3)
    .map((city) => city.name)
    .join(', ');
  const url = `${SITE_ORIGIN}/dumpster-rental/${state.slug}`;
  const description =
    operators.length > 0
      ? `Compare ${operators.length} verified dumpster rental operator${operators.length === 1 ? '' : 's'} across ${state.name}${topCities ? `, including ${topCities}` : ''}. Pricing ranges, permit notes & free quotes.`
      : `Dumpster rental in ${state.name}: sizes, permit notes and pricing guidance while we verify local operators.`;
  return seoHead({
    path: `/dumpster-rental/${state.slug}`,
    title: pageTitle(`${state.name} Dumpster Rental (${state.abbr})`),
    description: description.length <= 160 ? description : description.slice(0, 157).trimEnd() + '…',
    // Same bar as city pages: no verified operators means a thin page.
    noIndex: operators.length === 0,
    jsonLd: [
      itemListJsonLd(
        listed.map((city) => ({ name: city.name, url: `${url}/${city.slug}` })),
        `Dumpster rental cities in ${state.name}`,
      ),
      breadcrumbJsonLd([
        { name: 'Home', url: SITE_ORIGIN },
        { name: state.name, url },
      ]),
    ],
  });
});
