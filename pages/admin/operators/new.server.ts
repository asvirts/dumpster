import { asc } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import type { Href } from 'void/routes';
import { createOperator, parseFormOperator } from '../../../src/lib/admin';
import { getDb } from '../../../src/lib/db';
import { cities } from '../../../src/lib/schema';
import { adminGuard, adminHead } from '../../../src/server/admin-guard';
import { withShared } from '../../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const db = getDb();
  const allCities = await db.select().from(cities).orderBy(asc(cities.state), asc(cities.name));
  return {
    adminEmail: c.get('adminEmail'),
    cities: allCities.map((city) => ({ id: city.id, name: city.name, state: city.state })),
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Add operator'));

export const action = defineHandler(adminGuard, async (c) => {
  const db = getDb();
  const form = await c.req.formData();
  const data = parseFormOperator(form);
  if (!data.name.trim()) {
    return new Response('Name is required', { status: 400 });
  }
  const id = await createOperator(db, data, c.get('adminEmail'));
  return c.redirect(`/admin/operators/${id}` as Href, 303);
});
