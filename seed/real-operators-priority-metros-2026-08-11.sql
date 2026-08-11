-- Real operators researched 2026-08-11 from public company sites.
-- verification_notes document web research; phone insurance/license still recommended.
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-htx-parada', 'Parada Waste', 'parada-waste', '281-741-3847', NULL, 'https://paradawaste.com/',
  'Houston same-day roll-off dumpster rental for residential and construction. Local team with Spanish-language support.', 'Houston', 'TX', 29.7604, -95.3698,
  350, 650, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-htx-parada-10', 'op-real-htx-parada', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-htx-parada-15', 'op-real-htx-parada', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-htx-parada-20', 'op-real-htx-parada', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-htx-parada-30', 'op-real-htx-parada', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-htx-parada-construction', 'op-real-htx-parada', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-htx-parada-mixed', 'op-real-htx-parada', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-htx-parada-household', 'op-real-htx-parada', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-htx-parada-roofing', 'op-real-htx-parada', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-htx-parada', 'op-real-htx-parada', 'city-houston', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-htx-btdt', 'Bin There Dump That Houston', 'bin-there-dump-that-houston', '281-209-0552', NULL, 'https://www.bintheredumpthat.com/houston-dumpster-rentals/',
  'Houston franchise specializing in driveway-friendly trailer-style dumpsters for residential projects.', 'Houston', 'TX', 29.78, -95.42,
  360, 680, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 78, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-htx-btdt-10', 'op-real-htx-btdt', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-htx-btdt-15', 'op-real-htx-btdt', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-htx-btdt-20', 'op-real-htx-btdt', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-htx-btdt-construction', 'op-real-htx-btdt', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-htx-btdt-mixed', 'op-real-htx-btdt', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-htx-btdt-household', 'op-real-htx-btdt', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-htx-btdt', 'op-real-htx-btdt', 'city-houston', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-dfw-ironman', 'Iron Man Roll Offs', 'iron-man-roll-offs', '469-314-0248', NULL, 'https://ironmanrolloffs.com/',
  'Veteran-owned DFW dumpster rental, junk removal, and light demolition serving Dallas, Rockwall, Plano, and North Texas.', 'Dallas', 'TX', 32.93, -96.46,
  340, 620, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-dfw-ironman-10', 'op-real-dfw-ironman', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-dfw-ironman-15', 'op-real-dfw-ironman', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-dfw-ironman-20', 'op-real-dfw-ironman', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-dfw-ironman-30', 'op-real-dfw-ironman', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-dfw-ironman-construction', 'op-real-dfw-ironman', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-dfw-ironman-mixed', 'op-real-dfw-ironman', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-dfw-ironman-household', 'op-real-dfw-ironman', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-dfw-ironman-roofing', 'op-real-dfw-ironman', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-dfw-ironman', 'op-real-dfw-ironman', 'city-dallas', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-dfw-rentals', 'DFW Dumpster Rentals', 'dfw-dumpster-rentals', '817-523-1722', NULL, 'https://dfw-dumpsterrentals.com/',
  'Roll-off dumpster rental across Dallas–Fort Worth with clear size packages for residential and commercial jobs.', 'Dallas', 'TX', 32.78, -96.8,
  450, 600, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-dfw-rentals-10', 'op-real-dfw-rentals', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-dfw-rentals-15', 'op-real-dfw-rentals', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-dfw-rentals-20', 'op-real-dfw-rentals', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-dfw-rentals-construction', 'op-real-dfw-rentals', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-dfw-rentals-mixed', 'op-real-dfw-rentals', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-dfw-rentals-household', 'op-real-dfw-rentals', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-dfw-rentals', 'op-real-dfw-rentals', 'city-dallas', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-atx-dumpo', 'Dumposaurus Dumpsters', 'dumposaurus-dumpsters', '512-774-5666', NULL, 'https://www.dumposaurus.com/',
  'Family-owned dumpster rental serving Austin and nearby Central Texas communities with honest pricing and fast delivery.', 'Austin', 'TX', 30.27, -97.74,
  375, 700, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-dumpo-10', 'op-real-atx-dumpo', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-dumpo-15', 'op-real-atx-dumpo', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-dumpo-20', 'op-real-atx-dumpo', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-dumpo-30', 'op-real-atx-dumpo', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atx-dumpo-construction', 'op-real-atx-dumpo', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atx-dumpo-mixed', 'op-real-atx-dumpo', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atx-dumpo-household', 'op-real-atx-dumpo', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atx-dumpo-yard', 'op-real-atx-dumpo', 'yard');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-atx-dumpo', 'op-real-atx-dumpo', 'city-austin', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-atx-redbox', 'redbox+ Dumpsters of Greater Austin', 'redbox-plus-greater-austin', '512-957-9701', NULL, 'https://www.redboxplus.com/greater-austin/',
  'Residential roll-off dumpster rental in Greater Austin with clean containers and online booking options.', 'Austin', 'TX', 30.3, -97.75,
  380, 720, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 79, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-redbox-10', 'op-real-atx-redbox', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-redbox-15', 'op-real-atx-redbox', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-redbox-20', 'op-real-atx-redbox', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atx-redbox-30', 'op-real-atx-redbox', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atx-redbox-construction', 'op-real-atx-redbox', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atx-redbox-mixed', 'op-real-atx-redbox', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atx-redbox-household', 'op-real-atx-redbox', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-atx-redbox', 'op-real-atx-redbox', 'city-austin', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-den-trashdaddy', 'Trash Daddy Dumpsters', 'trash-daddy-dumpsters-denver', '888-970-2144', NULL, 'https://trashdaddydumpsters.com/dumpster-rentals-colorado/denver/',
  'Locally operated roll-off dumpsters for Denver and the Front Range. Flat-rate packages with same-day delivery options.', 'Denver', 'CO', 39.74, -104.99,
  480, 750, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-den-trashdaddy-10', 'op-real-den-trashdaddy', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-den-trashdaddy-15', 'op-real-den-trashdaddy', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-den-trashdaddy-20', 'op-real-den-trashdaddy', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-den-trashdaddy-30', 'op-real-den-trashdaddy', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-den-trashdaddy-40', 'op-real-den-trashdaddy', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-den-trashdaddy-construction', 'op-real-den-trashdaddy', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-den-trashdaddy-mixed', 'op-real-den-trashdaddy', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-den-trashdaddy-household', 'op-real-den-trashdaddy', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-den-trashdaddy-roofing', 'op-real-den-trashdaddy', 'roofing');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-den-trashdaddy-concrete', 'op-real-den-trashdaddy', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-den-trashdaddy', 'op-real-den-trashdaddy', 'city-denver', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-phx-az', 'AZ Dumpsters', 'az-dumpsters', '602-344-0093', NULL, 'https://azdumpsters.com/',
  'Phoenix metro roll-off dumpster rentals with transparent online pricing for residential and commercial debris.', 'Phoenix', 'AZ', 33.45, -112.07,
  300, 550, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-az-10', 'op-real-phx-az', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-az-15', 'op-real-phx-az', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-az-20', 'op-real-phx-az', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-az-30', 'op-real-phx-az', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-az-40', 'op-real-phx-az', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-phx-az-construction', 'op-real-phx-az', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-phx-az-mixed', 'op-real-phx-az', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-phx-az-household', 'op-real-phx-az', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-phx-az-concrete', 'op-real-phx-az', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-phx-az', 'op-real-phx-az', 'city-phoenix', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-phx-vavia', 'VaVia Dumpster Rental Phoenix', 'vavia-dumpster-rental-phoenix', '602-529-1217', NULL, 'https://govavia.com/phoenix-az-dumpster-rental/',
  'Phoenix dumpster rental for home renovations, remodels, and small construction projects.', 'Phoenix', 'AZ', 33.46, -112.08,
  320, 580, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 77, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-vavia-10', 'op-real-phx-vavia', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-vavia-15', 'op-real-phx-vavia', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-phx-vavia-20', 'op-real-phx-vavia', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-phx-vavia-construction', 'op-real-phx-vavia', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-phx-vavia-mixed', 'op-real-phx-vavia', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-phx-vavia-household', 'op-real-phx-vavia', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-phx-vavia', 'op-real-phx-vavia', 'city-phoenix', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-mia-heroes', 'Dumpster Rental Miami Heroes', 'dumpster-rental-miami-heroes', '786-321-9718', NULL, 'https://dumpsterrentalmiamiheroes.net/',
  'Roll-off dumpster rentals for residential and commercial projects throughout Miami-Dade County.', 'Miami', 'FL', 25.76, -80.19,
  400, 750, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-heroes-10', 'op-real-mia-heroes', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-heroes-15', 'op-real-mia-heroes', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-heroes-20', 'op-real-mia-heroes', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-heroes-30', 'op-real-mia-heroes', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-mia-heroes-construction', 'op-real-mia-heroes', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-mia-heroes-mixed', 'op-real-mia-heroes', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-mia-heroes-household', 'op-real-mia-heroes', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-mia-heroes', 'op-real-mia-heroes', 'city-miami', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-mia-redbox', 'redbox+ Dumpsters of North Miami', 'redbox-plus-north-miami', '786-422-1755', NULL, 'https://www.redboxplus.com/north-miami/local-dumpster-rental-in-the-miami-fl-area/',
  'North Miami roll-off dumpster rentals with clean, well-maintained containers for homes and jobsites.', 'Miami', 'FL', 25.89, -80.19,
  420, 780, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 78, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-redbox-10', 'op-real-mia-redbox', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-redbox-15', 'op-real-mia-redbox', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-redbox-20', 'op-real-mia-redbox', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-mia-redbox-30', 'op-real-mia-redbox', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-mia-redbox-construction', 'op-real-mia-redbox', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-mia-redbox-mixed', 'op-real-mia-redbox', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-mia-redbox-household', 'op-real-mia-redbox', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-mia-redbox', 'op-real-mia-redbox', 'city-miami', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-orl-today', 'Dumpster Today Orlando', 'dumpster-today-orlando', '407-801-3867', NULL, 'https://dumpstertoday.com/locations/orlando/',
  'Same-day roll-off dumpster rentals for Greater Orlando residential and contractor projects.', 'Orlando', 'FL', 28.54, -81.38,
  350, 650, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 81, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-today-10', 'op-real-orl-today', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-today-15', 'op-real-orl-today', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-today-20', 'op-real-orl-today', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-today-30', 'op-real-orl-today', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-orl-today-construction', 'op-real-orl-today', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-orl-today-mixed', 'op-real-orl-today', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-orl-today-household', 'op-real-orl-today', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-orl-today-yard', 'op-real-orl-today', 'yard');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-orl-today', 'op-real-orl-today', 'city-orlando', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-orl-ej', 'EJ Dumpster Services', 'ej-dumpster-services', '407-460-2324', NULL, 'https://www.yelp.com/biz/ej-dumpster-services-orlando',
  'Orlando dumpster rentals and junk removal for homes and construction sites.', 'Orlando', 'FL', 28.5, -81.4,
  340, 620, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 75, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-ej-10', 'op-real-orl-ej', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-ej-15', 'op-real-orl-ej', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-ej-20', 'op-real-orl-ej', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-orl-ej-30', 'op-real-orl-ej', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-orl-ej-construction', 'op-real-orl-ej', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-orl-ej-mixed', 'op-real-orl-ej', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-orl-ej-household', 'op-real-orl-ej', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-orl-ej', 'op-real-orl-ej', 'city-orlando', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-tpa-deboer', 'DeBoer Bros. Disposal', 'deboer-bros-disposal', '813-931-3300', NULL, 'https://www.deboerbros.com/',
  'Locally owned Tampa Bay roll-off dumpster business with fast delivery for residential and commercial customers.', 'Tampa', 'FL', 27.97, -82.45,
  340, 620, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-tpa-deboer-10', 'op-real-tpa-deboer', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-tpa-deboer-15', 'op-real-tpa-deboer', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-tpa-deboer-20', 'op-real-tpa-deboer', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-tpa-deboer-30', 'op-real-tpa-deboer', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-tpa-deboer-construction', 'op-real-tpa-deboer', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-tpa-deboer-mixed', 'op-real-tpa-deboer', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-tpa-deboer-household', 'op-real-tpa-deboer', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-tpa-deboer', 'op-real-tpa-deboer', 'city-tampa', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-tpa-smiley', 'Smiley''s Dumpster Rental', 'smileys-dumpster-rental', '813-575-5865', NULL, 'https://smileys-dumpsters.com/dumpster-rental-in-tampa',
  'Driveway-safe dumpster rentals in Tampa with friendly local service for cleanouts and remodels.', 'Tampa', 'FL', 27.95, -82.46,
  335, 600, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-tpa-smiley-10', 'op-real-tpa-smiley', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-tpa-smiley-15', 'op-real-tpa-smiley', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-tpa-smiley-20', 'op-real-tpa-smiley', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-tpa-smiley-construction', 'op-real-tpa-smiley', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-tpa-smiley-mixed', 'op-real-tpa-smiley', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-tpa-smiley-household', 'op-real-tpa-smiley', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-tpa-smiley', 'op-real-tpa-smiley', 'city-tampa', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-la-calwaste', 'Roll Off Dumpster Rental Inc (Cal Waste Bins)', 'cal-waste-bins', '818-509-1352', NULL, 'https://calwastebins.com/',
  'Family-owned roll-off dumpster rental in Los Angeles and the San Fernando Valley. Same-day delivery, no hidden fees.', 'Los Angeles', 'CA', 34.18, -118.44,
  450, 900, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 87, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-calwaste-10', 'op-real-la-calwaste', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-calwaste-20', 'op-real-la-calwaste', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-calwaste-30', 'op-real-la-calwaste', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-calwaste-40', 'op-real-la-calwaste', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-calwaste-construction', 'op-real-la-calwaste', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-calwaste-mixed', 'op-real-la-calwaste', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-calwaste-household', 'op-real-la-calwaste', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-calwaste-concrete', 'op-real-la-calwaste', 'concrete');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-calwaste-roofing', 'op-real-la-calwaste', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-la-calwaste', 'op-real-la-calwaste', 'city-los-angeles', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-la-metro', 'Metropolis Disposal', 'metropolis-disposal', '800-650-6165', NULL, 'https://www.metropolis-disposal.com/',
  'Family-owned Los Angeles dumpster rental since 1998 serving the San Fernando Valley and Greater LA with high recycling rates.', 'Los Angeles', 'CA', 34.19, -118.45,
  480, 950, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-metro-10', 'op-real-la-metro', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-metro-20', 'op-real-la-metro', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-metro-30', 'op-real-la-metro', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-la-metro-40', 'op-real-la-metro', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-metro-construction', 'op-real-la-metro', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-metro-mixed', 'op-real-la-metro', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-metro-household', 'op-real-la-metro', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-la-metro-concrete', 'op-real-la-metro', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-la-metro', 'op-real-la-metro', 'city-los-angeles', NULL);
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-real-atl-br', 'BR Roll Offs', 'br-roll-offs', '404-661-9021', NULL, 'https://br-rolloffs.com/',
  'Family-owned Atlanta metro dumpster rental with same-day delivery on clean 10–30 yard roll-offs. Based in Woodstock, GA.', 'Atlanta', 'GA', 34.1, -84.52,
  400, 700, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'web-research-2026-08-11', 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atl-br-10', 'op-real-atl-br', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atl-br-15', 'op-real-atl-br', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atl-br-20', 'op-real-atl-br', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-real-atl-br-30', 'op-real-atl-br', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atl-br-construction', 'op-real-atl-br', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atl-br-mixed', 'op-real-atl-br', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atl-br-household', 'op-real-atl-br', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-real-atl-br-roofing', 'op-real-atl-br', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-real-atl-br', 'op-real-atl-br', 'city-atlanta', NULL);
