import { env } from 'cloudflare:workers';
import { eq, sql } from 'drizzle-orm';
import type { AppDb } from './db';
import { inboundEmails, operators } from './schema';
import { logAudit } from './admin';
import { sendAdminReplyAlert } from './email';
import { siteUrl } from './leads';
import { isAutoReply, isUnsubscribeRequest, parseEmailAddress, stripQuotedReply } from './inbound-rules';

/** `data` of Resend's `email.received` webhook (metadata only — no body). */
export type ReceivedEventData = {
  email_id: string;
  from: string;
  to?: string[];
  subject?: string;
  message_id?: string;
};

type ReceivedEmail = {
  from?: string;
  subject?: string;
  text?: string | null;
  html?: string | null;
  message_id?: string;
  headers?: Record<string, string>;
};

/** Needs a full-access Resend key; the send-only RESEND_API_KEY cannot read received mail. */
async function fetchReceivedEmail(emailId: string): Promise<ReceivedEmail | null> {
  const key = (env as { RESEND_RECEIVING_API_KEY?: string }).RESEND_RECEIVING_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(emailId)}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      console.error('[inbound] fetch received email failed', res.status, await res.text());
      return null;
    }
    return (await res.json()) as ReceivedEmail;
  } catch (err) {
    console.error('[inbound] fetch received email error', err);
    return null;
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<(br|\/p|\/div|\/li)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"');
}

export type InboundOutcome = 'duplicate' | 'ignored' | 'auto_reply' | 'unsubscribed' | 'needs_answer';

export async function handleReceivedEmail(db: AppDb, data: ReceivedEventData): Promise<InboundOutcome> {
  const [existing] = await db
    .select({ id: inboundEmails.id })
    .from(inboundEmails)
    .where(eq(inboundEmails.resendEmailId, data.email_id))
    .limit(1);
  if (existing) return 'duplicate';

  const full = await fetchReceivedEmail(data.email_id);
  const fromHeader = full?.headers?.from ?? full?.from ?? data.from;
  const fromEmail = parseEmailAddress(fromHeader) ?? parseEmailAddress(data.from);
  if (!fromEmail) return 'ignored';
  // Never act on our own mail (bounces of our sends, loops).
  if (fromEmail.endsWith('@findadumpster.net') || fromEmail.endsWith('.findadumpster.net')) return 'ignored';

  const subject = full?.subject ?? data.subject ?? '(no subject)';
  const fullText = full?.text ?? (full?.html ? htmlToText(full.html) : null);
  const replyText = stripQuotedReply(fullText);

  const [operator] = await db
    .select({ id: operators.id, name: operators.name })
    .from(operators)
    .where(sql`lower(${operators.email}) = ${fromEmail}`)
    .limit(1);

  let outcome: InboundOutcome = 'needs_answer';
  if (isAutoReply(subject, full?.headers)) outcome = 'auto_reply';
  else if (fullText !== null && isUnsubscribeRequest(subject, replyText)) outcome = 'unsubscribed';
  else if (fullText === null && isUnsubscribeRequest(subject, '')) outcome = 'unsubscribed';

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  await db
    .insert(inboundEmails)
    .values({
      id,
      resendEmailId: data.email_id,
      fromEmail,
      fromHeader,
      subject,
      messageId: full?.message_id ?? data.message_id ?? null,
      replyText: fullText === null ? null : replyText,
      fullText,
      operatorId: operator?.id ?? null,
      autoAction: outcome === 'needs_answer' ? null : outcome,
      handledAt: outcome === 'needs_answer' ? null : now,
    })
    .onConflictDoNothing();

  if (outcome === 'unsubscribed' && operator) {
    await db
      .update(operators)
      .set({ leadEmailsOptOut: true, autoUnlockEnabled: false, updatedAt: now })
      .where(eq(operators.id, operator.id));
    await logAudit(db, {
      action: 'operator_unsubscribe',
      entityType: 'operator',
      entityId: operator.id,
      actor: 'email-reply',
      notes: subject,
    });
  }

  if (outcome === 'needs_answer') {
    await sendAdminReplyAlert({
      fromHeader,
      subject,
      replyText: fullText === null ? '(Reply text unavailable — set RESEND_RECEIVING_API_KEY.)' : replyText,
      operatorName: operator?.name ?? null,
      adminUrl: `${siteUrl()}/admin/replies#${id}`,
      refs: { operatorId: operator?.id ?? null },
    });
  }
  return outcome;
}
