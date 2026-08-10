import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import type { AppDb } from './db';
import {
  adminAudit,
  operatorMaterials,
  operatorServiceAreas,
  operatorSizes,
  operators,
} from './schema';
import { slugify } from './geo';
import type { VerificationStatus } from './constants';
import { MATERIALS } from './constants';
import { sanitizeHttpUrl } from './urls';

const MATERIAL_IDS = new Set(MATERIALS.map((m) => m.id));

export async function logAudit(
  db: AppDb,
  opts: {
    action: string;
    entityType: string;
    entityId?: string | null;
    actor?: string | null;
    notes?: string | null;
  },
) {
  await db.insert(adminAudit).values({
    id: nanoid(),
    action: opts.action,
    entityType: opts.entityType,
    entityId: opts.entityId ?? null,
    actor: opts.actor ?? null,
    notes: opts.notes ?? null,
  });
}

export function uniqueSlug(name: string, suffix?: string): string {
  const base = slugify(name) || 'operator';
  return suffix ? `${base}-${suffix}` : base;
}

export async function replaceOperatorSizes(
  db: AppDb,
  operatorId: string,
  yards: number[],
) {
  await db.delete(operatorSizes).where(eq(operatorSizes.operatorId, operatorId));
  if (yards.length === 0) return;
  await db.insert(operatorSizes).values(
    yards.map((y) => ({
      id: nanoid(),
      operatorId,
      yards: y,
    })),
  );
}

export async function replaceOperatorMaterials(
  db: AppDb,
  operatorId: string,
  materials: string[],
) {
  const allowed = materials.filter((m) =>
    MATERIAL_IDS.has(m as (typeof MATERIALS)[number]['id']),
  );
  await db
    .delete(operatorMaterials)
    .where(eq(operatorMaterials.operatorId, operatorId));
  if (allowed.length === 0) return;
  await db.insert(operatorMaterials).values(
    allowed.map((material) => ({
      id: nanoid(),
      operatorId,
      material,
    })),
  );
}

export async function replaceServiceCityIds(
  db: AppDb,
  operatorId: string,
  cityIds: string[],
) {
  await db
    .delete(operatorServiceAreas)
    .where(eq(operatorServiceAreas.operatorId, operatorId));
  if (cityIds.length === 0) return;
  await db.insert(operatorServiceAreas).values(
    cityIds.map((cityId) => ({
      id: nanoid(),
      operatorId,
      cityId,
      zip: null,
    })),
  );
}

export type OperatorFormData = {
  name: string;
  slug?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  hqCity?: string;
  hqState?: string;
  hqLat?: number | null;
  hqLng?: number | null;
  pricingMin?: number | null;
  pricingMax?: number | null;
  pricingNotes?: string;
  includedTonnage?: number | null;
  overageRate?: number | null;
  drivewaySuitable?: boolean;
  drivewayNotes?: string;
  sameDayCapable?: boolean;
  isBroker?: boolean;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
  insuranceVerified?: boolean;
  licenseNotes?: string;
  qualityScore?: number | null;
  isPublished?: boolean;
  sizes?: number[];
  materials?: string[];
  cityIds?: string[];
};

export async function createOperator(
  db: AppDb,
  data: OperatorFormData,
  actor?: string,
) {
  const id = nanoid();
  const slug = data.slug?.trim() || uniqueSlug(data.name, id.slice(0, 6));
  const status = data.verificationStatus ?? 'pending';
  const now = new Date().toISOString();

  await db.insert(operators).values({
    id,
    name: data.name.trim(),
    slug,
    phone: data.phone || null,
    email: data.email || null,
    website: sanitizeHttpUrl(data.website) || null,
    description: data.description || null,
    hqCity: data.hqCity || null,
    hqState: data.hqState || null,
    hqLat: data.hqLat ?? null,
    hqLng: data.hqLng ?? null,
    pricingMin: data.pricingMin ?? null,
    pricingMax: data.pricingMax ?? null,
    pricingNotes: data.pricingNotes || null,
    includedTonnage: data.includedTonnage ?? null,
    overageRate: data.overageRate ?? null,
    drivewaySuitable: data.drivewaySuitable ?? false,
    drivewayNotes: data.drivewayNotes || null,
    sameDayCapable: data.sameDayCapable ?? false,
    isBroker: data.isBroker ?? false,
    verificationStatus: status,
    lastVerifiedAt: status === 'verified' ? now : null,
    verifiedBy: status === 'verified' ? (actor ?? 'admin') : null,
    verificationNotes: data.verificationNotes || null,
    insuranceVerified: data.insuranceVerified ?? false,
    licenseNotes: data.licenseNotes || null,
    qualityScore: data.qualityScore ?? 50,
    isPublished: data.isPublished ?? status === 'verified',
    isDemo: false,
    updatedAt: now,
  });

  await replaceOperatorSizes(db, id, data.sizes ?? []);
  await replaceOperatorMaterials(db, id, data.materials ?? []);
  await replaceServiceCityIds(db, id, data.cityIds ?? []);
  await logAudit(db, {
    action: 'create',
    entityType: 'operator',
    entityId: id,
    actor,
    notes: `Created ${data.name}`,
  });

  return id;
}

