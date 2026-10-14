# Experiment 003 — LIVE EVIDENCE

> **Record status: AI GENERATED / SOURCE ATTACHED until human review.**
> Claude Code wrote this record during the experiment, and it is the AI's own account. Every source fact in it was gathered by AI agents from official pages (or, where those refused automated requests, from Internet Archive copies), with quotes and URLs in [`data/live-sources.json`](../data/live-sources.json) and [`src/content/claims.ts`](../src/content/claims.ts). No human has checked it yet. See [`docs/AI_TRANSPARENCY.md`](../docs/AI_TRANSPARENCY.md) for the labels.

| Field | Value |
| --- | --- |
| **ID** | 003 |
| **Name** | LIVE EVIDENCE |
| **Status** | In progress. AI build complete on the branch; human review pending; not merged; not deployed |
| **Dates** | 15 October 2026 (Malaysia and Singapore time), one session |
| **Environment** | Claude Code Local (the command-line agent, on a local macOS machine), model Claude Opus 5.5 |
| **Worktree** | `jerebu-exe-003` (`~/Projects/jerebu-exe-003`) |
| **Branch** | `experiment/003-live-evidence`. No pull request opened by the AI |

## Question

From the founder's brief:

> Can JEREBU.EXE collect, normalise and present current public environmental observations relevant to transboundary haze affecting Malaysia and Singapore without confusing observation, interpretation, attribution or legal responsibility?

**Short answer, for human review:** partly yes. The site can collect and present current official observations for Singapore (air quality and weather) and satellite fire detections for the region, each with its source, time and limits, and keep them at the observation level. It cannot yet do the same for Malaysia's air quality, or for the official regional haze picture: no documented, licensed, machine-readable source was found for either, so both are linked or named, not copied. Whether the separation of evidence levels actually works for readers is untested: no human has used the page.

## Human input

- **HUMAN DECISION:** the experiment, its name and question, and the written brief: goals, the evidence model, the non-negotiable rules, the sources to research, the route, the freshness, failure, privacy and security requirements, the record's fields and the completion report.
- **HUMAN DECISION:** the worktree and branch, and the instructions not to merge, not to deploy, not to publish externally, and not to depend on Experiment 002.
- **HUMAN DECISION:** that the founder reviews the result. No human took part during the session itself: no question was asked and none was answered.

## AI responsibility

From the brief: source discovery, architecture, implementation and testing. In practice, Claude Code also wrote the documentation and this record, and chose the map window, the freshness thresholds and the page's wording, all of which need human review.

AI agents used:

- **Claude Code** (main session, Claude Opus 5.5): planning, implementation, tests, documentation, browser checks.
- **5 research agents**, one per area (NASA FIRMS, Malaysia air quality, Singapore air quality, meteorology and regional haze, maps and geodata). They could open web pages and make small numbers of requests.
- **5 sceptic agents**, one per area, each told to re-check the matching researcher's claims against the official pages and to try to refute them.
- **10 review agents** at the end: 5 reviewers, one per dimension (evidence integrity, facts and citations, code, security and operations, documentation), each followed by a verifier told to refute that reviewer's findings. They read the branch and the saved evidence only: no network, no changes.

No AI model runs inside the site: the page uses no AI at build time or at run time.

## Starting state

- `main` at `5d12fad` ("Merge pull request #1"), the Experiment 001 baseline: a static Next.js 16 site with four routes, no data integrations, no credentials, no tests beyond lint, typecheck and build.
- `npm run check` passed on the untouched worktree.
- `npm audit` reported 5 high-severity vulnerable packages, all in development dependencies and all from one advisory (GHSA-vfj7-8cjw-p6xm in `braces`, reached through `eslint-config-next`); `npm audit --omit=dev` reported none. Unchanged by this experiment, and not fixed: it is unrelated, and `npm audit fix --force` was not run, as the brief instructed.
- Node 24.4.1 and npm 11.21.0 locally; CI uses Node 22.
- Network: every source host was reachable from the session (unlike Experiment 001, whose environment could not open pages), except NASA's earthdata.nasa.gov, which refused automated requests (HTTP 403).

## Dependencies

**Experiment 002 was running independently, on another branch, and was not required for Experiment 003.** This experiment did not read, use or modify Experiment 002's worktree or branch. It is meant to merge into Experiment 001's `main` on its own, and it leaves Experiment 002's entries in the experiment log unchanged ("Planned"), because their real state belongs to that branch. Files that both experiments may change, and so may conflict when both are merged, are listed under [Human review](#human-review).

