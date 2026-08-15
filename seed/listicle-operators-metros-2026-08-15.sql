-- High-quality local operators researched 2026-08-15 via Firecrawl search + site scrapes.
-- Quality bar: own-site phone, local/regional hauler, roll-off dumpsters, not a national broker.
-- verification_notes document web research; phone insurance/license still recommended.

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-okc-enviro', 'Enviro Dispose', 'enviro-dispose', '405-213-4593', 'dustin@envirodispose.com', 'https://envirodispose.com/',
  'Locally owned Oklahoma City roll-off hauler with same-day service and 10–40 yard open-top boxes. Yard at 7220 NW 63rd Street in Bethany.', 'Oklahoma City', 'OK', 35.4676, -97.5164,
  350, 700, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 88, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-enviro-10', 'op-fc15-okc-enviro', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-enviro-15', 'op-fc15-okc-enviro', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-enviro-20', 'op-fc15-okc-enviro', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-enviro-25', 'op-fc15-okc-enviro', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-enviro-30', 'op-fc15-okc-enviro', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-enviro-40', 'op-fc15-okc-enviro', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-enviro-construction', 'op-fc15-okc-enviro', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-enviro-mixed', 'op-fc15-okc-enviro', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-enviro-household', 'op-fc15-okc-enviro', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-enviro-yard', 'op-fc15-okc-enviro', 'yard');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-okc-enviro', 'op-fc15-okc-enviro', 'city-oklahoma-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-okc-cubic', 'Cubic Waste Solutions', 'cubic-waste-solutions', '405-261-9105', NULL, 'https://cubicwaste.com/',
  'Family-owned Oklahoma City roll-off contractor with 10–40 yard dumpsters, same-day delivery, and driveway-friendly smaller boxes.', 'Oklahoma City', 'OK', 35.4676, -97.5164,
  350, 750, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 87, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-cubic-10', 'op-fc15-okc-cubic', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-cubic-15', 'op-fc15-okc-cubic', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-cubic-20', 'op-fc15-okc-cubic', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-cubic-30', 'op-fc15-okc-cubic', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-cubic-40', 'op-fc15-okc-cubic', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-cubic-construction', 'op-fc15-okc-cubic', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-cubic-mixed', 'op-fc15-okc-cubic', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-cubic-household', 'op-fc15-okc-cubic', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-cubic-concrete', 'op-fc15-okc-cubic', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-okc-cubic', 'op-fc15-okc-cubic', 'city-oklahoma-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-okc-ready', 'Ready to Roll Off', 'ready-to-roll-off', '405-919-2814', 'ready2rolloff@gmail.com', 'https://ready2rolloff.com/',
  'Family-run OKC roll-off rental with a published $435 20-yard / 10-day package (2 tons included) and same-day delivery across Edmond, Yukon, and Mustang.', 'Oklahoma City', 'OK', 35.4676, -97.5164,
  435, 550, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-ready-20', 'op-fc15-okc-ready', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-ready-construction', 'op-fc15-okc-ready', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-ready-mixed', 'op-fc15-okc-ready', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-ready-household', 'op-fc15-okc-ready', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-okc-ready', 'op-fc15-okc-ready', 'city-oklahoma-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-okc-junkfrog', 'Junk Frog', 'junk-frog', '405-444-5865', NULL, 'https://junkfrog.com/',
  'Oklahoma City roll-off dumpster rental plus junk removal and storage with flat-rate pricing.', 'Oklahoma City', 'OK', 35.4676, -97.5164,
  325, 650, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-junkfrog-10', 'op-fc15-okc-junkfrog', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-junkfrog-15', 'op-fc15-okc-junkfrog', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-junkfrog-20', 'op-fc15-okc-junkfrog', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-junkfrog-30', 'op-fc15-okc-junkfrog', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-junkfrog-construction', 'op-fc15-okc-junkfrog', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-junkfrog-mixed', 'op-fc15-okc-junkfrog', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-junkfrog-household', 'op-fc15-okc-junkfrog', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-okc-junkfrog', 'op-fc15-okc-junkfrog', 'city-oklahoma-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-okc-payneless', 'Payne-Less Junk Removal', 'payne-less-junk-removal', '405-788-1689', NULL, 'https://www.okcjunkhauling.com/',
  'OKC dumpster rental and junk removal with first-ton included packages and same- or next-day service.', 'Oklahoma City', 'OK', 35.4676, -97.5164,
  300, 600, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 79, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-payneless-15', 'op-fc15-okc-payneless', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-payneless-20', 'op-fc15-okc-payneless', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-payneless-construction', 'op-fc15-okc-payneless', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-payneless-mixed', 'op-fc15-okc-payneless', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-payneless-household', 'op-fc15-okc-payneless', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-okc-payneless', 'op-fc15-okc-payneless', 'city-oklahoma-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-okc-btdt', 'Bin There Dump That Oklahoma City', 'bin-there-dump-that-oklahoma-city', '405-640-4345', NULL, 'https://www.okcdumpsterrental.com/',
  'Driveway-safe trailer-style dumpsters from local franchisees Jason and Heather. Flat-rate 10-day rentals in 6–20 yard sizes.', 'Oklahoma City', 'OK', 35.4676, -97.5164,
  350, 700, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 76, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-btdt-6', 'op-fc15-okc-btdt', 6);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-btdt-10', 'op-fc15-okc-btdt', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-btdt-14', 'op-fc15-okc-btdt', 14);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-okc-btdt-20', 'op-fc15-okc-btdt', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-btdt-construction', 'op-fc15-okc-btdt', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-btdt-mixed', 'op-fc15-okc-btdt', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-okc-btdt-household', 'op-fc15-okc-btdt', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-okc-btdt', 'op-fc15-okc-btdt', 'city-oklahoma-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-tul-reddirt', 'Red Dirt Roll-Offs', 'red-dirt-roll-offs', '918-955-3867', NULL, 'https://www.reddirtrolloffs.com/',
  'Veteran- and firefighter-owned Tulsa roll-off company with published 10-yard ($299) and 15-yard ($349) 10-day rates.', 'Tulsa', 'OK', 36.154, -95.9928,
  299, 399, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 88, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-reddirt-10', 'op-fc15-tul-reddirt', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-reddirt-15', 'op-fc15-tul-reddirt', 15);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-reddirt-construction', 'op-fc15-tul-reddirt', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-reddirt-mixed', 'op-fc15-tul-reddirt', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-reddirt-household', 'op-fc15-tul-reddirt', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-reddirt-yard', 'op-fc15-tul-reddirt', 'yard');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-tul-reddirt', 'op-fc15-tul-reddirt', 'city-tulsa', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-tul-atob', 'A to B Hauling', 'a-to-b-hauling', '918-900-4285', NULL, 'https://atobhauling.com/',
  'Owner-operated Tulsa roll-off rentals since 2014 with 15–30 yard boxes and same-day delivery when booked before 2 p.m.', 'Tulsa', 'OK', 36.154, -95.9928,
  350, 700, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-atob-15', 'op-fc15-tul-atob', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-atob-20', 'op-fc15-tul-atob', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-atob-25', 'op-fc15-tul-atob', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-atob-30', 'op-fc15-tul-atob', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-atob-construction', 'op-fc15-tul-atob', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-atob-mixed', 'op-fc15-tul-atob', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-atob-household', 'op-fc15-tul-atob', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-tul-atob', 'op-fc15-tul-atob', 'city-tulsa', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-tul-awc', 'American Waste Control', 'american-waste-control', '918-446-0023', NULL, 'https://www.americanwastecontrol.com/',
  'Tulsa waste, recycling, and roll-off company serving homes and businesses since 1970.', 'Tulsa', 'OK', 36.154, -95.9928,
  350, 750, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-awc-10', 'op-fc15-tul-awc', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-awc-20', 'op-fc15-tul-awc', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-awc-30', 'op-fc15-tul-awc', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-awc-40', 'op-fc15-tul-awc', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-awc-construction', 'op-fc15-tul-awc', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-awc-mixed', 'op-fc15-tul-awc', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-awc-household', 'op-fc15-tul-awc', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-tul-awc', 'op-fc15-tul-awc', 'city-tulsa', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-tul-oncall', 'On Call Services and Rentals', 'on-call-services-rentals', '918-397-7787', NULL, 'https://oncallservicesandrentals.com/roll-off-dumpsters/',
  'Tulsa-based roll-off, porta-potty, and fencing company with 15–30 yard dumpsters and published tonnage packages.', 'Tulsa', 'OK', 36.154, -95.9928,
  325, 650, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-oncall-15', 'op-fc15-tul-oncall', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-oncall-20', 'op-fc15-tul-oncall', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-oncall-25', 'op-fc15-tul-oncall', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-oncall-30', 'op-fc15-tul-oncall', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-oncall-construction', 'op-fc15-tul-oncall', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-oncall-mixed', 'op-fc15-tul-oncall', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-oncall-household', 'op-fc15-tul-oncall', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-oncall-yard', 'op-fc15-tul-oncall', 'yard');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-tul-oncall', 'op-fc15-tul-oncall', 'city-tulsa', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-tul-btdt', 'Bin There Dump That Tulsa West', 'bin-there-dump-that-tulsa-west', '918-246-7199', NULL, 'https://www.bintheredumpthat.com/tulsa-west-dumpster-rentals/',
  'Locally operated Tulsa West franchise with driveway-friendly trailer dumpsters for residential jobs.', 'Tulsa', 'OK', 36.154, -95.9928,
  350, 680, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 75, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-btdt-10', 'op-fc15-tul-btdt', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-btdt-14', 'op-fc15-tul-btdt', 14);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-tul-btdt-20', 'op-fc15-tul-btdt', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-btdt-construction', 'op-fc15-tul-btdt', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-btdt-mixed', 'op-fc15-tul-btdt', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-tul-btdt-household', 'op-fc15-tul-btdt', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-tul-btdt', 'op-fc15-tul-btdt', 'city-tulsa', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-chi-brackenbox', 'Brackenbox', 'brackenbox', '708-339-4100', NULL, 'https://brackenbox.com/',
  'Chicagoland and northwest Indiana residential and commercial roll-off with 10–30 yard boxes. Hours Mon–Fri 6–4, Sat 7–2.', 'Chicago', 'IL', 41.8781, -87.6298,
  375, 750, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-brackenbox-10', 'op-fc15-chi-brackenbox', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-brackenbox-15', 'op-fc15-chi-brackenbox', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-brackenbox-20', 'op-fc15-chi-brackenbox', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-brackenbox-30', 'op-fc15-chi-brackenbox', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-brackenbox-construction', 'op-fc15-chi-brackenbox', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-brackenbox-mixed', 'op-fc15-chi-brackenbox', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-brackenbox-household', 'op-fc15-chi-brackenbox', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-brackenbox-roofing', 'op-fc15-chi-brackenbox', 'roofing');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-brackenbox-yard', 'op-fc15-chi-brackenbox', 'yard');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-chi-brackenbox', 'op-fc15-chi-brackenbox', 'city-chicago', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-chi-r2r', 'Ready 2 Roll Hauling', 'ready-2-roll-hauling', '312-520-3619', 'info@ready2rollhauling.com', 'https://www.ready2rollhauling.com/',
  'Chicago south-suburbs junk removal and roll-off from about $370, with same-day service often available.', 'Chicago', 'IL', 41.8781, -87.6298,
  370, 550, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-r2r-12', 'op-fc15-chi-r2r', 12);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-r2r-15', 'op-fc15-chi-r2r', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-r2r-21', 'op-fc15-chi-r2r', 21);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-r2r-construction', 'op-fc15-chi-r2r', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-r2r-mixed', 'op-fc15-chi-r2r', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-r2r-household', 'op-fc15-chi-r2r', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-r2r-yard', 'op-fc15-chi-r2r', 'yard');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-chi-r2r', 'op-fc15-chi-r2r', 'city-chicago', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-chi-sbc', 'SBC Waste Solutions', 'sbc-waste-solutions', '312-522-1115', NULL, 'https://www.sbcwastesolutions.com/',
  'Locally owned Chicago-area hauler offering roll-off, front-load, and recycling across the southwest and west suburbs.', 'Chicago', 'IL', 41.8781, -87.6298,
  375, 800, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-sbc-10', 'op-fc15-chi-sbc', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-sbc-15', 'op-fc15-chi-sbc', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-sbc-20', 'op-fc15-chi-sbc', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-sbc-30', 'op-fc15-chi-sbc', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-sbc-40', 'op-fc15-chi-sbc', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-sbc-construction', 'op-fc15-chi-sbc', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-sbc-mixed', 'op-fc15-chi-sbc', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-sbc-household', 'op-fc15-chi-sbc', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-chi-sbc', 'op-fc15-chi-sbc', 'city-chicago', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-chi-mobile', 'Mobiledumps Chicagoland', 'mobiledumps-chicagoland', '262-202-4507', NULL, 'https://mobiledumps.com/locations/il/chicagoland/',
  'Locally owned 14-yard trailer dumpsters for Greater Chicago suburbs with express delivery windows.', 'Chicago', 'IL', 41.8781, -87.6298,
  350, 550, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 78, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-chi-mobile-14', 'op-fc15-chi-mobile', 14);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-mobile-construction', 'op-fc15-chi-mobile', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-mobile-mixed', 'op-fc15-chi-mobile', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-chi-mobile-household', 'op-fc15-chi-mobile', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-chi-mobile', 'op-fc15-chi-mobile', 'city-chicago', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-nyc-guma', 'Guma Containers', 'guma-containers', '718-928-3024', 'sales@gumacontainers.com', 'https://www.gumacontainers.com/',
  'Minority-owned, family-run NYC roll-off and packer-truck service with 10–30 yard containers.', 'New York', 'NY', 40.7128, -74.006,
  450, 1200, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-guma-10', 'op-fc15-nyc-guma', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-guma-15', 'op-fc15-nyc-guma', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-guma-20', 'op-fc15-nyc-guma', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-guma-25', 'op-fc15-nyc-guma', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-guma-30', 'op-fc15-nyc-guma', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-guma-construction', 'op-fc15-nyc-guma', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-guma-mixed', 'op-fc15-nyc-guma', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-guma-household', 'op-fc15-nyc-guma', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-nyc-guma', 'op-fc15-nyc-guma', 'city-new-york', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-nyc-bestway', 'Bestway Carting', 'bestway-carting', '800-216-1284', NULL, 'https://www.bestwaycarting.com/',
  'Brooklyn, Queens, and NYC carting company with 30+ years of container rentals and construction debris service. HQ in Little Neck.', 'New York', 'NY', 40.7128, -74.006,
  500, 1300, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-bestway-10', 'op-fc15-nyc-bestway', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-bestway-20', 'op-fc15-nyc-bestway', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-bestway-30', 'op-fc15-nyc-bestway', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-bestway-40', 'op-fc15-nyc-bestway', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-bestway-construction', 'op-fc15-nyc-bestway', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-bestway-mixed', 'op-fc15-nyc-bestway', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-bestway-household', 'op-fc15-nyc-bestway', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-nyc-bestway', 'op-fc15-nyc-bestway', 'city-new-york', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-nyc-action', 'Action Carting', 'action-carting', '866-270-9900', NULL, 'https://actioncarting.com/',
  'Licensed NYC commercial waste zone hauler offering roll-off dumpsters across the five boroughs.', 'New York', 'NY', 40.7128, -74.006,
  500, 1400, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 79, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-action-10', 'op-fc15-nyc-action', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-action-20', 'op-fc15-nyc-action', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-action-30', 'op-fc15-nyc-action', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nyc-action-40', 'op-fc15-nyc-action', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-action-construction', 'op-fc15-nyc-action', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-action-mixed', 'op-fc15-nyc-action', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nyc-action-household', 'op-fc15-nyc-action', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-nyc-action', 'op-fc15-nyc-action', 'city-new-york', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-phl-geppert', 'Geppert Recycling', 'geppert-recycling', '215-842-0122', NULL, 'https://geppertrecycling.com/',
  '30+ year Philadelphia waste station and roll-off company serving the city plus Bucks, Chester, Delaware, and Montgomery counties.', 'Philadelphia', 'PA', 39.9526, -75.1652,
  375, 800, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-geppert-10', 'op-fc15-phl-geppert', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-geppert-15', 'op-fc15-phl-geppert', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-geppert-20', 'op-fc15-phl-geppert', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-geppert-30', 'op-fc15-phl-geppert', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-geppert-40', 'op-fc15-phl-geppert', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-geppert-construction', 'op-fc15-phl-geppert', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-geppert-mixed', 'op-fc15-phl-geppert', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-geppert-household', 'op-fc15-phl-geppert', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-phl-geppert', 'op-fc15-phl-geppert', 'city-philadelphia', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-phl-tswaste', 'Tri-State Waste', 'tri-state-waste', '215-423-5200', 'info@tswaste.com', 'https://tswaste.com/',
  'Philadelphia and South Jersey roll-off hauler with 10–40 yard dumpsters and local dispatch.', 'Philadelphia', 'PA', 39.9526, -75.1652,
  375, 850, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-tswaste-10', 'op-fc15-phl-tswaste', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-tswaste-12', 'op-fc15-phl-tswaste', 12);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-tswaste-15', 'op-fc15-phl-tswaste', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-tswaste-20', 'op-fc15-phl-tswaste', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-tswaste-30', 'op-fc15-phl-tswaste', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-tswaste-40', 'op-fc15-phl-tswaste', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-tswaste-construction', 'op-fc15-phl-tswaste', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-tswaste-mixed', 'op-fc15-phl-tswaste', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-tswaste-household', 'op-fc15-phl-tswaste', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-phl-tswaste', 'op-fc15-phl-tswaste', 'city-philadelphia', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-phl-reams', 'Reams Disposal', 'reams-disposal', '484-722-8247', NULL, 'https://reamsdisposal.com/dumpster-rental-philadelphia-pa/',
  'Philadelphia County dumpster rental for remodels, additions, and cleanouts.', 'Philadelphia', 'PA', 39.9526, -75.1652,
  350, 750, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-reams-10', 'op-fc15-phl-reams', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-reams-15', 'op-fc15-phl-reams', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-reams-20', 'op-fc15-phl-reams', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phl-reams-30', 'op-fc15-phl-reams', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-reams-construction', 'op-fc15-phl-reams', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-reams-mixed', 'op-fc15-phl-reams', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phl-reams-household', 'op-fc15-phl-reams', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-phl-reams', 'op-fc15-phl-reams', 'city-philadelphia', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-sea-nw', 'NW Dumpsters', 'nw-dumpsters', '206-866-0688', 'hello@nwdumpsters.com', 'https://nwdumpsters.com/',
  'Locally owned Seattle MBE/DBE roll-off company with 300+ containers and same- or next-day delivery.', 'Seattle', 'WA', 47.6062, -122.3321,
  450, 900, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 88, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sea-nw-10', 'op-fc15-sea-nw', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sea-nw-20', 'op-fc15-sea-nw', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sea-nw-30', 'op-fc15-sea-nw', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sea-nw-40', 'op-fc15-sea-nw', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sea-nw-construction', 'op-fc15-sea-nw', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sea-nw-mixed', 'op-fc15-sea-nw', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sea-nw-household', 'op-fc15-sea-nw', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sea-nw-concrete', 'op-fc15-sea-nw', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-sea-nw', 'op-fc15-sea-nw', 'city-seattle', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-sea-sound', 'Sound Hauling', 'sound-hauling', '425-400-4285', NULL, 'https://soundhauling.com/services/dumpster-rental.aspx',
  'Seattle-area hauling company with 14- and 25-yard roll-offs, published package pricing, and driveway-friendly options.', 'Seattle', 'WA', 47.6062, -122.3321,
  375, 525, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sea-sound-14', 'op-fc15-sea-sound', 14);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sea-sound-25', 'op-fc15-sea-sound', 25);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sea-sound-construction', 'op-fc15-sea-sound', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sea-sound-mixed', 'op-fc15-sea-sound', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sea-sound-household', 'op-fc15-sea-sound', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-sea-sound', 'op-fc15-sea-sound', 'city-seattle', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-clt-a1', 'A1 Dumpster Rentals', 'a1-dumpster-rentals', '704-391-7030', NULL, 'https://www.a1dumpsterrentals.com/',
  'Locally owned Charlotte dumpster and demolition company with 30+ years in North and South Carolina.', 'Charlotte', 'NC', 35.2271, -80.8431,
  350, 700, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-a1-10', 'op-fc15-clt-a1', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-a1-15', 'op-fc15-clt-a1', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-a1-20', 'op-fc15-clt-a1', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-a1-30', 'op-fc15-clt-a1', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-a1-construction', 'op-fc15-clt-a1', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-a1-mixed', 'op-fc15-clt-a1', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-a1-household', 'op-fc15-clt-a1', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-clt-a1', 'op-fc15-clt-a1', 'city-charlotte', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-clt-regency', 'Regency Hauling', 'regency-hauling', '704-593-6378', 'info@regencyhauling.com', 'https://regencyhauling.com/',
  'Charlotte dumpster rental and hauling from WT Harris Blvd with 10–40 yard roll-offs and Monday–Saturday service.', 'Charlotte', 'NC', 35.2271, -80.8431,
  365, 550, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-regency-10', 'op-fc15-clt-regency', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-regency-15', 'op-fc15-clt-regency', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-regency-20', 'op-fc15-clt-regency', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-regency-30', 'op-fc15-clt-regency', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-regency-40', 'op-fc15-clt-regency', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-regency-construction', 'op-fc15-clt-regency', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-regency-mixed', 'op-fc15-clt-regency', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-regency-household', 'op-fc15-clt-regency', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-regency-roofing', 'op-fc15-clt-regency', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-clt-regency', 'op-fc15-clt-regency', 'city-charlotte', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-clt-masters', 'Roll Off Masters', 'roll-off-masters', '980-346-3810', NULL, 'https://rolloffmastersllc.com/',
  'Charlotte residential and construction roll-off company with driveway-safe delivery and 15/20/30 yard boxes.', 'Charlotte', 'NC', 35.2271, -80.8431,
  350, 700, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-masters-15', 'op-fc15-clt-masters', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-masters-20', 'op-fc15-clt-masters', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-clt-masters-30', 'op-fc15-clt-masters', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-masters-construction', 'op-fc15-clt-masters', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-masters-mixed', 'op-fc15-clt-masters', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-clt-masters-household', 'op-fc15-clt-masters', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-clt-masters', 'op-fc15-clt-masters', 'city-charlotte', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-nsh-tnro', 'Tennessee Rolloff', 'tennessee-rolloff', '615-784-4076', NULL, 'https://tnrolloff.com/',
  'Metro Nashville licensed roll-off and portable toilet company with same-day delivery and 15–30 yard boxes.', 'Nashville', 'TN', 36.1627, -86.7816,
  350, 700, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-tnro-15', 'op-fc15-nsh-tnro', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-tnro-20', 'op-fc15-nsh-tnro', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-tnro-30', 'op-fc15-nsh-tnro', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-tnro-construction', 'op-fc15-nsh-tnro', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-tnro-mixed', 'op-fc15-nsh-tnro', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-tnro-household', 'op-fc15-nsh-tnro', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-nsh-tnro', 'op-fc15-nsh-tnro', 'city-nashville', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-nsh-jandj', 'J and J Services', 'j-and-j-services', '615-599-7778', NULL, 'https://www.jandjservices.com/services/commercial/roll-off-dumpster-rental',
  'Nashville-area commercial and residential roll-off rentals in 10–40 yard sizes.', 'Nashville', 'TN', 36.1627, -86.7816,
  350, 750, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-jandj-10', 'op-fc15-nsh-jandj', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-jandj-12', 'op-fc15-nsh-jandj', 12);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-jandj-15', 'op-fc15-nsh-jandj', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-jandj-20', 'op-fc15-nsh-jandj', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-jandj-30', 'op-fc15-nsh-jandj', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-jandj-40', 'op-fc15-nsh-jandj', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-jandj-construction', 'op-fc15-nsh-jandj', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-jandj-mixed', 'op-fc15-nsh-jandj', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-jandj-household', 'op-fc15-nsh-jandj', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-nsh-jandj', 'op-fc15-nsh-jandj', 'city-nashville', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-nsh-reddog', 'Red Dog Dumpsters', 'red-dog-dumpsters', '615-933-3300', NULL, 'https://reddogdumpsters.com/',
  'Nashville roll-off company with published 10/15/20 yard pricing and free delivery inside a 30-minute radius.', 'Nashville', 'TN', 36.1627, -86.7816,
  365, 515, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 81, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-reddog-10', 'op-fc15-nsh-reddog', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-reddog-15', 'op-fc15-nsh-reddog', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-nsh-reddog-20', 'op-fc15-nsh-reddog', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-reddog-construction', 'op-fc15-nsh-reddog', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-reddog-mixed', 'op-fc15-nsh-reddog', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-nsh-reddog-household', 'op-fc15-nsh-reddog', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-nsh-reddog', 'op-fc15-nsh-reddog', 'city-nashville', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-bos-homestead', 'Homestead Disposal', 'homestead-disposal', '781-320-0516', 'eric@homestead-disposal.com', 'https://www.homestead-disposal.com/',
  'Westwood-based Greater Boston roll-off specialist with 25+ years, driveway-safe 7/10/15 yard boxes, and next-day delivery.', 'Boston', 'MA', 42.3601, -71.0589,
  450, 750, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 88, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bos-homestead-7', 'op-fc15-bos-homestead', 7);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bos-homestead-10', 'op-fc15-bos-homestead', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bos-homestead-15', 'op-fc15-bos-homestead', 15);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-homestead-construction', 'op-fc15-bos-homestead', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-homestead-mixed', 'op-fc15-bos-homestead', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-homestead-household', 'op-fc15-bos-homestead', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-homestead-roofing', 'op-fc15-bos-homestead', 'roofing');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-homestead-yard', 'op-fc15-bos-homestead', 'yard');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-homestead-concrete', 'op-fc15-bos-homestead', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-bos-homestead', 'op-fc15-bos-homestead', 'city-boston', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-bos-viking', 'Viking Disposal', 'viking-disposal', '781-716-7400', NULL, 'https://vikingdisposalserv.com/services/roll-off-dumpster/',
  'Greater Boston roll-off and recycling with 10–30 yard dumpsters and same-day service when inventory allows.', 'Boston', 'MA', 42.3601, -71.0589,
  400, 800, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bos-viking-10', 'op-fc15-bos-viking', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bos-viking-15', 'op-fc15-bos-viking', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bos-viking-20', 'op-fc15-bos-viking', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bos-viking-30', 'op-fc15-bos-viking', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-viking-construction', 'op-fc15-bos-viking', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-viking-mixed', 'op-fc15-bos-viking', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bos-viking-household', 'op-fc15-bos-viking', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-bos-viking', 'op-fc15-bos-viking', 'city-boston', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-cmh-affordable', 'Affordable Dumpsters', 'affordable-dumpsters-columbus', '614-476-3626', NULL, 'https://www.affordabledumping.com/',
  'Franklin County roll-off and trailer dumpsters since 1995. Published rates from $225 with same-day delivery.', 'Columbus', 'OH', 39.9612, -82.9988,
  225, 400, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 87, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-affordable-10', 'op-fc15-cmh-affordable', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-affordable-14', 'op-fc15-cmh-affordable', 14);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-affordable-15', 'op-fc15-cmh-affordable', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-affordable-20', 'op-fc15-cmh-affordable', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-affordable-construction', 'op-fc15-cmh-affordable', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-affordable-mixed', 'op-fc15-cmh-affordable', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-affordable-household', 'op-fc15-cmh-affordable', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-cmh-affordable', 'op-fc15-cmh-affordable', 'city-columbus', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-cmh-midohio', 'Mid-Ohio Dumpsters', 'mid-ohio-dumpsters', '614-721-7777', 'sales@midohiodumpsters.com', 'https://www.midohiodumpsters.com/',
  'Family-owned Columbus dumpster, demolition, and junk company with 10–30 yard roll-offs.', 'Columbus', 'OH', 39.9612, -82.9988,
  325, 650, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-midohio-10', 'op-fc15-cmh-midohio', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-midohio-15', 'op-fc15-cmh-midohio', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-midohio-20', 'op-fc15-cmh-midohio', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-midohio-30', 'op-fc15-cmh-midohio', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-midohio-construction', 'op-fc15-cmh-midohio', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-midohio-mixed', 'op-fc15-cmh-midohio', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-midohio-household', 'op-fc15-cmh-midohio', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-cmh-midohio', 'op-fc15-cmh-midohio', 'city-columbus', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-cmh-frog', 'Frog Hauling', 'frog-hauling', '614-258-3764', NULL, 'https://froghauling.com/',
  'Columbus flat-rate dumpster rental with same-day delivery when ordered before 1 p.m. Serves Dublin, Westerville, and Upper Arlington.', 'Columbus', 'OH', 39.9612, -82.9988,
  305, 425, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-frog-10', 'op-fc15-cmh-frog', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-frog-15', 'op-fc15-cmh-frog', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-frog-20', 'op-fc15-cmh-frog', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-cmh-frog-30', 'op-fc15-cmh-frog', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-frog-construction', 'op-fc15-cmh-frog', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-frog-mixed', 'op-fc15-cmh-frog', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-cmh-frog-household', 'op-fc15-cmh-frog', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-cmh-frog', 'op-fc15-cmh-frog', 'city-columbus', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-indy-aa', 'A and A Roll Offs', 'a-and-a-roll-offs', '317-680-3867', NULL, 'https://www.aarolloffs.com/',
  'Central Indiana roll-off company with published 12–30 yard rates from $325 and same-day delivery.', 'Indianapolis', 'IN', 39.7684, -86.1581,
  325, 525, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-aa-12', 'op-fc15-indy-aa', 12);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-aa-15', 'op-fc15-indy-aa', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-aa-20', 'op-fc15-indy-aa', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-aa-25', 'op-fc15-indy-aa', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-aa-30', 'op-fc15-indy-aa', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-aa-construction', 'op-fc15-indy-aa', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-aa-mixed', 'op-fc15-indy-aa', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-aa-household', 'op-fc15-indy-aa', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-indy-aa', 'op-fc15-indy-aa', 'city-indianapolis', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-indy-hoosier', 'Hoosier Hauler', 'hoosier-hauler', '317-838-8302', NULL, 'https://hoosierhauler.com/',
  'Indianapolis dumpster rental for 25+ years with 10–40 yard roll-offs and portable restrooms.', 'Indianapolis', 'IN', 39.7684, -86.1581,
  325, 700, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-hoosier-10', 'op-fc15-indy-hoosier', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-hoosier-15', 'op-fc15-indy-hoosier', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-hoosier-20', 'op-fc15-indy-hoosier', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-hoosier-30', 'op-fc15-indy-hoosier', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-hoosier-40', 'op-fc15-indy-hoosier', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-hoosier-construction', 'op-fc15-indy-hoosier', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-hoosier-mixed', 'op-fc15-indy-hoosier', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-hoosier-household', 'op-fc15-indy-hoosier', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-indy-hoosier', 'op-fc15-indy-hoosier', 'city-indianapolis', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-indy-greenway', 'Greenway Dumpsters', 'greenway-dumpsters', '317-617-9464', NULL, 'https://greenwaydumpsters.com/',
  'Indianapolis 10–30 yard roll-off rentals for homes and contractors.', 'Indianapolis', 'IN', 39.7684, -86.1581,
  325, 650, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-greenway-10', 'op-fc15-indy-greenway', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-greenway-15', 'op-fc15-indy-greenway', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-greenway-20', 'op-fc15-indy-greenway', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-greenway-25', 'op-fc15-indy-greenway', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-indy-greenway-30', 'op-fc15-indy-greenway', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-greenway-construction', 'op-fc15-indy-greenway', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-greenway-mixed', 'op-fc15-indy-greenway', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-indy-greenway-household', 'op-fc15-indy-greenway', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-indy-greenway', 'op-fc15-indy-greenway', 'city-indianapolis', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-det-dumpday', 'Dump Day Dumpster Rental', 'dump-day-dumpster-rental', '313-918-4880', 'dumpdaydumpsters@gmail.com', 'https://www.dumpdaydumpsterrental.com/',
  'Locally owned Metro Detroit rubber-wheeled dumpsters with clear tonnage packages and same-day options.', 'Detroit', 'MI', 42.3314, -83.0458,
  350, 450, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 88, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-det-dumpday-10', 'op-fc15-det-dumpday', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-det-dumpday-20', 'op-fc15-det-dumpday', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-det-dumpday-construction', 'op-fc15-det-dumpday', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-det-dumpday-mixed', 'op-fc15-det-dumpday', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-det-dumpday-household', 'op-fc15-det-dumpday', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-det-dumpday-roofing', 'op-fc15-det-dumpday', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-det-dumpday', 'op-fc15-det-dumpday', 'city-detroit', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-det-dd', 'Detroit Dumpsters', 'detroit-dumpsters', '313-246-8878', NULL, 'https://www.detroitdumpsters.com/',
  'Detroit roll-off rentals in 10–40 yard sizes serving Dearborn, Grosse Pointe, and Ann Arbor with same-day when available.', 'Detroit', 'MI', 42.3314, -83.0458,
  250, 800, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-det-dd-10', 'op-fc15-det-dd', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-det-dd-20', 'op-fc15-det-dd', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-det-dd-30', 'op-fc15-det-dd', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-det-dd-40', 'op-fc15-det-dd', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-det-dd-construction', 'op-fc15-det-dd', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-det-dd-mixed', 'op-fc15-det-dd', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-det-dd-household', 'op-fc15-det-dd', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-det-dd', 'op-fc15-det-dd', 'city-detroit', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-msp-a1', 'A-1 Hauling and Rolloffs', 'a-1-hauling-and-rolloffs', '763-444-6992', NULL, 'https://a1rolloffs.com/',
  'Twin Cities roll-off company with driveway-safe dumpsters, 10–40 yard sizes, and published rates from about $435.', 'Minneapolis', 'MN', 44.9778, -93.265,
  435, 715, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 86, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-a1-10', 'op-fc15-msp-a1', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-a1-15', 'op-fc15-msp-a1', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-a1-20', 'op-fc15-msp-a1', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-a1-30', 'op-fc15-msp-a1', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-a1-40', 'op-fc15-msp-a1', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-a1-construction', 'op-fc15-msp-a1', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-a1-mixed', 'op-fc15-msp-a1', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-a1-household', 'op-fc15-msp-a1', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-a1-concrete', 'op-fc15-msp-a1', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-msp-a1', 'op-fc15-msp-a1', 'city-minneapolis', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-msp-nordic', 'Nordic Waste', 'nordic-waste', '612-816-8500', NULL, 'https://nordic-waste.com/',
  'Minneapolis–St. Paul roll-off hauler with flat-rate pricing and live local dispatch.', 'Minneapolis', 'MN', 44.9778, -93.265,
  375, 700, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-nordic-10', 'op-fc15-msp-nordic', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-nordic-15', 'op-fc15-msp-nordic', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-nordic-20', 'op-fc15-msp-nordic', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-nordic-30', 'op-fc15-msp-nordic', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-nordic-construction', 'op-fc15-msp-nordic', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-nordic-mixed', 'op-fc15-msp-nordic', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-nordic-household', 'op-fc15-msp-nordic', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-nordic-roofing', 'op-fc15-msp-nordic', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-msp-nordic', 'op-fc15-msp-nordic', 'city-minneapolis', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-msp-american', 'American Dumpster Rental and Recycling', 'american-dumpster-rental-mn', '651-442-8960', NULL, 'https://www.americandumpstermn.com/',
  'Twin Cities dumpster rental and recycling for residential and contractor jobs.', 'Minneapolis', 'MN', 44.9778, -93.265,
  375, 700, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 81, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-american-10', 'op-fc15-msp-american', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-american-15', 'op-fc15-msp-american', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-american-20', 'op-fc15-msp-american', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-american-30', 'op-fc15-msp-american', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-american-construction', 'op-fc15-msp-american', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-american-mixed', 'op-fc15-msp-american', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-american-household', 'op-fc15-msp-american', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-msp-american', 'op-fc15-msp-american', 'city-minneapolis', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-msp-haulit', 'Haul It A Day', 'haul-it-a-day', '651-615-4423', NULL, 'https://www.haulitaday.com/',
  'Twin Cities dumpster service with 10/15/20 yard roll-offs.', 'Minneapolis', 'MN', 44.9778, -93.265,
  350, 650, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-haulit-10', 'op-fc15-msp-haulit', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-haulit-15', 'op-fc15-msp-haulit', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msp-haulit-20', 'op-fc15-msp-haulit', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-haulit-construction', 'op-fc15-msp-haulit', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-haulit-mixed', 'op-fc15-msp-haulit', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msp-haulit-household', 'op-fc15-msp-haulit', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-msp-haulit', 'op-fc15-msp-haulit', 'city-minneapolis', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-kc-uloadit', 'U-LOAD-IT Dumpsters', 'u-load-it-dumpsters', '816-537-5623', NULL, 'https://uloaditkc.com/',
  'Locally owned Kansas City dumpster rental since 1997 with same-day service and 1,000+ five-star reviews.', 'Kansas City', 'MO', 39.0997, -94.5786,
  325, 700, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 87, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-uloadit-10', 'op-fc15-kc-uloadit', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-uloadit-15', 'op-fc15-kc-uloadit', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-uloadit-20', 'op-fc15-kc-uloadit', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-uloadit-30', 'op-fc15-kc-uloadit', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-uloadit-40', 'op-fc15-kc-uloadit', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-uloadit-construction', 'op-fc15-kc-uloadit', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-uloadit-mixed', 'op-fc15-kc-uloadit', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-uloadit-household', 'op-fc15-kc-uloadit', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-kc-uloadit', 'op-fc15-kc-uloadit', 'city-kansas-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-kc-trashbox', 'The Trash Box', 'the-trash-box', '816-875-0028', NULL, 'https://thetrashboxkc.com/',
  'Kansas City roll-off company with published 12–20 yard rates from $299 and same-day claims.', 'Kansas City', 'MO', 39.0997, -94.5786,
  299, 399, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-trashbox-12', 'op-fc15-kc-trashbox', 12);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-trashbox-15', 'op-fc15-kc-trashbox', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-trashbox-20', 'op-fc15-kc-trashbox', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-trashbox-construction', 'op-fc15-kc-trashbox', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-trashbox-mixed', 'op-fc15-kc-trashbox', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-trashbox-household', 'op-fc15-kc-trashbox', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-kc-trashbox', 'op-fc15-kc-trashbox', 'city-kansas-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-kc-disposal', 'KC Disposal', 'kc-disposal', '816-388-9739', 'kcdisposal@gmail.com', 'https://kansascitydisposal.com/',
  'Kansas City dumpster rentals for residential and contractor jobs.', 'Kansas City', 'MO', 39.0997, -94.5786,
  325, 650, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-disposal-10', 'op-fc15-kc-disposal', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-disposal-15', 'op-fc15-kc-disposal', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-disposal-20', 'op-fc15-kc-disposal', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-kc-disposal-30', 'op-fc15-kc-disposal', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-disposal-construction', 'op-fc15-kc-disposal', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-disposal-mixed', 'op-fc15-kc-disposal', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-kc-disposal-household', 'op-fc15-kc-disposal', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-kc-disposal', 'op-fc15-kc-disposal', 'city-kansas-city', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-las-western', 'Western Elite', 'western-elite', '702-605-0655', NULL, 'https://westernelite.com/',
  'Las Vegas, Henderson, and Summerlin dumpster rental with a same-day delivery guarantee on 15–40 yard boxes.', 'Las Vegas', 'NV', 36.1699, -115.1398,
  350, 800, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 84, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-western-15', 'op-fc15-las-western', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-western-30', 'op-fc15-las-western', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-western-40', 'op-fc15-las-western', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-las-western-construction', 'op-fc15-las-western', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-las-western-mixed', 'op-fc15-las-western', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-las-western-household', 'op-fc15-las-western', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-las-western', 'op-fc15-las-western', 'city-las-vegas', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-las-grizzly', 'Grizzly Hauling and Junk', 'grizzly-hauling-and-junk', '702-628-7929', NULL, 'https://www.grizzlyhaulingandjunk.com/',
  'Las Vegas local hauling and roll-off with 10–40 yard dumpsters and driveway-friendly options.', 'Las Vegas', 'NV', 36.1699, -115.1398,
  325, 750, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-grizzly-10', 'op-fc15-las-grizzly', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-grizzly-15', 'op-fc15-las-grizzly', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-grizzly-20', 'op-fc15-las-grizzly', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-grizzly-30', 'op-fc15-las-grizzly', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-las-grizzly-40', 'op-fc15-las-grizzly', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-las-grizzly-construction', 'op-fc15-las-grizzly', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-las-grizzly-mixed', 'op-fc15-las-grizzly', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-las-grizzly-household', 'op-fc15-las-grizzly', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-las-grizzly', 'op-fc15-las-grizzly', 'city-las-vegas', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-pdx-oregonrec', 'Oregon Recycling', 'oregon-recycling', '503-720-2281', 'sales@oregon-recycling.com', 'https://oregon-recycling.com/',
  'Portland dumpster rental and junk removal with 15–25 yard roll-offs and published package pricing.', 'Portland', 'OR', 45.5152, -122.6784,
  275, 475, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pdx-oregonrec-15', 'op-fc15-pdx-oregonrec', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pdx-oregonrec-20', 'op-fc15-pdx-oregonrec', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pdx-oregonrec-25', 'op-fc15-pdx-oregonrec', 25);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pdx-oregonrec-construction', 'op-fc15-pdx-oregonrec', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pdx-oregonrec-mixed', 'op-fc15-pdx-oregonrec', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pdx-oregonrec-household', 'op-fc15-pdx-oregonrec', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-pdx-oregonrec', 'op-fc15-pdx-oregonrec', 'city-portland', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-pdx-bc', 'BC Haulers', 'bc-haulers', '971-301-5033', NULL, 'https://www.bchaulers.com/',
  'Portland and Salem junk removal, demolition, and roll-off dumpsters with a published 21-yard package.', 'Portland', 'OR', 45.5152, -122.6784,
  325, 550, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pdx-bc-15', 'op-fc15-pdx-bc', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pdx-bc-21', 'op-fc15-pdx-bc', 21);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pdx-bc-construction', 'op-fc15-pdx-bc', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pdx-bc-mixed', 'op-fc15-pdx-bc', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pdx-bc-household', 'op-fc15-pdx-bc', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-pdx-bc', 'op-fc15-pdx-bc', 'city-portland', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-sat-southtx', 'South Texas Dumpsters', 'south-texas-dumpsters', '210-372-8666', NULL, 'https://southtexasdumpsters.com/',
  'San Antonio roll-off company with 20–40 yard dumpsters for homes and construction sites.', 'San Antonio', 'TX', 29.4241, -98.4936,
  350, 750, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sat-southtx-20', 'op-fc15-sat-southtx', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sat-southtx-30', 'op-fc15-sat-southtx', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sat-southtx-40', 'op-fc15-sat-southtx', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sat-southtx-construction', 'op-fc15-sat-southtx', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sat-southtx-mixed', 'op-fc15-sat-southtx', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sat-southtx-household', 'op-fc15-sat-southtx', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-sat-southtx', 'op-fc15-sat-southtx', 'city-san-antonio', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-sat-txro', 'TX Roll Offs', 'tx-roll-offs', '210-903-3333', NULL, 'https://txrolloffs.com/',
  'San Antonio dumpster rental and roll-off service with 20–40 yard containers.', 'San Antonio', 'TX', 29.4241, -98.4936,
  350, 750, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 81, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sat-txro-20', 'op-fc15-sat-txro', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sat-txro-30', 'op-fc15-sat-txro', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sat-txro-40', 'op-fc15-sat-txro', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sat-txro-construction', 'op-fc15-sat-txro', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sat-txro-mixed', 'op-fc15-sat-txro', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sat-txro-household', 'op-fc15-sat-txro', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-sat-txro', 'op-fc15-sat-txro', 'city-san-antonio', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-jax-american', 'American Rolloffs', 'american-rolloffs', '904-605-1600', NULL, 'https://american-rolloffs.com/',
  'Northeast Florida same- or next-day roll-off delivery with 10–40 yard dumpsters and 14-day rentals.', 'Jacksonville', 'FL', 30.3322, -81.6557,
  350, 750, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-american-10', 'op-fc15-jax-american', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-american-15', 'op-fc15-jax-american', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-american-20', 'op-fc15-jax-american', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-american-30', 'op-fc15-jax-american', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-american-40', 'op-fc15-jax-american', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-american-construction', 'op-fc15-jax-american', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-american-mixed', 'op-fc15-jax-american', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-american-household', 'op-fc15-jax-american', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-jax-american', 'op-fc15-jax-american', 'city-jacksonville', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-jax-904', '904 Dumpster', '904-dumpster', '904-240-5598', NULL, 'https://www.904dumpster.com/',
  'Jacksonville dumpster rental starting at $299 with delivery, pickup, and disposal included on 10/15/20 yard boxes.', 'Jacksonville', 'FL', 30.3322, -81.6557,
  299, 550, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-904-10', 'op-fc15-jax-904', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-904-15', 'op-fc15-jax-904', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-904-20', 'op-fc15-jax-904', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-904-construction', 'op-fc15-jax-904', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-904-mixed', 'op-fc15-jax-904', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-904-household', 'op-fc15-jax-904', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-jax-904', 'op-fc15-jax-904', 'city-jacksonville', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-jax-shapells', 'Shapell''s Inc', 'shapells-inc', '904-786-5503', NULL, 'https://www.shapells.com/',
  'Jacksonville waste-management company offering roll-off dumpster rentals for homes and contractors.', 'Jacksonville', 'FL', 30.3322, -81.6557,
  350, 750, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-shapells-10', 'op-fc15-jax-shapells', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-shapells-20', 'op-fc15-jax-shapells', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-shapells-30', 'op-fc15-jax-shapells', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-jax-shapells-40', 'op-fc15-jax-shapells', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-shapells-construction', 'op-fc15-jax-shapells', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-shapells-mixed', 'op-fc15-jax-shapells', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-jax-shapells-household', 'op-fc15-jax-shapells', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-jax-shapells', 'op-fc15-jax-shapells', 'city-jacksonville', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-sf-citywide', 'Citywide Debris Box and Recycling', 'citywide-debris-box', '415-822-3688', NULL, 'https://www.citywidedebrisbox.com/',
  'San Francisco Bay Area debris-box hauler specializing in construction and demolition material.', 'San Francisco', 'CA', 37.7749, -122.4194,
  500, 1100, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sf-citywide-10', 'op-fc15-sf-citywide', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sf-citywide-20', 'op-fc15-sf-citywide', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sf-citywide-30', 'op-fc15-sf-citywide', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-sf-citywide-40', 'op-fc15-sf-citywide', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sf-citywide-construction', 'op-fc15-sf-citywide', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sf-citywide-mixed', 'op-fc15-sf-citywide', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-sf-citywide-concrete', 'op-fc15-sf-citywide', 'concrete');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-sf-citywide', 'op-fc15-sf-citywide', 'city-san-francisco', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-dc-eai', 'EAI Roll Off', 'eai-roll-off', '301-428-0822', NULL, 'https://eairolloff.com/',
  'Dumpster and roll-off service for Washington DC, Maryland, and Northern Virginia with 10–30 yard boxes.', 'Washington', 'DC', 38.9072, -77.0369,
  400, 850, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-dc-eai-10', 'op-fc15-dc-eai', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-dc-eai-15', 'op-fc15-dc-eai', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-dc-eai-20', 'op-fc15-dc-eai', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-dc-eai-30', 'op-fc15-dc-eai', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-dc-eai-construction', 'op-fc15-dc-eai', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-dc-eai-mixed', 'op-fc15-dc-eai', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-dc-eai-household', 'op-fc15-dc-eai', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-dc-eai', 'op-fc15-dc-eai', 'city-washington', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-dc-sel', 'SEL Hauling', 'sel-hauling', '301-330-0983', NULL, 'https://www.selhauling.com/roll-off-dumpster/',
  'Roll-off dumpsters within about 25 miles of DC, including 20- and 30-yard open containers.', 'Washington', 'DC', 38.9072, -77.0369,
  400, 800, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 78, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-dc-sel-20', 'op-fc15-dc-sel', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-dc-sel-30', 'op-fc15-dc-sel', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-dc-sel-construction', 'op-fc15-dc-sel', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-dc-sel-mixed', 'op-fc15-dc-sel', 'mixed');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-dc-sel', 'op-fc15-dc-sel', 'city-washington', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-phx-aros', 'Arizona Roll-Off Services', 'arizona-roll-off-services', '480-725-7240', NULL, 'https://www.arizonarolloffservices.com/',
  'Phoenix front-load and roll-off dumpster rental company serving the East Valley.', 'Phoenix', 'AZ', 33.4484, -112.074,
  325, 650, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phx-aros-10', 'op-fc15-phx-aros', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phx-aros-20', 'op-fc15-phx-aros', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phx-aros-30', 'op-fc15-phx-aros', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-phx-aros-40', 'op-fc15-phx-aros', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phx-aros-construction', 'op-fc15-phx-aros', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phx-aros-mixed', 'op-fc15-phx-aros', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-phx-aros-household', 'op-fc15-phx-aros', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-phx-aros', 'op-fc15-phx-aros', 'city-phoenix', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-bal-ace', 'ACE Roll Off', 'ace-roll-off', '410-288-3867', 'acerolloff@288dump.com', 'https://www.acerolloff.com/',
  'Locally owned Baltimore dumpster rental with 10–40 yard roll-offs and same-day options.', 'Baltimore', 'MD', 39.2904, -76.6122,
  350, 750, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-ace-10', 'op-fc15-bal-ace', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-ace-15', 'op-fc15-bal-ace', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-ace-20', 'op-fc15-bal-ace', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-ace-30', 'op-fc15-bal-ace', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-ace-40', 'op-fc15-bal-ace', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bal-ace-construction', 'op-fc15-bal-ace', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bal-ace-mixed', 'op-fc15-bal-ace', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bal-ace-household', 'op-fc15-bal-ace', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-bal-ace', 'op-fc15-bal-ace', 'city-baltimore', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-bal-86', '86 Dumpster', '86-dumpster', '443-671-1850', 'info@86dumpsters.com', 'https://86dumpster.com/',
  'White Marsh, Maryland roll-off company serving Baltimore with 10–30 yard dumpsters and published rates from $409.', 'Baltimore', 'MD', 39.2904, -76.6122,
  409, 597, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-86-10', 'op-fc15-bal-86', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-86-15', 'op-fc15-bal-86', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-86-20', 'op-fc15-bal-86', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-86-25', 'op-fc15-bal-86', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bal-86-30', 'op-fc15-bal-86', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bal-86-construction', 'op-fc15-bal-86', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bal-86-mixed', 'op-fc15-bal-86', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bal-86-household', 'op-fc15-bal-86', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-bal-86', 'op-fc15-bal-86', 'city-baltimore', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-bhm-daddy', 'Dumpster Daddy', 'dumpster-daddy', '205-447-8044', NULL, 'https://www.dumpsterdaddyal.com/',
  'Locally owned Birmingham roll-off hauler with 15–40 yard dumpsters and same-day service.', 'Birmingham', 'AL', 33.5186, -86.8104,
  325, 700, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 85, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bhm-daddy-15', 'op-fc15-bhm-daddy', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bhm-daddy-20', 'op-fc15-bhm-daddy', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bhm-daddy-25', 'op-fc15-bhm-daddy', 25);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bhm-daddy-30', 'op-fc15-bhm-daddy', 30);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-bhm-daddy-40', 'op-fc15-bhm-daddy', 40);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bhm-daddy-construction', 'op-fc15-bhm-daddy', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bhm-daddy-mixed', 'op-fc15-bhm-daddy', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bhm-daddy-household', 'op-fc15-bhm-daddy', 'household');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-bhm-daddy-roofing', 'op-fc15-bhm-daddy', 'roofing');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-bhm-daddy', 'op-fc15-bhm-daddy', 'city-birmingham', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-lou-wastenow', 'Waste Now', 'waste-now', '502-969-7684', NULL, 'https://www.wastenow.com/',
  'Local Louisville dumpster and porta-potty company for residential and construction jobs.', 'Louisville', 'KY', 38.2527, -85.7585,
  325, 650, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 83, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-lou-wastenow-10', 'op-fc15-lou-wastenow', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-lou-wastenow-15', 'op-fc15-lou-wastenow', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-lou-wastenow-20', 'op-fc15-lou-wastenow', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-lou-wastenow-30', 'op-fc15-lou-wastenow', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-lou-wastenow-construction', 'op-fc15-lou-wastenow', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-lou-wastenow-mixed', 'op-fc15-lou-wastenow', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-lou-wastenow-household', 'op-fc15-lou-wastenow', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-lou-wastenow', 'op-fc15-lou-wastenow', 'city-louisville', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-msy-engulf', 'EnGulf Waste', 'engulf-waste', '504-429-3867', 'admin@engulfwaste.com', 'https://engulfwaste.com/',
  'New Orleans dumpster rental claiming same-day delivery for homes and construction sites.', 'New Orleans', 'LA', 29.9511, -90.0715,
  350, 700, NULL, NULL, NULL,
  0, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msy-engulf-10', 'op-fc15-msy-engulf', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msy-engulf-15', 'op-fc15-msy-engulf', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msy-engulf-20', 'op-fc15-msy-engulf', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-msy-engulf-30', 'op-fc15-msy-engulf', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msy-engulf-construction', 'op-fc15-msy-engulf', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msy-engulf-mixed', 'op-fc15-msy-engulf', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-msy-engulf-household', 'op-fc15-msy-engulf', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-msy-engulf', 'op-fc15-msy-engulf', 'city-new-orleans', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-pvd-rhody', 'Rhody Disposal', 'rhody-disposal', '401-633-4465', 'info@rhodydisposal.com', 'https://www.rhodydisposal.com/',
  'Rhode Island roll-off and junk removal serving Providence and the surrounding cities.', 'Providence', 'RI', 41.8236, -71.4222,
  350, 700, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pvd-rhody-10', 'op-fc15-pvd-rhody', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pvd-rhody-15', 'op-fc15-pvd-rhody', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pvd-rhody-20', 'op-fc15-pvd-rhody', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-pvd-rhody-30', 'op-fc15-pvd-rhody', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pvd-rhody-construction', 'op-fc15-pvd-rhody', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pvd-rhody-mixed', 'op-fc15-pvd-rhody', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-pvd-rhody-household', 'op-fc15-pvd-rhody', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-pvd-rhody', 'op-fc15-pvd-rhody', 'city-providence', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-hfd-talkin', 'Talkin Trash CT', 'talkin-trash-ct', '860-604-1941', NULL, 'https://www.talkintrashct.com/',
  'Greater Hartford dumpster rental with driveway-friendly 12–20 yard boxes.', 'Hartford', 'CT', 41.7658, -72.6734,
  350, 650, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 81, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-hfd-talkin-12', 'op-fc15-hfd-talkin', 12);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-hfd-talkin-15', 'op-fc15-hfd-talkin', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-hfd-talkin-20', 'op-fc15-hfd-talkin', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-hfd-talkin-construction', 'op-fc15-hfd-talkin', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-hfd-talkin-mixed', 'op-fc15-hfd-talkin', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-hfd-talkin-household', 'op-fc15-hfd-talkin', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-hfd-talkin', 'op-fc15-hfd-talkin', 'city-hartford', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-hfd-hippo', 'Hippo Hartford Dumpster Rental', 'hippo-hartford-dumpster-rental', '860-502-2519', NULL, 'https://hippodumpsterct.com/',
  'Hartford-area 10/15/20 yard dumpster rentals with same-day options.', 'Hartford', 'CT', 41.7658, -72.6734,
  325, 600, NULL, NULL, NULL,
  1, NULL, 1, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 79, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-hfd-hippo-10', 'op-fc15-hfd-hippo', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-hfd-hippo-15', 'op-fc15-hfd-hippo', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-hfd-hippo-20', 'op-fc15-hfd-hippo', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-hfd-hippo-construction', 'op-fc15-hfd-hippo', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-hfd-hippo-mixed', 'op-fc15-hfd-hippo', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-hfd-hippo-household', 'op-fc15-hfd-hippo', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-hfd-hippo', 'op-fc15-hfd-hippo', 'city-hartford', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-fsd-605', '605 Hauling', '605-hauling', '605-553-0711', '605hauling@gmail.com', 'https://www.605hauling.com/',
  'Sioux Falls driveway-safe dumpsters in 12–20 yard sizes.', 'Sioux Falls', 'SD', 43.5446, -96.7311,
  325, 600, NULL, NULL, NULL,
  1, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 82, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-fsd-605-12', 'op-fc15-fsd-605', 12);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-fsd-605-17', 'op-fc15-fsd-605', 17);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-fsd-605-20', 'op-fc15-fsd-605', 20);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-fsd-605-construction', 'op-fc15-fsd-605', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-fsd-605-mixed', 'op-fc15-fsd-605', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-fsd-605-household', 'op-fc15-fsd-605', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-fsd-605', 'op-fc15-fsd-605', 'city-sioux-falls', NULL);

