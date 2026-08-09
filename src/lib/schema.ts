import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const cities = sqliteTable(
  'cities',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    state: text('state').notNull(),
    slug: text('slug').notNull(),
    stateSlug: text('state_slug').notNull(),
    lat: real('lat').notNull(),
    lng: real('lng').notNull(),
    localPermitSummary: text('local_permit_summary'),
    typicalPricingNotes: text('typical_pricing_notes'),
    specialRules: text('special_rules'),
    isPriority: integer('is_priority', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [
    uniqueIndex('cities_state_slug_idx').on(t.state, t.slug),
    index('cities_priority_idx').on(t.isPriority),
  ],
);

export const operators = sqliteTable(
  'operators',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    phone: text('phone'),
    email: text('email'),
    website: text('website'),
    description: text('description'),
    hqCity: text('hq_city'),
    hqState: text('hq_state'),
    hqLat: real('hq_lat'),
    hqLng: real('hq_lng'),
    pricingMin: real('pricing_min'),
    pricingMax: real('pricing_max'),
    pricingNotes: text('pricing_notes'),
    includedTonnage: real('included_tonnage'),
    overageRate: real('overage_rate'),
    drivewaySuitable: integer('driveway_suitable', { mode: 'boolean' }).default(false),
    drivewayNotes: text('driveway_notes'),
    sameDayCapable: integer('same_day_capable', { mode: 'boolean' }).default(false),
    isBroker: integer('is_broker', { mode: 'boolean' }).notNull().default(false),
    verificationStatus: text('verification_status', {
      enum: ['pending', 'verified', 'rejected'],
    })
      .notNull()
      .default('pending'),
    lastVerifiedAt: text('last_verified_at'),
    verifiedBy: text('verified_by'),
    verificationNotes: text('verification_notes'),
    insuranceVerified: integer('insurance_verified', { mode: 'boolean' }).default(false),
    licenseNotes: text('license_notes'),
    qualityScore: real('quality_score').default(50),
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
    isDemo: integer('is_demo', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [
    uniqueIndex('operators_slug_idx').on(t.slug),
    index('operators_status_idx').on(t.verificationStatus),
    index('operators_published_idx').on(t.isPublished),
    index('operators_broker_idx').on(t.isBroker),
  ],
);

export const operatorSizes = sqliteTable(
  'operator_sizes',
  {
    id: text('id').primaryKey(),
    operatorId: text('operator_id')
      .notNull()
      .references(() => operators.id, { onDelete: 'cascade' }),
    yards: integer('yards').notNull(),
  },
  (t) => [
    uniqueIndex('operator_sizes_unique').on(t.operatorId, t.yards),
    index('operator_sizes_yards_idx').on(t.yards),
  ],
);

export const operatorMaterials = sqliteTable(
  'operator_materials',
  {
    id: text('id').primaryKey(),
    operatorId: text('operator_id')
      .notNull()
      .references(() => operators.id, { onDelete: 'cascade' }),
    material: text('material').notNull(),
  },
  (t) => [
    uniqueIndex('operator_materials_unique').on(t.operatorId, t.material),
    index('operator_materials_material_idx').on(t.material),
  ],
);

export const operatorServiceAreas = sqliteTable(
  'operator_service_areas',
  {
    id: text('id').primaryKey(),
    operatorId: text('operator_id')
      .notNull()
      .references(() => operators.id, { onDelete: 'cascade' }),
    cityId: text('city_id').references(() => cities.id, { onDelete: 'cascade' }),
    zip: text('zip'),
  },
  (t) => [
    index('osa_operator_idx').on(t.operatorId),
    index('osa_city_idx').on(t.cityId),
    index('osa_zip_idx').on(t.zip),
  ],
);

export const leads = sqliteTable(
  'leads',
  {
    id: text('id').primaryKey(),
    operatorId: text('operator_id')
      .notNull()
      .references(() => operators.id, { onDelete: 'cascade' }),
    seekerName: text('seeker_name').notNull(),
    seekerEmail: text('seeker_email').notNull(),
    seekerPhone: text('seeker_phone'),
    projectSize: text('project_size'),
    material: text('material'),
    addressOrZip: text('address_or_zip'),
    timeline: text('timeline'),
    notes: text('notes'),
    status: text('status', { enum: ['new', 'notified', 'closed'] })
      .notNull()
      .default('new'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [
    index('leads_operator_idx').on(t.operatorId),
    index('leads_status_idx').on(t.status),
  ],
);

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    type: text('type').notNull(),
    path: text('path'),
    queryJson: text('query_json'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [index('events_type_idx').on(t.type)],
);

export const adminAudit = sqliteTable('admin_audit', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  actor: text('actor'),
  notes: text('notes'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const citiesRelations = relations(cities, ({ many }) => ({
  serviceAreas: many(operatorServiceAreas),
}));

export const operatorsRelations = relations(operators, ({ many }) => ({
  sizes: many(operatorSizes),
  materials: many(operatorMaterials),
  serviceAreas: many(operatorServiceAreas),
  leads: many(leads),
}));

export const operatorSizesRelations = relations(operatorSizes, ({ one }) => ({
  operator: one(operators, {
    fields: [operatorSizes.operatorId],
    references: [operators.id],
  }),
}));

export const operatorMaterialsRelations = relations(operatorMaterials, ({ one }) => ({
  operator: one(operators, {
    fields: [operatorMaterials.operatorId],
    references: [operators.id],
  }),
}));

export const operatorServiceAreasRelations = relations(operatorServiceAreas, ({ one }) => ({
  operator: one(operators, {
    fields: [operatorServiceAreas.operatorId],
    references: [operators.id],
  }),
  city: one(cities, {
    fields: [operatorServiceAreas.cityId],
    references: [cities.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  operator: one(operators, {
    fields: [leads.operatorId],
    references: [operators.id],
  }),
}));

export type City = typeof cities.$inferSelect;
export type Operator = typeof operators.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewOperator = typeof operators.$inferInsert;
export type NewCity = typeof cities.$inferInsert;
export type NewLead = typeof leads.$inferInsert;