UPDATE cities SET updated_at = datetime('now') WHERE is_priority = 1;
-- Extra Denver + Atlanta (confirmed phones)
INSERT OR REPLACE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES
('op-real-den-remedies', 'Roll-Off Remedies', 'roll-off-remedies', '303-433-1553', NULL, 'https://remediesdumpsterrental.com/',
 'Flat-rate roll-off dumpster rental in Denver with 10–40 yard sizes and next-day delivery options.',
 'Denver', 'CO', 39.76, -105.02, 350, 700, NULL, NULL, NULL, 1, NULL, 1, 0,
 'verified', datetime('now'), 'web-research-2026-08-11',
 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
 0, NULL, 84, 1, 0, 'unclaimed', 1),
('op-real-den-dudez', 'Dumpster Dudez of South Denver', 'dumpster-dudez-south-denver', '303-962-2121', NULL, 'https://dumpsterdudez.com/denver',
 'Locally owned Dumpster Dudez franchise serving greater Denver with residential and commercial roll-offs.',
 'Denver', 'CO', 39.60, -104.95, 360, 720, NULL, NULL, NULL, 1, NULL, 1, 0,
 'verified', datetime('now'), 'web-research-2026-08-11',
 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
 0, NULL, 82, 1, 0, 'unclaimed', 1),
