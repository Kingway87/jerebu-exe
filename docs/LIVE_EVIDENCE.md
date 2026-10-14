# Live evidence

> **Status: Experiment 003, AI generated, awaiting human review.**
> Written by an AI agent (Claude Code) on 15 October 2026, during [Experiment 003](../experiments/003-live-evidence.md), on the branch `experiment/003-live-evidence`. AI involvement: **AI GENERATED + UNVERIFIED** (see [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md)). AI agents checked every fact about a source below against the official pages on 14–15 October 2026, with two exceptions: NASA's earthdata.nasa.gov pages refused automated requests, so their wording was read from Internet Archive copies dated 27 August to 12 October 2026; and NEA's air pollution FAQ and haze infographic were read once, by one agent, and not re-checked. No human has checked any of it. Nothing here is merged or deployed.

This document describes the live evidence page, `/live`: what it shows, where its data comes from, how the data is fetched, checked and labelled, what happens when a source fails, and what the page cannot say.

The page answers one question from the founder's brief:

> Can JEREBU.EXE collect, normalise and present current public environmental observations relevant to transboundary haze affecting Malaysia and Singapore without confusing observation, interpretation, attribution or legal responsibility?

It is an evidence viewer. It is not a "who caused the haze?" machine.

## Contents

1. [What the page shows](#1-what-the-page-shows)
2. [Evidence boundaries](#2-evidence-boundaries)
3. [Architecture](#3-architecture)
4. [Sources](#4-sources)
5. [Schemas](#5-schemas)
6. [Freshness](#6-freshness)
7. [Failure behaviour](#7-failure-behaviour)
8. [Caching and refresh](#8-caching-and-refresh)
9. [Credentials and security](#9-credentials-and-security)
10. [Privacy](#10-privacy)
11. [The map](#11-the-map)
12. [The role of AI](#12-the-role-of-ai)
13. [Testing](#13-testing)
14. [Operating the page](#14-operating-the-page)
15. [Limitations](#15-limitations)
16. [Future work](#16-future-work)

## 1. What the page shows

`/live` has nine sections. Every value on it comes from an official public source, with that source's name, the time the value describes, the time this site retrieved it, and a status.

| § | Section | What it shows | Source |
| --- | --- | --- | --- |
| 01 | Source status | One row per source: what it provides, its status (see [§6](#6-freshness)), the time of its newest data and when it was retrieved (or when retrieval was attempted). A key explains each status. | All sources |
| 02 | Satellite fire observations | Counts of VIIRS active-fire detections inside the map window, by satellite and by NASA's confidence class; the range of acquisition times; a map of detections per 0.1° cell; the ten cells with the most detections as a text version of the map (coordinates only); and what a detection can and cannot show. | NASA FIRMS |
| 03 | Malaysia air | A link to Malaysia's official Air Pollutant Index (not copied: see [§4](#4-sources)), the Department of Environment's published method, and MET Malaysia's general forecast by state for the day it covers, labelled as a forecast. | DOE APIMS (link only); MET Malaysia via data.gov.my |
| 04 | Singapore air | NEA's 24-hour PSI for five regions with NEA's descriptor bands, the pollutant whose sub-index sets each PSI, and 1-hour PM2.5 by region with NEA's bands, labelled as real-time values provided "as is". | NEA via data.gov.sg |
| 05 | Regional conditions | Wind direction, wind speed and rainfall at Singapore's weather stations, and a note on ASMC, which publishes the official regional haze picture (named, not copied). | MSS via data.gov.sg |
| 06 | What this means | Plain sentences restating what the sources last reported, each with the time it describes, beside the questions people naturally ask next, which the page does not answer. The sentences come from fixed rules in the code; no AI model writes them. | Derived from the above |
| 07 | What this does not mean | Why a detection cannot identify a cause, an owner or a responsible party, and the chain of separate steps from hotspot to legal responsibility. | Project method |
| 08 | Sources | For each source the page uses: status, credential, update frequency, licence, what it can and cannot show, limitations, attribution and how it was checked. For each of the 8 sources investigated but not used: status, institution and the reason it is not used. Rate limits and the full records are in the registry file. | [`data/live-sources.json`](../data/live-sources.json) |
| 09 | How this page works | The pipeline, the freshness thresholds (rendered from the registry), and what the page does not do. | Project code |

The header states the page's three rules:

```text
NO DATA      ≠  ZERO
OBSERVATION  ≠  ATTRIBUTION
ATTRIBUTION  ≠  LEGAL RESPONSIBILITY
```

The page is not health advice. It tells readers to follow the official advisories where they are.

## 2. Evidence boundaries

The project's evidence ladder (see [METHODOLOGY.md](METHODOLOGY.md)) has four levels: observation, interpretation, attribution and legal responsibility. `/live` produces observations only.

| Level | On `/live` |
| --- | --- |
| **Observation** | Every measurement on the page: published by an official source, or counted or classified from published values by deterministic code (detection counts, NEA's bands, the pollutant that sets the PSI), with provenance. |
| **Interpretation** | Not produced by this site. The page shows one agency interpretation: MET Malaysia's forecast, labelled "Forecast, not an observation" and tagged Level 2, as the agency's own prediction. ASMC is named as the agency that publishes regional assessments, which are its interpretations, not this site's. |
| **Attribution** | Not attempted. |
| **Legal responsibility** | Never decided here. |

What the page deliberately does not do (brief, sections 04, 11 and 15):

- no company, concession or land-ownership overlays;
- no names of companies, people or governments in connection with any fire or haze;
- no automatic attribution, and no scoring or ranking of countries, named places or organisations (the fire section lists the 0.1° grid cells with the most detections, by coordinates only, as a text version of the map);
- no AI-written summary or interpretation of the data;
- no request for the reader's location, and no tracking.

The observation sentences in §06 are produced by [`src/lib/live/summaries.ts`](../src/lib/live/summaries.ts). They restate published values (for example, the lowest and highest regional PSI and the hour it is for). Tests check that none of the nine sentence forms names a company, a government or a cause; that zero satellite detections is described as zero detections, never as zero fires; and that zero is described as NASA's own report only when the retrieval was complete, fully readable and current (see [§7](#7-failure-behaviour)).

## 3. Architecture

```text
SOURCE → FETCH → VALIDATE → NORMALISE → CACHE → DISPLAY
```

Every step is ordinary, deterministic code. No AI model fetches, checks, converts or summarises any value at build time or at run time.

| Step | Code | What it does |
| --- | --- | --- |
| Source | [`data/live-sources.json`](../data/live-sources.json), [`src/lib/live/registry.ts`](../src/lib/live/registry.ts) | The registry of sources, loaded and checked when the site is built. A source with an invalid record or freshness policy fails the build. |
| Fetch | [`src/lib/live/http.ts`](../src/lib/live/http.ts) | One HTTP client for every source: GET only, a project User-Agent, a timeout (covering the whole response), a response-size cap, `cache: "no-store"`, no redirects followed, and typed failures. Records the server's `Date` and `Last-Modified` headers. |
| Validate and normalise | [`src/lib/live/sources/`](../src/lib/live/sources/) | One pure module per publisher (`datagovsg.ts`, `firms.ts`, `datagovmy.ts`). Each checks the documented structure, units and plausible ranges, and turns each record into an `Observation` or a `ForecastRecord`. Rejected records are counted and explained, never dropped silently. |
| Load | [`src/lib/live/loaders.ts`](../src/lib/live/loaders.ts) | One loader per source. Never throws: every failure becomes an "unavailable" (or, for FIRMS, "partial") snapshot that says what failed. |
| Cache | [`src/lib/live/snapshots.ts`](../src/lib/live/snapshots.ts) | Wraps each loader in a `"use cache"` scope with a cache lifetime from [`next.config.ts`](../next.config.ts). Reads the clock and the credentials on the server. |
| Display | [`src/app/live/page.tsx`](../src/app/live/page.tsx), [`src/components/live/`](../src/components/live/) | Server components render the page. One small client component re-checks freshness against the reader's clock. |

**Requests per refresh.** FIRMS: 2 (one file or API call per satellite, made one after the other, a second apart). data.gov.sg: 5 (PSI, PM2.5, wind direction, wind speed, rainfall), made at the same time. data.gov.my: 1. Readers' browsers contact none of these sources; only the site's server does.

**Still static.** The root layout keeps `ensureStatic = "navigation"`. `/live` is prerendered at build time (`○` in the build output) and refreshed in the background by Next.js's cache lifetimes; there is no request-time rendering, no database and no server state beyond Next.js's own cache. The build output shows `/live` as static with `revalidate 10m, expire 1h` when every source is available, and `2m, 10m` when one has just failed.

**Supporting files**

| Path | Purpose |
| --- | --- |
| [`data/live-sources.json`](../data/live-sources.json) | Source registry (17 sources) |
| [`data/live-sources.schema.json`](../data/live-sources.schema.json) | JSON Schema for the registry, checked by a test |
| [`src/lib/live/types.ts`](../src/lib/live/types.ts) | Observation, forecast, snapshot and provenance types |
| [`src/lib/live/freshness.ts`](../src/lib/live/freshness.ts) | Freshness rules |
| [`src/lib/live/status.ts`](../src/lib/live/status.ts) | Status names, their meanings, and how a retrieval is labelled |
| [`src/lib/live/study-area.ts`](../src/lib/live/study-area.ts) | The map window |
| [`src/lib/live/time.ts`](../src/lib/live/time.ts) | Date formatting (UTC+8, the time zone of both Malaysia and Singapore) |
| [`src/content/live.ts`](../src/content/live.ts) | The page's framing: evidence levels, questions, reasons for no attribution |
| [`src/content/geo/basemap.ts`](../src/content/geo/basemap.ts) | Generated basemap ([§11](#11-the-map)) |
| [`scripts/check-live-sources.ts`](../scripts/check-live-sources.ts) | `npm run live:check`: runs every loader once and prints the result |
| [`scripts/build-basemap.mjs`](../scripts/build-basemap.mjs) | Regenerates the basemap from Natural Earth |
| [`tests/`](../tests/) | Unit tests, with real captured responses as fixtures |

## 4. Sources

The registry, [`data/live-sources.json`](../data/live-sources.json), is the canonical record. Each entry has the institution, official and documentation URLs, access method, endpoints, authentication, rate limits, update frequency and observed latency, licence and attribution, freshness policy, fields, what the source can and cannot show, limitations, for unused sources the reason, and a verification block with quotes from the official pages (and the archive copy, where one was read) and a list of what is still unverified. `humanVerified` is `false` for every entry. Status values follow the brief: AVAILABLE, PARTIALLY AVAILABLE, MANUAL SOURCE, REQUIRES ACCESS and NOT YET VERIFIED.

### Integrated (data shown on `/live`)

| Source | Publisher | Access | Licence | Status |
| --- | --- | --- | --- | --- |
| NASA FIRMS, VIIRS 375 m active fires (NOAA-20, NOAA-21) | NASA LANCE FIRMS | Open regional CSV files, no key. With `NASA_FIRMS_MAP_KEY` set, the documented area API instead | No licence named for these products; NASA asks redistributors to cite FIRMS and link its disclaimer | AVAILABLE |
| 24-hour PSI and pollutant sub-indices, 5 regions | NEA via data.gov.sg | v2 real-time API, key optional | Singapore Open Data Licence v1.0 | AVAILABLE |
| 1-hour PM2.5, 5 regions | NEA via data.gov.sg | as above | as above | AVAILABLE |
| Wind direction, wind speed, rainfall, by station | MSS (NEA) via data.gov.sg | as above | as above | AVAILABLE |
| General forecast by state, for the current day | MET Malaysia via data.gov.my | Weather API, no token | CC BY 4.0 | AVAILABLE |
| Coastlines and land boundaries (bundled, not fetched) | Natural Earth v5.1.2 | Downloaded once by a script; committed | Public domain | AVAILABLE |

### Linked, not copied

| Source | Why |
| --- | --- |
| DOE Malaysia, Air Pollutant Index Management System (APIMS) | MANUAL SOURCE. No documented public data feed or dataset of current readings was found. The APIMS page loads its readings from internal addresses that are not documented for public use, and the licence for reuse is unclear. The page links to APIMS and summarises DOE's published method. |

### Named, not linked (terms of use need a human decision)

| Source | Why |
| --- | --- |
| NEA haze website (haze.gov.sg) | MANUAL SOURCE. Its robots.txt disallows all automated access. NEA's Terms of Use are inconsistent on linking: clause 4.3 allows hyperlinking for "personal, internal, non-commercial or informational purposes", while clause 12 asks for notice before linking to the home page and permission before linking to internal pages. Clause 6 forbids automated copying. |
| ASEAN Specialised Meteorological Centre (ASMC) | MANUAL SOURCE. Publishes the official regional haze picture for ASEAN. Its terms of use have the same inconsistency (clauses 4.3 and 8.1) and forbid automated or manual monitoring or copying without NEA's written permission (clause 6.2). |
| ASMC WIS 2.0 data portal (pilot) | NOT YET VERIFIED. Every request for hotspot data failed (HTTP 502 or 504) in two independent checks; only a daily haze-map image worked. Its licence is contradictory. |

### Reference only (researched, not used)

data.gov.my Monthly Air Pollution (PARTIALLY AVAILABLE: monthly, latest month December 2024); Air Pollutant Index datasets on archive.data.gov.my (NOT YET VERIFIED: 2014–2020, downloads failed); MET Malaysia API (REQUIRES ACCESS: registration token); BMKG open data (AVAILABLE, context only); SiPongi+ (MANUAL SOURCE). See the registry and [DATA_SOURCES.md](DATA_SOURCES.md#experiment-003-sources-opened-and-checked) for details.

### Source reliability

What the experiment learned about how far each integrated source can be relied on. Details and quotes are in the registry entries named.

| Source | Official quality statement | Known error modes | Observed delivery | Consistency checks |
| --- | --- | --- | --- | --- |
| NASA FIRMS (`nasa-firms`) | Near-real-time data; NASA provides LANCE and FIRMS data "as is" | A detection marks a pixel centre about 375 m across; position errors are usually under 100 m but can be several kilometres; fires are missed under cloud, smoke or canopy, between overpasses, or when small or cool; gas flares, volcanoes and industrial heat are detected too and are not labelled in near-real-time data | Files rewritten about hourly; the newest NOAA-21 detection was about 4 hours old in a file rewritten at 18:55 UTC on 14 October 2026; "24h" files can hold detections more than a day old | The sceptic agent matched NASA's documented column names and the regional box against the live files |
| PSI and PM2.5 (`datagovsg-psi`, `datagovsg-pm25`) | Provided by data.gov.sg "as is"; no statement on quality control or later revision was found in the pages read | Documented units in the PSI response are inconsistent, so only index values are used; the API's `date` history is incomplete | Usually 15–61 minutes after the hour; on 14 October 2026 three readings were 98–216 minutes late | The published PSI equalled the highest of the five published sub-indices in every region-hour checked for the five regions (455 across six dates), but not in a "national" series returned for 1 January 2021 |
| Wind and rainfall (`datagovsg-wind-*`, `datagovsg-rainfall`) | "The data is subject to correction subsequently if necessary"; readings "could thus be influenced by local conditions" | The wind direction convention (from or towards) is not documented | Readings about 5 to 9 minutes old when served | Units checked against each response (`degrees`, `knots`, `mm`) |
| MET Malaysia forecast (`datagovmy-weather-forecast`) | A forecast, not a measurement | Live values use terms, such as "Jerebu", that the documentation does not list; a period has one description, so haze can go unmentioned | Updated daily; carries no issue time | Each forecast must be for the requested day; others are rejected and counted |

### Required notices

- **data.gov.sg.** The Singapore Open Data Licence asks for "a conspicuous notice acknowledging the source of the datasets and including a link to the most recent version of this Licence", and forbids suggesting official status or endorsement. Each Singapore panel shows the licence's example notice, filled in with the dataset name and the retrieval date, and says that JEREBU.EXE is not affiliated with or endorsed by NEA or data.gov.sg.
- **NASA FIRMS.** FIRMS asks anyone who provides its data to a third party to use its acknowledgement and to replicate or link its disclaimer. The fire section carries that acknowledgement word for word, the product DOI for NOAA-20 (no DOI was found for the NOAA-21 product), and a link to NASA's data use guidance and disclaimer for FIRMS. No licence is named for these products: NASA's guidance says data from NASA-led missions are CC0 unless marked otherwise, but does not say whether that covers VIIRS on NOAA's satellites. NASA material must not be used to suggest NASA's endorsement, and the page does not.
- **data.gov.my.** CC BY 4.0 attribution to MET Malaysia via data.gov.my.
- **Natural Earth.** Public domain; credited in the map caption.

### How the project's integration rules were applied

[DATA_SOURCES.md](DATA_SOURCES.md#rules-for-future-integrations) sets 16 rules for integrating a source. This branch:

- **Departs from rule 1 (Evaluated first).** No human evaluated the sources before integration; AI agents did. The two integrated sources listed on `/evidence` carry the interim status "integrated, pending evaluation". A human must decide.
- **Partly meets rule 8 (provenance with every record).** Each retrieval records the registry id, the URL requested (with any key replaced), the retrieval time in UTC, the server's own date and the validation notes, and the licence is in the registry. But observations carry registry ids, not the ids in DATA_SOURCES.md (five of the feeds have no entry there); no raw response is kept; FIRMS is kept only as a summary; and processing steps are documented in the code and this document, not stored with each record.
- **Meets rules 2–7 and 9–16** as described in the sections above: terms and licences followed for the sources used, and NEA and ASMC named rather than linked pending a decision (2); one request per source per refresh, within the published limits for one copy of the site (3; see [§8](#8-caching-and-refresh) for hosting); the static architecture kept (4); keys only in server-side environment variables, never committed, never sent to browsers (5–7); provenance and the real-time nature of values shown on the page (9); ageing data labelled delayed or stale, never shown as current (10); Malaysia's and Singapore's indices not compared (11); the agencies behind the two government portals credited (12); no hotspot presented as a fire, and no attribution (13–14); no personal data (15); AI involvement recorded (16).

## 5. Schemas

### Source registry

[`data/live-sources.schema.json`](../data/live-sources.schema.json) (JSON Schema draft 2020-12) defines a registry entry. A test validates the registry against it, and [`registry.ts`](../src/lib/live/registry.ts) re-checks the parts the page depends on when the site is built: unique ids, HTTPS addresses, a valid freshness policy for every integrated source, no credential variable with a `NEXT_PUBLIC_` prefix, no key-like string in an endpoint (in a query string or in the URL path, where FIRMS puts its key), a reason for every source not used, and no web address in the attribution of a source that may not be linked.

### Observation (provenance per value)

From [`types.ts`](../src/lib/live/types.ts):

| Field | Meaning |
| --- | --- |
| `sourceId` | The registry id |
| `level` | Always `"observation"`. Interpretations use a separate type. |
| `metric`, `value`, `unit` | What was measured, the published value, and the unit the source documents. `value` is `null` when the source gave none, never `0`. |
| `observedAt` | When the value applies, ISO 8601 with offset, as published |
| `averaging` | The averaging period, where the value is an average |
| `location` | A satellite pixel centre, a station, or a reporting region (region coordinates are the source's label position, not a station) |
| `qualityFlags` | `real-time` (published "as is", with no statement of quality control), FIRMS confidence class, or `future-timestamp` |
| `rawReference` | Where in the raw response the value came from. Never contains a credential. |
| `attributes` | Other documented fields from the same record, unchanged |

There is deliberately no field for cause, owner or responsibility.

### Retrieval record (provenance per request)

Every snapshot records `retrievedAt` (UTC; for a failed retrieval, the time it was attempted), every request made (URL with any key replaced by `{MAP_KEY}`, HTTP status, the server's `Date` header and, for FIRMS files, `Last-Modified`), counts of records received, accepted and rejected, validation notes in plain language, and a typed failure when there is no data. Next to each dataset the page shows the source, the time the data describes, the retrieval (or attempt) time, the status and any validation notes; when a source fails, it shows the reason and the HTTP status. `npm run live:check` prints the whole record, including the request URLs and server dates.

### Forecast

MET Malaysia's forecast is a `ForecastRecord` with `level: "forecast"`, the day it is for, the wording per period as published (in Malay), and the summary. It never enters a list of observations.

### Interpretation (reserved, unused)

`Interpretation` exists so that any future reading of the data, by a person, a rule or an AI model, is stored apart from the observations, says how it was produced and whether a human reviewed it. Experiment 003 produces none.

## 6. Freshness

Environmental data misleads when readers cannot tell how old it is. Each integrated source has a freshness policy in the registry: a basis time and two thresholds, with the reasons.

| State | Rule |
| --- | --- |
| **Recent** | age ≤ the source's "recent" threshold: within its normal update cycle. Not real time: every source publishes with a delay. |
| **Delayed** | between the two thresholds: later than expected. The source may be late, or the page may not have refreshed. |
| **Stale** | older than the "stale" threshold, or, for a forecast, the day it forecasts has ended: too old to describe current conditions. Shown for the record only. |
| **Age unknown** | retrieved, but nothing in the response shows how old the data is: for example, satellite files with no detections. It cannot be read as describing current conditions. |

Three further statuses describe the absence of data, and none of them says anything about the world:

| Status | Meaning |
| --- | --- |
| **Unavailable** | The source could not be retrieved, or its response failed validation. Nothing is shown. |
| **Not configured** | This copy of the site lacks a credential a source needs, so no request was made. (No integrated source currently needs one: FIRMS falls back to its open files.) |
| **Not integrated** | No documented public data feed was found, or the source's terms need a human decision, so the page does not copy its readings. |

### Thresholds

| Source | Measured from | Recent | Delayed | Stale | Reason (abridged from the registry) |
| --- | --- | --- | --- | --- | --- |
| NASA FIRMS | newest detection in NASA's files | ≤ 16 h | ≤ 30 h | > 30 h | VIIRS typically views an area twice a day, with full global coverage every 12 hours; FIRMS aims to publish within 3 hours of an overpass (about 4 hours was observed) and rewrites the files about hourly. The newest detection can be up to about 16 hours old even when the feed is current. Beyond 30 hours, at least one full overpass cycle has been missed. |
| PSI, PM2.5 | reading time | ≤ 150 min | ≤ 6 h | > 6 h | Hourly readings, usually arriving 15–61 minutes after their hour (three arrived 98–216 minutes late on 14 October 2026). |
| Wind direction, wind speed, rainfall | reading time | ≤ 30 min | ≤ 3 h | > 3 h | Described as updated every five minutes. |
| MET Malaysia forecast | retrieval time | ≤ 6 h | ≤ 24 h | > 24 h | A forecast carries only the day it is for, not an issue time; updated daily. Once that day has ended (midnight, Malaysia time) it is shown as stale whatever its age. |

**Re-checked in the browser.** The server classifies freshness when it retrieves the data. Because a cached page can be served long after that, a small client component ([`freshness-label.tsx`](../src/components/live/freshness-label.tsx)) recomputes the state and the age against the reader's clock every 30 seconds ("observed 34 min ago"), and marks a forecast stale once its day has ended. Without JavaScript, the state at retrieval is shown, labelled "status when retrieved", and the retrieval time is in the provenance panel.

**Times that cannot be trusted.** A basis time that cannot be read gives "Age unknown", not "Recent". Readings dated more than five minutes after the retrieval time are kept and flagged, but are not used to judge freshness, and a note says so. A basis time more than five minutes ahead of the reader's clock is flagged in the browser ("timestamp is ahead of your clock").

## 7. Failure behaviour

**No data never becomes zero.** A source that cannot be read produces an "unavailable" snapshot with no observations, never an empty list that could be read as "nothing happened". The page then says the source is unavailable, why, and what the gap does not mean, and keeps the source's provenance: the time of the attempt, labelled as an attempt, with "Not retrieved" in place of the newest data.

| Failure | Detected by | What the page says |
| --- | --- | --- |
| No network, DNS or TLS failure | `fetch` error | "Connection failed. The source could not be reached." |
| Timeout: 15 s for data.gov.sg and data.gov.my; up to 30 s per FIRMS file and 45 s for both | `AbortSignal.timeout`, covering the whole response | "Timed out." with "No response within N seconds" or "The response did not finish arriving within N seconds" |
| HTTP error | status ≥ 400 | The status; 401/403 as a refusal, 429 as rate-limited |
| Redirect | status 3xx | "The source redirected the request (HTTP N); this site reads only the documented address." Redirects are never followed. |
| FIRMS key rejected | FIRMS's plain-text error ("Invalid MAP_KEY.") | "NASA FIRMS rejected the configured MAP_KEY as invalid." |
| Oversized response (2 MB data.gov.sg and data.gov.my, 30 MB per FIRMS file) | size cap | "The response was larger than the N limit." |
| Not JSON, or not CSV with the required columns | parser | "The response was not valid JSON." and similar |
| Wrong structure, wrong unit, no readings, or no value for the headline metric (PSI or 1-hour PM2.5) | validator | A specific message, for example "The response had no usable "psi_twenty_four_hourly" readings." |
| A FIRMS file whose rows all fail validation | validator | "None of the file's N rows could be read in the documented format." That file counts as failed, never as "no detections". |
| Single implausible value (outside the documented or physical range) | validator | Value rejected and counted; the reason listed under "Notes from this retrieval" |
| Station or region without a value | normaliser | "No reading", never 0 |
| One FIRMS satellite fails, the other works | loader | Outcome "partial": detections shown with a notice that one satellite's data is missing; the status table, the §06 sentence and the map description say the count is incomplete |
| The two FIRMS files fail for different reasons | loader | Each file's reason, with its HTTP status |
| One of two related feeds fails (wind direction or speed; PSI or PM2.5) | panel | A notice for the failed feed; its column reads "Not retrieved", not "No reading" |
| A response dated more than 10 minutes from the retrieval time | server `Date` header | A note saying it may be a cached copy |

**Zero is a real value only when a source reports it.** If FIRMS answers with valid files, none of whose rows was rejected, that show the feed is current (the newest detection anywhere in NASA's files is recent) and that contain no detections inside the map window, the page says "NASA FIRMS reported no detections inside the map window for this period", and adds that this is a report of zero detections, not of zero fires. If the files are complete but cannot be dated, were partly unreadable, or one was missing, the page says instead that the files contained no detections in the window but that this is not a report of zero detections, and the map is labelled "ZERO NOT CONFIRMED". A rain gauge reporting 0 mm is a measurement of no rain; a gauge with no value is "No reading".

**Retry.** A failed source is cached for a shorter time (the `liveRetry` profile: revalidate after 2 minutes), so it is tried again sooner.

## 8. Caching and refresh

Each source's snapshot is wrapped in `"use cache"` with a cache-lifetime profile defined in [`next.config.ts`](../next.config.ts):

| Profile | Used for | stale | revalidate | expire |
| --- | --- | --- | --- | --- |
| `liveHourly` | PSI, PM2.5 | 5 min | 15 min | 2 h |
| `liveWeather` | wind, rainfall | 5 min | 10 min | 1 h |
| `liveSatellite` | FIRMS | 5 min | 30 min | 3 h |
| `liveForecast` | MET Malaysia forecast | 5 min | 60 min | 6 h |
| `liveRetry` | any source that just failed | 1 min | 2 min | 10 min |

- **At build time** every source is fetched once, and the page is prerendered with the results.
- **On a long-running Next.js server** (`npm run start`, or a self-hosted server whose in-memory cache persists), a request that arrives after a snapshot's `revalidate` time gets the cached page while the snapshot is fetched again in the background. There, these timings bound how often the site contacts each source. They are not freshness labels: those come from the data's own times.
- **On serverless hosts** that cache usually does not persist (the bundled Next.js documentation says so for `"use cache"`). Every page refresh, every 10 minutes or every 2 minutes while a source is failing, would then fetch every source again, unless a persistent cache handler (`cacheHandlers`, or `"use cache: remote"`) is configured. Choose hosting with this in mind.
- **On a host that only serves files**, the data stays as it was at build time. The retrieval times are on the page, and readers' browsers label the data delayed, then stale, as it ages.
- Every profile keeps `stale` at 30 seconds or more and `expire` at 5 minutes or more, which `ensureStatic = "navigation"` requires for content to stay prerendered.
- **Prerender time limit.** Next.js stops a `"use cache"` function that runs longer than 54 seconds while prerendering (0.9 × the default `staticPageGenerationTimeout` of 60 s), which would fail the build. The FIRMS loader therefore gives its two requests 45 seconds in all; the other loaders time out after 15 seconds and run at the same time.

**No hidden reuse.** Every source request uses `cache: "no-store"`, so Next.js's fetch cache never answers on the source's behalf. This was a real bug found during the experiment: without it, a second build reused stored responses while stamping a new retrieval time, so old data would have been shown as newly retrieved. Each request now also records the server's `Date` header, and a response dated more than 10 minutes from the retrieval time is flagged. A test covers this.

**FIRMS is cached as a summary.** A busy fire season can produce tens of thousands of detections a day. The FIRMS snapshot keeps the retrieval record and a deterministic summary (counts, time range and a 0.1° density grid), not every detection, which keeps the page small (about 600 KB of HTML, about 90 KB compressed, when measured on 15 October 2026 with 23,610 detections in the window). The detections themselves stay one link away, at NASA.

## 9. Credentials and security

| Variable | Needed? | Used for | Where it is read |
| --- | --- | --- | --- |
| `NASA_FIRMS_MAP_KEY` | No | Switches FIRMS from the open regional files to the documented area API for the map window | [`snapshots.ts`](../src/lib/live/snapshots.ts), on the server, inside the cached scope |
| `DATA_GOV_SG_API_KEY` | No (recommended for production by data.gov.sg) | Sent as the `x-api-key` header to raise data.gov.sg's rate limits | [`snapshots.ts`](../src/lib/live/snapshots.ts), on the server |

- **Nothing is required.** Every integrated source works without a credential. No key was used, created or requested during Experiment 003.
- **Server only.** Neither variable has the `NEXT_PUBLIC_` prefix, so Next.js never puts it in browser JavaScript. `snapshots.ts` imports `server-only`, so the build fails if client code imports it. A build made with dummy values for both variables (and every source address made unreachable) contained neither value anywhere in its output.
- **Never stored or shown.** The FIRMS key travels only in the request URL. Every stored or displayed URL has it replaced with `{MAP_KEY}`, error messages never include URLs, and the key is read inside the cached scope, so it never becomes part of a cache key or an argument. The data.gov.sg key travels only in a request header, which is not recorded. Tests check the redaction.
- **No redirects.** Requests do not follow redirects. A credential in a header or a URL can therefore never be sent on to another address, and the address recorded is the one that answered.
- **Not in the repository.** [`.env.example`](../.env.example) lists the two names with empty values. `.env*` files other than the example are git-ignored. To use a key locally, put it in `.env.local` (which `npm run live:check` also reads); on a host, set it in the host's environment settings.
- **Keys expire.** data.gov.sg emails a key's owner 3 months, 1 month, 3 weeks and 1 week before it expires. Renew the key and update the host's setting, or remove the variable to return to keyless access.
- **Outbound requests only.** The site sends GET requests to fixed, documented URLs. Nothing a reader sends reaches a source: the page has no inputs, forms or query parameters that affect requests.
- **Polite access.** Requests carry the User-Agent `JEREBU.EXE/0.1 (+https://github.com/Kingway87/jerebu-exe)`. FIRMS requests go one at a time, a second apart, as FIRMS's robots.txt asks (`Crawl-delay: 1`). The 5 data.gov.sg requests per refresh are within the keyless limit of 6 calls per 10 seconds for one copy of the site. data.gov.sg does not say whether the limit is counted per address, per key or globally, so `npm run live:check`, a second build or a second server on the same address could push the total over it; the datasets over the limit would then show as unavailable ("Too many requests") until the next retry. Nothing is scraped: every integrated source is a documented file or API.
- **Untrusted input.** Responses are parsed as JSON or CSV only, never executed, with size caps and validation. Source text is rendered by React, which escapes it, and look-ups by source-supplied values ignore inherited properties.

See also [SECURITY.md](../SECURITY.md).

## 10. Privacy

- The page does not ask for the reader's location, and does not use browser geolocation.
- It sets no cookies and uses no local storage.
- It loads nothing from other websites: no map tiles, fonts, scripts or images from third parties. The map is drawn from data in the site's own code.
- It collects no health information and has no forms.
- Times are shown in UTC+8, the time zone of Malaysia and Singapore, so the page does not need the reader's time zone. The browser's clock is used only to re-check freshness, and nothing is sent anywhere.

Browser tests during the experiment (Playwright, Chrome) confirmed that loading `/live` made requests only to the site itself, and left no cookies or storage.

## 11. The map

The map in §02 is a static SVG drawn on the server: no map library, no tile server, no client-side JavaScript.

- **Basemap.** Natural Earth v5.1.2 1:10m land polygons and land boundary lines (public domain). [`scripts/build-basemap.mjs`](../scripts/build-basemap.mjs) downloads them from a pinned commit of Natural Earth's official repository, checks each file against its git blob SHA-1, clips to the map window plus a 0.5° margin (so cut edges fall outside the frame instead of drawing false straight coastlines), simplifies the shapes (Douglas–Peucker, 0.02°, about 2 km), and writes SVG path data to [`src/content/geo/basemap.ts`](../src/content/geo/basemap.ts), which is committed. Building the site needs no download.
- **Projection.** Plate carrée: longitude and latitude used directly as x and y. Near the equator the distortion is small, and the projection keeps the arithmetic obvious.
- **Boundaries.** Only Natural Earth's land boundary lines of type "Land" are drawn (water-indicator lines, such as the one through the Johor Strait, are left out). They follow Natural Earth's de facto depiction, are drawn only to help readers find their way, and say nothing about any boundary question. The caption says so, and repeats NASA's statement that its fire data imply no opinion on any frontier or boundary.
- **Detections.** Not drawn as points. Detections are counted in cells of 0.1° (about 11 km), and each cell is shaded by its count in four classes (1–4, 5–19, 20–99, 100 or more). A detection marks a pixel centre with a position uncertainty of hundreds of metres or more, and drawing points would suggest a precision the data does not have.
- **When there is nothing reliable to draw**, the map says so on its face: "NO DATA RETRIEVED" when FIRMS could not be read, "ZERO NOT CONFIRMED" when the files contained no detections in the window but could not be confirmed complete and current. The density legend is then replaced by a sentence saying that an empty map here is not a map of no fires.
- **Map window.** 95°E–119.5°E, 6.5°S–7.5°N: Peninsular Malaysia, Singapore, Sumatra and Borneo. It is a display window chosen by the AI, not a claim about where smoke comes from. Detections outside it are counted and the count is shown. Changing it is a human decision ([`study-area.ts`](../src/lib/live/study-area.ts) and the basemap script must change together).
- **Not shown:** smoke, fire perimeters, land ownership, concessions, company boundaries.
- **Accessible.** The SVG has a title and a text description. The list of the busiest cells gives the same information in text.

## 12. The role of AI

- **AI built this.** Claude Code (an AI coding agent) researched the sources, designed and wrote the code, the tests and this document, from the founder's brief. AI research agents opened the official pages; separate AI sceptic agents re-checked their findings and corrected several; AI review agents then reviewed the finished branch. The [experiment record](../experiments/003-live-evidence.md) lists the main corrections; the agents' full reports are not in the repository.
- **No AI at run time.** No AI model is called when the site is built or served. Every value on the page is fetched, validated, normalised and summarised by deterministic code, whose rules an AI wrote and a human has yet to review.
- **Not yet checked by a human.** Every source fact in the registry was gathered by AI agents. Until a human verifies them, the integrated sources carry the status "integrated, pending evaluation" on `/evidence`, and the page header says the experiment awaits human review.

## 13. Testing

```bash
npm test             # unit tests (Node's test runner, through tsx; Node 22 or later)
npm run live:check   # one real request per source; prints what the page would show
npm run check        # lint, typecheck, tests, build
```

- **Unit tests** ([`tests/`](../tests/)) cover the freshness rules and their boundaries; how a retrieval is labelled (including "Age unknown"); the registry against its schema, including checks that reject a `NEXT_PUBLIC_` credential variable or a key-like string in an endpoint's query or path; the shared fetch client (redirects refused, the size cap with and without a declared length, a timeout while the body arrives, HTTP 401 and 403, the fetch-cache regression); data.gov.sg through the shared loader (PSI, plus a unit mismatch on wind speed, a range check on PM2.5, a missing headline metric, a future-dated reading, an error in the body, an HTML page instead of JSON, an empty response, HTTP 429, network errors and timeouts); FIRMS (open files and the keyed API, the time budget, key redaction and an invalid key, a header-only file, files whose rows all fail validation, one or both files failing, future-dated rows, binning at cell edges, times without leading zeros); the MET Malaysia forecast (the Malaysian date, the documented vocabulary, the haze term, the end of the forecast's day, HTTP 429); the observation sentences; and the claims register. Only FIRMS has a partial outcome. They run without a network or a credential: `fetch` and the clock are injected.
- **Fixtures** ([`tests/fixtures/live/`](../tests/fixtures/live/)) are real responses captured on 14–15 October 2026, each with a provenance file giving the URL, retrieval time, HTTP status and how the sample was chosen. See [`tests/fixtures/README.md`](../tests/fixtures/README.md). They are test inputs only and are never shown on the site.
- **`npm run live:check`** runs the same loaders against the real sources and exits with code 1 if any is unavailable, so it can be used as a scheduled check. It reads the optional keys from the environment or `.env.local` and never prints them.
- **Browser checks** (during the experiment, not in CI): no requests to other sites, no cookies or storage, no hydration or console errors, no broken links or anchors, no accessibility violations reported by axe on `/live`, and no horizontal overflow at 320, 375, 768 and 1280 pixels wide. A build with every source address made unreachable showed each source as unavailable, with its reason, and no zero anywhere.

## 14. Operating the page

**Adding a source.** Research it first and record it in the registry with status, licence, rate limits and verification evidence, and in [DATA_SOURCES.md](DATA_SOURCES.md). Write a pure normaliser with tests against a real captured response, a loader that never throws, a `"use cache"` wrapper with a suitable profile, and a freshness policy with its reasons. Add it to the status table and the page. Register any new factual claim in [`src/content/claims.ts`](../src/content/claims.ts). Do this in a documented experiment with human review.

**Changing a threshold.** Edit the source's `freshness` in the registry, with the reason. The page reads it from there; update the table in this document by hand.

**When a source changes its format.** Responses that no longer match, including FIRMS files whose rows can no longer be read, fail validation, and the page shows that source as unavailable with the reason. Run `npm run live:check` to see the failure, capture a new fixture, and update the normaliser.

**Before a production deployment** (a human decision, not taken in this experiment): obtain a data.gov.sg API key and set `DATA_GOV_SG_API_KEY` (and plan for its renewal); decide whether to request a FIRMS MAP_KEY; choose hosting that runs Next.js with a persistent cache (see [§8](#8-caching-and-refresh)); decide the linking questions for NEA and ASMC; and check the registry's sources against the official pages.

## 15. Limitations

- **Malaysia's main air-quality measure is not shown as data.** No documented public feed of current Air Pollutant Index readings was found. The page links to DOE's own page instead. This is the largest gap.
- **The regional picture is not shown.** ASMC publishes the official regional haze situation, but no licensed, working, machine-readable source was found, so it is named, not copied. Hard-coding its alert level would go stale.
- **One country's weather.** The wind and rain measurements are from Singapore's stations only. A wind reading at one station cannot show where smoke came from.
- **Real-time data carries no statement of quality control.** data.gov.sg provides its APIs "as is", and its weather data is "subject to correction subsequently if necessary". Whether NEA revises real-time air readings could not be confirmed (haze.gov.sg disallows automated access).
- **Satellites miss fires.** Cloud, thick smoke, tree canopy, the timing of overpasses and small or short-lived fires all cause missed detections. NASA's "24h" files can include detections more than a day old; the page shows the actual range.
- **Fixed thresholds.** The freshness thresholds come from published update cycles, one night's observation by AI agents, and past-day records from the PSI API. They may need adjusting after longer use.
- **The map window was chosen by the AI.** It covers Malaysia, Singapore and the nearest land, but it is not based on any analysis of where smoke comes from.
- **Wind direction convention.** The data.gov.sg documentation does not say whether direction is where the wind blows from (the usual meteorological convention) or towards. The page assumes the usual convention and says so.
- **Keyless use of data.gov.sg** is described by data.gov.sg as "for testing purposes".
- **MET Malaysia's forecast vocabulary** includes values, such as "Jerebu", that the API documentation does not list. They are shown as published, in Malay, without a translation. A forecast that does not mention haze is not a forecast of clear air.

## 16. Future work

In rough order of value (for human decision):

1. **Human verification** of the registry entries and of the "integrated, pending evaluation" status (see the experiment record's review list).
2. **Malaysia's Air Pollutant Index.** Ask DOE whether a documented feed or dataset of current readings exists, or can be provided, and on what terms.
3. **ASMC.** Ask ASMC (via NEA) about linking and reuse, and about the WIS 2.0 portal's status and licence. MSS also publishes some WIS 2.0 datasets as WMO "core" data, which WMO describes as free and unrestricted, such as surface and upper-air observations; they were not tested.
4. **History.** Keep a dated record of snapshots so that trends can be shown with a stated baseline (needs storage and a documented design).
5. **More stations.** Malaysian weather observations, if a documented source exists.
6. **Interpretation, done carefully.** Any interpretation (for example, "PSI rose over the past 24 hours") would use the reserved `Interpretation` type, state its method, and be reviewed before display.

Nothing here should become attribution. See [METHODOLOGY.md](METHODOLOGY.md).

---

<sub>AI involvement: this document is **AI GENERATED** by Claude Code during Experiment 003. **UNVERIFIED**: no human has yet checked it against the code or the sources.</sub>
