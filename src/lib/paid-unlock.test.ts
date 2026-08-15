import { describe, expect, test } from 'bun:test';
import { decidePaidUnlock, formatUsdFromCents } from './paid-unlock';

const offered = {
  status: 'offered' as const,
  operatorId: 'op_1',
  stripeCheckoutSessionId: 'cs_stored',
};

describe('formatUsdFromCents', () => {
  test('formats whole dollars', () => {
    expect(formatUsdFromCents(2500)).toBe('$25.00');
  });

  test('formats zero', () => {
    expect(formatUsdFromCents(0)).toBe('$0.00');
  });
});

describe('decidePaidUnlock', () => {
  test('unlocks an offered lead even when a newer session was stored', () => {
    expect(
      decidePaidUnlock(offered, {
        operatorId: 'op_1',
        stripeCheckoutSessionId: 'cs_paid_older',
        amountTotal: 2500,
        expectedPriceCents: 2500,
      }),
    ).toEqual({ action: 'unlock' });
  });

  test('unlocks when stored session matches', () => {
    expect(
      decidePaidUnlock(offered, {
        operatorId: 'op_1',
        stripeCheckoutSessionId: 'cs_stored',
        amountTotal: 2500,
        expectedPriceCents: 2500,
      }),
    ).toEqual({ action: 'unlock' });
  });

  test('is idempotent for the same paid session', () => {
    expect(
      decidePaidUnlock(
        { ...offered, status: 'unlocked' },
        {
          operatorId: 'op_1',
          stripeCheckoutSessionId: 'cs_stored',
          amountTotal: 2500,
          expectedPriceCents: 2500,
        },
      ),
    ).toEqual({ action: 'already_unlocked' });
  });

  test('accepts an already-unlocked lead with no stored session', () => {
    expect(
      decidePaidUnlock(
        { status: 'unlocked', operatorId: 'op_1', stripeCheckoutSessionId: null },
        {
          operatorId: 'op_1',
          stripeCheckoutSessionId: 'cs_paid',
          amountTotal: 2500,
          expectedPriceCents: 2500,
        },
      ),
    ).toEqual({ action: 'already_unlocked' });
  });

  test('rejects a second payment after a different session already unlocked', () => {
    const result = decidePaidUnlock(
      { ...offered, status: 'unlocked' },
      {
        operatorId: 'op_1',
        stripeCheckoutSessionId: 'cs_other',
        amountTotal: 2500,
        expectedPriceCents: 2500,
      },
    );
    expect(result.action).toBe('reject');
    if (result.action === 'reject') {
      expect(result.error).toContain('different checkout session');
    }
  });

  test('rejects operator mismatch', () => {
    const result = decidePaidUnlock(offered, {
      operatorId: 'op_other',
      stripeCheckoutSessionId: 'cs_stored',
      amountTotal: 2500,
      expectedPriceCents: 2500,
    });
    expect(result.action).toBe('reject');
    if (result.action === 'reject') {
      expect(result.error).toContain('operator');
    }
  });

  test('rejects amount mismatch', () => {
    const result = decidePaidUnlock(offered, {
      operatorId: 'op_1',
      stripeCheckoutSessionId: 'cs_stored',
      amountTotal: 100,
      expectedPriceCents: 2500,
    });
    expect(result.action).toBe('reject');
    if (result.action === 'reject') {
      expect(result.error).toContain('does not match lead price');
    }
  });

  test('rejects closed and new leads', () => {
    expect(
      decidePaidUnlock(
        { ...offered, status: 'closed' },
        {
          operatorId: 'op_1',
          stripeCheckoutSessionId: 'cs_stored',
          amountTotal: 2500,
          expectedPriceCents: 2500,
        },
      ).action,
    ).toBe('reject');
    expect(
      decidePaidUnlock(
        { ...offered, status: 'new' },
        {
          operatorId: 'op_1',
          stripeCheckoutSessionId: 'cs_stored',
          amountTotal: 2500,
          expectedPriceCents: 2500,
        },
      ).action,
    ).toBe('reject');
  });
});
