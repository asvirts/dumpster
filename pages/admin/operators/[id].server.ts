import { asc, eq } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import type { Href } from 'void/routes';
import { logAudit, parseFormOperator, updateOperator } from '../../../src/lib/admin';
import { getDb } from '../../../src/lib/db';
import { formatDate } from '../../../src/lib/geo';
import { cities, operatorMaterials, operatorServiceAreas, operatorSizes, operators } from '../../../src/lib/schema';
import { adminGuard, adminHead } from '../../../src/server/admin-guard';
import { withShared } from '../../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const id = c.req.param('id');
  if (!id) return c.redirect('/admin/operators');
  const db = getDb();

  const op = await db.query.operators.findFirst({ where: eq(operators.id, id) });
  if (!op) return new Response('Not found', { status: 404 });

  const [sizes, materials, areas, allCities] = await Promise.all([
    db.select().from(operatorSizes).where(eq(operatorSizes.operatorId, id)),
    db.select().from(operatorMaterials).where(eq(operatorMaterials.operatorId, id)),
    db.select().from(operatorServiceAreas).where(eq(operatorServiceAreas.operatorId, id)),
    db.select().from(cities).orderBy(asc(cities.state), asc(cities.name)),
  ]);

  return {
    adminEmail: c.get('adminEmail'),
    id,
    saved: c.req.query('saved') === '1',
    status: {
      verificationStatus: op.verificationStatus,
      lastVerified: op.lastVerifiedAt ? formatDate(op.lastVerifiedAt) : null,
      verifiedBy: op.verifiedBy,
      isPublished: op.isPublished,
      isDemo: op.isDemo,
      slug: op.slug,
    },
    operator: {
      name: op.name,
      slug: op.slug,
      phone: op.phone,
      email: op.email,
      website: op.website,
      description: op.description,
      hqCity: op.hqCity,
      hqState: op.hqState,
      hqLat: op.hqLat,
      hqLng: op.hqLng,
      pricingMin: op.pricingMin,
      pricingMax: op.pricingMax,
      pricingNotes: op.pricingNotes,
      includedTonnage: op.includedTonnage,
      overageRate: op.overageRate,
      qualityScore: op.qualityScore,
      verificationStatus: op.verificationStatus,
      verificationNotes: op.verificationNotes,
      drivewayNotes: op.drivewayNotes,
      licenseNotes: op.licenseNotes,
      drivewaySuitable: op.drivewaySuitable,
      sameDayCapable: op.sameDayCapable,
      isBroker: op.isBroker,
      insuranceVerified: op.insuranceVerified,
      isPublished: op.isPublished,
    },
    sizes: sizes.map((s) => s.yards),
    materials: materials.map((m) => m.material as string),
    cityIds: areas.map((a) => a.cityId).filter(Boolean) as string[],
    cities: allCities.map((city) => ({ id: city.id, name: city.name, state: city.state })),
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>((_c, props) => adminHead(`Edit: ${props.operator.name}`));

export const action = defineHandler(adminGuard, async (c) => {
  const id = c.req.param('id');
  if (!id) return c.redirect('/admin/operators', 303);
  const db = getDb();
  const adminEmail = c.get('adminEmail');
  const form = await c.req.formData();
  const intent = form.get('intent')?.toString();

  if (intent === 'delete') {
    await db.delete(operators).where(eq(operators.id, id));
    await logAudit(db, {
      action: 'delete',
      entityType: 'operator',
      entityId: id,
      actor: adminEmail,
    });
    return c.redirect('/admin/operators', 303);
  }

  if (intent === 'verify' || intent === 'reject') {
    const status = intent === 'verify' ? 'verified' : 'rejected';
    const now = new Date().toISOString();
    await db
      .update(operators)
      .set({
        verificationStatus: status,
        lastVerifiedAt: status === 'verified' ? now : null,
        verifiedBy: adminEmail ?? 'admin',
        isPublished: status === 'verified',
        verificationNotes: form.get('quickNotes')?.toString() || null,
        updatedAt: now,
      })
      .where(eq(operators.id, id));
    await logAudit(db, {
      action: status,
      entityType: 'operator',
      entityId: id,
      actor: adminEmail,
    });
    return c.redirect(`/admin/operators/${id}` as Href, 303);
  }

  const data = parseFormOperator(form);
  await updateOperator(db, id, data, adminEmail);
  return c.redirect(`/admin/operators/${id}?saved=1` as Href, 303);
});
