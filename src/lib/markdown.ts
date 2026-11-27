/**
 * Small Markdown → HTML renderer for the guides (src/content/guides).
 *
 * It mirrors what Astro's default pipeline produced for this content (remark-parse + remark-gfm
 * + remark-smartypants → remark-rehype → rehype heading ids → hast-util-to-html): the same tags,
 * attributes, entity style (`&#x26;`) and line breaks between blocks, so the HTML diffs cleanly.
 *
 * Supported: ATX headings (with github-slugger ids), paragraphs, hard breaks, bullet and ordered
 * lists (tight and loose, nested by indentation), GFM tables, blockquotes, fenced code, thematic
 * breaks, links, autolinks, strong, emphasis, strikethrough, inline code, backslash escapes and
 * smart punctuation. Raw HTML in Markdown is escaped, not passed through.
 * Not supported: setext headings, indented code, reference links, footnotes, task lists, images.
 */

// ---------- escaping ----------

/** Text content, as hast-util-to-html encodes it. */
export function escapeText(value: string): string {
  return value.replace(/&/g, '&#x26;').replace(/</g, '&#x3C;');
}

/** Double-quoted attribute value, as hast-util-to-html encodes it. */
export function escapeAttr(value: string): string {
  return value.replace(/&/g, '&#x26;').replace(/"/g, '&#x22;');
}

// ---------- heading ids (github-slugger) ----------

/** github-slugger's slug(): lowercase, drop punctuation and symbols, spaces → hyphens. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}

/** Per-document slugger: repeats get -1, -2, … like github-slugger. */
export function createSlugger(): (value: string) => string {
  const seen = new Map<string, number>();
  return (value) => {
    const base = slugify(value);
    let slug = base;
    while (seen.has(slug)) {
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      slug = `${base}-${n}`;
    }
    seen.set(slug, 0);
    return slug;
  };
}

// ---------- smart punctuation (retext-smartypants defaults) ----------

function smartypants(text: string, prev: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const before = i > 0 ? text[i - 1] : prev;
    const after = text[i + 1] ?? '';
    if (ch === '.' && text.startsWith('...', i)) {
      out += '…';
      i += 2;
    } else if (ch === '-' && text[i + 1] === '-') {
      // `dashes: true`: `--` (and `---`) → em dash.
      out += '—';
      i += text[i + 2] === '-' ? 2 : 1;
    } else if (ch === '"' || ch === "'") {
      const opening = before === '' || /[\s([{—–-]/.test(before);
      const intraword = /[\p{L}\p{N}]/u.test(before) && /[\p{L}\p{N}]/u.test(after);
      if (ch === "'") out += opening && !intraword ? '‘' : '’';
      else out += opening ? '“' : '”';
    } else {
      out += ch;
    }
  }
  return out;
}

// ---------- inline ----------

const ESCAPABLE = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
const HARD_BREAK = '\u0000';

type InlineState = { last: string };

function textOut(raw: string, st: InlineState): string {
  if (!raw) return '';
  const html = escapeText(smartypants(raw, st.last));
  st.last = raw[raw.length - 1];
  return html;
}

function findClosing(src: string, from: number, marker: string): number {
  for (let j = from; j <= src.length - marker.length; j++) {
    if (src[j] === '\\') {
      j++;
      continue;
    }
    if (src[j] === '`') {
      const run = /^`+/.exec(src.slice(j))![0];
      const end = src.indexOf(run, j + run.length);
      if (end !== -1) j = end + run.length - 1;
      continue;
    }
    if (src.startsWith(marker, j) && !/\s/.test(src[j - 1] ?? ' ')) {
      // `*` inside `**…**`: skip a doubled marker when looking for a single one.
      if (marker.length === 1 && src[j + 1] === marker) {
        j++;
        continue;
      }
      return j;
    }
  }
  return -1;
}

function matchBracket(src: string, open: number): number {
  let depth = 0;
  for (let j = open; j < src.length; j++) {
    if (src[j] === '\\') j++;
    else if (src[j] === '[') depth++;
    else if (src[j] === ']' && --depth === 0) return j;
  }
  return -1;
}

function renderInline(src: string, st: InlineState = { last: '' }): string {
  let out = '';
  let buf = '';
  const flush = () => {
    out += textOut(buf, st);
    buf = '';
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (ch === HARD_BREAK) {
      flush();
      out += '<br>\n';
      st.last = '\n';
      continue;
    }

    if (ch === '\\' && ESCAPABLE.test(src[i + 1] ?? '')) {
      flush();
      out += escapeText(src[i + 1]);
      st.last = src[i + 1];
      i++;
      continue;
    }

    if (ch === '`') {
      const run = /^`+/.exec(src.slice(i))![0];
      const end = src.indexOf(run, i + run.length);
      if (end !== -1) {
        flush();
        let code = src.slice(i + run.length, end).replace(/\n/g, ' ');
        if (/^ .*[^ ].* $/.test(code)) code = code.slice(1, -1);
        out += `<code>${escapeText(code)}</code>`;
        st.last = '`';
        i = end + run.length - 1;
        continue;
      }
    }

    if (ch === '<') {
      const auto = /^<((?:https?|mailto):[^\s<>]+)>/i.exec(src.slice(i));
      if (auto) {
        flush();
        out += `<a href="${escapeAttr(auto[1])}">${escapeText(auto[1])}</a>`;
        st.last = '>';
        i += auto[0].length - 1;
        continue;
      }
    }

    if (ch === '[') {
      const close = matchBracket(src, i);
      if (close !== -1 && src[close + 1] === '(') {
        const dest = /^\(\s*(<[^>]*>|[^\s()]*(?:\([^\s()]*\)[^\s()]*)*)(?:\s+"([^"]*)")?\s*\)/.exec(
          src.slice(close + 1),
        );
        if (dest) {
          flush();
          const href = dest[1].replace(/^<|>$/g, '');
          const title = dest[2] !== undefined ? ` title="${escapeAttr(dest[2])}"` : '';
          out += `<a href="${escapeAttr(href)}"${title}>${renderInline(src.slice(i + 1, close), st)}</a>`;
          i = close + dest[0].length;
          continue;
        }
      }
    }

    if (ch === '*' || ch === '_' || ch === '~') {
      const double = src[i + 1] === ch;
      const marker = double ? ch + ch : ch;
      const prevCh = i > 0 ? src[i - 1] : '';
      const next = src[i + marker.length] ?? '';
      // `_` only opens at a word boundary; `~` only as GFM `~~`.
      const canOpen =
        next !== '' &&
        !/\s/.test(next) &&
        (ch !== '_' || !/[\p{L}\p{N}]/u.test(prevCh)) &&
        (ch !== '~' || double);
      if (canOpen) {
        const end = findClosing(src, i + marker.length, marker);
        if (end !== -1 && end > i + marker.length) {
          const after = src[end + marker.length] ?? '';
          if (ch !== '_' || !/[\p{L}\p{N}]/u.test(after)) {
            flush();
            const tag = ch === '~' ? 'del' : double ? 'strong' : 'em';
            out += `<${tag}>${renderInline(src.slice(i + marker.length, end), st)}</${tag}>`;
            i = end + marker.length - 1;
            continue;
          }
        }
      }
    }

    buf += ch;
  }
  flush();
  return out;
}

/** Paragraph text: strip line indentation, turn `  \n` / `\\\n` into hard breaks. */
function inlineFromLines(lines: string[]): string {
  const parts = lines.map((l) => l.replace(/^[ \t]+/, ''));
  let text = '';
  parts.forEach((line, idx) => {
    const last = idx === parts.length - 1;
    if (last) {
      text += line.replace(/[ \t]+$/, '');
    } else if (/ {2,}$/.test(line) || /\\$/.test(line)) {
      text += line.replace(/\\$/, '').replace(/[ \t]+$/, '') + HARD_BREAK;
    } else {
      text += line.replace(/[ \t]+$/, '') + '\n';
    }
  });
  return renderInline(text);
}

// ---------- blocks ----------

const RE_HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const RE_HR = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const RE_FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*([^`\s]*)?.*$/;
const RE_BULLET = /^( {0,3})([-*+])([ \t]+|$)(.*)$/;
const RE_ORDERED = /^( {0,3})(\d{1,9})([.)])([ \t]+|$)(.*)$/;
const RE_QUOTE = /^ {0,3}> ?(.*)$/;
const RE_TABLE_DELIM = /^ {0,3}\|?[ \t]*:?-+:?[ \t]*(\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;

function splitRow(line: string): string[] {
  let row = line.trim();
  if (row.startsWith('|')) row = row.slice(1);
  if (row.endsWith('|') && !row.endsWith('\\|')) row = row.slice(0, -1);
  const cells: string[] = [];
  let cur = '';
  for (let i = 0; i < row.length; i++) {
    if (row[i] === '\\' && row[i + 1] === '|') {
      cur += '|';
      i++;
    } else if (row[i] === '|') {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += row[i];
    }
  }
  cells.push(cur.trim());
  return cells;
}

function isTableStart(lines: string[], i: number): boolean {
  return lines[i].includes('|') && i + 1 < lines.length && RE_TABLE_DELIM.test(lines[i + 1]) && lines[i + 1].includes('-');
}

function startsBlock(line: string): boolean {
  return (
    RE_HEADING.test(line) ||
    RE_HR.test(line) ||
    RE_FENCE.test(line) ||
    RE_QUOTE.test(line) ||
    RE_BULLET.test(line) ||
    // Only an ordered list starting at 1 may interrupt a paragraph (CommonMark).
    (RE_ORDERED.test(line) && RE_ORDERED.exec(line)![2] === '1')
  );
}

const isBlank = (line: string) => /^[ \t]*$/.test(line);

type Ctx = { slug: (v: string) => string };

function renderTable(lines: string[]): string {
  const head = splitRow(lines[0]);
  const align = splitRow(lines[1]).map((c) =>
    c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : c.startsWith(':') ? 'left' : null,
  );
  const cell = (tag: 'th' | 'td', text: string, idx: number) =>
    `<${tag}${align[idx] ? ` align="${align[idx]}"` : ''}>${renderInline(text)}</${tag}>`;
  const row = (tag: 'th' | 'td', cells: string[]) => {
    const filled = head.map((_, idx) => cells[idx] ?? '');
    return `<tr>\n${filled.map((c, idx) => cell(tag, c, idx)).join('\n')}\n</tr>`;
  };
  let html = `<table>\n<thead>\n${row('th', head)}\n</thead>`;
  const body = lines.slice(2).map(splitRow);
  if (body.length) html += `\n<tbody>\n${body.map((cells) => row('td', cells)).join('\n')}\n</tbody>`;
  return `${html}\n</table>`;
}

function renderBlocks(lines: string[], ctx: Ctx): string[] {
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      i++;
      continue;
    }

    const fence = RE_FENCE.exec(line);
    if (fence) {
      const marker = fence[1];
      const lang = fence[2];
      const body: string[] = [];
      i++;
      while (i < lines.length && !new RegExp(`^ {0,3}${marker[0]}{${marker.length},}[ \\t]*$`).test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      i++;
      const code = body.length ? `${body.join('\n')}\n` : '';
      const cls = lang ? ` class="language-${escapeAttr(lang)}"` : '';
      out.push(`<pre><code${cls}>${escapeText(code)}</code></pre>`);
      continue;
    }

    const heading = RE_HEADING.exec(line);
    if (heading) {
      const level = heading[1].length;
      const inner = renderInline((heading[2] ?? '').trim());
      const text = inner
        .replace(/<[^>]+>/g, '')
        .replace(/&#x26;/g, '&')
        .replace(/&#x3C;/g, '<');
      out.push(`<h${level} id="${escapeAttr(ctx.slug(text))}">${inner}</h${level}>`);
      i++;
      continue;
    }

    if (RE_HR.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    if (RE_QUOTE.test(line)) {
      const body: string[] = [];
      while (i < lines.length && !isBlank(lines[i])) {
        const q = RE_QUOTE.exec(lines[i]);
        body.push(q ? q[1] : lines[i]);
        i++;
      }
      const inner = renderBlocks(body, ctx);
      out.push(`<blockquote>\n${inner.join('\n')}\n</blockquote>`);
      continue;
    }

    if (RE_BULLET.test(line) || RE_ORDERED.test(line)) {
      const [html, next] = renderList(lines, i, ctx);
      out.push(html);
      i = next;
      continue;
    }

    if (isTableStart(lines, i)) {
      const rows: string[] = [lines[i], lines[i + 1]];
      i += 2;
      while (i < lines.length && !isBlank(lines[i]) && !startsBlock(lines[i])) {
        rows.push(lines[i]);
        i++;
      }
      out.push(renderTable(rows));
      continue;
    }

    // Paragraph
    const para: string[] = [line];
    i++;
    while (i < lines.length && !isBlank(lines[i]) && !startsBlock(lines[i]) && !isTableStart(lines, i)) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inlineFromLines(para)}</p>`);
  }

  return out;
}

