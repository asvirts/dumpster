import { and, eq, inArray } from 'drizzle-orm';
import type { CloudContext } from 'void';
import { z } from 'zod';
import { logAudit } from '../lib/admin';
import { loadSession, workos } from '../lib/auth';
import { claimProofEmail } from '../lib/autopilot-rules';
import { cookieJar } from '../lib/cookies';
import { getDb } from '../lib/db';
import { sendClaimDecision } from '../lib/email';
import { siteUrl } from '../lib/leads';
import { operators } from '../lib/schema';
import { redirectWithFeedback } from './flash';
import { formFeedback, pageActionUrl } from './quote';
import { setFeedback } from './shared';

/**
 * Claim form (claimListing) on the public operator page. The GET page stays anonymous; this
 * POST action reads the WorkOS session itself, then 303s back to `#claim` (see flash.ts). Feedback `values`:
 *   signedIn: '1' when a session was found; reason: 'signin' | 'org'; autoApproved: '1' | '0'.
 */

export const CLAIM_FORM = 'claim';

const claimInputSchema = z.object({
  operatorId: z.string().min(1),
  message: z.string().max(1000).optional(),
});

/** Request-derived props for the ClaimListing island. */
export function claimFormContext(c: CloudContext) {
  const url = new URL(c.req.url);
  return {
    actionUrl: pageActionUrl(c, 'claimListing', 'claim'),
    returnTo: `${url.pathname}#claim`,
    feedback: formFeedback(c, CLAIM_FORM),
  };
}

/** claimListing page action. */
export async function claimListing(c: CloudContext): Promise<Response> {
  await handleClaim(c);
  return redirectWithFeedback(c, 'claim');
}

async function handleClaim(c: CloudContext): Promise<void> {
  const body = await c.req.parseBody();
  const raw: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(body)) if (typeof v === 'string') raw[k] = v === '' ? undefined : v;
  const values: Record<string, string> = {};
  if (raw.message) values.message = raw.message;

  const fail = (message: string, extra: Record<string, string> = {}) =>
    setFeedback(c, { form: CLAIM_FORM, ok: false, message, values: { ...values, ...extra } });

  const parsed = claimInputSchema.safeParse(raw);
  if (!parsed.success) return fail('Message must be 1000 characters or fewer.');
  const input = parsed.data;

  const auth = await loadSession(cookieJar(c), new URL(c.req.url));
  const userId = auth?.userId;
  const orgId = auth?.orgId;
  if (!auth || !userId) {
    return fail('Sign in to claim a listing.', { reason: 'signin' });
  }
  const signedIn = { signedIn: '1' };
  if (!orgId) {
    return fail('Create or select your company before claiming.', { ...signedIn, reason: 'org' });
  }

  const db = getDb();
  const op = await db.query.operators.findFirst({
    where: eq(operators.id, input.operatorId),
  });
  if (!op) return fail('Operator not found.', signedIn);
  if (op.claimStatus === 'approved') return fail('This listing is already claimed.', signedIn);
  if (op.claimStatus === 'pending') return fail('A claim is already pending review.', signedIn);

  const orgBusy = await db.query.operators.findFirst({
    where: and(eq(operators.orgId, orgId), inArray(operators.claimStatus, ['approved', 'pending'])),
  });
  if (orgBusy) {
    return fail(
      orgBusy.claimStatus === 'approved'
        ? 'This organization already owns another listing.'
        : 'This organization already has a claim pending review.',
      signedIn,
    );
  }

  // Verified emails prove control of the listing (instant approval) and give us
  // the claimant's address for lead emails once the claim is approved.
  // Re-read the user so a just-verified email counts (the session copy can be stale).
  let user = auth.user;
  try {
    user = await workos().userManagement.getUser(userId);
  } catch (err) {
    console.warn('[claim] could not load WorkOS user; using session copy', err);
  }
  const verifiedEmails = user.emailVerified ? [user.email] : [];
  const primaryEmail = verifiedEmails[0] ?? null;
  const proofEmail = claimProofEmail(op, verifiedEmails);
  const claimantEmail = (proofEmail ?? primaryEmail ?? verifiedEmails[0])?.trim().toLowerCase() || null;

  const now = new Date().toISOString();
  // CAS: only transition from unclaimed/rejected → pending
  const claimed = await db
    .update(operators)
    .set({
      orgId: orgId,
      claimStatus: 'pending',
      claimRequestedAt: now,
      claimRequestedByUserId: userId,
      claimRequestedByEmail: claimantEmail,
      claimMessage: input.message || null,
      updatedAt: now,
    })
    .where(and(eq(operators.id, input.operatorId), inArray(operators.claimStatus, ['unclaimed', 'rejected'])))
    .returning({ id: operators.id });

  if (claimed.length === 0) return fail('This listing is not available to claim.', signedIn);

  // Instant approval when a verified email proves control of the listing.
  if (proofEmail) {
    const approved = await db
      .update(operators)
      .set({
        claimStatus: 'approved',
        leadNotifyEmail: proofEmail,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(operators.id, op.id), eq(operators.claimStatus, 'pending'), eq(operators.orgId, orgId)))
      .returning({ id: operators.id });
    if (approved.length > 0) {
      await sendClaimDecision({
        operatorName: op.name,
        operatorEmail: proofEmail,
        approved: true,
        portalUrl: `${siteUrl()}/portal`,
        refs: { operatorId: op.id },
      });
      await logAudit(db, {
        action: 'claim_auto_approve',
        entityType: 'operator',
        entityId: op.id,
        actor: userId,
        notes: `org ${orgId}; verified email matched listing`,
      });
      return setFeedback(c, { form: CLAIM_FORM, ok: true, values: { ...signedIn, autoApproved: '1' } });
    }
  }

  setFeedback(c, { form: CLAIM_FORM, ok: true, values: { ...signedIn, autoApproved: '0' } });
}
