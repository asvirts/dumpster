import { and, eq, sql } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { getDb } from '../../src/lib/db';
import { getOperatorForOrg, getPendingClaimForOrg } from '../../src/lib/portal';
import { leads } from '../../src/lib/schema';
import { portalAuth, portalGuard } from '../../src/server/portal-guard';
import { portalHead } from '../../src/server/portal-head';

export const revalidate = 0;

export const loader = defineHandler(portalGuard, async (c) => {
  // The guard guarantees a signed-in user with an active company.
  const orgId = portalAuth(c).orgId;
  const db = getDb();
  const operator = await getOperatorForOrg(db, orgId);
  const pending = operator ? null : await getPendingClaimForOrg(db, orgId);

  let offered = 0;
  let unlocked = 0;
  if (operator) {
    const [offeredRow] = await db
      .select({ c: sql<number>`count(*)` })
      .from(leads)
      .where(and(eq(leads.operatorId, operator.id), eq(leads.status, 'offered')));
    const [unlockedRow] = await db
      .select({ c: sql<number>`count(*)` })
      .from(leads)
      .where(and(eq(leads.operatorId, operator.id), eq(leads.status, 'unlocked')));
    offered = offeredRow?.c ?? 0;
    unlocked = unlockedRow?.c ?? 0;
  }

  // Only what the page shows: props are serialized into the HTML.
  return {
    operator: operator
      ? {
          name: operator.name,
          slug: operator.slug,
          isPublished: Boolean(operator.isPublished),
          complimentaryLeadsRemaining: operator.complimentaryLeadsRemaining,
        }
      : null,
    pendingName: pending?.name ?? null,
    offered,
    unlocked,
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead(() => portalHead('/portal'));
