-- Pricing validation (2026-11-25).
-- Each published price range was checked against the operator's own website.
-- Ranges that the site backs up are set to the published low/high standard roll-off price.
-- Ranges the site does not back up (quote-only, no prices, dead/redirected site) are cleared,
-- so the listing shows "Request quote for pricing" instead of an estimate.

-- Validated against published prices.
-- https://86dumpster.com/ — 10–30 yd, 14-day; rock/dirt-only box excluded
UPDATE operators SET pricing_min = 409, pricing_max = 589, updated_at = datetime('now') WHERE id = 'op-fc15-bal-86';
-- https://www.homestead-disposal.com/dumpster-rental-prices-sizes/ — 7–15 yd 'starting price' cards
UPDATE operators SET pricing_min = 525, pricing_max = 725, updated_at = datetime('now') WHERE id = 'op-fc15-bos-homestead';
-- https://brackenbox.com/ — 10–30 yd 'from', 1 week
UPDATE operators SET pricing_min = 395, pricing_max = 495, updated_at = datetime('now') WHERE id = 'op-fc15-chi-brackenbox';
-- https://mobiledumps.com/locations/il/chicagoland/ — 14 yd trailer dumpster, 1–3 day
UPDATE operators SET pricing_min = 409, pricing_max = 449, updated_at = datetime('now') WHERE id = 'op-fc15-chi-mobile';
-- https://www.ready2rollhauling.com/ — 12/15/21 yd, up to 7 days
UPDATE operators SET pricing_min = 370, pricing_max = 450, updated_at = datetime('now') WHERE id = 'op-fc15-chi-r2r';
-- https://www.a1dumpsterrentals.com/north-carolina/ — 12–30 yd, 7-day, Charlotte
UPDATE operators SET pricing_min = 375, pricing_max = 575, updated_at = datetime('now') WHERE id = 'op-fc15-clt-a1';
-- https://regencyhauling.com/ — 10–40 yd 'starting at'
UPDATE operators SET pricing_min = 330, pricing_max = 550, updated_at = datetime('now') WHERE id = 'op-fc15-clt-regency';
-- https://affordabledumpsterscolumbus.com/ — 10–20 yd, up to 5 days (old domain redirects here)
UPDATE operators SET pricing_min = 275, pricing_max = 375, updated_at = datetime('now') WHERE id = 'op-fc15-cmh-affordable';
-- https://froghauling.com/ — 6–30 yd flat rate incl. tax
UPDATE operators SET pricing_min = 308, pricing_max = 579, updated_at = datetime('now') WHERE id = 'op-fc15-cmh-frog';
-- https://www.midohiodumpsters.com/dumpster-pricing — 10–30 yd
UPDATE operators SET pricing_min = 350, pricing_max = 700, updated_at = datetime('now') WHERE id = 'op-fc15-cmh-midohio';
-- https://www.dumpdaydumpsterrental.com/ — 10/20 yd, up to 5 days
UPDATE operators SET pricing_min = 350, pricing_max = 450, updated_at = datetime('now') WHERE id = 'op-fc15-det-dumpday';
-- https://hippodumpsterct.com/ — 10–20 yd, 7 days
UPDATE operators SET pricing_min = 499, pricing_max = 650, updated_at = datetime('now') WHERE id = 'op-fc15-hfd-hippo';
-- https://www.aarolloffs.com/ — 12–30 yd, 5–7 days
UPDATE operators SET pricing_min = 350, pricing_max = 550, updated_at = datetime('now') WHERE id = 'op-fc15-indy-aa';
-- https://www.904dumpster.com/ — 10–20 yd, 3–30 day options (Duval)
UPDATE operators SET pricing_min = 299, pricing_max = 549, updated_at = datetime('now') WHERE id = 'op-fc15-jax-904';
-- https://american-rolloffs.com/ — 15–40 yd, 14-day; dirt/concrete-only excluded
UPDATE operators SET pricing_min = 395, pricing_max = 620, updated_at = datetime('now') WHERE id = 'op-fc15-jax-american';
-- https://www.shapells.com/roll-off-dumpster-rental — 15–40 yd 'starting price', disposal extra
UPDATE operators SET pricing_min = 325, pricing_max = 425, updated_at = datetime('now') WHERE id = 'op-fc15-jax-shapells';
-- https://thetrashboxkc.com/ — 12–40 yd flat fees
UPDATE operators SET pricing_min = 299, pricing_max = 539, updated_at = datetime('now') WHERE id = 'op-fc15-kc-trashbox';
-- https://uloaditkc.com/ — 8–40 yd, 7-day
UPDATE operators SET pricing_min = 300, pricing_max = 550, updated_at = datetime('now') WHERE id = 'op-fc15-kc-uloadit';
-- https://www.wastenow.com/dumpster-rental/ — 6–40 yd 'starting price', 7 days
UPDATE operators SET pricing_min = 285, pricing_max = 500, updated_at = datetime('now') WHERE id = 'op-fc15-lou-wastenow';
-- https://a1rolloffs.com/ — 10–40 yd, 7-day
UPDATE operators SET pricing_min = 435, pricing_max = 715, updated_at = datetime('now') WHERE id = 'op-fc15-msp-a1';
-- https://www.americandumpstermn.com/category/residential_dumpster_rental/ — 10–30 yd, up to 7 days
UPDATE operators SET pricing_min = 395, pricing_max = 675, updated_at = datetime('now') WHERE id = 'op-fc15-msp-american';
-- https://www.haulitaday.com/ — 10–20 yd 'starting at'
UPDATE operators SET pricing_min = 429, pricing_max = 529, updated_at = datetime('now') WHERE id = 'op-fc15-msp-haulit';
-- https://nordic-waste.com/services/dumpster-rentals-price/ — 6–30 yd
UPDATE operators SET pricing_min = 350, pricing_max = 615, updated_at = datetime('now') WHERE id = 'op-fc15-msp-nordic';
-- https://reddogdumpsters.com/ — 10–20 yd, 7-day
UPDATE operators SET pricing_min = 365, pricing_max = 515, updated_at = datetime('now') WHERE id = 'op-fc15-nsh-reddog';
-- https://www.bestwaycarting.com/shop/ — 10–40 yd online order page
UPDATE operators SET pricing_min = 635, pricing_max = 1085, updated_at = datetime('now') WHERE id = 'op-fc15-nyc-bestway';
-- https://www.okcdumpsterrental.com/pricing/ — 6–20 yd 'starts at', 10 days
UPDATE operators SET pricing_min = 375, pricing_max = 475, updated_at = datetime('now') WHERE id = 'op-fc15-okc-btdt';
-- https://envirodispose.com/ — 10–40 yd 'starting at'
UPDATE operators SET pricing_min = 375, pricing_max = 575, updated_at = datetime('now') WHERE id = 'op-fc15-okc-enviro';
-- https://junkfrog.com/dumpster-rental/ — 6–40 yd flat rate, 10 days
UPDATE operators SET pricing_min = 375, pricing_max = 595, updated_at = datetime('now') WHERE id = 'op-fc15-okc-junkfrog';
-- https://ready2rolloff.com/ — 20 yd only, 10 days
UPDATE operators SET pricing_min = 435, pricing_max = 435, updated_at = datetime('now') WHERE id = 'op-fc15-okc-ready';
-- https://www.bchaulers.com/ — 13/21 yd, 1–5 days, disposal extra
UPDATE operators SET pricing_min = 275, pricing_max = 475, updated_at = datetime('now') WHERE id = 'op-fc15-pdx-bc';
-- https://oregon-recycling.com/ — 15–25 yd, 4 days; load-and-go excluded
UPDATE operators SET pricing_min = 425, pricing_max = 475, updated_at = datetime('now') WHERE id = 'op-fc15-pdx-oregonrec';
-- https://geppertrecycling.com/services/dumpster-rental/ — 10–40 yd, published ranges by size/material
UPDATE operators SET pricing_min = 415, pricing_max = 1300, updated_at = datetime('now') WHERE id = 'op-fc15-phl-geppert';
-- https://rhodydisposal.com/ — 10–20 yd
UPDATE operators SET pricing_min = 450, pricing_max = 550, updated_at = datetime('now') WHERE id = 'op-fc15-pvd-rhody';
-- https://soundhauling.com/services/dumpster-rental.aspx — 14/25 yd, 5-day
UPDATE operators SET pricing_min = 375, pricing_max = 525, updated_at = datetime('now') WHERE id = 'op-fc15-sea-sound';
-- https://www.americanwastecontrol.com/temporary-dumpsters/ — 16–30 yd, Tulsa metro
UPDATE operators SET pricing_min = 425, pricing_max = 495, updated_at = datetime('now') WHERE id = 'op-fc15-tul-awc';
-- https://www.bintheredumpthat.com/tulsa-west-dumpster-rentals/ — 6–20 yd, 7-day
UPDATE operators SET pricing_min = 260, pricing_max = 335, updated_at = datetime('now') WHERE id = 'op-fc15-tul-btdt';
-- https://www.reddirtrolloffs.com/ — 10–20 yd
UPDATE operators SET pricing_min = 299, pricing_max = 399, updated_at = datetime('now') WHERE id = 'op-fc15-tul-reddirt';
-- https://www.dumposaurus.com/ — 10–30 yd; clean-fill-only 5 yd excluded
UPDATE operators SET pricing_min = 415, pricing_max = 625, updated_at = datetime('now') WHERE id = 'op-real-atx-dumpo';
-- https://www.redboxplus.com/greater-austin/our-prices/ — 10–40 yd, 3–14 day
UPDATE operators SET pricing_min = 375, pricing_max = 750, updated_at = datetime('now') WHERE id = 'op-real-atx-redbox';
-- https://trashdaddydumpsters.com/dumpster-prices/ — company-stated overall range
UPDATE operators SET pricing_min = 395, pricing_max = 875, updated_at = datetime('now') WHERE id = 'op-real-den-trashdaddy';
-- https://dfw-dumpsterrentals.com/ — 15–40 yd, 7-day (cards and FAQ differ slightly)
UPDATE operators SET pricing_min = 500, pricing_max = 775, updated_at = datetime('now') WHERE id = 'op-real-dfw-rentals';
-- https://calwastebins.com/ — 10–40 yd, 7-day, varies by ZIP
UPDATE operators SET pricing_min = 575, pricing_max = 950, updated_at = datetime('now') WHERE id = 'op-real-la-calwaste';
-- https://dumpstertoday.com/locations/orlando/ — 12–26 yd, 3-day; concrete-only excluded
UPDATE operators SET pricing_min = 299, pricing_max = 399, updated_at = datetime('now') WHERE id = 'op-real-orl-today';

