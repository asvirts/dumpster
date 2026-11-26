import { desc, eq } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { logAudit } from '../../src/lib/admin';
import { getDb } from '../../src/lib/db';
import { sendClaimDecision } from '../../src/lib/email';
import { formatDate } from '../../src/lib/geo';
import { siteUrl } from '../../src/lib/leads';
import { operators } from '../../src/lib/schema';
import { adminActor, adminGuard, adminHead } from '../../src/server/admin-guard';
import { withShared } from '../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const db = getDb();
  const pendingClaims = await db
    .select()
    .from(operators)
    .where(eq(operators.claimStatus, 'pending'))
    .orderBy(desc(operators.claimRequestedAt));
  return {
    adminEmail: c.get('adminEmail'),
    pendingClaims: pendingClaims.map((op) => ({
      id: op.id,
      name: op.name,
      slug: op.slug,
      email: op.email,
      phone: op.phone,
      requestedAt: op.claimRequestedAt ? formatDate(op.claimRequestedAt) : '—',
      claimRequestedByEmail: op.claimRequestedByEmail,
      claimRequestedByUserId: op.claimRequestedByUserId,
      orgId: op.orgId,
      claimMessage: op.claimMessage,
    })),
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Claims'));

export const action = defineHandler(adminGuard, async (c) => {
  const db = getDb();
  const actor = adminActor(c);
  const form = await c.req.formData();
  const id = form.get('id')?.toString();
  const intent = form.get('intent')?.toString();
  const notes = form.get('notes')?.toString() || null;

  if (id && (intent === 'approve' || intent === 'reject')) {
    const op = await db.query.operators.findFirst({ where: eq(operators.id, id) });
    if (op && op.claimStatus === 'pending') {
      const now = new Date().toISOString();
      if (intent === 'approve') {
        await db
          .update(operators)
          .set({
            claimStatus: 'approved',
            // Lead emails go to the person who claimed it (falls back to the listing email).
            leadNotifyEmail: op.claimRequestedByEmail || op.leadNotifyEmail,
            updatedAt: now,
          })
          .where(eq(operators.id, id));
        await sendClaimDecision({
          operatorName: op.name,
          operatorEmail: op.claimRequestedByEmail || op.email,
          approved: true,
          portalUrl: `${siteUrl()}/portal`,
          refs: { operatorId: op.id },
        });
        await logAudit(db, {
          action: 'claim_approve',
          entityType: 'operator',
          entityId: id,
          actor,
          notes: op.orgId ? `org ${op.orgId}` : null,
        });
      } else {
        await db
          .update(operators)
          .set({
            claimStatus: 'rejected',
            claimMessage: notes || op.claimMessage,
            // Free the org slot so they can re-claim later if needed
            orgId: null,
            updatedAt: now,
          })
          .where(eq(operators.id, id));
        await sendClaimDecision({
          operatorName: op.name,
          operatorEmail: op.email,
          approved: false,
          portalUrl: `${siteUrl()}/portal`,
          notes,
          refs: { operatorId: op.id },
        });
        await logAudit(db, {
          action: 'claim_reject',
          entityType: 'operator',
          entityId: id,
          actor,
          notes,
        });
      }
    }
  }
  return c.redirect('/admin/claims', 303);
});
