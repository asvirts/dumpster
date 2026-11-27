import { describe, expect, test } from 'vite-plus/test';
import { metaDescription } from './seo';

describe('metaDescription', () => {
  test('returns short text unchanged, with whitespace collapsed', () => {
    expect(metaDescription('  Local   roll-off\noperator. ')).toBe('Local roll-off operator.');
  });

  test('cuts long text at a word boundary with an ellipsis', () => {
    const text = 'word '.repeat(40).trim();
    const out = metaDescription(text, 50);
    expect(out.length).toBeLessThanOrEqual(50);
    expect(out).toBe(`${'word '.repeat(10).trim()}…`);
    expect(metaDescription(text, 48)).toBe(`${'word '.repeat(9).trim()}…`);
  });

  test('drops trailing punctuation before the ellipsis', () => {
    expect(metaDescription('Dallas, Fort Worth, and many suburbs nearby', 21)).toBe('Dallas, Fort Worth…');
  });

  test('hard-cuts a single long word', () => {
    expect(metaDescription('a'.repeat(30), 10)).toBe(`${'a'.repeat(9)}…`);
  });
});
