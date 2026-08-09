import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getDb } from '../lib/db';
import { cities, operators } from '../lib/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? 'https://dumpsterlocal.com';
  const urls: string[] = [
    `${base}/`,
    `${base}/search`,
    `${base}/guides`,
  ];

  try {
    const db = getDb();
    const cityRows = await db.select().from(cities).where(eq(cities.isPriority, true));
    for (const c of cityRows) {
      urls.push(`${base}/dumpster-rental/${c.stateSlug}/${c.slug}`);
    }
    const ops = await db
      .select({ slug: operators.slug })
      .from(operators)
      .where(eq(operators.isPublished, true));
    for (const o of ops) {
      urls.push(`${base}/operator/${o.slug}`);
    }
  } catch {
    // DB may be unavailable at build-edge cases; still return static routes
  }

  try {
    const guides = await getCollection('guides');
    for (const g of guides) {
      urls.push(`${base}/guides/${g.id}`);
    }
  } catch {
    /* ignore */
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
