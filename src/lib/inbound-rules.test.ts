import { describe, expect, test } from 'vite-plus/test';
import {
  isAutoReply,
  isUnsubscribeRequest,
  parseEmailAddress,
  signSvixPayload,
  stripQuotedReply,
  verifySvixSignature,
} from './inbound-rules';

const SECRET = `whsec_${btoa('0123456789abcdef0123456789abcdef')}`;

describe('verifySvixSignature', () => {
  const body = '{"type":"email.received","data":{"email_id":"abc"}}';
  const now = 1_800_000_000;

  test('accepts a valid signature among several', async () => {
    const sig = await signSvixPayload(SECRET, 'msg_1', String(now), body);
    const ok = await verifySvixSignature(
      SECRET,
      { id: 'msg_1', timestamp: String(now), signature: `v1,bogus= v1,${sig}` },
      body,
      now + 10,
    );
    expect(ok).toBe(true);
  });

  test('rejects tampered body, wrong id, stale timestamp and missing headers', async () => {
    const sig = await signSvixPayload(SECRET, 'msg_1', String(now), body);
    const h = { id: 'msg_1', timestamp: String(now), signature: `v1,${sig}` };
    expect(await verifySvixSignature(SECRET, h, body + ' ', now)).toBe(false);
    expect(await verifySvixSignature(SECRET, { ...h, id: 'msg_2' }, body, now)).toBe(false);
    expect(await verifySvixSignature(SECRET, h, body, now + 600)).toBe(false);
    expect(await verifySvixSignature(SECRET, { ...h, signature: null }, body, now)).toBe(false);
    expect(await verifySvixSignature('', h, body, now)).toBe(false);
  });
});

describe('stripQuotedReply', () => {
  test('keeps only the new text', () => {
    const text = 'Yes send it over\nThanks\n\nOn Tue, Nov 25, 2026 at 3:15 PM Find A Dumpster <leads@findadumpster.net> wrote:\n> A customer near you…';
    expect(stripQuotedReply(text)).toBe('Yes send it over\nThanks');
    expect(stripQuotedReply('> quoted\nhi')).toBe('hi');
    expect(stripQuotedReply(null)).toBe('');
  });
});

describe('isUnsubscribeRequest', () => {
  test('catches short opt-out replies', () => {
    expect(isUnsubscribeRequest('Re: lead', 'STOP')).toBe(true);
    expect(isUnsubscribeRequest('Re: lead', 'Please remove me from your list.')).toBe(true);
    expect(isUnsubscribeRequest('Unsubscribe', '')).toBe(true);
    expect(isUnsubscribeRequest('Re: lead', "Don't email us again")).toBe(true);
  });

  test('leaves real questions alone', () => {
    expect(isUnsubscribeRequest('Re: lead', 'How much is it and how do I pay?')).toBe(false);
    expect(isUnsubscribeRequest('Re: lead', 'Can you stop by the yard tomorrow?')).toBe(false);
  });
});

describe('isAutoReply', () => {
  test('detects machine replies', () => {
    expect(isAutoReply('Out of Office: back Monday', {})).toBe(true);
    expect(isAutoReply('Re: lead', { 'Auto-Submitted': 'auto-replied' })).toBe(true);
    expect(isAutoReply('Re: lead', { precedence: 'auto_reply' })).toBe(true);
    expect(isAutoReply('Re: lead', { 'auto-submitted': 'no' })).toBe(false);
    expect(isAutoReply('Re: new dumpster lead', null)).toBe(false);
  });
});

describe('parseEmailAddress', () => {
  test('handles display names and bare addresses', () => {
    expect(parseEmailAddress('Ed Smith <Ed@RoadrunnerRollOffs.com>')).toBe('ed@roadrunnerrolloffs.com');
    expect(parseEmailAddress('info@ddtdumpster.com')).toBe('info@ddtdumpster.com');
    expect(parseEmailAddress('')).toBeNull();
  });
});
