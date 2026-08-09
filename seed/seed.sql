-- Find A Dumpster seed data
-- Cities are real priority metros.
-- Operators below are SEEDED PLACEHOLDERS for development and demo purposes.
-- They use placeholder contact info. Before any production marketing or paid traffic:
--   1. Verify every phone, website, and address with the actual business.
--   2. Re-verify insurance/license notes.
--   3. Update last_verified_at and verification_notes.
--   4. Consider setting is_demo=1 only for clearly fake testing entries.

DELETE FROM operator_service_areas;
DELETE FROM operator_materials;
DELETE FROM operator_sizes;
DELETE FROM leads;
DELETE FROM events;
DELETE FROM admin_audit;
DELETE FROM operators;
DELETE FROM cities;

-- Cities (real priority metros)
INSERT INTO cities (id, name, state, slug, state_slug, lat, lng, local_permit_summary, typical_pricing_notes, special_rules, is_priority) VALUES
('city-houston', 'Houston', 'TX', 'houston', 'tx', 29.7604, -95.3698,
 'Street placement usually requires a city right-of-way permit. Private driveway placement typically does not. HOAs may add restrictions.',
 'Typical residential roll-off: $350–$650 for 10–20 yd with ~1–2 tons included. Overage often $50–$100/ton. Concrete-only loads price differently.',
 'Watch for soft soil after storms; request plywood under rails for driveways.', 1),
('city-dallas', 'Dallas', 'TX', 'dallas', 'tx', 32.7767, -96.7970,
 'Dallas requires permits for dumpsters in the public right-of-way. Confirm with Public Works for street placement.',
 'Expect $325–$600 for common residential sizes. Weight limits matter on heavy debris (roofing, dirt).',
 'Many operators serve DFW metro; confirm exact ZIP coverage.', 1),
('city-austin', 'Austin', 'TX', 'austin', 'tx', 30.2672, -97.7431,
 'Austin ROW permits required for street placement. Residential driveway usually OK with owner permission.',
 'Typical range $375–$700 depending on size and dump fees. Green waste may have separate pricing.',
 'Steep lots and limited alley access are common — ask about truck clearance.', 1),
('city-miami', 'Miami', 'FL', 'miami', 'fl', 25.7617, -80.1918,
 'Miami-Dade and municipal rules vary. Street placement often needs a permit; condo boards frequently require approval.',
 'Coastal markets run higher: often $400–$750 for 10–20 yd. Storm debris surges can affect availability.',
 'Hurricane season demand spikes; book early after storms.', 1),
('city-orlando', 'Orlando', 'FL', 'orlando', 'fl', 28.5383, -81.3792,
 'City of Orlando and Orange County have separate ROW rules. Verify jurisdiction before street placement.',
 'Typical $350–$650 residential. Yard waste and construction debris are widely accepted; hazardous materials are not.',
 'Theme-park-area traffic can delay delivery windows.', 1),
('city-tampa', 'Tampa', 'FL', 'tampa', 'fl', 27.9506, -82.4572,
 'Tampa ROW permit required for public streets. Private property placement preferred when possible.',
 'Common pricing $340–$620. Heavy materials (concrete, dirt) often need dedicated containers.',
 'Flood-prone zones: place dumpsters on high ground when possible.', 1),
('city-los-angeles', 'Los Angeles', 'CA', 'los-angeles', 'ca', 34.0522, -118.2437,
 'LA Bureau of Street Services permits required for street placement. Many neighborhoods have strict rules and limited windows.',
 'Higher cost market: $450–$900+ common. Dump fees and hauling distance drive price. Always confirm all-in quote.',
 'Narrow streets and parking restrictions are frequent. Confirm truck access.', 1),
('city-phoenix', 'Phoenix', 'AZ', 'phoenix', 'az', 33.4484, -112.0740,
 'Phoenix requires permits for dumpsters in the right-of-way. Driveway placement is preferred.',
 'Typical $300–$550 for standard residential. Dirt and concrete often separate.',
 'Extreme heat: some operators limit afternoon deliveries in summer.', 1),
('city-atlanta', 'Atlanta', 'GA', 'atlanta', 'ga', 33.7490, -84.3880,
 'City of Atlanta and metro cities each set ROW rules. Confirm the correct municipality.',
 'Typical $325–$600. Mixed construction loads common; paint and chemicals restricted.',
 'Hilly lots and tree canopy can limit truck approach — share access photos when possible.', 1),
