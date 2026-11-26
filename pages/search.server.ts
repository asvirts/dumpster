import { nanoid } from 'nanoid';
import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../src/lib/db';
import { seoHead } from '../src/lib/head';
import { events } from '../src/lib/schema';
import { searchOperators } from '../src/lib/search';
import { pageTitle } from '../src/lib/seo';
import { quoteFormContext, submitQuote, turnstileHead } from '../src/server/quote';
import { withShared } from '../src/server/shared';

// Results depend on the query string, which ISR ignores: never cache this page.
export const revalidate = 0;

/** Compare bar (OperatorCard "Compare" checkboxes). Delegated, so it needs no hydration. */
const COMPARE_BAR_SCRIPT = `document.addEventListener('change',function(e){var t=e.target;if(!(t instanceof HTMLInputElement)||!t.classList.contains('compare-check'))return;var all=[].slice.call(document.querySelectorAll('.compare-check'));var checks=all.filter(function(c){return c.checked});var bar=document.getElementById('compare-bar'),count=document.getElementById('compare-count'),link=document.getElementById('compare-link');if(!bar||!count||!link)return;if(checks.length===0){bar.classList.add('hidden');return}bar.classList.remove('hidden');count.textContent=String(checks.length);var ids=checks.map(function(c){return c.value}).slice(0,4);link.href='/compare?ids='+ids.join(',');if(ids.length>=2)link.classList.remove('pointer-events-none','opacity-50');else link.classList.add('pointer-events-none','opacity-50');all.forEach(function(c){c.disabled=!c.checked&&checks.length>=4})});`;

export const loader = defineHandler(withShared, async (c) => {
  const q = c.req.query('q') ?? '';
  const size = c.req.query('size') ?? '';
  const material = c.req.query('material') ?? '';
  const driveway = c.req.query('driveway') ?? '';
  const sameDay = c.req.query('sameDay') ?? '';
  const verified = c.req.query('verified') ?? '1';
  const brokers = c.req.query('brokers') ?? '0';
  const sort = (c.req.query('sort') as 'quality' | 'price' | 'distance' | undefined) || 'quality';

  const db = getDb();
  const { operators: results, city } = await searchOperators(db, {
    q: q || undefined,
    size: size ? Number(size) : undefined,
    material: material || undefined,
    drivewayOnly: driveway === '1',
    sameDayOnly: sameDay === '1',
    verifiedOnly: verified !== '0',
    excludeBrokers: brokers !== '1',
    sort,
  });

  const quote = quoteFormContext(c);
  // Fire-and-forget analytics (best effort); not on the render after a quote submit.
  if (!quote.feedback) {
    try {
      await db.insert(events).values({
        id: nanoid(),
        type: 'search',
        path: '/search',
        queryJson: JSON.stringify({ q, size, material, count: results.length }),
      });
    } catch {
      /* ignore */
    }
  }

  const markers = results
    .filter((o) => o.hqLat != null && o.hqLng != null)
    .map((o) => ({ id: o.id, name: o.name, slug: o.slug, lat: o.hqLat as number, lng: o.hqLng as number }));

  const cityLabel = city ? `${city.name}, ${city.state}` : '';
  const heading = city
    ? `Dumpster rentals in ${city.name}, ${city.state}`
    : q
      ? `Results for “${q}”`
      : 'Search dumpster rentals';

  return {
    q,
    filters: { q: q || cityLabel, size, material, driveway, sameDay, verified, brokers, sort },
    city: city
      ? { id: city.id, name: city.name, state: city.state, slug: city.slug, stateSlug: city.stateSlug, lat: city.lat, lng: city.lng }
      : null,
    results,
    markers,
    heading,
    defaultZip: /^\d{5}$/.test(q.trim()) ? q.trim() : city ? cityLabel : q,
    quote,
  };
});

export type Props = InferProps<typeof loader>;

export const actions = {
  submitQuote: defineHandler(withShared, (c) => submitQuote(c)),
};

export const head = defineHead<Props>((c, props) => {
  const { city } = props;
  const head = seoHead({
    path: new URL(c.req.url).pathname,
    title: pageTitle(city ? `${city.name} Dumpster Rental` : 'Search'),
    description: `Compare verified dumpster rental operators${city ? ` in ${city.name}, ${city.state}` : ''}.`,
  });
  return {
    ...head,
    script: [...(head.script ?? []), { innerHTML: COMPARE_BAR_SCRIPT }, ...turnstileHead(props.quote)],
  };
});
