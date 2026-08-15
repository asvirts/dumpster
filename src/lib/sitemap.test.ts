import { describe, expect, test } from 'bun:test';
import {
  absoluteUrl,
  cityPageLastmod,
  maxLastmod,
  renderUrlset,
} from './sitemap';

describe('maxLastmod', () => {
  test('picks the latest parseable date', () => {
    expect(maxLastmod('2026-08-11', '2026-08-15 18:00:00', null)).toBe(
      '2026-08-15',
    );
  });

  test('returns null when nothing parses', () => {
    expect(maxLastmod(null, '', 'not-a-date')).toBeNull();
  });
});

describe('cityPageLastmod', () => {
  test('uses a newer listing date over a stale city row', () => {
    expect(cityPageLastmod('2026-08-11', ['2026-08-15T12:00:00Z'])).toBe(
      '2026-08-15',
    );
  });

  test('keeps the city date when listings are older', () => {
    expect(cityPageLastmod('2026-08-15', ['2026-08-11'])).toBe('2026-08-15');
  });
});

describe('renderUrlset', () => {
  test('emits city and operator landings with lastmod', () => {
    const xml = renderUrlset([
      {
        loc: absoluteUrl('https://findadumpster.net', '/dumpster-rental/ok/tulsa'),
        lastmod: '2026-08-15',
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: absoluteUrl('https://findadumpster.net', '/operator/red-dirt-roll-offs'),
        lastmod: '2026-08-15',
        changefreq: 'weekly',
        priority: 0.7,
      },
    ]);

    expect(xml).toContain(
      '<loc>https://findadumpster.net/dumpster-rental/ok/tulsa</loc>',
    );
    expect(xml).toContain(
      '<loc>https://findadumpster.net/operator/red-dirt-roll-offs</loc>',
    );
    expect(xml).toContain('<lastmod>2026-08-15</lastmod>');
    expect(xml).not.toContain('/dumpster-rental/ak/anchorage');
  });
});