-- No published prices to validate against: cleared.
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-bal-ace';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-bhm-daddy';
-- no prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-bos-viking';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-chi-sbc';
-- no prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-clt-masters';
-- no prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-dc-eai';
-- no prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-dc-sel';
-- only a general market range in article text
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-det-dd';
-- rents dump trailers only, no roll-offs
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-fsd-605';
-- prices load only in cart
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-hfd-talkin';
-- prices only inside booking tool
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-indy-greenway';
-- no base prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-indy-hoosier';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-kc-disposal';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-las-grizzly';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-las-western';
-- listing URL returns 404
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-mht-ktown';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-msy-engulf';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-nsh-jandj';
-- no prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-nsh-tnro';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-nyc-action';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-nyc-guma';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-okc-cubic';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-okc-payneless';
-- ZIP quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-phl-reams';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-phl-tswaste';
-- site now redirects to wasteconnections.com
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-phx-aros';
-- call for pricing
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-sat-southtx';
-- only blog estimates for another town
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-sat-txro';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-sea-nw';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-sf-citywide';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-tul-atob';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-fc15-tul-oncall';
-- only 'around $400' for 20 yd in FAQ
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-atl-br';
-- no prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-atl-vine';
-- no prices on site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-den-dudez';
-- only an expiring holiday promo
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-den-remedies';
-- only 'starting at $400'
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-dfw-ironman';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-htx-btdt';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-htx-parada';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-la-metro';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-mia-heroes';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-mia-redbox';
-- Yelp listing only, no company site
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-orl-ej';
-- call for quote
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-phx-az';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-phx-vavia';
-- call for rates
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-tpa-deboer';
-- quote only
UPDATE operators SET pricing_min = NULL, pricing_max = NULL, updated_at = datetime('now') WHERE id = 'op-real-tpa-smiley';
