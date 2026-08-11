import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import type { AppDb } from './db';
import {
  cities,
  operatorMaterials,
  operatorServiceAreas,
  operatorSizes,
  operators,
} from './schema';
import { distanceMiles } from './geo';

export type SearchFilters = {
  q?: string;
  state?: string;
  citySlug?: string;
  zip?: string;
  size?: number;
  material?: string;
  drivewayOnly?: boolean;
  sameDayOnly?: boolean;
  verifiedOnly?: boolean;
  excludeBrokers?: boolean;
  sort?: 'quality' | 'price' | 'distance';
};

export type OperatorResult = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  website: string | null;
  description: string | null;
  hqCity: string | null;
  hqState: string | null;
  hqLat: number | null;
  hqLng: number | null;
  pricingMin: number | null;
  pricingMax: number | null;
  pricingNotes: string | null;
  drivewaySuitable: boolean | null;
  drivewayNotes: string | null;
  sameDayCapable: boolean | null;
  isBroker: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  lastVerifiedAt: string | null;
  qualityScore: number | null;
  isDemo: boolean;
  sizes: number[];
  materials: string[];
  serviceCityNames: string[];
  distanceMiles?: number;
};

export async function findCityByQuery(db: AppDb, q: string) {
  const trimmed = q.trim();
  if (!trimmed) return null;

  // ZIP (5 digits)
  if (/^\d{5}$/.test(trimmed)) {
    const viaZip = await db
      .select({ city: cities })
      .from(operatorServiceAreas)
      .innerJoin(cities, eq(operatorServiceAreas.cityId, cities.id))
      .where(eq(operatorServiceAreas.zip, trimmed))
      .limit(1);
    if (viaZip[0]) return viaZip[0].city;
  }

  // "City, ST" or "City ST"
  const m = trimmed.match(/^(.+?)[,\s]+([A-Za-z]{2})$/);
  if (m) {
    const cityName = m[1].trim();
    const state = m[2].toUpperCase();
    const row = await db.query.cities.findFirst({
      where: and(
        eq(cities.state, state),
        sql`lower(${cities.name}) = ${cityName.toLowerCase()}`,
      ),
    });
    if (row) return row;
  }

  // City name only
  const byName = await db.query.cities.findFirst({
    where: sql`lower(${cities.name}) = ${trimmed.toLowerCase()}`,
  });
  if (byName) return byName;

  // Fuzzy contains
  const fuzzy = await db.query.cities.findFirst({
    where: sql`lower(${cities.name}) like ${`%${trimmed.toLowerCase()}%`}`,
  });
  return fuzzy ?? null;
}