INSERT OR IGNORE INTO operators (
  id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng,
  pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate,
  driveway_suitable, driveway_notes, same_day_capable, is_broker,
  verification_status, last_verified_at, verified_by, verification_notes,
  insurance_verified, license_notes, quality_score, is_published, is_demo, claim_status, complimentary_leads_remaining
) VALUES (
  'op-fc15-mht-ktown', 'K-Town Disposal', 'k-town-disposal', '603-386-0386', 'info@ktowndisposal.com', 'https://www.ktowndisposal.com/dumpster-rentals/manchester/',
  'Manchester, New Hampshire dumpster rentals for homes and job sites.', 'Manchester', 'NH', 42.9956, -71.4548,
  350, 700, NULL, NULL, NULL,
  0, NULL, 0, 0,
  'verified', datetime('now'), 'firecrawl-2026-08-15', 'Firecrawl web research 2026-08-15: public phone/website from company site. Local hauler (not a national broker). Phone call for insurance/license still recommended before paid ads.',
  0, NULL, 80, 1, 0, 'unclaimed', 1
);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-mht-ktown-10', 'op-fc15-mht-ktown', 10);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-mht-ktown-15', 'op-fc15-mht-ktown', 15);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-mht-ktown-20', 'op-fc15-mht-ktown', 20);
INSERT OR IGNORE INTO operator_sizes (id, operator_id, yards) VALUES ('sz-op-fc15-mht-ktown-30', 'op-fc15-mht-ktown', 30);
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-mht-ktown-construction', 'op-fc15-mht-ktown', 'construction');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-mht-ktown-mixed', 'op-fc15-mht-ktown', 'mixed');
INSERT OR IGNORE INTO operator_materials (id, operator_id, material) VALUES ('mt-op-fc15-mht-ktown-household', 'op-fc15-mht-ktown', 'household');
INSERT OR IGNORE INTO operator_service_areas (id, operator_id, city_id, zip) VALUES ('sa-op-fc15-mht-ktown', 'op-fc15-mht-ktown', 'city-manchester', NULL);

UPDATE cities SET is_priority = 1, updated_at = datetime('now') WHERE id IN ('city-baltimore', 'city-birmingham', 'city-boston', 'city-charlotte', 'city-chicago', 'city-columbus', 'city-detroit', 'city-hartford', 'city-indianapolis', 'city-jacksonville', 'city-kansas-city', 'city-las-vegas', 'city-louisville', 'city-manchester', 'city-minneapolis', 'city-nashville', 'city-new-orleans', 'city-new-york', 'city-oklahoma-city', 'city-philadelphia', 'city-phoenix', 'city-portland', 'city-providence', 'city-san-antonio', 'city-san-francisco', 'city-seattle', 'city-sioux-falls', 'city-tulsa', 'city-washington');

