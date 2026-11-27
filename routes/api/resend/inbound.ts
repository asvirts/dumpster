import { env } from 'cloudflare:workers';
import { defineHandler } from 'void';
import { getDb } from '../../../src/lib/db';
import { handleReceivedEmail, type ReceivedEventData } from '../../../src/lib/inbound';
import { verifySvixSignature } from '../../../src/lib/inbound-rules';

/** Resend Inbound webhook (`email.received`) for replies to leads@eeildoiint.resend.app. */
export const POST = defineHandler(async (c) => {
  const secret = (env as { RESEND_WEBHOOK_SECRET?: string }).RESEND_WEBHOOK_SECRET;
  if (!secret) return new Response('Inbound webhook is not configured', { status: 400 });

  // Raw body, unparsed: the Svix signature covers the exact bytes.
  const rawBody = await c.req.text();
  const valid = await verifySvixSignature(
    secret,
    {
      id: c.req.header('svix-id') ?? null,
      timestamp: c.req.header('svix-timestamp') ?? null,
      signature: c.req.header('svix-signature') ?? null,
    },
    rawBody,
  );
  if (!valid) return new Response('Invalid signature', { status: 400 });

  let event: { type?: string; data?: ReceivedEventData };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }
  if (event.type !== 'email.received' || !event.data?.email_id) {
    return Response.json({ received: true, ignored: event.type ?? 'unknown' });
  }

  try {
    const outcome = await handleReceivedEmail(getDb(), event.data);
    return Response.json({ received: true, outcome });
  } catch (err) {
    console.error('[inbound] handling failed', err);
    // Non-2xx makes Resend retry; handling is idempotent on email_id.
    return new Response('Handler error', { status: 500 });
  }
});
