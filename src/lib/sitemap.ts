/** Sitemap entry used to build standards-compliant XML for crawlers. */
export type SitemapImage = {
  loc: string;
  title?: string;
  caption?: string;
};

export type SitemapEntry = {
  loc: string;
  lastmod?: string | Date | null;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  /** 0.0–1.0 relative importance hint (ignored by Google, used by some crawlers). */
  priority?: number;
  images?: SitemapImage[];
};

const W3C_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

/** Escape text for XML element/attribute content. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Normalize a date-like value to W3C Datetime (YYYY-MM-DD preferred when time is midnight/unknown).
 * Returns null when the value cannot be parsed — omit lastmod rather than guess.
 */
export function toW3cDate(value: string | Date | null | undefined): string | null {
  if (value == null || value === '') return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value.toISOString().slice(0, 10);
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  // SQLite datetime('now') → "YYYY-MM-DD HH:MM:SS"
  const normalized = trimmed.includes(' ') && !trimmed.includes('T')
    ? trimmed.replace(' ', 'T') + (trimmed.endsWith('Z') ? '' : 'Z')
    : trimmed;

  if (W3C_DATE.test(trimmed) && trimmed.length === 10) {
    return trimmed;
  }

  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) {
    // Try pure date prefix from SQLite timestamps
    const dateOnly = trimmed.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return dateOnly;
    return null;
  }
  return d.toISOString().slice(0, 10);
}

export function absoluteUrl(base: string, path: string): string {
  const root = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${root}${p === '/' ? '/' : p.replace(/\/$/, '')}`;
}

/** Build a urlset XML document (with optional image extension). */
export function renderUrlset(entries: SitemapEntry[]): string {
  // Dedupe by loc (first wins — callers should order by importance).
  const seen = new Set<string>();
  const unique: SitemapEntry[] = [];
  for (const entry of entries) {
    if (!entry.loc || seen.has(entry.loc)) continue;
    seen.add(entry.loc);
    unique.push(entry);
  }

  const hasImages = unique.some((e) => e.images && e.images.length > 0);
  const imageNs = hasImages
    ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : '';

  const urls = unique
    .map((entry) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(entry.loc)}</loc>`];

      const lastmod = toW3cDate(entry.lastmod);
      if (lastmod) {
        lines.push(`    <lastmod>${lastmod}</lastmod>`);
      }
      if (entry.changefreq) {
        lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      }
      if (typeof entry.priority === 'number' && entry.priority >= 0 && entry.priority <= 1) {
        lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }

      if (entry.images?.length) {
        for (const img of entry.images) {
          lines.push(`    <image:image>`);
          lines.push(`      <image:loc>${escapeXml(img.loc)}</image:loc>`);
          if (img.title) {
            lines.push(`      <image:title>${escapeXml(img.title)}</image:title>`);
          }
          if (img.caption) {
            lines.push(`      <image:caption>${escapeXml(img.caption)}</image:caption>`);
          }
          lines.push(`    </image:image>`);
        }
      }

      lines.push(`  </url>`);
      return lines.join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNs}>
${urls}
</urlset>
`;
}
