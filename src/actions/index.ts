import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { nanoid } from 'nanoid';
import { and, eq, inArray } from 'drizzle-orm';
import { getDb } from '../lib/db';
import { events, leads, operators } from '../lib/schema';
import { sendAdminLeadAlert } from '../lib/email';
import { leadPriceCents, siteUrl, unlockLeadComplimentary } from '../lib/leads';
import { getStripe } from '../lib/stripe';

export const server = {
  submitQuote: defineAction({
    accept: 'form',
    input: z.object({
      operatorId: z.string().min(1),
      seekerName: z.string().min(1).max(120),
      seekerEmail: z.string().email(),
      seekerPhone: z.string().max(40).optional(),
      projectSize: z.string().max(20).optional(),
      material: z.string().max(40).optional(),
      addressOrZip: z.string().max(200).optional(),
      timeline: z.string().max(120).optional(),
      notes: z.string().max(2000).optional(),
      /** Honeypot — must be empty; bots often fill every field. */
      companyWebsite: z.string().max(200).optional(),
    }),
    handler: async (input) => {
      // Silent success for bots that fill the honeypot
      if (input.companyWebsite && input.companyWebsite.trim() !== '') {
        return { ok: true as const, leadId: 'ignored' };
      }

      const db = getDb();
      const op = await db.query.operators.findFirst({
        where: eq(operators.id, input.operatorId),
      });
      if (!op || !op.isPublished) {
        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'Operator not found or not available for quotes.',
        });
      }

      const leadId = nanoid();
      await db.insert(leads).values({
        id: leadId,
        operatorId: input.operatorId,
        requestedOperatorId: input.operatorId,
        seekerName: input.seekerName,
        seekerEmail: input.seekerEmail,
        seekerPhone: input.seekerPhone || null,
        projectSize: input.projectSize || null,
        material: input.material || null,
        addressOrZip: input.addressOrZip || null,
        timeline: input.timeline || null,
        notes: input.notes || null,
        status: 'new',
      });

      await sendAdminLeadAlert({
        operatorName: op.name,
        leadId,
        adminUrl: `${siteUrl()}/admin/leads`,
        seekerName: input.seekerName,
        seekerEmail: input.seekerEmail,
        seekerPhone: input.seekerPhone,
        projectSize: input.projectSize,
        material: input.material,
        addressOrZip: input.addressOrZip,
        timeline: input.timeline,
        notes: input.notes,
      });

      await db.insert(events).values({
        id: nanoid(),
        type: 'quote_submit',
        path: `/operator/${op.slug}`,
        queryJson: JSON.stringify({ operatorId: op.id, leadId }),
      });

      return { ok: true as const, leadId };
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

      const stripe = getStripe();
      const price = leadPriceCents();
      const base = siteUrl();
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer: op.stripeCustomerId || undefined,
        customer_email: op.stripeCustomerId ? undefined : op.email || undefined,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: price,
              product_data: {
                name: `Dumpster lead — ${lead.seekerName}`,
                description: [lead.projectSize, lead.material, lead.addressOrZip]
                  .filter(Boolean)
                  .join(' · ') || 'Quote lead unlock',
              },
            },
          },
        ],
        metadata: {
          leadId: lead.id,
          operatorId: op.id,
          clerkOrgId: orgId,
        },
        success_url: `${base}/portal/leads?unlocked=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/portal/leads?canceled=1`,
      });

      if (!session.url) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Checkout failed.' });
      }

      await db
        .update(leads)
        .set({ stripeCheckoutSessionId: session.id })
        .where(eq(leads.id, lead.id));

      return { ok: true as const, url: session.url };
    },
  }),
};
