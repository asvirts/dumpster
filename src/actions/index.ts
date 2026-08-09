import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { getDb } from '../lib/db';
import { events, leads, operators } from '../lib/schema';
import { sendLeadNotification } from '../lib/email';

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
    }),
    handler: async (input) => {
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

      const emailed = await sendLeadNotification({
        operatorName: op.name,
        operatorEmail: op.email,
        seekerName: input.seekerName,
        seekerEmail: input.seekerEmail,
        seekerPhone: input.seekerPhone,
        projectSize: input.projectSize,
        material: input.material,
        addressOrZip: input.addressOrZip,
        timeline: input.timeline,
        notes: input.notes,
      });

      if (emailed) {
        await db.update(leads).set({ status: 'notified' }).where(eq(leads.id, leadId));
      }

      await db.insert(events).values({
        id: nanoid(),
        type: 'quote_submit',
        path: `/operator/${op.slug}`,
        queryJson: JSON.stringify({ operatorId: op.id, leadId }),
      });

      return { ok: true as const, leadId };
    },
  }),
};
