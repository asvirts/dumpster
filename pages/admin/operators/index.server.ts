import { and, desc, eq, like, or } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../../../src/lib/db';
import { formatDate } from '../../../src/lib/geo';
import { operators } from '../../../src/lib/schema';
import { adminGuard, adminHead } from '../../../src/server/admin-guard';
import { withShared } from '../../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const status = c.req.query('status') ?? '';
  const q = c.req.query('q') ?? '';

  const db = getDb();
  const conditions = [];
  if (status === 'pending' || status === 'verified' || status === 'rejected') {
    conditions.push(eq(operators.verificationStatus, status));
  }
  if (q.trim()) {
    const likeQ = `%${q.trim()}%`;
    conditions.push(or(like(operators.name, likeQ), like(operators.slug, likeQ), like(operators.hqCity, likeQ)));
  }

  const rows = await db
    .select()
    .from(operators)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(operators.updatedAt))
    .limit(200);

  return {
    adminEmail: c.get('adminEmail'),
    status,
    q,
    rows: rows.map((op) => ({
      id: op.id,
      name: op.name,
      hqCity: op.hqCity,
      hqState: op.hqState,
      isBroker: op.isBroker,
      isDemo: op.isDemo,
      verificationStatus: op.verificationStatus,
      isPublished: op.isPublished,
      qualityScore: op.qualityScore,
      lastVerified: formatDate(op.lastVerifiedAt) || '—',
    })),
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Operators'));
