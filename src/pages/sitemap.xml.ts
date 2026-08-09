import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { and, eq } from 'drizzle-orm';
import { getDb } from '../lib/db';
import { cities, operators } from '../lib/schema';
import {
  absoluteUrl,
  renderUrlset,
  type SitemapEntry,
} from '../lib/sitemap';

const SITE_FALLBACK = 'https://findadumpster.net';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || SITE_FALLBACK).replace(/\/$/, '');
  const entries: SitemapEntry[] = [];

  // Core indexable landings (highest priority first for stable, meaningful order).
  entries.push(
    {
      loc: absoluteUrl(base, '/'),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: absoluteUrl(base, '/search'),
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: absoluteUrl(base, '/guides'),
      changefreq: 'weekly',
      priority: 0.8,
    },
  );

  // Priority city landings — primary SEO money pages.
  try {
    const db = getDb();
    const cityRows = await db
      .select({
        slug: cities.slug,
        stateSlug: cities.stateSlug,
        updatedAt: cities.updatedAt,
      })
      .from(cities)
      .where(eq(cities.isPriority, true));

    for (const c of cityRows) {
      entries.push({
        loc: absoluteUrl(base, `/dumpster-rental/${c.stateSlug}/${c.slug}`),
        lastmod: c.updatedAt,
        changefreq: 'weekly',
        priority: 0.9,
      });
    }

    // Published, non-demo operators only (public, indexable profiles).
    const ops = await db
      .select({
        slug: operators.slug,
        updatedAt: operators.updatedAt,
        lastVerifiedAt: operators.lastVerifiedAt,
      })
      .from(operators)
      .where(and(eq(operators.isPublished, true), eq(operators.isDemo, false)));

    for (const o of ops) {
      entries.push({
        loc: absoluteUrl(base, `/operator/${o.slug}`),
        // Prefer last verification when present — more accurate freshness signal for listings.
        lastmod: o.lastVerifiedAt ?? o.updatedAt,
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
        changefreq: 'monthly',
        priority: 0.7,
      };

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

  // Excluded by design (not indexable / no public value as standalone URLs):
  // /admin/*, /compare, /404, query-param search facets

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