('city-denver', 'Denver', 'CO', 'denver', 'co', 39.7392, -104.9903,
 'Denver requires a ROW permit for street dumpsters. Alleys may have separate rules.',
 'Typical $350–$650. Weight limits matter with dense materials. Winter delays possible.',
 'Snow and ice: confirm driveway protection and placement surface.', 1);

-- ============================================
-- SEEDED OPERATORS (placeholders, not live data)
-- All is_demo = 0 so they appear in production-like views.
-- Replace with actually verified real operators before marketing.
-- ============================================

INSERT INTO operators (id, name, slug, phone, email, website, description, hq_city, hq_state, hq_lat, hq_lng, pricing_min, pricing_max, pricing_notes, included_tonnage, overage_rate, driveway_suitable, driveway_notes, same_day_capable, is_broker, verification_status, last_verified_at, verified_by, verification_notes, insurance_verified, license_notes, quality_score, is_published, is_demo) VALUES
-- Houston
('op-htx-1', 'Lone Star Container Services', 'lone-star-container-services', '713-555-0140', 'dispatch@lonestarcontainers.example', NULL, 'Houston-area roll-off focused on residential cleanouts and light construction. Offers plywood protection on request.', 'Houston', 'TX', 29.74, -95.36, 365, 625, 'Includes up to 7 days and 2 tons. Overage billed per ton. Street permits extra.', 2.0, 78, 1, 'Plywood included for driveway jobs when requested.', 1, 0, 'verified', '2025-08-01', 'seed', 'SEED PLACEHOLDER — verify phone, website, and insurance before production use.', 1, 'Texas waste hauler permit (verify current)', 88, 1, 0),
('op-htx-2', 'Gulf Coast Roll Off', 'gulf-coast-roll-off', '713-555-0192', NULL, 'https://example.com/gulfcoastrolloff', 'Family-run hauler serving Houston and surrounding counties. Good for remodel and roofing debris.', 'Houston', 'TX', 29.79, -95.41, 340, 590, '10- and 15-yard flat-rate packages sometimes available for cleanouts.', 1.5, 82, 1, 'Boards provided for most residential driveways.', 1, 0, 'verified', '2025-07-28', 'seed', 'SEED PLACEHOLDER — verify all details.', 1, NULL, 85, 1, 0),

-- Dallas / DFW
('op-dfw-1', 'Metroplex Roll-Off Co', 'metroplex-roll-off-co', '214-555-0233', 'quotes@metroplexrolloff.example', NULL, 'DFW local operator covering Dallas, Fort Worth, and many suburbs. Strong on residential driveway jobs.', 'Dallas', 'TX', 32.79, -96.81, 335, 595, 'Standard 7–10 day rentals. Volume pricing on multi-container jobs.', 2.0, 72, 1, 'Driveway boards available on request.', 1, 0, 'verified', '2025-08-02', 'seed', 'SEED PLACEHOLDER — verify phone and coverage area.', 1, NULL, 87, 1, 0),
('op-dfw-2', 'North Texas Hauling', 'north-texas-hauling', '214-555-0278', NULL, NULL, 'Serves Dallas proper and nearby cities. Handles mixed debris and roofing well.', 'Dallas', 'TX', 32.82, -96.77, 355, 610, 'Ask about no-overage packages on smaller loads.', 1.5, 85, 1, NULL, 0, 0, 'verified', '2025-07-20', 'seed', 'SEED PLACEHOLDER — verify all contact and service details.', 0, NULL, 79, 1, 0),

-- Austin
('op-atx-1', 'Capital City Containers', 'capital-city-containers', '512-555-0311', 'hello@capitalcitycontainers.example', NULL, 'Austin residential and remodel specialist. Clear pricing and driveway-friendly options.', 'Austin', 'TX', 30.28, -97.75, 375, 680, '1.5–2 tons typical. Green waste pricing may differ.', 1.5, 92, 1, 'Good track record on suburban driveways and limited-access lots.', 1, 0, 'verified', '2025-08-03', 'seed', 'SEED PLACEHOLDER — verify before marketing.', 1, NULL, 84, 1, 0),

-- Miami
('op-mia-1', 'Biscayne Bay Roll Off', 'biscayne-bay-roll-off', '305-555-0422', 'info@biscaynebayrolloff.example', NULL, 'Miami-Dade focused residential and light commercial. Experience with condo and storm-related debris.', 'Miami', 'FL', 25.78, -80.21, 425, 765, 'Higher dump fees reflected. Confirm all-in quote including permits.', 1.5, 115, 1, 'Plywood recommended on pavers and tile.', 0, 0, 'verified', '2025-07-25', 'seed', 'SEED PLACEHOLDER — verify phone and current rates.', 1, NULL, 82, 1, 0),