export async function updateOperator(
  db: AppDb,
  id: string,
  data: OperatorFormData,
  actor?: string,
) {
  const existing = await db.query.operators.findFirst({
    where: eq(operators.id, id),
  });
  if (!existing) throw new Error('Operator not found');

  const status = data.verificationStatus ?? existing.verificationStatus;
  const now = new Date().toISOString();
  let lastVerifiedAt = existing.lastVerifiedAt;
  let verifiedBy = existing.verifiedBy;

  if (status === 'verified' && existing.verificationStatus !== 'verified') {
    lastVerifiedAt = now;
    verifiedBy = actor ?? 'admin';
  }

  await db
    .update(operators)
    .set({
      name: data.name.trim(),
      slug: data.slug?.trim() || existing.slug,
      phone: data.phone || null,
      email: data.email || null,
      website: sanitizeHttpUrl(data.website) || null,
      description: data.description || null,
      hqCity: data.hqCity || null,
      hqState: data.hqState || null,
      hqLat: data.hqLat ?? null,
      hqLng: data.hqLng ?? null,
      pricingMin: data.pricingMin ?? null,
      pricingMax: data.pricingMax ?? null,
      pricingNotes: data.pricingNotes || null,
      includedTonnage: data.includedTonnage ?? null,
      overageRate: data.overageRate ?? null,
      drivewaySuitable: data.drivewaySuitable ?? false,
      drivewayNotes: data.drivewayNotes || null,
      sameDayCapable: data.sameDayCapable ?? false,
      isBroker: data.isBroker ?? false,
      verificationStatus: status,
      lastVerifiedAt,
      verifiedBy,
      verificationNotes: data.verificationNotes || null,
      insuranceVerified: data.insuranceVerified ?? false,
      licenseNotes: data.licenseNotes || null,
      qualityScore: data.qualityScore ?? existing.qualityScore,
      isPublished:
        data.isPublished ??
        (status === 'verified' ? true : status === 'rejected' ? false : existing.isPublished),
      updatedAt: now,
    })
    .where(eq(operators.id, id));

  if (data.sizes) await replaceOperatorSizes(db, id, data.sizes);
  if (data.materials) await replaceOperatorMaterials(db, id, data.materials);
  if (data.cityIds) await replaceServiceCityIds(db, id, data.cityIds);

  await logAudit(db, {
    action: 'update',
    entityType: 'operator',
    entityId: id,
    actor,
    notes: `Updated ${data.name} (${status})`,
  });
}

export function parseFormOperator(form: FormData): OperatorFormData {
  const num = (key: string) => {
    const v = form.get(key)?.toString().trim();
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const bool = (key: string) => form.get(key) === 'on' || form.get(key) === '1';

  const sizes = form
    .getAll('sizes')
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
  const materials = form
    .getAll('materials')
    .map(String)
    .filter((m) => MATERIAL_IDS.has(m as (typeof MATERIALS)[number]['id']));
  const cityIds = form.getAll('cityIds').map(String);

  return {
    name: String(form.get('name') ?? ''),
    slug: form.get('slug')?.toString(),
    phone: form.get('phone')?.toString(),
    email: form.get('email')?.toString(),
    website: sanitizeHttpUrl(form.get('website')?.toString()) ?? undefined,
    description: form.get('description')?.toString(),
    hqCity: form.get('hqCity')?.toString(),
    hqState: form.get('hqState')?.toString(),
    hqLat: num('hqLat'),
    hqLng: num('hqLng'),
    pricingMin: num('pricingMin'),
    pricingMax: num('pricingMax'),
    pricingNotes: form.get('pricingNotes')?.toString(),
    includedTonnage: num('includedTonnage'),
    overageRate: num('overageRate'),
    drivewaySuitable: bool('drivewaySuitable'),
    drivewayNotes: form.get('drivewayNotes')?.toString(),
    sameDayCapable: bool('sameDayCapable'),
    isBroker: bool('isBroker'),
    verificationStatus: (form.get('verificationStatus')?.toString() ||
      'pending') as VerificationStatus,
    verificationNotes: form.get('verificationNotes')?.toString(),
    insuranceVerified: bool('insuranceVerified'),
    licenseNotes: form.get('licenseNotes')?.toString(),
    qualityScore: num('qualityScore'),
    isPublished: bool('isPublished'),
    sizes,
    materials,
    cityIds,
  };
}
