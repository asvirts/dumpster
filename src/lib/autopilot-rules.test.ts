import { describe, expect, test } from 'bun:test';
import {
  candidateTier,
  claimAutoApprovable,
  claimProofEmail,
  clampWeeklyCap,
  extractZip,
  hoursAgoSqlite,
  leadSuspicionReasons,
  operatorNotifyEmail,
  parseNotifyEmail,
  rankCandidates,
  signLinkValue,
  verifyLinkValue,
  type CandidateFacts,
} from './autopilot-rules';

const good = {
  seekerName: 'Pat Doe',
  seekerEmail: 'pat@gmail.com',
  seekerPhone: '(512) 867-5309',
  notes: 'Kitchen remodel, need it Friday',
};

describe('leadSuspicionReasons', () => {
  test('accepts a normal lead', () => {
    expect(leadSuspicionReasons(good)).toEqual([]);
  });

  test('accepts +1 country code', () => {
    expect(leadSuspicionReasons({ ...good, seekerPhone: '+1 512-867-5309' })).toEqual([]);
  });

  test('holds short, repeated and 555 phones', () => {
    expect(leadSuspicionReasons({ ...good, seekerPhone: '867-5309' })).toHaveLength(1);
    expect(leadSuspicionReasons({ ...good, seekerPhone: '1111111111' })).toHaveLength(1);
    expect(leadSuspicionReasons({ ...good, seekerPhone: '512-555-0199' })).toHaveLength(1);
  });

  test('holds disposable email and link spam', () => {
    expect(leadSuspicionReasons({ ...good, seekerEmail: 'x@mailinator.com' })).toHaveLength(1);
    expect(
      leadSuspicionReasons({ ...good, notes: 'see https://a.example and www.b.example' }),
    ).toHaveLength(1);
    expect(leadSuspicionReasons({ ...good, seekerName: 'Buy now https://spam' })).toHaveLength(1);
  });
});

describe('extractZip', () => {
  test('finds a ZIP in an address', () => {
    expect(extractZip('123 Main St, Austin, TX 78701-1234')).toBe('78701');
    expect(extractZip('78701')).toBe('78701');
    expect(extractZip('17322 Canby Rd, Leesburg, VA 20175, EE. UU.')).toBe('20175');
    expect(extractZip('Austin TX')).toBeNull();
    expect(extractZip(null)).toBeNull();
  });
});

describe('rankCandidates', () => {
  const base: CandidateFacts = {
    id: 'a',
    claimStatus: 'unclaimed',
    autoUnlockEnabled: false,
    hasSavedCard: false,
    verificationStatus: 'verified',
    qualityScore: 50,
    distanceMiles: 5,
  };

  test('auto-buy operators first, then claimed, then unclaimed', () => {
    const auto = { ...base, id: 'auto', claimStatus: 'approved', autoUnlockEnabled: true, hasSavedCard: true };
    const claimed = { ...base, id: 'claimed', claimStatus: 'approved' };
    const unclaimed = { ...base, id: 'unclaimed', qualityScore: 99 };
    expect(rankCandidates([unclaimed, claimed, auto]).map((c) => c.id)).toEqual([
      'auto',
      'claimed',
      'unclaimed',
    ]);
  });

  test('auto-buy without a saved card is not tier 3', () => {
    expect(candidateTier({ ...base, claimStatus: 'approved', autoUnlockEnabled: true })).toBe(2);
  });

  test('within a tier: verified, quality, then distance', () => {
    const far = { ...base, id: 'far', distanceMiles: 30 };
    const near = { ...base, id: 'near', distanceMiles: 2 };
    const pending = { ...base, id: 'pending', verificationStatus: 'pending', distanceMiles: 1 };
    const best = { ...base, id: 'best', qualityScore: 90, distanceMiles: 40 };
    expect(rankCandidates([pending, far, near, best]).map((c) => c.id)).toEqual([
      'best',
      'near',
      'far',
      'pending',
    ]);
  });
});