export async function searchOperators(
  db: AppDb,
  filters: SearchFilters,
): Promise<{ operators: OperatorResult[]; city: typeof cities.$inferSelect | null }> {
  let city: typeof cities.$inferSelect | null = null;

  if (filters.citySlug && filters.state) {
    city =
      (await db.query.cities.findFirst({
        where: and(
          eq(cities.slug, filters.citySlug),
          eq(cities.state, filters.state.toUpperCase()),
        ),
      })) ?? null;
  } else if (filters.q) {
    city = await findCityByQuery(db, filters.q);
  }

  const verifiedOnly = filters.verifiedOnly !== false;
  const excludeBrokers = filters.excludeBrokers !== false;

  // Public directory never shows demos/seeds — same bar as sitemap.
  const conditions = [eq(operators.isPublished, true), eq(operators.isDemo, false)];
  if (verifiedOnly) {
    conditions.push(eq(operators.verificationStatus, 'verified'));
  }
  if (excludeBrokers) {
    conditions.push(eq(operators.isBroker, false));
  }
  if (filters.drivewayOnly) {
    conditions.push(eq(operators.drivewaySuitable, true));
  }
  if (filters.sameDayOnly) {
    conditions.push(eq(operators.sameDayCapable, true));
  }

  let operatorIds: string[] | null = null;

  if (city) {
    const areas = await db
      .select({ operatorId: operatorServiceAreas.operatorId })
      .from(operatorServiceAreas)
      .where(eq(operatorServiceAreas.cityId, city.id));
    operatorIds = [...new Set(areas.map((a) => a.operatorId))];
    if (operatorIds.length === 0) {
      return { operators: [], city };
    }
  } else if (filters.zip) {
    const areas = await db
      .select({ operatorId: operatorServiceAreas.operatorId })
      .from(operatorServiceAreas)
      .where(eq(operatorServiceAreas.zip, filters.zip));
    operatorIds = [...new Set(areas.map((a) => a.operatorId))];
    if (operatorIds.length === 0) {
      return { operators: [], city: null };
    }
  }

  if (filters.size) {
    const sized = await db
      .select({ operatorId: operatorSizes.operatorId })
      .from(operatorSizes)
      .where(eq(operatorSizes.yards, filters.size));
    const sizeIds = new Set(sized.map((s) => s.operatorId));
    if (operatorIds) {
      operatorIds = operatorIds.filter((id) => sizeIds.has(id));
    } else {
      operatorIds = [...sizeIds];
    }
    if (operatorIds.length === 0) {
      return { operators: [], city };
    }
  }

  if (filters.material) {
    const mat = await db
      .select({ operatorId: operatorMaterials.operatorId })
      .from(operatorMaterials)
      .where(eq(operatorMaterials.material, filters.material));
    const matIds = new Set(mat.map((m) => m.operatorId));
    if (operatorIds) {
      operatorIds = operatorIds.filter((id) => matIds.has(id));
    } else {
      operatorIds = [...matIds];
    }
    if (operatorIds.length === 0) {
      return { operators: [], city };
    }
  }

  if (operatorIds) {
    conditions.push(inArray(operators.id, operatorIds));
  }

  const sort = filters.sort ?? 'quality';
  const orderBy =
    sort === 'price'
      ? [asc(operators.pricingMin), desc(operators.qualityScore)]
      : [desc(operators.qualityScore), asc(operators.pricingMin)];

  const rows = await db
    .select()
    .from(operators)
    .where(and(...conditions))
    .orderBy(...orderBy)
    .limit(100);

  if (rows.length === 0) {
    return { operators: [], city };
  }

  const ids = rows.map((r) => r.id);
  const [sizes, materials, areas] = await Promise.all([
    db.select().from(operatorSizes).where(inArray(operatorSizes.operatorId, ids)),
    db
      .select()
      .from(operatorMaterials)
      .where(inArray(operatorMaterials.operatorId, ids)),
    db
      .select({
        operatorId: operatorServiceAreas.operatorId,
        cityName: cities.name,
        state: cities.state,
      })
      .from(operatorServiceAreas)
      .leftJoin(cities, eq(operatorServiceAreas.cityId, cities.id))
      .where(inArray(operatorServiceAreas.operatorId, ids)),
  ]);

  const sizesByOp = groupBy(sizes, (s) => s.operatorId, (s) => s.yards);
  const matsByOp = groupBy(materials, (m) => m.operatorId, (m) => m.material);
  const citiesByOp = groupBy(
    areas.filter((a) => a.cityName),
    (a) => a.operatorId,
    (a) => `${a.cityName}, ${a.state}`,
  );

  let results: OperatorResult[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    phone: r.phone,
    website: r.website,
    description: r.description,
    hqCity: r.hqCity,
    hqState: r.hqState,
    hqLat: r.hqLat,
    hqLng: r.hqLng,
    pricingMin: r.pricingMin,
    pricingMax: r.pricingMax,
    pricingNotes: r.pricingNotes,
    drivewaySuitable: r.drivewaySuitable,
    drivewayNotes: r.drivewayNotes,
    sameDayCapable: r.sameDayCapable,
    isBroker: r.isBroker,
    verificationStatus: r.verificationStatus,
    lastVerifiedAt: r.lastVerifiedAt,
    qualityScore: r.qualityScore,
    isDemo: r.isDemo,
    sizes: (sizesByOp.get(r.id) ?? []).sort((a, b) => a - b),
    materials: matsByOp.get(r.id) ?? [],
    serviceCityNames: [...new Set(citiesByOp.get(r.id) ?? [])],
  }));

  if (city && (sort === 'distance' || sort === 'quality')) {
    results = results.map((r) => {
      if (r.hqLat != null && r.hqLng != null) {
        return {
          ...r,
          distanceMiles: distanceMiles(city.lat, city.lng, r.hqLat, r.hqLng),
        };
      }
      return r;
    });
    if (sort === 'distance') {
      results.sort(
        (a, b) => (a.distanceMiles ?? 9999) - (b.distanceMiles ?? 9999),
      );
    }
  }

  return { operators: results, city };
}

export async function getOperatorBySlug(db: AppDb, slug: string) {
  const op = await db.query.operators.findFirst({
    where: and(
      eq(operators.slug, slug),
      eq(operators.isPublished, true),
      eq(operators.isDemo, false),
    ),
    with: {
      sizes: true,
      materials: true,
      serviceAreas: { with: { city: true } },
    },
  });
  return op ?? null;
}

export async function getOperatorById(db: AppDb, id: string) {
  return (
    (await db.query.operators.findFirst({
      where: eq(operators.id, id),
      with: {
        sizes: true,
        materials: true,
        serviceAreas: { with: { city: true } },
      },
    })) ?? null
  );
}

export async function getCityWithOperators(
  db: AppDb,
  stateSlug: string,
  citySlug: string,
) {
  const city = await db.query.cities.findFirst({
    where: and(eq(cities.stateSlug, stateSlug), eq(cities.slug, citySlug)),
  });
  if (!city) return null;

  const { operators: ops } = await searchOperators(db, {
    state: city.state,
    citySlug: city.slug,
    verifiedOnly: true,
    excludeBrokers: true,
    sort: 'quality',
  });

  return { city, operators: ops };
}

export async function getPriorityCities(db: AppDb) {
  return db
    .select()
    .from(cities)
    .where(eq(cities.isPriority, true))
    .orderBy(asc(cities.state), asc(cities.name));
}

function groupBy<T, K extends string, V>(
  items: T[],
  keyFn: (item: T) => K,
  valFn: (item: T) => V,
): Map<K, V[]> {
  const map = new Map<K, V[]>();
  for (const item of items) {
    const k = keyFn(item);
    const arr = map.get(k) ?? [];
    arr.push(valFn(item));
    map.set(k, arr);
  }
  return map;
}
