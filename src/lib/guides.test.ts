import { describe, expect, test } from 'vite-plus/test';
import { getGuide, getGuides, parseFrontmatter, renderGuide } from './guides';

describe('parseFrontmatter', () => {
  test('flat YAML scalars', () => {
    const { data, body } = parseFrontmatter(
      '---\ntitle: A: B\ndraft: true\nupdated: 2026-08-09\nquoted: "x # y"\nurl: https://example.com/a\n---\n\nBody\n',
    );
    expect(data).toEqual({
      title: 'A: B',
      draft: true,
      updated: '2026-08-09',
      quoted: 'x # y',
      url: 'https://example.com/a',
    });
    expect(body).toBe('\nBody\n');
  });
});

describe('guides', () => {
  test('loads every guide with valid frontmatter, sorted by title', () => {
    const guides = getGuides();
    expect(guides.length).toBeGreaterThan(0);
    const titles = guides.map((g) => g.data.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
    for (const g of guides) expect(g.data.draft).toBe(false);
  });

  test('cost guide frontmatter and rendering', () => {
    const guide = getGuide('how-much-do-dumpster-rentals-cost');
    expect(guide?.data.category).toBe('basics');
    expect(guide?.data.updated?.toISOString().slice(0, 10)).toBe('2026-08-09');
    expect(guide?.data.image).toBe('/guides/how-much-do-dumpster-rentals-cost.jpg');
    const html = renderGuide(guide!);
    expect(html).toContain(
      '<h2 id="dumpster-rental-prices-by-size-2026-national-ranges">Dumpster Rental Prices by Size (2026 National Ranges)</h2>',
    );
    expect(html).toContain('<p><strong>How much does a 20-yard dumpster cost?</strong><br>\nTypically');
    expect(html).not.toContain('**');
  });

  test('unknown slug', () => {
    expect(getGuide('does-not-exist')).toBeUndefined();
    expect(getGuide(undefined)).toBeUndefined();
  });
});
