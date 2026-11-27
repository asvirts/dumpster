import { describe, expect, test } from 'vite-plus/test';
import { canonicalRedirect } from './canonical-url';

describe('canonicalRedirect', () => {
  test('leaves canonical URLs alone', () => {
    expect(canonicalRedirect('https://findadumpster.net/', 'GET')).toBeNull();
    expect(canonicalRedirect('https://findadumpster.net/dumpster-rental/tx/houston?x=1', 'GET')).toBeNull();
    expect(canonicalRedirect('https://findadumpster.net/admin/leads/AbC123', 'GET')).toBeNull();
  });

  test('moves http to https', () => {
    expect(canonicalRedirect('http://findadumpster.net/guides', 'GET')).toBe('https://findadumpster.net/guides');
  });

  test('moves www and workers.dev hosts to the canonical host', () => {
    expect(canonicalRedirect('https://www.findadumpster.net/search?q=tx', 'GET')).toBe(
      'https://findadumpster.net/search?q=tx',
    );
    expect(canonicalRedirect('http://findadumpster.asvirts.workers.dev/operator/x', 'GET')).toBe(
      'https://findadumpster.net/operator/x',
    );
  });

  test('drops a trailing slash', () => {
    expect(canonicalRedirect('https://findadumpster.net/dumpster-rental/tx/houston/', 'GET')).toBe(
      'https://findadumpster.net/dumpster-rental/tx/houston',
    );
  });

  test('lowercases public slugs only', () => {
    expect(canonicalRedirect('https://findadumpster.net/dumpster-rental/TX/Houston', 'GET')).toBe(
      'https://findadumpster.net/dumpster-rental/tx/houston',
    );
    expect(canonicalRedirect('https://findadumpster.net/Guides/Dumpster-Size-Guide', 'GET')).toBe(
      'https://findadumpster.net/guides/dumpster-size-guide',
    );
    expect(canonicalRedirect('https://findadumpster.net/portal/Leads', 'GET')).toBeNull();
  });

  test('keeps localhost host and scheme', () => {
    expect(canonicalRedirect('http://localhost:8789/dumpster-rental/TX/Houston/', 'GET')).toBe(
      'http://localhost:8789/dumpster-rental/tx/houston',
    );
    expect(canonicalRedirect('http://localhost:8789/', 'GET')).toBeNull();
  });

  test('never redirects form posts', () => {
    expect(canonicalRedirect('http://www.findadumpster.net/Operator/X/', 'POST')).toBeNull();
  });
});
