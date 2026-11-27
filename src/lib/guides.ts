import { z } from 'zod';
import { renderMarkdown } from './markdown';

/** Frontmatter schema (was the `guides` content collection in src/content.config.ts). */
export const guideSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().default('general'),
  draft: z.boolean().default(false),
  /** First publication; falls back to `updated` in Article JSON-LD. */
  published: z.coerce.date().optional(),
  /** Last meaningful content update — used for sitemap lastmod and Article dateModified. */
  updated: z.coerce.date().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  imageCredit: z.string().optional(),
  imageCreditUrl: z.string().url().optional(),
});

export type GuideData = z.infer<typeof guideSchema>;

export type Guide = {
  /** URL slug: the file name without `.md` (Astro's glob loader id). */
  id: string;
  data: GuideData;
  /** Markdown body without frontmatter. */
  body: string;
};

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === '') return null;
  const quoted = /^(["'])(.*)\1$/.exec(value);
  if (quoted) {
    return quoted[1] === '"'
      ? quoted[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\')
      : quoted[2].replace(/''/g, "'");
  }
  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === 'true';
  if (/^(null|~)$/.test(value)) return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  // Unquoted scalar; drop a trailing YAML comment.
  return value.replace(/\s+#.*$/, '');
}

/**
 * Split `---` frontmatter from the body. Handles the flat `key: value` YAML the guides use
 * (strings, quoted strings, booleans, numbers, dates as strings for `z.coerce.date()`).
 */
export function parseFrontmatter(source: string): { data: Record<string, unknown>; body: string } {
  const text = source.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const match = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text);
  if (!match) return { data: {}, body: text };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const kv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(line);
    if (!kv) throw new Error(`Unsupported frontmatter line: ${line}`);
    const value = parseScalar(kv[2] ?? '');
    // YAML null → key absent, so zod defaults and optionals apply.
    if (value !== null) data[kv[1]] = value;
  }
  return { data, body: text.slice(match[0].length) };
}

const files = import.meta.glob<string>('../content/guides/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function loadAll(): Guide[] {
  return Object.entries(files).map(([path, source]) => {
    const id = path.replace(/^.*\/content\/guides\//, '').replace(/\.md$/, '');
    const { data, body } = parseFrontmatter(source);
    const parsed = guideSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid frontmatter in src/content/guides/${id}.md: ${parsed.error.message}`);
    }
    return { id, data: parsed.data, body };
  });
}

let cache: Guide[] | null = null;

/** Published guides (drafts excluded), sorted by title like the Astro guides index. */
export function getGuides(): Guide[] {
  cache ??= loadAll()
    .filter((g) => !g.data.draft)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
  return cache;
}

export function getGuide(id: string | undefined): Guide | undefined {
  return id ? getGuides().find((g) => g.id === id) : undefined;
}

export function renderGuide(guide: Guide): string {
  return renderMarkdown(guide.body);
}
