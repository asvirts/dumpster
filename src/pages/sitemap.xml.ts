import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { and, asc, eq, sql } from 'drizzle-orm';
import { getDb } from '../lib/db';
import { cities, operatorServiceAreas, operators } from '../lib/schema';
import {
  absoluteUrl,
  cityPageLastmod,
  maxLastmod,
  renderUrlset,
  type SitemapEntry,
} from '../lib/sitemap';

const SITE_FALLBACK = 'https://findadumpster.net';

const publishedOperator = and(
  eq(operators.isPublished, true),
  eq(operators.isDemo, false),
  eq(operators.isBroker, false),
);

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || SITE_FALLBACK).replace(/\/$/, '');
  const entries: SitemapEntry[] = [];

  // Core indexable landings (lastmod filled after child pages are known).
  const home: SitemapEntry = {
    loc: absoluteUrl(base, '/'),
    changefreq: 'daily',
    priority: 1.0,
  };
  const searchHub: SitemapEntry = {
    loc: absoluteUrl(base, '/search'),
    changefreq: 'daily',
    priority: 0.8,
  };
  const guidesHub: SitemapEntry = {
    loc: absoluteUrl(base, '/guides'),
    changefreq: 'weekly',
    priority: 0.8,
  };
  entries.push(home, searchHub, guidesHub);

  const cityLastmods: Array<string | Date | null | undefined> = [];
  const operatorLastmods: Array<string | Date | null | undefined> = [];
  const guideLastmods: Array<string | Date | null | undefined> = [];

  // City landings that have at least one public listing — stays current as
  // operators are added. Empty cities stay out (thin pages).
  try {
    const db = getDb();
    const cityRows = await db
      .select({
        slug: cities.slug,
        stateSlug: cities.stateSlug,
        updatedAt: cities.updatedAt,
        listingLastmod: sql<string>`max(coalesce(${operators.lastVerifiedAt}, ${operators.updatedAt}))`,
      })
      .from(cities)
      .innerJoin(operatorServiceAreas, eq(operatorServiceAreas.cityId, cities.id))
      .innerJoin(operators, eq(operators.id, operatorServiceAreas.operatorId))
      .where(publishedOperator)
      .groupBy(cities.id, cities.slug, cities.stateSlug, cities.updatedAt)
      .orderBy(asc(cities.stateSlug), asc(cities.slug));

    for (const c of cityRows) {
      const lastmod = cityPageLastmod(c.updatedAt, [c.listingLastmod]);
      cityLastmods.push(lastmod);
      entries.push({
        loc: absoluteUrl(base, `/dumpster-rental/${c.stateSlug}/${c.slug}`),
        lastmod,
        changefreq: 'weekly',
        priority: 0.9,
      });
    }

    // Published, non-demo, non-broker operators only (public, indexable profiles).
    const ops = await db
      .select({
        slug: operators.slug,
        updatedAt: operators.updatedAt,
        lastVerifiedAt: operators.lastVerifiedAt,
      })
      .from(operators)
      .where(publishedOperator);

    for (const o of ops) {
      const lastmod = o.lastVerifiedAt ?? o.updatedAt;
      operatorLastmods.push(lastmod);
      entries.push({
        loc: absoluteUrl(base, `/operator/${o.slug}`),
        // Prefer last verification when present — more accurate freshness signal for listings.
        lastmod,
        changefreq: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    // DB may be unavailable in edge build cases; still emit static routes.
  }

  // Evergreen guides (skip drafts). Attach image entries when present for image search.
  try {
    const guides = await getCollection('guides', ({ data }) => !data.draft);
    for (const g of guides) {
      const entry: SitemapEntry = {
        loc: absoluteUrl(base, `/guides/${g.id}`),
        lastmod: g.data.updated ?? null,
        changefreq: 'monthly',
        priority: 0.7,
      };
      if (g.data.updated) guideLastmods.push(g.data.updated);

      if (g.data.image) {
        const imageLoc = g.data.image.startsWith('http')
          ? g.data.image
          : absoluteUrl(base, g.data.image);
        entry.images = [
          {
            loc: imageLoc,
            title: g.data.title,
            caption: g.data.imageAlt ?? g.data.description,
          },
        ];
      }

      entries.push(entry);
    }
  } catch {
    /* content collection unavailable */
  }

  // Hub lastmod = latest meaningful child update (honest freshness, not deploy time).
  const guidesMax = maxLastmod(...guideLastmods);
  if (guidesMax) guidesHub.lastmod = guidesMax;

  const directoryMax = maxLastmod(...cityLastmods, ...operatorLastmods);
  if (directoryMax) searchHub.lastmod = directoryMax;

  const homeMax = maxLastmod(directoryMax, guidesMax);
  if (homeMax) home.lastmod = homeMax;

  // Excluded by design (not indexable / no public value as standalone URLs):
  // /admin/*, /portal/*, /compare, /404, brokers, demos, query-param search facets

  const body = renderUrlset(entries);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Hourly revalidate is enough; city/operator updates are infrequent.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
