#!/usr/bin/env bun
/**
 * Generate SQL to add one representative city per US state + DC.
 * Usage: bun scripts/expand-cities.ts > seed/add-all-states.sql
 *
 * These are CITIES ONLY. Operators must still be researched and verified.
 * After running, review and run against D1:
 *   wrangler d1 execute dumpsterlocal --file=./seed/add-all-states.sql
 */

import citiesData from '../data/us-major-cities.json';

const lines: string[] = [];

lines.push('-- Auto-generated city expansion for 50 states + DC');
lines.push('-- Generated: ' + new Date().toISOString());
lines.push('-- IMPORTANT: These cities have NO operators yet.');
lines.push('-- Research and add verified local haulers via /admin/operators/new or CSV import.');
lines.push('-- Verify all permit/pricing notes with local sources before publishing.');
lines.push('');

lines.push('BEGIN TRANSACTION;');
lines.push('');

// Track existing to avoid duplicates
const existing = new Set([
  'city-phoenix','city-los-angeles','city-denver','city-miami','city-orlando','city-tampa',
  'city-atlanta','city-houston','city-dallas','city-austin'
]);

for (const c of citiesData.cities) {
  if (existing.has(c.id)) {
    // Optionally update notes on existing
    if (c.notes) {
      lines.push(`-- ${c.name}, ${c.state} already seeded; optional note update skipped`);
    }
    continue;
  }

  const permit = c.notes
    ? `${c.name} metro. ${c.notes} Verify local ROW permit rules before publishing.`
    : `${c.name} metro. Verify local right-of-way / street placement rules.`;

  const pricing = 'Typical residential roll-off pricing varies widely by market. Request all-in quotes. Overage and dump fees are the biggest variables.';

  lines.push(`INSERT INTO cities (id, name, state, slug, state_slug, lat, lng, local_permit_summary, typical_pricing_notes, special_rules, is_priority) VALUES`);
  lines.push(`('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.state}', '${c.slug}', '${c.state.toLowerCase()}', ${c.lat}, ${c.lng},`);
  lines.push(` '${permit.replace(/'/g, "''")}', '${pricing}', NULL, 0);`);
  lines.push('');
}

lines.push('COMMIT;');
lines.push('-- After import, visit /admin/cities to add city-specific permit and pricing intelligence.');
lines.push('-- Then research and add at least one verified operator per new state via admin or CSV.');

console.log(lines.join('\n'));
