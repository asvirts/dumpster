import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';
import { getStripe, getStripeWebhookSecret } from '../../../lib/stripe';
import { unlockLeadPaid } from '../../../lib/leads';

export const POST: APIRoute = async ({ request }) => {
  const stripe = getStripe();
  const secret = getStripeWebhookSecret();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  const rawBody = await request.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, secret);
  } catch (err) {
    console.error('[stripe webhook] verify failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const leadId = session.metadata?.leadId;
    const operatorId = session.metadata?.operatorId;
    if (leadId && session.payment_status === 'paid') {
      const db = getDb();
      const result = await unlockLeadPaid(db, {
        leadId,
        operatorId: operatorId || null,
        stripeCheckoutSessionId: session.id,
        stripeCustomerId:
          typeof session.customer === 'string' ? session.customer : session.customer?.id,
        amountTotal: typeof session.amount_total === 'number' ? session.amount_total : null,
      });
      if (!result.ok) {
        console.error('[stripe webhook] unlock failed', result.error, {
          leadId,
          sessionId: session.id,
        });
        // Retry only transient races; permanent validation failures must not loop forever
        const retryable =
          result.error.includes('race') || result.error.includes('Lead unlock race');
        return new Response(JSON.stringify({ received: true, error: result.error }), {
          status: retryable ? 500 : 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
