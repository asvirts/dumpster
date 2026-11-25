-- Coverage for open leads with no emailable operator (2026-11-25).
-- Firecrawl scrapes of each company's own site: email, phone and service area as published there.
-- Leads: Jacksonville FL (city-jacksonville), Leesburg VA 20175, Geneva IL 60134.

-- Emails for existing published operators (from their own sites).
UPDATE operators SET email = 'jax@american-rolloffs.com', updated_at = datetime('now') WHERE id = 'op-fc15-jax-american' AND email IS NULL;
UPDATE operators SET email = 'info@904dumpster.com', updated_at = datetime('now') WHERE id = 'op-fc15-jax-904' AND email IS NULL;
UPDATE operators SET email = 'shapells@bellsouth.net', updated_at = datetime('now') WHERE id = 'op-fc15-jax-shapells' AND email IS NULL;
UPDATE operators SET email = 'sales@eairolloff.com', updated_at = datetime('now') WHERE id = 'op-fc15-dc-eai' AND email IS NULL;

-- EAI Roll Off lists Loudoun County incl. Leesburg (eairolloff.com/location-loudoun-county-va/).
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-dc-eai-20175', 'op-fc15-dc-eai', NULL, '20175');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-dc-eai-20176', 'op-fc15-dc-eai', NULL, '20176');

-- Iron Bull Hauling — serves Loudoun, Frederick, Clarke and Warren counties (VA); Leesburg page.
INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  driveway_suitable, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc25-va-ironbull', 'Iron Bull Hauling', 'iron-bull-hauling', '540-327-9805', 'ironbullhauling@gmail.com', 'https://www.ironbullhauling.com/dumpster-rental-leesburg-va',
  'Northern Virginia hauler with 10–30 yard roll-off dumpsters, same-day delivery and flat-rate pricing across Loudoun, Frederick, Clarke and Warren counties, including Leesburg and Purcellville.',
  NULL, 'VA', NULL, NULL,
  0, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-11-25', 'Firecrawl web research 2026-11-25: phone, email and Leesburg service page from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, 78, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc25-va-ironbull-10', 'op-fc25-va-ironbull', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc25-va-ironbull-20', 'op-fc25-va-ironbull', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc25-va-ironbull-30', 'op-fc25-va-ironbull', 30);
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-va-ironbull-20175', 'op-fc25-va-ironbull', NULL, '20175');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-va-ironbull-20176', 'op-fc25-va-ironbull', NULL, '20176');

-- DDT Dumpster — 1640 W. Main St., St. Charles IL; serves St. Charles, Geneva, Batavia (Kane/DuPage/DeKalb).
INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  driveway_suitable, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc25-il-ddt', 'DDT Dumpster', 'ddt-dumpster', '630-524-2851', 'info@ddtdumpster.com', 'https://ddtdumpster.com/',
  'St. Charles, IL roll-off company with driveway-safe dumpsters for St. Charles, Geneva, Batavia and nearby Kane, DuPage and DeKalb County towns.',
  'St. Charles', 'IL', 41.9142, -88.3087,
  1, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-11-25', 'Firecrawl web research 2026-11-25: address, phone, email and Geneva service area from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-il-ddt-60134', 'op-fc25-il-ddt', NULL, '60134');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-il-ddt-60174', 'op-fc25-il-ddt', NULL, '60174');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-il-ddt-60175', 'op-fc25-il-ddt', NULL, '60175');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-il-ddt-60510', 'op-fc25-il-ddt', NULL, '60510');

-- Roadrunner Roll-Offs — St. Charles IL; owner-run; 6–20 yard containers; Geneva listed in service area.
INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  driveway_suitable, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc25-il-roadrunner', 'Roadrunner Roll-Offs', 'roadrunner-roll-offs', '630-495-1177', 'ed@roadrunnerrolloffs.com', 'https://roadrunnerrolloffs.com/',
  'Owner-operated St. Charles, IL roll-off service with 6–20 yard containers and flexible scheduling for St. Charles, Geneva and the Fox Valley.',
  'St. Charles', 'IL', 41.9142, -88.3087,
  1, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-11-25', 'Firecrawl web research 2026-11-25: phone, email and Geneva service area from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, 78, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc25-il-roadrunner-15', 'op-fc25-il-roadrunner', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc25-il-roadrunner-20', 'op-fc25-il-roadrunner', 20);
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-il-roadrunner-60134', 'op-fc25-il-roadrunner', NULL, '60134');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-il-roadrunner-60174', 'op-fc25-il-roadrunner', NULL, '60174');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc25-il-roadrunner-60175', 'op-fc25-il-roadrunner', NULL, '60175');