-- Orlando
('op-orl-1', 'Central Florida Dumpsters', 'central-florida-dumpsters', '407-555-0515', NULL, NULL, 'Orange and Seminole County coverage. Flexible rental periods for homeowners and contractors.', 'Orlando', 'FL', 28.55, -81.39, 349, 615, NULL, 2.0, 78, 1, NULL, 1, 0, 'verified', '2025-07-30', 'seed', 'SEED PLACEHOLDER — verify service area and contact.', 1, NULL, 80, 1, 0),

-- Tampa
('op-tpa-1', 'Tampa Bay Container Co', 'tampa-bay-container-co', '813-555-0618', 'dispatch@tampabaycontainer.example', NULL, 'Local Tampa Bay roll-off for homes and small commercial. Driveway protection emphasized.', 'Tampa', 'FL', 27.96, -82.46, 329, 585, NULL, 1.5, 75, 1, 'Underlayment standard on most residential drops.', 1, 0, 'verified', '2025-08-01', 'seed', 'SEED PLACEHOLDER — verify before use.', 1, NULL, 86, 1, 0),

-- Los Angeles
('op-la-1', 'SoCal Roll Off Services', 'socal-roll-off-services', '213-555-0725', NULL, 'https://example.com/socalrolloff', 'Los Angeles County residential and remodel hauler. Helps with permit guidance on request.', 'Los Angeles', 'CA', 34.04, -118.26, 485, 875, 'All-in quotes strongly recommended due to variable dump fees.', 1.5, 135, 1, 'Plywood and street mats often required in dense areas.', 0, 0, 'verified', '2025-07-22', 'seed', 'SEED PLACEHOLDER — verify licensing and current pricing.', 1, 'CA waste hauler (verify current status)', 78, 1, 0),

-- Phoenix
('op-phx-1', 'Valley Roll Off', 'valley-roll-off', '602-555-0833', 'quotes@valleyrolloff.example', NULL, 'Phoenix metro residential specialist. Offers dedicated concrete/dirt boxes.', 'Phoenix', 'AZ', 33.46, -112.06, 305, 535, 'Concrete and dirt often priced separately with higher included tonnage.', 2.5, 68, 1, NULL, 1, 0, 'verified', '2025-08-04', 'seed', 'SEED PLACEHOLDER — verify phone and heat-season policies.', 1, NULL, 83, 1, 0),

-- Atlanta
('op-atl-1', 'Peachtree Roll Off', 'peachtree-roll-off', '404-555-0944', NULL, NULL, 'Atlanta and surrounding counties. Driveway-friendly residential focus.', 'Atlanta', 'GA', 33.76, -84.40, 335, 595, NULL, 2.0, 72, 1, 'Boards and protection available.', 1, 0, 'verified', '2025-07-18', 'seed', 'SEED PLACEHOLDER — verify all details.', 1, NULL, 81, 1, 0),

-- Denver
('op-den-1', 'Front Range Containers', 'front-range-containers', '303-555-1027', 'hello@frontrangecontainers.example', NULL, 'Denver metro and Front Range. Handles winter weather logistics and driveway protection.', 'Denver', 'CO', 39.74, -104.99, 365, 645, 'Weather delays common in winter — confirm timing.', 1.5, 88, 1, NULL, 0, 0, 'verified', '2025-07-27', 'seed', 'SEED PLACEHOLDER — verify before marketing.', 1, NULL, 79, 1, 0),

-- Broker example (useful for testing the broker filter)
('op-broker-1', 'National Dumpster Network', 'national-dumpster-network', '800-555-0001', 'leads@nationaldumpsternetwork.example', 'https://example.com/ndn', 'National lead broker that routes to local haulers. Clearly labeled as broker.', 'Dallas', 'TX', 32.78, -96.80, 420, 950, 'Final price depends on local partner selected. Not a direct hauler.', 1.0, 110, 1, NULL, 1, 1, 'verified', '2025-05-15', 'seed', 'Demo broker for filter testing. Keep for QA.', 0, NULL, 35, 1, 0),

-- Pending example (for admin queue testing)
('op-pending-1', 'Example Pending Hauler', 'example-pending-hauler', '555-555-0199', 'pending@example.com', NULL, 'Placeholder pending operator to test the verification workflow.', 'Houston', 'TX', 29.76, -95.37, 300, 500, NULL, 1.0, 55, 1, NULL, 0, 0, 'pending', NULL, NULL, 'Awaiting phone + website verification. For admin testing only.', 0, NULL, 45, 0, 0);

