import { inArray } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { MATERIALS } from '../src/lib/constants';
import { getDb } from '../src/lib/db';
import { formatCurrency, formatPhone } from '../src/lib/geo';
import { seoHead } from '../src/lib/head';
import { operatorMaterials, operators, operatorSizes } from '../src/lib/schema';
import { pageTitle } from '../src/lib/seo';
import { withShared } from '../src/server/shared';

// The selection lives in `?ids=`, which ISR leaves out of the cache key: never cache this page.
export const revalidate = 0;

type Op = typeof operators.$inferSelect;

export const loader = defineHandler(withShared, async (c) => {
  const ids = (c.req.query('ids') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const db = getDb();
  let rows: Op[] = [];
  const sizesMap = new Map<string, number[]>();
  const matsMap = new Map<string, string[]>();

  if (ids.length > 0) {
    const found = await db.select().from(operators).where(inArray(operators.id, ids));
    // Preserve selection order
    rows = ids.map((id) => found.find((r) => r.id === id)).filter((r): r is Op => Boolean(r));

    if (rows.length) {
      const opIds = rows.map((r) => r.id);
      const sizes = await db.select().from(operatorSizes).where(inArray(operatorSizes.operatorId, opIds));
      const mats = await db.select().from(operatorMaterials).where(inArray(operatorMaterials.operatorId, opIds));
      for (const s of sizes) {
        const arr = sizesMap.get(s.operatorId) ?? [];
        arr.push(s.yards);
        sizesMap.set(s.operatorId, arr);
      }
      for (const m of mats) {
        const arr = matsMap.get(m.operatorId) ?? [];
        arr.push(m.material);
        matsMap.set(m.operatorId, arr);
      }
    }
  }

  const fields: { label: string; value: (id: string, op: Op) => string }[] = [
    {
      label: 'Published price',
      value: (_id, op) =>
        op.pricingMin != null && op.pricingMax != null
          ? `${formatCurrency(op.pricingMin)}–${formatCurrency(op.pricingMax)}`
          : 'Not published',
    },
    {
      label: 'Sizes',
      value: (id) =>
        (sizesMap.get(id) ?? [])
          .sort((a, b) => a - b)
          .map((y) => `${y} yd`)
          .join(', ') || '—',
    },
    {
      label: 'Materials',
      value: (id) =>
        (matsMap.get(id) ?? []).map((m) => MATERIALS.find((x) => x.id === m)?.label ?? m).join(', ') || '—',
    },
    { label: 'Driveway-safe', value: (_id, op) => (op.drivewaySuitable ? 'Yes' : 'Limited / ask') },
    { label: 'Same-day', value: (_id, op) => (op.sameDayCapable ? 'Yes' : 'No') },
    { label: 'Broker', value: (_id, op) => (op.isBroker ? 'Yes' : 'No — local operator') },
    {
      label: 'Included tonnage',
      value: (_id, op) => (op.includedTonnage != null ? `~${op.includedTonnage} tons` : '—'),
    },
    {
      label: 'Overage rate',
      value: (_id, op) => (op.overageRate != null ? `~${formatCurrency(op.overageRate)}/ton` : '—'),
    },
    { label: 'Phone', value: (_id, op) => (op.phone ? formatPhone(op.phone) : '—') },
  ];

  return {
    operators: rows.map((op) => ({
      id: op.id,
      name: op.name,
      slug: op.slug,
      lastVerifiedAt: op.verificationStatus === 'verified' ? op.lastVerifiedAt : null,
      isBroker: op.isBroker,
      isDemo: op.isDemo,
    })),
    // Pre-rendered cells: rows[i].values[j] belongs to operators[j].
    rows: fields.map((f) => ({ label: f.label, values: rows.map((op) => f.value(op.id, op)) })),
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>((c) =>
  seoHead({ path: new URL(c.req.url).pathname, title: pageTitle('Compare operators'), noIndex: true }),
);
