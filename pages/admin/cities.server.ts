import { asc, eq } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import type { Href } from 'void/routes';
import { getDb } from '../../src/lib/db';
import { cities } from '../../src/lib/schema';
import { adminGuard, adminHead } from '../../src/server/admin-guard';
import { withShared } from '../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const db = getDb();
  const rows = await db.select().from(cities).orderBy(asc(cities.state), asc(cities.name));
  return {
    adminEmail: c.get('adminEmail'),
    saved: c.req.query('saved') ?? null,
    rows: rows.map((r) => ({
      id: r.id,
      name: r.name,
      state: r.state,
      slug: r.slug,
      stateSlug: r.stateSlug,
      localPermitSummary: r.localPermitSummary,
      typicalPricingNotes: r.typicalPricingNotes,
      specialRules: r.specialRules,
      isPriority: r.isPriority,
    })),
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Cities'));

export const action = defineHandler(adminGuard, async (c) => {
  const db = getDb();
  const form = await c.req.parseBody();
  const str = (k: string) => (typeof form[k] === 'string' ? (form[k] as string) : undefined);
  const id = str('id');
  if (id) {
    await db
      .update(cities)
      .set({
        localPermitSummary: str('localPermitSummary') || null,
        typicalPricingNotes: str('typicalPricingNotes') || null,
        specialRules: str('specialRules') || null,
        isPriority: form.isPriority === 'on',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cities.id, id));
  }
  return c.redirect(`/admin/cities?saved=${id}` as Href, 303);
});
