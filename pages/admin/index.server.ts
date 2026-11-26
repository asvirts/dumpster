import { eq, sql } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../../src/lib/db';
import { leads, operators } from '../../src/lib/schema';
import { adminGuard, adminHead } from '../../src/server/admin-guard';
import { withShared } from '../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const db = getDb();

  const [pending] = await db
    .select({ c: sql<number>`count(*)` })
    .from(operators)
    .where(eq(operators.verificationStatus, 'pending'));
  const [verified] = await db
    .select({ c: sql<number>`count(*)` })
    .from(operators)
    .where(eq(operators.verificationStatus, 'verified'));
  const [published] = await db
    .select({ c: sql<number>`count(*)` })
    .from(operators)
    .where(eq(operators.isPublished, true));
  const [newLeads] = await db
    .select({ c: sql<number>`count(*)` })
    .from(leads)
    .where(eq(leads.status, 'new'));
  const [pendingClaims] = await db
    .select({ c: sql<number>`count(*)` })
    .from(operators)
    .where(eq(operators.claimStatus, 'pending'));

  const pendingList = await db.query.operators.findMany({
    where: eq(operators.verificationStatus, 'pending'),
    orderBy: (o, { desc }) => [desc(o.createdAt)],
    limit: 10,
  });

  return {
    adminEmail: c.get('adminEmail'),
    counts: {
      pending: pending?.c ?? 0,
      verified: verified?.c ?? 0,
      published: published?.c ?? 0,
      newLeads: newLeads?.c ?? 0,
      pendingClaims: pendingClaims?.c ?? 0,
    },
    pendingList: pendingList.map((op) => ({
      id: op.id,
      name: op.name,
      hqCity: op.hqCity,
      hqState: op.hqState,
      phone: op.phone,
    })),
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Dashboard'));
