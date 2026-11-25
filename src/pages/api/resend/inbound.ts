import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getDb } from '../../../lib/db';
import { handleReceivedEmail, type ReceivedEventData } from '../../../lib/inbound';
import { verifySvixSignature } from '../../../lib/inbound-rules';

/** Resend Inbound webhook (`email.received`) for replies to leads@reply.findadumpster.net. */
export const POST: APIRoute = async ({ request }) => {
  const secret = (env as { RESEND_WEBHOOK_SECRET?: string }).RESEND_WEBHOOK_SECRET;
  if (!secret) return new Response('Inbound webhook is not configured', { status: 400 });

  const rawBody = await request.text();
  const valid = await verifySvixSignature(
    secret,
    {
      id: request.headers.get('svix-id'),
      timestamp: request.headers.get('svix-timestamp'),
      signature: request.headers.get('svix-signature'),
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
};