-- Sizes for seeded operators
INSERT INTO operator_sizes (id, operator_id, yards) VALUES
('sz-htx1-10', 'op-htx-1', 10), ('sz-htx1-15', 'op-htx-1', 15), ('sz-htx1-20', 'op-htx-1', 20), ('sz-htx1-30', 'op-htx-1', 30),
('sz-htx2-10', 'op-htx-2', 10), ('sz-htx2-15', 'op-htx-2', 15), ('sz-htx2-20', 'op-htx-2', 20), ('sz-htx2-30', 'op-htx-2', 30),
('sz-dfw1-10', 'op-dfw-1', 10), ('sz-dfw1-15', 'op-dfw-1', 15), ('sz-dfw1-20', 'op-dfw-1', 20), ('sz-dfw1-30', 'op-dfw-1', 30),
('sz-dfw2-10', 'op-dfw-2', 10), ('sz-dfw2-15', 'op-dfw-2', 15), ('sz-dfw2-20', 'op-dfw-2', 20),
('sz-atx1-10', 'op-atx-1', 10), ('sz-atx1-15', 'op-atx-1', 15), ('sz-atx1-20', 'op-atx-1', 20), ('sz-atx1-30', 'op-atx-1', 30),
('sz-mia1-10', 'op-mia-1', 10), ('sz-mia1-15', 'op-mia-1', 15), ('sz-mia1-20', 'op-mia-1', 20), ('sz-mia1-30', 'op-mia-1', 30),
('sz-orl1-10', 'op-orl-1', 10), ('sz-orl1-15', 'op-orl-1', 15), ('sz-orl1-20', 'op-orl-1', 20), ('sz-orl1-30', 'op-orl-1', 30),
('sz-tpa1-10', 'op-tpa-1', 10), ('sz-tpa1-15', 'op-tpa-1', 15), ('sz-tpa1-20', 'op-tpa-1', 20), ('sz-tpa1-30', 'op-tpa-1', 30),
('sz-la1-10', 'op-la-1', 10), ('sz-la1-15', 'op-la-1', 15), ('sz-la1-20', 'op-la-1', 20), ('sz-la1-30', 'op-la-1', 30), ('sz-la1-40', 'op-la-1', 40),
('sz-phx1-10', 'op-phx-1', 10), ('sz-phx1-15', 'op-phx-1', 15), ('sz-phx1-20', 'op-phx-1', 20), ('sz-phx1-30', 'op-phx-1', 30),
('sz-atl1-10', 'op-atl-1', 10), ('sz-atl1-15', 'op-atl-1', 15), ('sz-atl1-20', 'op-atl-1', 20), ('sz-atl1-30', 'op-atl-1', 30),
('sz-den1-10', 'op-den-1', 10), ('sz-den1-15', 'op-den-1', 15), ('sz-den1-20', 'op-den-1', 20), ('sz-den1-30', 'op-den-1', 30),
('sz-brk-10', 'op-broker-1', 10), ('sz-brk-20', 'op-broker-1', 20), ('sz-brk-30', 'op-broker-1', 30), ('sz-brk-40', 'op-broker-1', 40),
('sz-pend-10', 'op-pending-1', 10), ('sz-pend-15', 'op-pending-1', 15), ('sz-pend-20', 'op-pending-1', 20);

