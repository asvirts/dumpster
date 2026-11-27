import { defineHandler } from 'void';
import { getDb } from '../../../src/lib/db';
import { fulfillPaidCheckoutSession } from '../../../src/lib/lead-checkout';
import { getStripe, getStripeWebhookSecret } from '../../../src/lib/stripe';

export const POST = defineHandler(async (c) => {
  let stripe;
  let secret;
  try {
    stripe = getStripe();
    secret = getStripeWebhookSecret();
  } catch {
    return new Response('Stripe webhook is not configured', { status: 400 });
  }
  const signature = c.req.header('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  // Raw body, unparsed: the signature covers the exact bytes.
  const rawBody = await c.req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, secret);
  } catch (err) {
    console.error('[stripe webhook] verify failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object;
    console.error('[stripe webhook] async payment failed', {
      sessionId: session.id,
      leadId: session.metadata?.leadId,
    });
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object;
    const result = await fulfillPaidCheckoutSession(getDb(), session);
    if (!result.ok) {
      console.error('[stripe webhook] unlock failed', result.error, {
        type: event.type,
        sessionId: session.id,
        leadId: session.metadata?.leadId,
      });
      const retryable = result.error.includes('race') || result.error.includes('Lead unlock race');
      return new Response(JSON.stringify({ received: true, error: result.error }), {
        status: retryable ? 500 : 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