function renderList(lines: string[], start: number, ctx: Ctx): [string, number] {
  const first = RE_ORDERED.exec(lines[start]);
  const ordered = !!first;
  const bulletChar = ordered ? null : RE_BULLET.exec(lines[start])![2];
  const delim = first?.[3];
  const items: string[][] = [];
  let loose = false;
  let i = start;
  let blankBefore = false;

  const matchItem = (line: string) => {
    if (ordered) {
      const m = RE_ORDERED.exec(line);
      return m && m[3] === delim ? { indent: m[1].length + m[2].length + 1 + Math.max(1, m[4].length), text: m[5] } : null;
    }
    const m = RE_BULLET.exec(line);
    return m && m[2] === bulletChar ? { indent: m[1].length + 1 + Math.max(1, m[3].length), text: m[4] } : null;
  };

  let indent = 0;
  while (i < lines.length) {
    const line = lines[i];
    const item = matchItem(line);
    if (item && !(RE_HR.test(line) && !ordered)) {
      if (blankBefore && items.length) loose = true;
      items.push([item.text]);
      indent = item.indent;
      blankBefore = false;
      i++;
      continue;
    }
    if (isBlank(line)) {
      // A blank line ends the list unless an indented continuation or a new item follows.
      const next = lines.slice(i + 1).find((l) => !isBlank(l));
      if (next === undefined) break;
      const nextIndent = /^ */.exec(next)![0].length;
      if (!matchItem(next) && nextIndent < indent) break;
      items[items.length - 1].push('');
      blankBefore = true;
      i++;
      continue;
    }
    const lineIndent = /^ */.exec(line)![0].length;
    if (lineIndent >= indent) {
      if (blankBefore) loose = true;
      items[items.length - 1].push(line.slice(indent));
      blankBefore = false;
      i++;
      continue;
    }
    // Lazy paragraph continuation (unindented text right after an item line).
    if (!blankBefore && !startsBlock(line)) {
      items[items.length - 1].push(line);
      i++;
      continue;
    }
    break;
  }

  const lis = items.map((itemLines) => {
    while (itemLines.length && isBlank(itemLines[itemLines.length - 1])) itemLines.pop();
    const blocks = renderBlocks(itemLines, ctx);
    if (!blocks.length) return '<li></li>';
    if (loose) return `<li>\n${blocks.join('\n')}\n</li>`;
    // Tight: paragraphs are unwrapped.
    const parts = blocks.map((b) => (b.startsWith('<p>') && b.endsWith('</p>') ? b.slice(3, -4) : b));
    const nested = parts.length > 1 ? `${parts[0]}\n${parts.slice(1).join('\n')}\n` : parts[0];
    return `<li>${nested}</li>`;
  });

  const startNum = first ? Number(first[2]) : 1;
  const open = ordered ? (startNum !== 1 ? `<ol start="${startNum}">` : '<ol>') : '<ul>';
  const close = ordered ? '</ol>' : '</ul>';
  return [`${open}\n${lis.join('\n')}\n${close}`, i];
}

/** Render a Markdown document body (no frontmatter) to HTML. */
export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  return renderBlocks(lines, { slug: createSlugger() }).join('\n');
}