-- Materials
INSERT INTO operator_materials (id, operator_id, material) VALUES
('mt-htx1-c', 'op-htx-1', 'construction'), ('mt-htx1-m', 'op-htx-1', 'mixed'), ('mt-htx1-h', 'op-htx-1', 'household'), ('mt-htx1-r', 'op-htx-1', 'roofing'),
('mt-htx2-c', 'op-htx-2', 'construction'), ('mt-htx2-m', 'op-htx-2', 'mixed'), ('mt-htx2-h', 'op-htx-2', 'household'), ('mt-htx2-y', 'op-htx-2', 'yard'),
('mt-dfw1-c', 'op-dfw-1', 'construction'), ('mt-dfw1-m', 'op-dfw-1', 'mixed'), ('mt-dfw1-h', 'op-dfw-1', 'household'), ('mt-dfw1-r', 'op-dfw-1', 'roofing'),
('mt-dfw2-c', 'op-dfw-2', 'construction'), ('mt-dfw2-m', 'op-dfw-2', 'mixed'), ('mt-dfw2-h', 'op-dfw-2', 'household'),
('mt-atx1-c', 'op-atx-1', 'construction'), ('mt-atx1-m', 'op-atx-1', 'mixed'), ('mt-atx1-h', 'op-atx-1', 'household'), ('mt-atx1-y', 'op-atx-1', 'yard'),
('mt-mia1-c', 'op-mia-1', 'construction'), ('mt-mia1-m', 'op-mia-1', 'mixed'), ('mt-mia1-h', 'op-mia-1', 'household'),
('mt-orl1-c', 'op-orl-1', 'construction'), ('mt-orl1-m', 'op-orl-1', 'mixed'), ('mt-orl1-h', 'op-orl-1', 'household'), ('mt-orl1-y', 'op-orl-1', 'yard'),
('mt-tpa1-c', 'op-tpa-1', 'construction'), ('mt-tpa1-m', 'op-tpa-1', 'mixed'), ('mt-tpa1-h', 'op-tpa-1', 'household'),
('mt-la1-c', 'op-la-1', 'construction'), ('mt-la1-m', 'op-la-1', 'mixed'), ('mt-la1-h', 'op-la-1', 'household'), ('mt-la1-r', 'op-la-1', 'roofing'),
('mt-phx1-c', 'op-phx-1', 'construction'), ('mt-phx1-con', 'op-phx-1', 'concrete'), ('mt-phx1-m', 'op-phx-1', 'mixed'),
('mt-atl1-c', 'op-atl-1', 'construction'), ('mt-atl1-m', 'op-atl-1', 'mixed'), ('mt-atl1-h', 'op-atl-1', 'household'),
('mt-den1-c', 'op-den-1', 'construction'), ('mt-den1-m', 'op-den-1', 'mixed'), ('mt-den1-h', 'op-den-1', 'household'), ('mt-den1-r', 'op-den-1', 'roofing'),
('mt-brk-c', 'op-broker-1', 'construction'), ('mt-brk-m', 'op-broker-1', 'mixed'), ('mt-brk-h', 'op-broker-1', 'household'),
('mt-pend-c', 'op-pending-1', 'construction'), ('mt-pend-m', 'op-pending-1', 'mixed'), ('mt-pend-h', 'op-pending-1', 'household');

-- Service areas (tie operators to cities + sample ZIPs)
INSERT INTO operator_service_areas (id, operator_id, city_id, zip) VALUES
('sa-htx1a', 'op-htx-1', 'city-houston', '77002'), ('sa-htx1b', 'op-htx-1', 'city-houston', '77019'),
('sa-htx2a', 'op-htx-2', 'city-houston', '77006'), ('sa-htx2b', 'op-htx-2', 'city-houston', '77008'),
('sa-dfw1a', 'op-dfw-1', 'city-dallas', '75201'), ('sa-dfw1b', 'op-dfw-1', 'city-dallas', '75204'),
('sa-dfw2a', 'op-dfw-2', 'city-dallas', '75207'),
('sa-atx1a', 'op-atx-1', 'city-austin', '78701'), ('sa-atx1b', 'op-atx-1', 'city-austin', '78704'),
('sa-mia1a', 'op-mia-1', 'city-miami', '33130'), ('sa-mia1b', 'op-mia-1', 'city-miami', '33132'),
('sa-orl1a', 'op-orl-1', 'city-orlando', '32801'), ('sa-orl1b', 'op-orl-1', 'city-orlando', '32803'),
('sa-tpa1a', 'op-tpa-1', 'city-tampa', '33602'), ('sa-tpa1b', 'op-tpa-1', 'city-tampa', '33606'),
('sa-la1a', 'op-la-1', 'city-los-angeles', '90012'), ('sa-la1b', 'op-la-1', 'city-los-angeles', '90015'),
('sa-phx1a', 'op-phx-1', 'city-phoenix', '85003'), ('sa-phx1b', 'op-phx-1', 'city-phoenix', '85004'),
('sa-atl1a', 'op-atl-1', 'city-atlanta', '30303'), ('sa-atl1b', 'op-atl-1', 'city-atlanta', '30308'),
('sa-den1a', 'op-den-1', 'city-denver', '80202'), ('sa-den1b', 'op-den-1', 'city-denver', '80203'),
('sa-brk1', 'op-broker-1', 'city-dallas', '75201'), ('sa-brk2', 'op-broker-1', 'city-houston', '77002'),
('sa-pend1', 'op-pending-1', 'city-houston', '77002');