## Process

1. **Baseline.** Read the brief, `AGENTS.md`, the methodology and AI transparency documents, and the Next.js 16 documentation bundled in `node_modules/next/dist/docs/` (caching with `"use cache"` and `cacheLife`, and what `ensureStatic = "navigation"` allows). Ran `npm run check` and `npm audit`.
2. **Research and sceptical review** (a workflow of 10 agents). Each researcher produced a structured report with quotes, URLs and statuses; each sceptic re-fetched the key pages and returned a verdict for each of the researcher's main claims. Across the five sceptic reports, 91 claims were checked: 64 confirmed, 21 partially confirmed, 5 refuted and 1 unverifiable. The sceptics proposed 51 corrections and flagged 51 omissions.
3. **Design.** Chose a deterministic pipeline (source, fetch, validate, normalise, cache, display) inside the existing static architecture, with Next.js's `"use cache"` and per-source cache lifetimes instead of a database. Chose a static SVG map from Natural Earth instead of a tile map (no third-party requests, no new dependency).
4. **Implementation.** Registry and schema, types, fetch client, normalisers, loaders, cached snapshots, components, the `/live` page, the basemap script, the source checker, tests with real captured fixtures, and documentation. Updated `/`, `/evidence`, `/about`, the claims register and the candidate source list.
5. **Applying the sceptics' corrections** as each report arrived (see [Mistakes and corrections](#mistakes-and-corrections)).
6. **First checks and commits.** Unit tests, `npm run check`, `npm run live:check` against the real sources, browser checks with Playwright, a secrets scan of the changed files, and a build with every source address made unreachable. The work was committed in four commits, and the forced-failure build led to a fifth.
7. **Final AI review** (a workflow of 10 agents, after those commits). The verifiers refuted none of the 84 findings: after verification, 9 were rated major, 55 minor and 20 cosmetic. All 84 were addressed, together with three problems the AI found in its own screenshots during the review, and the checks were run again (see [Checks performed](#checks-performed)).

## Outputs

**New**

| Path | What it is |
| --- | --- |
| [`src/app/live/page.tsx`](../src/app/live/page.tsx) | The `/live` page (nine sections) |
| [`src/components/live/`](../src/components/live/) | Its components: status table and chips, freshness label, provenance, fire panel and map, Singapore and Malaysia panels, regional conditions, meaning sections, sources register, how it works |
| [`src/lib/live/`](../src/lib/live/) | Types, freshness, status, fetch client, registry loader, map window, time formatting, normalisers for data.gov.sg, NASA FIRMS and data.gov.my, loaders, cached snapshots, observation sentences |
| [`src/content/live.ts`](../src/content/live.ts) | The page's framing: evidence levels, questions it can and cannot answer, reasons it cannot attribute |
| [`src/content/geo/basemap.ts`](../src/content/geo/basemap.ts) | Generated basemap (Natural Earth, public domain) |
| [`data/live-sources.json`](../data/live-sources.json), [`data/live-sources.schema.json`](../data/live-sources.schema.json) | Source registry (17 sources) and its JSON Schema |
| [`scripts/check-live-sources.ts`](../scripts/check-live-sources.ts) | `npm run live:check` |
| [`scripts/build-basemap.mjs`](../scripts/build-basemap.mjs) | Rebuilds the basemap |
| [`tests/`](../tests/) | 95 unit tests and real captured fixtures with provenance |
| [`.env.example`](../.env.example) | The two optional variable names, empty |
| [`docs/LIVE_EVIDENCE.md`](../docs/LIVE_EVIDENCE.md) | Architecture, sources and their reliability, schemas, freshness, failure behaviour, caching, security, privacy, map, testing, limitations, future work |
| This record | |

**Changed:** `next.config.ts` (cache lifetimes), `package.json` and `package-lock.json` (development dependencies `tsx` and `ajv`; scripts `test` and `live:check`; `check` now runs the tests; Node 22 or later), the CI workflow (runs the tests) and the pull request template (lists `npm test`), `/` and `/about` (no longer say the site shows no data), `/evidence` (status of the two integrated sources; unlinked NEA and ASMC pages; notes on MSS and MET Malaysia; categories link to `/live`), the navigation (`Live` added), `src/content/claims.ts` (citations, archived copies and new claims), `src/content/sources.ts`, `src/content/evidence.ts`, `src/content/experiments.ts`, and the documentation listed in [Files](#files-changed-in-documentation).

**Deliberately not produced:** no attribution of any kind; no company, concession or ownership data; no history or trends (no storage); no AI interpretation; no Malaysian air-quality values; no ASMC material; no health advice; no deployment.

## Sources investigated

Seventeen sources are recorded in the registry. Status values are the brief's.

| Source | Status | Use on `/live` |
| --- | --- | --- |
| NASA FIRMS, VIIRS active fires (NOAA-20, NOAA-21) | AVAILABLE | Integrated |
| data.gov.sg PSI (NEA) | AVAILABLE | Integrated |
| data.gov.sg PM2.5 (NEA) | AVAILABLE | Integrated |
| data.gov.sg wind direction, wind speed, rainfall (MSS) | AVAILABLE | Integrated (3 sources) |
| data.gov.my Weather API forecast (MET Malaysia) | AVAILABLE | Integrated |
| Natural Earth | AVAILABLE | Bundled (basemap) |
| DOE Malaysia APIMS | MANUAL SOURCE | Linked, not copied |
| data.gov.my Monthly Air Pollution | PARTIALLY AVAILABLE | Reference only (monthly; latest month December 2024) |
| archive.data.gov.my Air Pollutant Index datasets | NOT YET VERIFIED | Reference only (2014–2020; downloads failed) |
| NEA haze website (haze.gov.sg) | MANUAL SOURCE | Named, not linked |
| ASMC | MANUAL SOURCE | Named, not linked |
| ASMC WIS 2.0 portal (pilot) | NOT YET VERIFIED | Named, not linked |
| MET Malaysia API | REQUIRES ACCESS | Reference only |
| BMKG open data | AVAILABLE | Reference only (context) |
| SiPongi+ | MANUAL SOURCE | Reference only |

Also examined and recorded in [`docs/DATA_SOURCES.md`](../docs/DATA_SOURCES.md) but not given registry entries: other FIRMS routes (WMS/WFS, the two-month text archive, the archive download tool, the Fire Map, per-country yearly summaries, a page of days with missing data, and an experimental layer of static thermal anomalies that NASA says is not for distribution), DOE's data request portal (manual application), DOE's industrial-emissions API (out of scope), the ASMC hotspot text files, MET Malaysia's fire danger rating pages, data.gov.sg's historical datasets and two-hour forecast, OpenStreetMap tiles (rejected for privacy and terms), and map libraries (not needed).

## Integrations completed

| Integration | How | Requests per refresh | Refresh |
| --- | --- | --- | --- |
| NASA FIRMS | Keyless: NASA's open "South East Asia" 24h VIIRS files for NOAA-20 and NOAA-21, limited to the map window and summarised. With `NASA_FIRMS_MAP_KEY`: the documented area API for the map window, last 24 hours | 2, one second apart, 45 seconds in all at most | 30 min |
| Singapore PSI and sub-indices | data.gov.sg v2 real-time API | 1 | 15 min |
| Singapore 1-hour PM2.5 | data.gov.sg v2 real-time API | 1 | 15 min |
| Singapore wind direction, wind speed, rainfall | data.gov.sg v2 real-time API | 3 | 10 min |
| MET Malaysia forecast by state | data.gov.my Weather API | 1 | 60 min |

`npm run live:check` retrieved all seven integrated feeds successfully during the session. Each integration has unit tests for its success path and for failures: data.gov.sg through the shared loader (PSI, plus a unit mismatch on wind speed and a range check on PM2.5), FIRMS (including its partial outcome, the only source that has one) and the data.gov.my forecast. HTTP 401 and 403, redirects and the size limit are tested on the shared fetch client.

## Integrations blocked

| Source | Blocked by |
| --- | --- |
| Malaysia's current Air Pollutant Index (DOE APIMS) | No documented public feed or dataset of current readings was found; the page uses undocumented internal endpoints; reuse terms are unclear. Linked instead. Needs DOE's answer. |
| ASMC regional haze situation, alert levels, hotspots | Terms of use that set conditions on linking and forbid automated monitoring or copying (and are internally inconsistent); no working machine-readable source. Named instead. Needs ASMC's (NEA's) answer. |
| ASMC WIS 2.0 hotspot data | Every request failed (HTTP 502/504); contradictory licence; pilot. |
| NEA haze.gov.sg | robots.txt disallows all automated access; the same NEA data is available through data.gov.sg, which is used instead. |
| MET Malaysia API | Needs a registration token. Not needed: data.gov.my carries the forecast without one. |
| Historical Malaysian readings (archive.data.gov.my) | Downloads returned HTTP 502. Relevant to history work, not to `/live`. |

## Credentials required

**None.** Every integration works without a credential. No key was created, requested or used, and none is in the repository.

Optional, for a production deployment (human decisions):

- `DATA_GOV_SG_API_KEY`: data.gov.sg describes keyless access as "for testing purposes" and strongly recommends a key for production. Keys expire and must be renewed. How to obtain one: <https://guide.data.gov.sg/developer-guide/api-overview/how-to-request-an-api-key>.
- `NASA_FIRMS_MAP_KEY`: switches FIRMS to its documented area API. Free, requested with an email address at <https://firms.modaps.eosdis.nasa.gov/api/map_key/>.

Both are read on the server only and never reach the browser (see [`docs/LIVE_EVIDENCE.md`](../docs/LIVE_EVIDENCE.md#9-credentials-and-security)).

## Checks performed

Results below are from the final run, after the final review's findings were fixed, unless a row says otherwise.

| Check (brief, section 21) | Method | Result |
| --- | --- | --- |
| 1–2. Every claimed source verified, official documentation preferred | Research agents opened the official pages; sceptic agents re-checked them; the final review's facts reviewer checked quotes and statements against the saved copies | Done by AI for all 17 registry entries; quotes and URLs recorded, with archive copies where NASA's pages refused automated requests. **Not checked by a human.** |
| 3. API integrations tested | `npm run live:check` against the real sources (during the session); unit tests with real captured responses | All 7 feeds retrieved; tests pass |
| 4. Failure states | Unit tests for network errors, timeouts (including mid-response), redirects, HTTP 401, 403, 429, error bodies, malformed responses, wrong units, empty responses, missing headline values, oversized responses, unreadable FIRMS rows, partial FIRMS failures, an invalid FIRMS key. Plus a production build with every source address made unreachable, viewed in a browser | Pass. In the forced-failure build every feed showed "Unavailable" with its reason, newest data "Not retrieved", the time labelled "Attempted", the map labelled "NO DATA RETRIEVED", and no zero anywhere; `/live` was still static, with the 2-minute retry lifetime |
| 5. Timestamps and freshness | Unit tests for thresholds, boundaries, time-zone offsets, unreadable and future times, data that cannot be dated ("Age unknown"), and the end of a forecast's day; the fetch-cache bug was found and fixed here | Pass |
| 6. NO DATA never shown as ZERO | Tests: missing values become `null`; an empty response is a failure; a FIRMS file whose rows cannot be read is a failure; zero detections is described as NASA's zero only for a complete, readable, current retrieval, and never as zero fires | Pass |
| 7. Observation separated from interpretation | Separate types for observations, forecasts and (unused) interpretations; evidence-level tags on the page; tests on the observation sentences | Pass, by design and test. Not yet judged by a human reader |
| 8. No unsupported attribution | No owner, cause or responsibility fields exist; tests check that none of the nine sentence forms names a company, a government or a cause; the final AI review's evidence-integrity reviewer read all page copy and found no attribution | Pass |
| 9. JSON and data schemas | The registry is validated against its JSON Schema in the tests and re-checked at build time | Pass |
| 10–13. Lint, typecheck, build, errors fixed | `npm run check` | Pass: lint clean, typecheck clean, 95 of 95 tests, build succeeded with every route static and `/live` refreshing at 10 minutes, expiring at 1 hour |
| 14. Responsive behaviour | Playwright, Chrome, at 320, 375, 768 and 1280 px, on every route | No horizontal overflow |
| 15. Internal navigation | Playwright: every internal link and in-page anchor on every route | No broken links or anchors |
| 16. Accessibility basics | axe-core in Playwright; one heading level 1; no duplicate ids; keyboard-reachable disclosure widgets; text alternatives for the map; status-table labels kept for screen readers on wide screens (a final-review finding) | 0 violations on `/live`. One pre-existing best-practice notice on `/` (from Experiment 001) was left alone |
| 17. git diff and status | Reviewed before each commit | Working tree clean after the final commit; nothing pushed or merged |
| 18. No secrets committed | Before the first commits: searched the changed and untracked files for key-like strings and the variable names. After the fixes: searched the branch's history (`git log -p 5d12fad..HEAD`) and the working tree again. The forced-failure build was made with dummy values for both variables, and its output was searched for them | No key-like strings; only `.env.example`, with empty values; neither dummy value anywhere in the build output |

Also checked: the page makes requests only to the site itself in the browser and sets no cookies or storage (Playwright); no hydration or console errors; two consecutive production builds 13 seconds apart retrieved fresh data each time (the cache regression).

**Not checked:** behaviour on a real host (nothing was deployed); behaviour over days (only one session); `npm test` on Node 21 or earlier (the project now requires Node 22); screen readers other than automated checks; whether readers understand the evidence levels as intended.

## Mistakes and corrections

Mistakes the AI made or caught in itself, and corrections made after the AI agents' checks. Mistakes nobody noticed cannot be listed.

**Caught in the AI's own testing or review**

1. **Major: stale data with a fresh time.** Source requests did not opt out of Next.js's fetch cache, so a second build reused stored responses while stamping a new retrieval time: old data would have been shown as newly retrieved. Noticed because the second build's data step took 0.56 seconds instead of 16. Fixed with `cache: "no-store"` on every request, a check of each response's own `Date` header, and a regression test. Verified with two builds 13 seconds apart.
2. **FIRMS window.** The first design trimmed NASA's "last 24 hours" files to the 24 hours before retrieval. Checking a real file showed that this would drop a whole satellite overpass, because the files span more than 24 hours of acquisitions. Changed: the open files are shown as published, with their actual time range; only the keyed API path is trimmed.
3. **FIRMS freshness.** First measured from the retrieval time, which cannot detect a feed that has stopped updating. Changed to the newest detection in NASA's files, with thresholds for twice-daily overpasses.
4. **"Provisional" label.** The first design flagged NEA readings as provisional, based on a haze.gov.sg line that turned out to be only a search snippet (the page itself cannot be opened by automated tools). Replaced by a "real-time" flag with verified wording: data.gov.sg provides its APIs "as is".
5. **Overstated comparison.** Page copy first said Malaysia's and Singapore's indices differ in "pollutants and breakpoints". Both use six pollutants, and Singapore's breakpoints were not verified. Rewritten to a difference in averaging periods; the final review then found that the nitrogen dioxide example used was contradicted by NEA's own data (item 29).
6. **PM2.5 unit.** The PSI loader first read the 24-hour PM2.5 field as µg/m³; the official documentation is inconsistent about units in that response. Removed; only index values, and 1-hour PM2.5 from its own endpoint, are used.
7. **Hard-coded status.** The forecast panel first showed a fixed "Recent" label. Replaced by the shared freshness rule.
8. **From memory.** Described Natural Earth from memory ("supported by NACIS"); replaced with what its terms page says.
9. **Untranslated term.** MET Malaysia's live data uses "Jerebu", which the API documentation does not list (it lists "Berjerebu": "Hazy."). The first plan translated it as "Hazy"; it is now shown as published, with the discrepancy explained.
10. **Index-dependent copy.** The `/live` ASMC note displayed the first item of a registry list; reordering the list silently removed the reason ASMC is not linked. Explicit text now gives the reason. The final review found the "not used" list still relied on that first item, which for ASMC is a description, not a reason; each unused source now has an explicit reason in the registry (`notUsedBecause`).
11. **Smaller errors**: a union-typed argument to `cacheLife` (type error), a test helper made self-recursive by a search-and-replace (caught by the tests), a refresh interval stated as "10 to 30 minutes" (it is 10 to 60), a code comment describing the FIRMS freshness basis wrongly, and contrast and overflow problems found in browser checks.
12. **Empty map read as "no fires".** In the forced-failure build, the fire map was empty but kept its detection-density legend, which could be read as a map of no fires. The map now says "NO DATA RETRIEVED" on its face, and the legend is replaced by a sentence saying that an empty map here is not a map of no fires.
13. **Found in screenshots during the final review:** the PM2.5 column header was set in capitals, which turned "µg/m³" into "MG/M³", a unit a thousand times larger; the forecast row in the status table read "Newest data: None"; and the rainfall sentence assumed that each 5-minute total ends at its timestamp, which is not documented. All three fixed.

**Corrected after the sceptic agents' checks**

14. **Map boundaries.** The caption said "land boundaries", but the Natural Earth file also contains water-indicator lines, including one through the Johor Strait. Only lines of type "Land" are now drawn, and downloads are pinned and checked.
15. **Terms of use.** ASMC's and NEA's terms were first summarised as a flat requirement for permission. Their clause 4.3 allows use and hyperlinking for "personal, internal, non-commercial or informational purposes", which conflicts with their linking clauses (ASMC 8.1, NEA 12). Corrected everywhere to "terms set conditions on linking that a person has yet to review"; the cautious not-linked approach is kept for a human to decide.
16. **ASMC WIS 2.0** was first rated PARTIALLY AVAILABLE. No hotspot record was ever retrieved, only an image worked, WMO's caches do not keep this kind of data, and the licence is contradictory. Now NOT YET VERIFIED.
17. **Rate limits.** data.gov.sg's enforcement date was first written as in force. data.gov.sg announced enforcement from 31 December 2025 (originally 1 November 2025), and OGP's update for the first quarter of 2026 says the limits were "rolled out incrementally". Reworded.
18. **History through the API.** An early note said past days could be retrieved through the API's date parameter from 2016. The sceptic found 2016 and 2019 dates return nothing and 2021 and 2023 dates are partial. Recorded as a limitation.
19. **Malaysia.** The sceptic found DOE's open-data page listing the index as an open dataset, DOE's documented API (for industrial emissions only), and 18 Air Pollutant Index datasets on the legacy portal (13 described as hourly readings for a state or territory), and corrected the station count wording and the gaps in the monthly dataset. All recorded.
20. **Forecast caveat.** A sceptic noted that the absence of a haze term in a forecast does not mean clear air. The page now says so. The AI also corrected the sceptic: its evidence (no forecast summary contained "Berjerebu" on a hazy day) was weaker than it looked, because that day's period forecasts used the undocumented "Jerebu" for seven of the 16 states and federal territories.
21. **NASA FIRMS licence.** Recorded as "no named licence". The sceptic found NASA's data use guidance: data from NASA-led missions are CC0 unless marked otherwise. Whether that covers VIIRS on NOAA's satellites is not stated, so the registry now says exactly that.
22. **NASA's requested wording.** The page paraphrased NASA's acknowledgement. FIRMS asks third parties to use specific wording; the page now uses it word for word.
23. **Overpass times.** The freshness explanation quoted equator-crossing times from one answer in NASA's FAQ, which another answer contradicts. Removed; the explanation now uses only statements that agree.
24. **File times.** The page said "NASA last updated the files at …", using the files' Last-Modified time. The sceptic observed that NASA rewrites the files about hourly, often unchanged, so that time is not the data's time. Reworded.
25. **Dead disclaimer link** (found by the AI while applying item 22). The disclaimer address in NASA's own product metadata redirected to a "not found" page when the Internet Archive last captured it (April 2025). The page now links the FIRMS page that NASA's live readme names for "Data Use Guidance & Disclaimer".
26. **Notes not shown** (found by the AI while checking the documentation against the code). Validation notes, such as a rejected value or a possibly cached response, were shown only for a partial FIRMS retrieval, although the documentation said they were shown for every source. Every dataset now shows them.

Not every sceptic correction or omission is listed here: they made 51 of each, and their full reports are not in the repository. Two corrections were missed when the reports arrived and applied only after the final review: the inconsistent "national" PSI series for older dates, and the incremental rollout of data.gov.sg's rate limits.

**Found by the final AI review** (84 findings in all; the main ones)

27. **"No detections" that were not.** If every row in a FIRMS file failed validation (for example after a format change), the page said "NASA FIRMS reported no detections", while the status bar said "Unavailable". Such a file is now a validation failure. More generally, zero is described as NASA's own zero only when the retrieval was complete, fully readable and current; otherwise the page says it is not a report of zero detections, and the map is labelled "ZERO NOT CONFIRMED".
28. **"Unavailable" for data that was retrieved.** A successful retrieval with nothing to date it by (such as satellite files with no detections) was labelled "Unavailable". It now has its own status, "Age unknown". Failed retrievals now say "Attempted" and "Not retrieved" instead of "Retrieved" and "None".
29. **A comparison contradicted by the data.** The page said DOE averages nitrogen dioxide over one hour while NEA uses 24-hour averages; NEA's own PSI response publishes nitrogen dioxide as a 1-hour maximum. The example now uses sulphur dioxide, which the data supports, and the NEA citation quotes the sentence the claim relies on.
30. **A build that a slow server could break.** The two FIRMS requests could take 61 seconds, but Next.js stops a cached function after 54 seconds while prerendering, which would have failed the build instead of showing FIRMS as unavailable. The two requests now share a 45-second budget, and a test checks it.
31. **A forecast for a day that had ended** could still be labelled "Recent" and "for today". It is now marked stale once its day has ended (midnight, Malaysia time), and the status table shows the day it is for.
32. **Partial and single-feed failures.** A partial FIRMS retrieval looked complete in the status bar and in the §06 sentence, and a single failed wind feed showed only "No reading" at every station. Both now say what is missing.
33. **Redirects were followed,** so a key sent in a header could have travelled to another address. Redirects are now refused and reported.
34. **Smaller fixes:** a timeout while a response was arriving reported as a connection failure; a PSI response without its PSI values shown as current; a future-dated reading able to mark a stalled feed as current; look-ups that could hit inherited object properties; a haze term with a qualifier not counted; status labels not read out on wide screens; a duplicated screen-reader label; a registry check that missed a key in the FIRMS URL path; `npm run live:check` ignoring `.env.local`; and a CI comment that described FIRMS wrongly.
35. **False or unsupported statements in the documents,** now corrected: this record said that nothing obtained in the research agents' conduct slips was used (see below); it reported the final review as passed, and a history secrets scan, before either had happened; it and other documents said every correction was listed; quotes in the registry for the PM2.5 dataset and for BMKG were not on the pages cited; and several counts and dates were wrong (late PSI readings placed on the wrong night, "18 hourly" datasets, "seven states", "six" DOE sub-indices where there are seven, and five "advisories" where there is one advisory affecting five packages).

**Conduct slips by research and sceptic agents (self-disclosed)**

- The Singapore researcher made 6 requests to nea.gov.sg before reading clause 6 of NEA's terms, which forbids automated copying without permission. Among the pages read were NEA's air pollution FAQ and its haze infographic.
- The Malaysia researcher fetched one eqmp.doe.gov.my page before reading that host's robots.txt (which disallows all), and made one request to the undocumented APIMS endpoint to observe its structure. The Malaysia sceptic made one request to the same endpoint (`/api3/publicportalapims/mapcaqm`) to re-check the station count.
- The FIRMS researcher fetched two internal JSON files on the FIRMS site once, to read the links they contained, and saved a JavaScript file from FIRMS's `/dist/` directory; FIRMS's robots.txt disallows both. The FIRMS sceptic read one undocumented internal endpoint once, to see what a page displays.
- The map sceptic requested planet.openstreetmap.org's `/tile_logs/` index in the same command as its robots.txt, which disallows all automated access.
- The meteorology researcher and sceptic together made about 65 one-off requests to ASMC's websites (about 29 to asmc.asean.org, 23 to the WIS 2.0 portal and 14 to its API) to read the terms and pages and test the documented API, saving copies as evidence. ASMC's clause 6.2 forbids any "automatic device, or manual process to monitor or copy any pages" without NEA's permission. This was one-off reading for research, not monitoring, but a human may judge it differently.

**Some of what was read this way is used.** NEA's air pollution FAQ and its haze infographic, both fetched before NEA's terms were read, are the only sources for the PSI and 1-hour PM2.5 bands that label Singapore's readings on `/live`, for the sentence on `/live` that the PSI is the highest of six sub-indices, and for the NEA quotes in four cited claims on `/evidence`. Text from the ASMC requests (its terms, its role and the WIS 2.0 test results) appears in the registry and in `/live`'s list of sources. A human should decide whether these uses are acceptable under NEA's and ASMC's terms (clauses 4.3 and 6). Nothing else obtained in these slips is used, and the page's own requests go only to documented files and APIs.

## Limitations

- **Malaysia's air quality is not shown as data**, and neither is the official regional haze picture. These are the biggest gaps against the brief's goals 2 and 4.
- **Weather is Singapore's only.** A station's wind reading cannot show where smoke came from.
- **No history.** The page shows the latest data only; trends would need storage and a design.
- **AI-verified only.** Every source fact, threshold and piece of copy is the AI's work, checked by other AI agents, not by a person.
- **One session.** Freshness thresholds and latencies come from published cycles, one night's observation, and past-day records from the PSI API.
- **The map window** is the AI's choice, not an analysis.
- **Untested hosting.** Background refresh works only on a host that runs Next.js. On a static file host the data stays at build time (and is labelled as ageing). On a serverless host the cache usually does not persist, so every page refresh would contact every source unless a persistent cache is configured.
- **Terms questions are open**: linking to NEA and ASMC; reuse of APIMS readings; the use of NEA pages read before NEA's terms; keyless use of data.gov.sg in production.
- **Real-time data** carries no statement of quality control; NEA's possible later revisions could not be checked.

See also [`docs/LIVE_EVIDENCE.md`](../docs/LIVE_EVIDENCE.md#15-limitations).

## Human review

**Required.** Before the branch is merged or anything is deployed, a human should:

- [ ] Read `/live` as a member of the public would. Does it keep observation, interpretation, attribution and legal responsibility apart? Is anything worded as blame?
- [ ] Check the registry entries for the integrated sources against the official pages, especially licences, attribution notices and update frequencies, and set `humanVerified` only for what was actually checked.
- [ ] Decide whether to accept the interim status "integrated, pending evaluation" (FIRMS and data.gov.sg PSI on `/evidence`), which departs from the rule that a source must be Evaluated by a human before it is integrated ([`DATA_SOURCES.md`](../docs/DATA_SOURCES.md#rules-for-future-integrations)), or to evaluate the sources first.
- [ ] Decide whether `/evidence` keeps the Experiment 001 commitment that data panels stay empty until reviewed by a human. This branch states an exception for Experiment 003.
- [ ] Decide how the site may refer to NEA (haze.gov.sg and nea.gov.sg pages) and ASMC, given their terms, and whether the NEA bands and quotes read before NEA's terms may be used. The `/evidence` links to them from Experiment 001 were removed on this branch pending that decision. weather.gov.sg's terms were not checked, and `/evidence` still links to it.
- [ ] Decide whether to contact DOE (about a feed of current readings and reuse terms) and ASMC (about linking, reuse and the WIS 2.0 portal).
- [ ] Decide on a data.gov.sg API key for production (and who renews it), and whether to request a FIRMS MAP_KEY.
- [ ] Check the wording of the claims added to [`src/content/claims.ts`](../src/content/claims.ts) against their cited sources.
- [ ] Review the map window, the freshness thresholds and the wind-direction assumption.
- [ ] Decide how to host: background refresh needs a host that runs Next.js, and on serverless hosts a persistent cache, or every page refresh will contact every source.
- [ ] Merge order with Experiment 002. Both branches may change `src/content/experiments.ts`, `experiments/README.md`, `docs/ROADMAP.md`, `docs/DATA_SOURCES.md`, `src/content/claims.ts`, `src/content/sources.ts` and `README.md`. Resolve conflicts by keeping both experiments' changes.
- [ ] Record the cost of the session.

## Human corrections

None yet. Human review has not happened.

## Open questions

- Does DOE publish, or would it publish, current Air Pollutant Index readings in a documented, licensed form?
- Does a non-commercial civic site fall under clause 4.3 of NEA's and ASMC's terms, or under their linking clauses?
- Does NEA revise real-time readings after publication?
- Is data.gov.sg's wind direction the direction the wind comes from (the usual convention)?
- Are NASA's regional files intended for regular automated downloads? (FIRMS's robots.txt allows them with a one-second delay, which the site respects; no statement either way was found.)

## Cost

**Monetary cost: to be recorded after session.** No reliable cost figure was available to the AI, and none is estimated here.

Usage figures reported by Claude Code's workflow tool, for scale only (they are not a cost):

- the research and sceptic workflow ran 10 agents, which used 3,162,670 tokens and 1,021 tool calls over about 83 minutes;
- the final review workflow ran 10 agents, which used 3,649,230 tokens and 994 tool calls over about 45 minutes.

The main session's own usage was not available to the AI.

## Next experiment

A HUMAN DECISION. The AI's suggestions, in order: (1) human review of this branch and of Experiment 002, then merge; (2) the requests to DOE and ASMC above, which decide whether Malaysia's readings and the regional picture can ever be shown; (3) a decision on hosting, since live data needs a server; (4) only then, history: storing dated snapshots so that change over time can be shown with a stated baseline.

## Files changed in documentation

[`docs/LIVE_EVIDENCE.md`](../docs/LIVE_EVIDENCE.md) (new), [`docs/DATA_SOURCES.md`](../docs/DATA_SOURCES.md), [`docs/ROADMAP.md`](../docs/ROADMAP.md), [`docs/METHODOLOGY.md`](../docs/METHODOLOGY.md), [`README.md`](../README.md), [`SECURITY.md`](../SECURITY.md), [`CONTRIBUTING.md`](../CONTRIBUTING.md), [`AGENTS.md`](../AGENTS.md), [`.github/pull_request_template.md`](../.github/pull_request_template.md), [`experiments/README.md`](README.md), [`tests/fixtures/README.md`](../tests/fixtures/README.md).

## Status

**AI GENERATED / SOURCE ATTACHED until human review.**

---

<sub>AI involvement: this record is **AI GENERATED** by Claude Code during Experiment 003. **UNVERIFIED**: no human has reviewed it.</sub>
