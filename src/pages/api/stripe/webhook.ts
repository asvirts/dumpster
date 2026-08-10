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
    if (leadId && session.payment_status === 'paid') {
      const db = getDb();
      const result = await unlockLeadPaid(db, {
        leadId,
        stripeCheckoutSessionId: session.id,
        stripeCustomerId:
          typeof session.customer === 'string' ? session.customer : session.customer?.id,
      });
      if (!result.ok) {
        console.error('[stripe webhook] unlock failed', result.error);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
