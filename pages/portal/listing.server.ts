import { asc, eq } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import { logAudit, replaceOperatorMaterials, replaceOperatorSizes, replaceServiceCityIds } from '../../src/lib/admin';
import { DUMPSTER_SIZES, MATERIALS } from '../../src/lib/constants';
import { getDb } from '../../src/lib/db';
import { getOperatorForOrg } from '../../src/lib/portal';
import { cities, operators } from '../../src/lib/schema';
import { sanitizeHttpUrl } from '../../src/lib/urls';
import { portalAuth, portalGuard } from '../../src/server/portal-guard';
import { portalHead } from '../../src/server/portal-head';
import { setFeedback } from '../../src/server/shared';

export const revalidate = 0;

const MATERIAL_IDS = new Set(MATERIALS.map((m) => m.id));

export const loader = defineHandler(portalGuard, async (c) => {
  // The guard guarantees a signed-in user with an active company.
  const db = getDb();
  const operator = await getOperatorForOrg(db, portalAuth(c).orgId);

  const allCities = await db.select().from(cities).orderBy(asc(cities.state), asc(cities.name));
  const sizes = operator
    ? (await db.query.operatorSizes.findMany({ where: (t, { eq: e }) => e(t.operatorId, operator.id) })).map(
        (s) => s.yards,
      )
    : [];
  const materials = operator
    ? (
        await db.query.operatorMaterials.findMany({ where: (t, { eq: e }) => e(t.operatorId, operator.id) })
      ).map((m) => m.material)
    : [];
  const cityIds = operator
    ? ((
        await db.query.operatorServiceAreas.findMany({ where: (t, { eq: e }) => e(t.operatorId, operator.id) })
      )
        .map((a) => a.cityId)
        .filter(Boolean) as string[])
    : [];

  // Only the editable fields: props are serialized into the page.
  return {
    operator: operator
      ? {
          name: operator.name,
          isPublished: Boolean(operator.isPublished),
          phone: operator.phone,
          email: operator.email,
          website: operator.website,
          description: operator.description,
          hqCity: operator.hqCity,
          hqState: operator.hqState,
          pricingMin: operator.pricingMin,
          pricingMax: operator.pricingMax,
          pricingNotes: operator.pricingNotes,
          includedTonnage: operator.includedTonnage,
          overageRate: operator.overageRate,
          drivewayNotes: operator.drivewayNotes,
          drivewaySuitable: Boolean(operator.drivewaySuitable),
          sameDayCapable: Boolean(operator.sameDayCapable),
        }
      : null,
    cities: allCities.map((ct) => ({ id: ct.id, name: ct.name, state: ct.state })),
    sizes,
    materials,
    cityIds,
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead(() => portalHead('/portal/listing'));

/** Save the listing; the page re-renders with "Listing saved." as the Astro page did. */
export const actions = {
  save: defineHandler(portalGuard, async (c) => {
    const auth = portalAuth(c);
    const db = getDb();
    const operator = await getOperatorForOrg(db, auth.orgId);
    if (!operator) return;

    const body = await c.req.parseBody({ all: true });
    const all = (key: string): string[] => {
      const v = body[key];
      return (Array.isArray(v) ? v : v === undefined ? [] : [v]).filter((x): x is string => typeof x === 'string');
    };
    const str = (key: string): string | undefined => all(key)[0];
    const num = (key: string) => {
      const v = str(key)?.trim();
      if (!v) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };
    const bool = (key: string) => str(key) === 'on' || str(key) === '1';
    const sizes = all('sizes')
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n) && (DUMPSTER_SIZES as readonly number[]).includes(n));
    const materials = all('materials').filter((m) => MATERIAL_IDS.has(m as (typeof MATERIALS)[number]['id']));
    const cityIds = all('cityIds');
    const now = new Date().toISOString();

    await db
      .update(operators)
      .set({
        name: String(str('name') ?? operator.name).trim() || operator.name,
        phone: str('phone') || null,
        email: str('email') || null,
        website: sanitizeHttpUrl(str('website')) || null,
        description: str('description') || null,
        hqCity: str('hqCity') || null,
        hqState: str('hqState') || null,
        pricingMin: num('pricingMin'),
        pricingMax: num('pricingMax'),
        pricingNotes: str('pricingNotes') || null,
        includedTonnage: num('includedTonnage'),
        overageRate: num('overageRate'),
        drivewaySuitable: bool('drivewaySuitable'),
        drivewayNotes: str('drivewayNotes') || null,
        sameDayCapable: bool('sameDayCapable'),
        updatedAt: now,
      })
      .where(eq(operators.id, operator.id));

    await replaceOperatorSizes(db, operator.id, sizes);
    await replaceOperatorMaterials(db, operator.id, materials);
    await replaceServiceCityIds(db, operator.id, cityIds);
    await logAudit(db, {
      action: 'portal_listing_update',
      entityType: 'operator',
      entityId: operator.id,
      actor: auth.userId,
    });

    setFeedback(c, { form: 'listing', ok: true, message: 'Listing saved.' });
  }),
};
