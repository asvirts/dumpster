import Stripe from 'stripe';
import { env } from 'cloudflare:workers';

export function getStripe(): Stripe {
  const key = (env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, {
    apiVersion: '2026-07-29.dahlia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export function getStripeWebhookSecret(): string {
  const secret = (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }
  return secret;
}

/** Expire an open Checkout Session. Completed/expired sessions are ignored. */
export async function expireCheckoutSession(sessionId: string | null | undefined): Promise<void> {
  if (!sessionId) return;
  if (!(env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY) return;
  try {
    await getStripe().checkout.sessions.expire(sessionId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!/already|expired|complete|no such checkout/i.test(message)) {
      console.warn('[stripe] expire session failed', sessionId, message);
    }
  }
}

export function checkoutIntegrationIdentifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const suffix = [...bytes].map((b) => String.fromCharCode(97 + (b % 26))).join('');
  return `lead-unlock-${suffix}`;
}

export function isMissingStripeCustomer(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: string }).code === 'resource_missing'
  );
}
