import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { and, eq, inArray } from 'drizzle-orm';
import { getDb } from '../lib/db';
import { leads, operators } from '../lib/schema';
import { quoteInputSchema } from '../lib/lead-fields';
import {
  clientIpFromRequest,
  createHeldLead,
  unlockLeadComplimentary,
} from '../lib/leads';
import { createLeadUnlockCheckout } from '../lib/lead-checkout';
import { verifyTurnstile } from '../lib/turnstile';

export const server = {
  submitQuote: defineAction({
    accept: 'form',
    input: quoteInputSchema,
    handler: async (input, context) => {
      // Silent success for bots that fill the honeypot
      if (input.companyWebsite && input.companyWebsite.trim() !== '') {
        return { ok: true as const, leadId: 'ignored' };
      }

      const ip = clientIpFromRequest(context.request);
      const turnstile = await verifyTurnstile({
        token: input['cf-turnstile-response'],
        ip,
      });
      if (!turnstile.ok) {
        throw new ActionError({ code: 'BAD_REQUEST', message: turnstile.error });
      }

      const mode = input.mode === 'match' ? 'match' : 'direct';
      const result = await createHeldLead(getDb(), {
        mode,
        operatorId: input.operatorId,
        seekerName: input.seekerName,
        seekerEmail: input.seekerEmail,
        seekerPhone: input.seekerPhone,
        projectSize: input.projectSize,
        material: input.material,
        addressOrZip: input.addressOrZip,
        timeline: input.timeline,
        notes: input.notes,
        preferredContact: input.preferredContact,
        budgetRange: input.budgetRange,
        howFound: input.howFound,
        sourcePath: input.sourcePath,
        sourceCityId: input.sourceCityId,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        utmContent: input.utmContent,
        utmTerm: input.utmTerm,
        referrer: input.referrer,
        ip,
      });

      if (!result.ok) {
        throw new ActionError({
          code: result.code,
          message: result.error,
        });
      }

      return { ok: true as const, leadId: result.leadId };
    },
  }),

  claimListing: defineAction({
    accept: 'form',
    input: z.object({
      operatorId: z.string().min(1),
      message: z.string().max(1000).optional(),
    }),
    handler: async (input, context) => {
      const auth = context.locals.auth?.();
      const userId = auth?.userId;
      const orgId = auth?.orgId;
      if (!userId) {
        throw new ActionError({ code: 'UNAUTHORIZED', message: 'Sign in to claim a listing.' });
      }
      if (!orgId) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Create or select a company organization in Clerk before claiming.',
        });
      }

      const db = getDb();
      const op = await db.query.operators.findFirst({
        where: eq(operators.id, input.operatorId),
      });
      if (!op) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'Operator not found.' });
      }
      if (op.claimStatus === 'approved') {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'This listing is already claimed.' });
      }
      if (op.claimStatus === 'pending') {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'A claim is already pending review.',
        });
      }

      const orgBusy = await db.query.operators.findFirst({
        where: and(
          eq(operators.clerkOrgId, orgId),
          inArray(operators.claimStatus, ['approved', 'pending']),
        ),
      });
      if (orgBusy) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message:
            orgBusy.claimStatus === 'approved'
              ? 'This organization already owns another listing.'
              : 'This organization already has a claim pending review.',
        });
      }

      const now = new Date().toISOString();
      // CAS: only transition from unclaimed/rejected → pending
      const claimed = await db
        .update(operators)
        .set({
          clerkOrgId: orgId,
          claimStatus: 'pending',
          claimRequestedAt: now,
          claimRequestedByUserId: userId,
          claimMessage: input.message || null,
          updatedAt: now,
        })
        .where(
          and(
            eq(operators.id, input.operatorId),
            inArray(operators.claimStatus, ['unclaimed', 'rejected']),
          ),
        )
        .returning({ id: operators.id });

      if (claimed.length === 0) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'This listing is not available to claim.',
        });
      }

      return { ok: true as const };
    },
  }),

  unlockLeadComplimentary: defineAction({
    accept: 'form',
    input: z.object({
      leadId: z.string().min(1),
    }),
    handler: async (input, context) => {
      const auth = context.locals.auth?.();
      const orgId = auth?.orgId;
      if (!auth?.userId || !orgId) {
        throw new ActionError({ code: 'UNAUTHORIZED', message: 'Sign in required.' });
      }

      const db = getDb();
      const op = await db.query.operators.findFirst({
        where: and(eq(operators.clerkOrgId, orgId), eq(operators.claimStatus, 'approved')),
      });
      if (!op) {
        throw new ActionError({ code: 'FORBIDDEN', message: 'No approved listing for this org.' });
      }

      const lead = await db.query.leads.findFirst({ where: eq(leads.id, input.leadId) });
      if (!lead || lead.operatorId !== op.id || lead.status !== 'offered') {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Lead is not available to unlock.' });
      }

      const result = await unlockLeadComplimentary(db, {
        leadId: lead.id,
        operatorId: op.id,
        actor: auth.userId,
      });
      if (!result.ok) {
        throw new ActionError({ code: 'BAD_REQUEST', message: result.error });
      }
      return { ok: true as const };
    },
  }),

  createLeadCheckout: defineAction({
    accept: 'form',
    input: z.object({
      leadId: z.string().min(1),
    }),
    handler: async (input, context) => {
      const auth = context.locals.auth?.();
      const orgId = auth?.orgId;
      if (!auth?.userId || !orgId) {
        throw new ActionError({ code: 'UNAUTHORIZED', message: 'Sign in required.' });
      }

      const db = getDb();
      const op = await db.query.operators.findFirst({
        where: and(eq(operators.clerkOrgId, orgId), eq(operators.claimStatus, 'approved')),
      });
      if (!op) {
        throw new ActionError({ code: 'FORBIDDEN', message: 'No approved listing for this org.' });
      }

      const lead = await db.query.leads.findFirst({ where: eq(leads.id, input.leadId) });
      if (!lead || lead.operatorId !== op.id || lead.status !== 'offered') {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Lead is not available to purchase.' });
      }

      const checkout = await createLeadUnlockCheckout(db, {
        lead,
        operator: op,
        clerkOrgId: orgId,
      });
      if (!checkout.ok) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: checkout.error });
      }

      return { ok: true as const, url: checkout.url };
    },
  }),
};
