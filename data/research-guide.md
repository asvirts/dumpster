# High-Quality Operator Research Guide

## Goal
Ensure at least one verified, published, non-broker dumpster rental operator in every US state + DC.

## Current Status (as of 2026-08-09 Firecrawl research)
- **Cities**: 69 across 51 states/DC
- **Verified + Published Operators**: 13 seed placeholders (AZ, CA, CO, FL, GA, TX only)
- **Pending research candidates**: ~80 in `data/research/operators-pending-nationwide.csv`
- **States with research leads**: all 50 + DC (at least one candidate)
- **Still need phone verification before any publish**
- **Log**: `data/research/firecrawl-research-log.md`

## Research Sources (high quality first)
1. Local municipal business license / waste hauler permit lists (call city/county)
2. State environmental/waste management agency hauler registries
3. Local chamber of commerce / BBB listings (cross-check phone)
4. Google "roll off dumpster [city] [state]" — filter for actual haulers, not lead-gen/brokers
5. Thumbtack / Angi / HomeAdvisor listings (use to find names, then verify directly)
6. Facebook/Nextdoor local contractor groups (ask for recommendations)
7. Existing customer reviews on Google with recent photos of trucks/containers

## Red Flags (skip or mark carefully)
- National "we'll find you a hauler" sites that don't own trucks
- No phone number or only 800 numbers
- "Get instant quote" forms that never show a local company
- Reviews that all sound templated or are from the same week
- Website says "serving all 50 states"

## Verification Script (phone call)
```
Hi, I'm researching local dumpster providers for a directory. Can you confirm:
1. Do you own/operate your own roll-off trucks and containers?
2. Do you serve [CITY, STATE] directly?
3. What sizes do you offer? (10/15/20/30/40)
4. What's a typical all-in range for a 20-yard for a homeowner cleanout, including delivery/pickup and 1-2 tons?
5. Do you drop on residential driveways? Any protection requirements?
6. Do you ever offer same-day delivery when inventory allows?
7. Are you insured and permitted as a waste hauler in [state]?
```
Document answers. Only mark "verified" if you spoke to a human who confirmed they are the actual hauler.

## Data Entry
After research:
1. Go to `/admin/operators/new` (local) or production admin
2. Or use CSV import at `/admin/import` (imports as `pending`)
3. Set `verification_status = 'verified'`, `is_published = true` only after real verification
4. Add at least the state city as a service area
5. Fill sizes + materials
6. Add realistic pricing range (not "starting at $99")

## Per-State Starter Queries
Use these to begin research. Replace [CITY] with the city we have in the DB for that state.

AK: "dumpster rental Anchorage" OR "roll off Anchorage AK"
AL: "dumpster rental Birmingham AL" -national -broker
AR: "dumpster Little Rock" roll off
AZ: (already have) "Phoenix dumpster rental" local
CA: (already have) add SF Bay if possible
CO: (already have)
CT: "dumpster rental Hartford CT" OR "roll off" "Connecticut"
DC: "dumpster rental Washington DC" -broker (note: strict regs)
DE: "dumpster Wilmington DE" OR "Delaware roll off"
FL: (already have) consider adding more panhandle or Jacksonville
GA: (already have)
HI: "dumpster Honolulu" Hawaii (logistics heavy)
IA: "dumpster Des Moines" Iowa
ID: "Boise dumpster rental" OR "roll off Idaho"
IL: "Chicago dumpster rental" -broker local hauler
IN: "Indianapolis roll off dumpster"
KS: "Wichita dumpster" Kansas
KY: "Louisville dumpster rental" Kentucky
LA: "New Orleans dumpster" OR "roll off" Louisiana
MA: "Boston dumpster rental" -national
MD: "Baltimore roll off dumpster"
ME: "Portland Maine dumpster rental"
MI: "Detroit dumpster" OR "Grand Rapids roll off"
MN: "Minneapolis dumpster rental" Minnesota
MO: "St Louis" OR "Kansas City" dumpster rental local
MS: "Jackson MS dumpster" Mississippi
MT: "Billings dumpster" Montana
NC: "Charlotte dumpster rental" OR Raleigh "roll off"
ND: "Fargo dumpster" North Dakota
NE: "Omaha dumpster rental" Nebraska
NH: "Manchester NH dumpster"
NJ: "Newark" OR "dumpster rental NJ" local hauler (many brokers)
NM: "Albuquerque dumpster" New Mexico
NV: "Las Vegas dumpster rental" -broker
NY: "dumpster rental" (Brooklyn OR Queens OR "Long Island" OR Buffalo) local
OH: "Columbus OH dumpster" OR Cleveland "roll off"
OK: "Oklahoma City dumpster rental"
OR: "Portland Oregon dumpster" -national
PA: "Philadelphia dumpster rental" OR Pittsburgh local hauler
RI: "Providence dumpster" Rhode Island
SC: "Charleston SC dumpster" OR Columbia
SD: "Sioux Falls dumpster"
TN: "Nashville dumpster rental" OR Memphis local
TX: (already have) consider adding San Antonio / smaller cities
UT: "Salt Lake City dumpster" Utah
VA: "Richmond VA dumpster" OR "Virginia Beach" roll off
VT: "Burlington VT dumpster"
WA: "Seattle dumpster rental" local hauler -broker
WI: "Milwaukee dumpster" OR Madison Wisconsin
WV: "Charleston WV dumpster"
WY: "Cheyenne dumpster" Wyoming

## Output Target
Minimum viable: 1 verified operator per state.
Better: 2-3 per major metro, 1 for smaller states.
Quality > quantity. One well-verified local beats 10 broker placeholders.

## Before Any Marketing
Per ASSUMPTIONS.md:
- Every phone/website/address verified with the actual business
- Insurance/license notes re-verified
- last_verified_at updated
- verification_notes contain real notes (not "SEED PLACEHOLDER")
- Consider is_demo=1 only for clearly fake testing entries