('op-real-atl-vine', 'Vine Disposal', 'vine-disposal-atlanta', '678-315-2193', NULL, 'https://vinedisposal.com/dumpster-rental-in-atlanta-ga.html',
 'Metro Atlanta roll-off dumpster rentals for residential, remodeling, and commercial job sites.',
 'Atlanta', 'GA', 33.75, -84.39, 325, 650, NULL, NULL, NULL, 1, NULL, 0, 0,
 'verified', datetime('now'), 'web-research-2026-08-11',
 'Web research 2026-08-11: public phone/website from company site. Phone call for insurance/license still recommended before heavy marketing.',
 0, NULL, 78, 1, 0, 'unclaimed', 1);

INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES
('sz-op-real-den-remedies-10', 'op-real-den-remedies', 10),
('sz-op-real-den-remedies-20', 'op-real-den-remedies', 20),
('sz-op-real-den-remedies-30', 'op-real-den-remedies', 30),
('sz-op-real-den-remedies-40', 'op-real-den-remedies', 40),
('sz-op-real-den-dudez-10', 'op-real-den-dudez', 10),
('sz-op-real-den-dudez-15', 'op-real-den-dudez', 15),
('sz-op-real-den-dudez-20', 'op-real-den-dudez', 20),
('sz-op-real-den-dudez-25', 'op-real-den-dudez', 25),
('sz-op-real-atl-vine-10', 'op-real-atl-vine', 10),
('sz-op-real-atl-vine-20', 'op-real-atl-vine', 20),
('sz-op-real-atl-vine-30', 'op-real-atl-vine', 30),
('sz-op-real-atl-vine-40', 'op-real-atl-vine', 40);

INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES
('mt-op-real-den-remedies-c', 'op-real-den-remedies', 'construction'),
('mt-op-real-den-remedies-m', 'op-real-den-remedies', 'mixed'),
('mt-op-real-den-remedies-h', 'op-real-den-remedies', 'household'),
('mt-op-real-den-dudez-c', 'op-real-den-dudez', 'construction'),
('mt-op-real-den-dudez-m', 'op-real-den-dudez', 'mixed'),
('mt-op-real-den-dudez-h', 'op-real-den-dudez', 'household'),
('mt-op-real-atl-vine-c', 'op-real-atl-vine', 'construction'),
('mt-op-real-atl-vine-m', 'op-real-atl-vine', 'mixed'),
('mt-op-real-atl-vine-h', 'op-real-atl-vine', 'household');

INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES
('sa-op-real-den-remedies', 'op-real-den-remedies', 'city-denver', NULL),
('sa-op-real-den-dudez', 'op-real-den-dudez', 'city-denver', NULL),
('sa-op-real-atl-vine', 'op-real-atl-vine', 'city-atlanta', NULL);
