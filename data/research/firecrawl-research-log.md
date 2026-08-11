# Firecrawl Operator Research Log

**Date:** 2026-08-09  
**Method:** Firecrawl CLI (`search` + `scrape`; agent attempted for bulk remaining states but hit max-credits cap)  
**Output:** `data/research/operators-pending-nationwide.csv`

## Goal

Find high-quality **local** (non-broker) roll-off dumpster rental candidates so every US state + DC has at least one importable operator for phone verification.

## What we already had

Seed operators (placeholders) only in: **AZ, CA, CO, FL, GA, TX**

## Coverage result

| Metric | Count |
|--------|------:|
| CSV candidate rows | ~70 |
| Distinct states/DC in CSV | 45+ |
| Site scrapes saved under `.firecrawl/` | 18 |
| Metro search result files | 30+ |

## High-confidence SCRAPED candidates (prefer first)

These had company sites scraped with clear local positioning + phone:

| State | Company | Phone | Website |
|-------|---------|-------|---------|
| AL | Dumpster Daddy | 205-447-8044 | dumpsterdaddyal.com |
| IL | Brackenbox | 708-339-4100 | brackenbox.com |
| IL | Ready 2 Roll Hauling | 312-520-3619 | ready2rollhauling.com |
| KY | Waste Now | 502-969-7684 | wastenow.com |
| LA | EnGulf Waste | 504-429-3867 | engulfwaste.com |
| MD | ACE Roll Off | 410-288-3867 | acerolloff.com |
| MA | Homestead Disposal | 781-320-0516 | homestead-disposal.com |
| MI | Dump Day Dumpster | 313-918-4880 | dumpdaydumpsterrental.com |
| MN | A-1 Hauling & Rolloffs | 763-444-6992 | a1rolloffs.com |
| MO | KC Disposal | 816-388-9739 | kansascitydisposal.com |
| NC | Regency Hauling | 704-593-6378 | regencyhauling.com |
| NY | Bestway Carting | 800-216-1284 | bestwaycarting.com |
| OH | Mid-Ohio Dumpsters | 614-721-7777 | midohiodumpsters.com |
| PA | Geppert Recycling | 215-842-0122 | geppertrecycling.com |
| RI | Rhody Disposal | 401-633-4465 | rhodydisposal.com |
| WA | NW Dumpsters | 206-866-0688 | nwdumpsters.com |
| CT | Talkin' Trash / Hippo | 860-604-1941 / 860-502-2519 | talkintrashct.com / hippodumpsterct.com |

## Search-only candidates (phone in SERP, site not fully scraped)

Strong leads still needing a quick site scrape + phone call: AK, AR, DE, HI, ID, IN, IA, KS, MS, MT, NE, NM, ND, SC, TN, UT, VA, WI, WY, DC, plus alts for many states.

## Red flags / skipped patterns

- National brokers and quote marketplaces: WastePlace, Budget Dumpster, ZTERS, Dumpsters.com, Sourgum (often multi-market)
- Pure majors used only as last resort: WM, Republic (not preferred for directory differentiation)
- Lead-gen sites with 800-only and no local yard

## Import path (pending only)

1. Review/edit `data/research/operators-pending-nationwide.csv`
2. Drop rows with blank phones or fill phones from websites
3. Import via `/admin/import` (creates `verification_status=pending`, `is_published=false`)
4. Call each operator with the script in `data/research-guide.md`
5. Only then set `verified` + `is_published=1`

## Firecrawl notes

- Auth: CLI login to Personal team (successful this session)
- Rate limit: ~10–11 requests/minute on current plan → space scrapes ~12s apart
- Agent run for 23 remaining metros failed with **max credits** (cap 200) before returning structured JSON
- Local cache lives in `.firecrawl/` (gitignored)

## Next research priorities

1. Fill blank phones (NV Grizzly, OR BC Haulers/Oregon Recycling, OK Enviro Dispose, SD 605 Hauling, VT, NH, NJ)
2. Phone-verify the SCRAPED high-confidence set first (highest ROI)
3. ~~Replace remaining seed placeholders in AZ/CA/CO/FL/GA/TX with real businesses~~ **Done 2026-08-11** — seeds unpublished (`is_demo=1`); real operators loaded via `seed/real-operators-priority-metros-2026-08-11.sql` (2–3 per priority metro). Still recommend phone/insurance verification before paid ads.
4. Re-run Firecrawl agent in smaller state batches (5–8 metros, higher max-credits) if needed
