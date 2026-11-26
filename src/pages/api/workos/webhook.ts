import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { logAudit } from '../../../lib/admin';
import { workos } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { operators } from '../../../lib/schema';

/**
 * WorkOS events. Sessions already stop working when a user or membership is removed, so the
 * only app state to fix is a listing claimed by a company (organization) that was deleted:
 * it goes back to unclaimed and stops sending leads to the claimant.
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = (env as { WORKOS_WEBHOOK_SECRET?: string }).WORKOS_WEBHOOK_SECRET;
  const sigHeader = request.headers.get('workos-signature');
  if (!secret) return new Response('WorkOS webhook is not configured', { status: 400 });
  if (!sigHeader) return new Response('Missing signature', { status: 400 });

  let event;
  try {
    const payload = JSON.parse(await request.text());
    event = await workos().webhooks.constructEvent({ payload, sigHeader, secret });
  } catch (err) {
    console.error('[workos webhook] verify failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.event === 'organization.deleted') {
    const orgId = event.data.id;
    const db = getDb();
    const op = await db.query.operators.findFirst({ where: eq(operators.orgId, orgId) });
    if (op) {
      await db
        .update(operators)
        .set({
          orgId: null,
          claimStatus: 'unclaimed',
          claimRequestedAt: null,
          claimRequestedByUserId: null,
          claimRequestedByEmail: null,
          claimMessage: null,
          // Leads fall back to the listing's own email.
          leadNotifyEmail: null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(operators.id, op.id));
      await logAudit(db, {
        action: 'claim_released',
        entityType: 'operator',
        entityId: op.id,
        actor: 'workos',
        notes: `organization ${orgId} deleted (was ${op.claimStatus})`,
      });
    }
  }

  return new Response('ok');
};