describe('claimAutoApprovable', () => {
  const op = { email: 'office@acmedumpsters.com', website: 'https://www.acmedumpsters.com/' };

  test('exact listing email', () => {
    expect(claimAutoApprovable(op, ['Office@AcmeDumpsters.com'])).toBe(true);
  });

  test('same domain as website', () => {
    expect(claimAutoApprovable(op, ['owner@acmedumpsters.com'])).toBe(true);
    expect(claimAutoApprovable({ email: null, website: 'acmedumpsters.com' }, ['a@acmedumpsters.com'])).toBe(true);
  });

  test('rejects other domains, free mail and lookalikes', () => {
    expect(claimAutoApprovable(op, ['owner@gmail.com'])).toBe(false);
    expect(claimAutoApprovable(op, ['x@evilacmedumpsters.com'])).toBe(false);
    expect(claimAutoApprovable(op, [])).toBe(false);
    expect(
      claimAutoApprovable({ email: 'acme@gmail.com', website: 'https://gmail.com' }, ['other@gmail.com']),
    ).toBe(false);
  });

  test('gmail listing email still matches exactly', () => {
    expect(claimAutoApprovable({ email: 'acme@gmail.com', website: null }, ['acme@gmail.com'])).toBe(true);
  });
});

describe('claimProofEmail', () => {
  const op = { email: 'info@acme-dumpsters.com', website: 'https://www.acme-dumpsters.com' };

  test('returns the matching listing email', () => {
    expect(claimProofEmail(op, ['me@gmail.com', 'Info@Acme-Dumpsters.com'])).toBe('info@acme-dumpsters.com');
  });

  test('returns the claimant address on the website domain, not the listing email', () => {
    expect(claimProofEmail(op, ['me@gmail.com', 'Owner@acme-dumpsters.com'])).toBe('owner@acme-dumpsters.com');
  });

  test('null when nothing proves control', () => {
    expect(claimProofEmail(op, ['me@gmail.com'])).toBeNull();
    expect(claimProofEmail({ email: null, website: null }, ['owner@acme-dumpsters.com'])).toBeNull();
  });
});

describe('operatorNotifyEmail', () => {
  test('prefers the lead notification email', () => {
    expect(operatorNotifyEmail({ leadNotifyEmail: 'owner@acme.com', email: 'info@acme.com' })).toBe('owner@acme.com');
  });

  test('falls back to the listing email', () => {
    expect(operatorNotifyEmail({ leadNotifyEmail: '  ', email: 'info@acme.com' })).toBe('info@acme.com');
    expect(operatorNotifyEmail({ email: 'info@acme.com' })).toBe('info@acme.com');
  });

  test('null when neither is set', () => {
    expect(operatorNotifyEmail({ leadNotifyEmail: null, email: '' })).toBeNull();
  });
});

describe('parseNotifyEmail', () => {
  test('blank clears', () => {
    expect(parseNotifyEmail('  ')).toEqual({ ok: true, value: null });
    expect(parseNotifyEmail(null)).toEqual({ ok: true, value: null });
  });

  test('normalizes a valid address', () => {
    expect(parseNotifyEmail(' Owner@Acme.com ')).toEqual({ ok: true, value: 'owner@acme.com' });
  });

  test('rejects malformed input', () => {
    expect(parseNotifyEmail('owner@acme')).toEqual({ ok: false });
    expect(parseNotifyEmail('two words@acme.com')).toEqual({ ok: false });
  });
});

describe('signed links', () => {
  test('round-trips and rejects tampering', async () => {
    const sig = await signLinkValue('secret', 'unsub', 'op_1');
    expect(await verifyLinkValue('secret', 'unsub', 'op_1', sig)).toBe(true);
    expect(await verifyLinkValue('secret', 'unsub', 'op_2', sig)).toBe(false);
    expect(await verifyLinkValue('other', 'unsub', 'op_1', sig)).toBe(false);
    expect(await verifyLinkValue('secret', 'unsub', 'op_1', 'nope')).toBe(false);
  });
});

describe('misc', () => {
  test('clampWeeklyCap', () => {
    expect(clampWeeklyCap('5')).toBe(5);
    expect(clampWeeklyCap('0')).toBe(1);
    expect(clampWeeklyCap('1000')).toBe(100);
    expect(clampWeeklyCap('abc')).toBe(10);
  });

  test('hoursAgoSqlite matches SQLite datetime format', () => {
    const now = Date.parse('2026-11-25T12:30:45.123Z');
    expect(hoursAgoSqlite(1, now)).toBe('2026-11-25 11:30:45');
    // Same-day comparison with a SQLite created_at works as a string compare.
    expect('2026-11-25 12:00:00' >= hoursAgoSqlite(1, now)).toBe(true);
  });
});
