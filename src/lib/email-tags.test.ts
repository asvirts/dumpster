import { describe, expect, test } from 'vite-plus/test';
import { emailTags, leadTagId, sanitizeTagValue } from './email-tags';

describe('sanitizeTagValue', () => {
  test('keeps allowed characters', () => {
    expect(sanitizeTagValue('aZ09_-')).toBe('aZ09_-');
  });

  test('replaces everything else with underscores', () => {
    expect(sanitizeTagValue('a.b c@d/é')).toBe('a_b_c_d__');
  });

  test('caps at 256 characters', () => {
    expect(sanitizeTagValue('x'.repeat(300))).toHaveLength(256);
  });
});

describe('leadTagId', () => {
  test('uses the group id when present', () => {
    expect(leadTagId({ id: 'clone', groupId: 'group' })).toBe('group');
  });

  test('falls back to the row id', () => {
    expect(leadTagId({ id: 'row', groupId: null })).toBe('row');
  });
});

describe('emailTags', () => {
  test('site and kind only', () => {
    expect(emailTags('admin_digest')).toEqual([
      { name: 'site', value: 'dumpster' },
      { name: 'kind', value: 'admin_digest' },
    ]);
  });

  test('adds lead and operator ids, sanitized', () => {
    expect(emailTags('lead_offer', { leadId: 'V1StGXR8_Z5jdHi6B-myT', operatorId: 'op.1' })).toEqual([
      { name: 'site', value: 'dumpster' },
      { name: 'kind', value: 'lead_offer' },
      { name: 'lead_id', value: 'V1StGXR8_Z5jdHi6B-myT' },
      { name: 'operator_id', value: 'op_1' },
    ]);
  });

  test('skips missing ids', () => {
    expect(emailTags('inbound_forward', { leadId: null, operatorId: undefined })).toHaveLength(2);
  });
});
