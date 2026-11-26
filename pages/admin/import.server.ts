import { and, eq } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { createOperator } from '../../src/lib/admin';
import { getDb } from '../../src/lib/db';
import { slugify } from '../../src/lib/geo';
import { cities } from '../../src/lib/schema';
import { adminGuard, adminHead, getAdminResult, setAdminResult } from '../../src/server/admin-guard';
import { withShared } from '../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const result = getAdminResult(c);
  return {
    adminEmail: c.get('adminEmail'),
    message: typeof result?.message === 'string' ? result.message : '',
    errors: Array.isArray(result?.errors) ? (result.errors as string[]).slice(0, 20) : [],
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('CSV import'));

// Astro re-rendered the page with the import summary (no redirect); the loader reads it back.
export const action = defineHandler(adminGuard, async (c) => {
  const db = getDb();
  let message = '';
  let imported = 0;
  const errors: string[] = [];

  const form = await c.req.formData();
  const file = form.get('csv');
  if (!(file instanceof File)) {
    message = 'Please upload a CSV file.';
  } else if (file.size > 1_000_000) {
    message = 'CSV too large (max 1MB).';
  } else {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) {
      message = 'CSV needs a header row and at least one data row.';
    } else if (lines.length > 501) {
      message = 'CSV too many rows (max 500 data rows).';
    } else {
      const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
      const idx = (name: string) => headers.indexOf(name);

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        const get = (name: string) => {
          const j = idx(name);
          return j >= 0 ? (cols[j] ?? '').trim() : '';
        };
        const name = get('name');
        if (!name) {
          errors.push(`Row ${i + 1}: missing name`);
          continue;
        }
        try {
          const cityName = get('city');
          const state = get('state').toUpperCase();
          let cityIds: string[] = [];
          if (cityName && state) {
            const city = await db.query.cities.findFirst({
              where: and(eq(cities.state, state), eq(cities.slug, slugify(cityName))),
            });
            if (city) cityIds = [city.id];
          }
          const sizes = get('sizes')
            .split(/[|;,]/)
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n));
          const materials = get('materials')
            .split(/[|;,]/)
            .map((s) => s.trim())
            .filter(Boolean);

          await createOperator(
            db,
            {
              name,
              phone: get('phone') || undefined,
              email: get('email') || undefined,
              website: get('website') || undefined,
              description: get('description') || undefined,
              hqCity: cityName || undefined,
              hqState: state || undefined,
              pricingMin: get('pricing_min') ? Number(get('pricing_min')) : null,
              pricingMax: get('pricing_max') ? Number(get('pricing_max')) : null,
              verificationStatus: 'pending',
              isPublished: false,
              sizes,
              materials,
              cityIds,
            },
            c.get('adminEmail'),
          );
          imported++;
        } catch (e) {
          errors.push(`Row ${i + 1}: ${e instanceof Error ? e.message : 'error'}`);
        }
      }
      message = `Imported ${imported} operator(s) as pending.`;
    }
  }
  setAdminResult(c, { message, errors });
});

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}
