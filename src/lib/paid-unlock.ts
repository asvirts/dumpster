import type { Lead } from './schema';

export function formatUsdFromCents(cents: number): string {
  return `$${(Math.max(0, Math.round(cents)) / 100).toFixed(2)}`;
}

export type PaidUnlockOpts = {
  operatorId?: string | null;
  stripeCheckoutSessionId: string;
  amountTotal?: number | null;
  expectedPriceCents: number;
};

export type PaidUnlockDecision =
  | { action: 'already_unlocked' }
  | { action: 'unlock' }
  | { action: 'reject'; error: string };

/**
 * Decide whether a signed Stripe Checkout payment may unlock a lead.
 *
 * Session-id matching is intentionally loose for still-offered leads: a
 * double-click can create session B after session A was stored. Rejecting A
 * after a successful payment leaves the operator charged with a locked lead.
 */
export function decidePaidUnlock(
  lead: Pick<Lead, 'status' | 'operatorId' | 'stripeCheckoutSessionId'>,
  opts: PaidUnlockOpts,
): PaidUnlockDecision {
  if (lead.status === 'unlocked') {
    if (
      lead.stripeCheckoutSessionId &&
      lead.stripeCheckoutSessionId !== opts.stripeCheckoutSessionId
    ) {
      return {
        action: 'reject',
        error: 'Lead already unlocked by a different checkout session',
      };
    }
    return { action: 'already_unlocked' };
  }

  if (lead.status !== 'offered') {
    return { action: 'reject', error: `Lead is not offered (status=${lead.status})` };
  }

  if (opts.operatorId && lead.operatorId !== opts.operatorId) {
    return { action: 'reject', error: 'Checkout operator does not match lead assignment' };
  }

  if (!lead.operatorId) {
    return { action: 'reject', error: 'Operator not found' };
  }

  if (opts.amountTotal != null && opts.amountTotal !== opts.expectedPriceCents) {
    return {
      action: 'reject',
      error: `Payment amount ${opts.amountTotal} does not match lead price ${opts.expectedPriceCents}`,
    };
  }

  return { action: 'unlock' };
}
