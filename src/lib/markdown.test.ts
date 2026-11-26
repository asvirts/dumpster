import { describe, expect, test } from 'vite-plus/test';
import { renderMarkdown, slugify } from './markdown';

// Expected strings are what Astro's default remark/rehype pipeline emits for the same input.

describe('renderMarkdown', () => {
  test('paragraphs, links, strong and heading ids', () => {
    const md = [
      'Permit fees—see [dumpster rental costs](/guides/how-much) for **typical** ranges.',
      '',
      '## When you usually need a permit',
      '',
      '## Commercial / contractor',
      '',
      '## How to Choose the Right Size (and Avoid Paying Twice)',
    ].join('\n');
    expect(renderMarkdown(md)).toBe(
      [
        '<p>Permit fees—see <a href="/guides/how-much">dumpster rental costs</a> for <strong>typical</strong> ranges.</p>',
        '<h2 id="when-you-usually-need-a-permit">When you usually need a permit</h2>',
        '<h2 id="commercial--contractor">Commercial / contractor</h2>',
        '<h2 id="how-to-choose-the-right-size-and-avoid-paying-twice">How to Choose the Right Size (and Avoid Paying Twice)</h2>',
      ].join('\n'),
    );
  });

  test('tight bullet and ordered lists', () => {
    const md = ['- One **bold**', '- Two', '', '1. First', '2. Second'].join('\n');
    expect(renderMarkdown(md)).toBe(
      [
        '<ul>',
        '<li>One <strong>bold</strong></li>',
        '<li>Two</li>',
        '</ul>',
        '<ol>',
        '<li>First</li>',
        '<li>Second</li>',
        '</ol>',
      ].join('\n'),
    );
  });

  test('loose list wraps items in paragraphs', () => {
    expect(renderMarkdown('- a\n\n- b')).toBe('<ul>\n<li>\n<p>a</p>\n</li>\n<li>\n<p>b</p>\n</li>\n</ul>');
  });

  test('GFM table', () => {
    const md = ['| Size | Best for |', '|------|----------|', '| **10 yard** | Garage cleanouts |'].join('\n');
    expect(renderMarkdown(md)).toBe(
      [
        '<table>',
        '<thead>',
        '<tr>',
        '<th>Size</th>',
        '<th>Best for</th>',
        '</tr>',
        '</thead>',
        '<tbody>',
        '<tr>',
        '<td><strong>10 yard</strong></td>',
        '<td>Garage cleanouts</td>',
        '</tr>',
        '</tbody>',
        '</table>',
      ].join('\n'),
    );
  });

  test('hard break and entity encoding', () => {
    expect(renderMarkdown('**Q?**  \nTypically C&D, 1 < 2.')).toBe(
      '<p><strong>Q?</strong><br>\nTypically C&#x26;D, 1 &#x3C; 2.</p>',
    );
  });

  test('smart punctuation', () => {
    expect(renderMarkdown(`It's "fine"... -- really`)).toBe('<p>It’s “fine”… — really</p>');
  });

  test('emphasis, code and escapes', () => {
    expect(renderMarkdown('*em* _em_ snake_case_name `a*b` \\*lit\\*')).toBe(
      '<p><em>em</em> <em>em</em> snake_case_name <code>a*b</code> *lit*</p>',
    );
  });

  test('duplicate heading ids get suffixes', () => {
    expect(renderMarkdown('## Tips\n\n## Tips')).toBe('<h2 id="tips">Tips</h2>\n<h2 id="tips-1">Tips</h2>');
  });
});

describe('slugify', () => {
  test('matches github-slugger for common headings', () => {
    expect(slugify('Dumpster Rental Prices by Size (2026 National Ranges)')).toBe(
      'dumpster-rental-prices-by-size-2026-national-ranges',
    );
    expect(slugify('Who pulls the permit?')).toBe('who-pulls-the-permit');
    expect(slugify('Not sure?')).toBe('not-sure');
  });
});
