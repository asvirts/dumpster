import { desc, eq } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { logAudit } from '../../src/lib/admin';
import { getDb } from '../../src/lib/db';
import { sendReplyAnswer } from '../../src/lib/email';
import { inboundEmails, operators } from '../../src/lib/schema';
import { adminActor, adminGuard, adminHead, getAdminResult, setAdminResult } from '../../src/server/admin-guard';
import { withShared } from '../../src/server/shared';

export const revalidate = 0;

const label: Record<string, string> = {
  unsubscribed: 'Unsubscribed automatically',
  auto_reply: 'Auto-reply (ignored)',
};

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const db = getDb();
  const result = getAdminResult(c);
  const rows = await db
    .select({
      reply: inboundEmails,
      operatorName: operators.name,
      operatorSlug: operators.slug,
    })
    .from(inboundEmails)
    .leftJoin(operators, eq(inboundEmails.operatorId, operators.id))
    .orderBy(desc(inboundEmails.createdAt))
    .limit(100);

  const open = rows
    .filter((r) => !r.reply.handledAt)
    .map(({ reply, operatorName, operatorSlug }) => ({
      id: reply.id,
      subject: reply.subject,
      receivedAt: `${reply.createdAt.slice(0, 16).replace('T', ' ')} UTC`,
      from: reply.fromHeader ?? reply.fromEmail,
      operatorName,
      operatorSlug,
      replyText: reply.replyText,
    }));
  const done = rows
    .filter((r) => r.reply.handledAt)
    .map(({ reply, operatorName }) => ({
      id: reply.id,
      who: operatorName ?? reply.fromEmail,
      subject: reply.subject,
      state: reply.autoAction
        ? (label[reply.autoAction] ?? reply.autoAction)
        : reply.answeredAt
          ? 'Answered'
          : 'Done',
    }));

  return {
    adminEmail: c.get('adminEmail'),
    flash: typeof result?.flash === 'string' ? result.flash : null,
    open,
    done,
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Replies'));

// Astro re-rendered the page with a flash message (no redirect); the loader reads it back.
export const action = defineHandler(adminGuard, async (c) => {
  const db = getDb();
  const actor = adminActor(c);
  let flash: string | null = null;
  const form = await c.req.formData();
  const id = form.get('id')?.toString() ?? '';
  const intent = form.get('intent')?.toString();
  const [row] = await db.select().from(inboundEmails).where(eq(inboundEmails.id, id)).limit(1);
  if (!row) {
    flash = 'Reply not found.';
  } else if (intent === 'answer') {
    const text = form.get('text')?.toString().trim() ?? '';
    if (!text) {
      flash = 'Write an answer first.';
    } else {
      const sent = await sendReplyAnswer({
        to: row.fromEmail,
        subject: row.subject ?? 'Your message',
        text,
        inReplyTo: row.messageId,
        refs: { operatorId: row.operatorId },
      });
      if (sent) {
        const now = new Date().toISOString();
        await db.update(inboundEmails).set({ answeredAt: now, handledAt: now }).where(eq(inboundEmails.id, id));
        await logAudit(db, {
          action: 'reply_answered',
          entityType: 'inbound_email',
          entityId: id,
          actor,
          notes: text.slice(0, 500),
        });
        flash = `Answer sent to ${row.fromEmail}.`;
      } else {
        flash = 'Sending failed — check RESEND_API_KEY.';
      }
    }
  } else if (intent === 'done') {
    await db.update(inboundEmails).set({ handledAt: new Date().toISOString() }).where(eq(inboundEmails.id, id));
    flash = 'Marked done.';
  } else if (intent === 'reopen') {
    await db.update(inboundEmails).set({ handledAt: null }).where(eq(inboundEmails.id, id));
    flash = 'Reopened.';
  }
  setAdminResult(c, { flash });
});
