# Data sources

Candidate public data sources for future JEREBU.EXE experiments.

> **Status, 15 October 2026.**
>
> - **Two entries are Integrated.** Experiment 003 integrated them, and the project's maintainer reviewed them with the rest of `/live`'s evidence on 15 October 2026. Every other entry from Experiment 001 is still a *Candidate*: none of those has been evaluated by a human.
> - **Experiment 003 opened and checked 17 sources**, using AI agents, for the live evidence page, `/live`. It integrated seven official data feeds from NASA FIRMS, data.gov.sg and data.gov.my. Two of them are entries in this list (NASA FIRMS and the data.gov.sg PSI API). They first carried an interim status, *Integrated, pending evaluation*, because the rule below says a source must be Evaluated first; after the maintainer's review on 15 October 2026 they are *Integrated*. See [Experiment 003: sources opened and checked](#experiment-003-sources-opened-and-checked).
> - **The full record of the Experiment 003 sources is machine-readable:** [`data/live-sources.json`](../data/live-sources.json), with quotes from the official pages.
> - **The haze history is not a data feed.** Since Experiment 002 (15 October 2026), the `/timeline` pages quote figures from published documents, each with its source, from a static file ([`data/haze-events.json`](../data/haze-events.json)) compiled by an AI agent. That research opened publications from several organisations on this list, and cited three of their published datasets as sources (NEA's historical 24-hour PSI and NEA's real-time PSI API, both on data.gov.sg, the latter read through `api.data.gov.sg/v1/environment/psi`, and Malaysia's monthly air pollution averages on data.gov.my); some figures on the timeline were worked out by the AI agent from these datasets, and say so. Experiment 002 did not evaluate or integrate any of those organisations or datasets under the checklist below, and no human has yet checked its use of them.
> - **No API key is used or stored.** Two optional keys are documented for server-side use only, and none is in the repository.
> - **The AI that compiled the Experiment 001 entries never opened those pages.** Experiment 002 later read some of them, or other pages on the same sites, as sources for the timeline, without evaluating them. The Experiment 003 updates were written by AI agents; the registry entries they summarise were reviewed by the project's maintainer on 15 October 2026, as part of the evidence on `/live` (the individual checks were not itemised). Every other link must be opened and checked by a human before anyone relies on it.
> - Inclusion is not an endorsement. It is not a claim that a source is accurate, complete, current or fit for any purpose.

## Contents

- [How this list was made](#how-this-list-was-made)
- [Experiment 003: sources opened and checked](#experiment-003-sources-opened-and-checked)
- [Status definitions](#status-definitions)
- [Evaluation checklist: Candidate to Evaluated](#evaluation-checklist-candidate-to-evaluated)
- [How to read an entry](#how-to-read-an-entry)
- [Regional (ASEAN)](#regional-asean)
- [Malaysia](#malaysia)
- [Singapore](#singapore)
- [Indonesia](#indonesia)
- [Global](#global)
- [Research discovery](#research-discovery)
- [Other references (not data)](#other-references-not-data)
- [Not found](#not-found)
- [Rules for future integrations](#rules-for-future-integrations)
- [Maintaining this list](#maintaining-this-list)

## How this list was made

This list was produced by AI agents during [Experiment 001](../experiments/001-autonomous-bootstrap.md), on 14 October 2026. The method had real limits, and they are set out here.

1. **Search only.** Five AI search agents ran web searches, each assigned one group of targets: satellite and regional, Malaysia, Singapore, Indonesia, and global and research. Across all six agents, including the sceptic agent described below, the run made about 173 tool calls, which were web searches.
2. **No page was opened.** Web page fetching did not work in the environment: the page-fetch tool failed for every host, and the container's own network blocked most government hosts. **No AI agent opened any page on this list.** Everything below comes from search-result titles, snippets and summaries produced by the search tool. Those summaries are machine-generated and can be wrong, out of date or internally inconsistent.
3. **Official domains.** Each URL is one that appeared in search results, normally on the operator's official domain. Exceptions are flagged in the entry. One court-records host is not on a government domain, and some URLs were first seen only as text inside other pages.
4. **A sceptical second pass.** A sixth agent reviewed all 46 entries and re-searched the doubtful ones. It:
   - kept every entry: 26 as "keep" and 20 as "keep with caveat";
   - corrected or supplied 4 URLs (for NASA Worldview, Indonesia's Ministry of Forestry, peraturan.go.id and JDIHN);
   - flagged 14 overclaims, such as a misspelt legal entity name, a misdescribed court circular and contradictory dataset dates.

   This document applies those corrections, and each correction is noted in the entry it affects. Irrelevant details that the sceptic flagged have been removed, such as a personnel note and an old website outage.
5. **Human check still needed.** The sceptic was also an AI agent working from search results. Its review lowers the risk of error but does not remove it. **A human must open and check each link before relying on it.**

46 entries were found. 45 are candidate data sources, listed below by jurisdiction. The other one is a governance reference (the Contributor Covenant), listed separately under [Other references](#other-references-not-data). 17 search targets were not found. They are listed under [Not found](#not-found).

**Relationship to the website.** The `/evidence` page shows a shorter, curated list of 27 of these sources, defined in [`src/content/sources.ts`](../src/content/sources.ts). Entries shown there are marked "Shown on /evidence" below. This document is the fuller record, with caveats.

## Experiment 003: sources opened and checked

[Experiment 003](../experiments/003-live-evidence.md) (live evidence) researched sources for current observations: satellite fires, Malaysian and Singaporean air quality, and regional weather and haze. Unlike Experiment 001, its agents could open pages.

**How it was checked.** Five AI research agents, one per area, opened the official pages and made small numbers of requests on 14–15 October 2026. Five AI sceptic agents then re-checked the researchers' main claims against the official pages and tried to refute them: of 91 claims checked, 64 were confirmed, 21 partially confirmed, 5 refuted and 1 could not be checked. Most of their corrections are applied below and in the registry; the experiment record lists the main ones. NASA's earthdata.nasa.gov pages refused automated requests, so their wording was read from Internet Archive copies (27 August to 12 October 2026). **The project's maintainer reviewed the evidence presented on `/live`, including the registry, on 15 October 2026; the individual checks were not itemised.** The research and sceptic agents' lapses of conduct (requests made before reading a site's terms or robots.txt, requests to disallowed paths and undocumented endpoints, and one-off requests to ASMC's websites) are disclosed in the experiment record.

**The canonical record** is [`data/live-sources.json`](../data/live-sources.json): for each source, its access method, endpoints, authentication, rate limits, update frequency, licence and attribution, what it can and cannot show, limitations, and quotes from the official pages. The table below summarises it. Statuses are the brief's: AVAILABLE, PARTIALLY AVAILABLE, MANUAL SOURCE, REQUIRES ACCESS, NOT YET VERIFIED.

| Source | Status | Use on `/live` | Entry below |
| --- | --- | --- | --- |
| NASA FIRMS, VIIRS active fires (NOAA-20, NOAA-21), open regional files | AVAILABLE | Integrated | `nasa-firms` |
| NASA FIRMS area API | REQUIRES ACCESS (free MAP_KEY) | Used instead of the files if `NASA_FIRMS_MAP_KEY` is set | `nasa-firms-api` |
| data.gov.sg PSI (NEA) | AVAILABLE | Integrated | `datagovsg-psi-api` |
| data.gov.sg PM2.5, real time (NEA) | AVAILABLE | Integrated | (new) |
| data.gov.sg wind direction, wind speed, rainfall (MSS) | AVAILABLE | Integrated | (new) |
| data.gov.my Weather API forecast (MET Malaysia) | AVAILABLE | Integrated | (new) |
| Natural Earth | AVAILABLE | Bundled basemap | (new) |
| DOE Malaysia APIMS | MANUAL SOURCE | Linked, not copied | `doe-apims-myeqms` |
| data.gov.my Monthly Air Pollution | PARTIALLY AVAILABLE | Not used | `datagovmy-air-pollution` |
| archive.data.gov.my Air Pollutant Index datasets | NOT YET VERIFIED | Not used | (new) |
| NEA haze website | MANUAL SOURCE | Named, not linked | `haze-gov-sg` |
| ASMC | MANUAL SOURCE | Named, not linked | `asmc` |
| ASMC WIS 2.0 portal | NOT YET VERIFIED | Named, not linked | `asmc-regional-haze-situation` |
| MET Malaysia API | REQUIRES ACCESS (registration token) | Not used | `metmalaysia` |
| BMKG open data | AVAILABLE | Not used (context) | `id-bmkg` |
| SiPongi+ | MANUAL SOURCE | Not used | `id-sipongi` |

### Main findings

**NASA FIRMS**

- NASA's regional "South East Asia" active-fire files (CSV) download without a key, and FIRMS's own outage notice recommends them while its country API is unavailable. The FAQ says they are "updated every 60 minutes"; their Last-Modified time changes about hourly even when the content does not, so it is not the data's time. Files labelled "24h" can hold detections more than a day old.
- The area API needs a free MAP_KEY, requested by email, with a limit of "5000 transactions / 10-minute interval". An invalid key gets HTTP 400 "Invalid MAP_KEY.".
- A detection marks "the center of a pixel flagged as containing one or more fires or other thermal anomalies"; FIRMS says "We are not able to determine the exact location or size of the fire", and "Different types of thermal anomalies are not currently attributed in the NRT MODIS or VIIRS data."
- Suomi NPP data delivery ends after 2 November 2026 at 13:00 UTC (NOAA NESDIS notice); some FIRMS text still says 1 November.
- No licence is named for the VIIRS products. NASA's data use guidance says data from NASA-led missions are CC0 unless marked otherwise; it does not say whether that covers VIIRS on NOAA's satellites. FIRMS asks anyone who provides its data to third parties to use its acknowledgement wording and replicate or link its disclaimer.
- Other routes, not used: WMS/WFS and the two-month text archive (REQUIRES ACCESS), the archive download tool and the Fire Map (MANUAL SOURCE), per-country yearly summaries (PARTIALLY AVAILABLE), a page of days with missing data (MANUAL SOURCE), and an experimental "static thermal anomalies" layer that "is not available for distribution" (MANUAL SOURCE: link only, never copy).

**Singapore**

- data.gov.sg's v2 real-time APIs for PSI and PM2.5 (and for weather) work without a key. The guide says keyless access is "for testing purposes" and strongly recommends a key for production. Limits: 6, 12 or 30 calls per 10 seconds (no key, development key, production key); enforcement was announced for 31 December 2025 (originally 1 November 2025), OGP's update for the first quarter of 2026 says the limits were "rolled out incrementally", and data.gov.sg says it is still fine-tuning them.
- Readings are hourly; on the days checked they usually appeared 15–61 minutes after their hour, but on 14 October 2026 three night readings arrived 98–216 minutes late. Current responses give regional values only, and the documented units in the PSI response are inconsistent, so `/live` uses index values only.
- The Singapore Open Data Licence v1.0 asks for "a conspicuous notice acknowledging the source of the datasets and including a link to the most recent version of this Licence", gives an example notice, and forbids suggesting official status or endorsement.
- NEA's FAQ: the PSI is the highest of six pollutant sub-indices, with bands from Good (0–50) to Hazardous (above 300). NEA's 1-hour PM2.5 bands come from an NEA infographic; the FAQ gives the lower edge of Band II as 55, the infographic as 56. The research agent read these NEA pages once; the sceptic did not re-open them, because NEA's terms forbid automated copying, but found the published PSI equal to the highest published sub-index in all 455 region-hours it checked for the five regions (a "national" series returned for 1 January 2021 did not match in any of its 8 hours). It also noted that the ozone and carbon monoxide sub-indices behave like 8-hour averages, so the FAQ's "24-hour average" wording may be a simplification.
- haze.gov.sg's robots.txt disallows all automated access, so its pages were not opened. NEA's Terms of Use forbid automated copying (clause 6) and set conditions on linking (clause 12) that conflict with clause 4.3, which allows hyperlinking "for personal, internal, non-commercial or informational purposes".
- Not used: the API's `date` parameter for history (2016 and 2019 dates returned nothing; 2021 and 2023 dates were partial); historical datasets (PARTIALLY AVAILABLE, with about a month's lag); undocumented v1 endpoints (NOT YET VERIFIED, not for integration); the two-hour forecast (AVAILABLE).

**Malaysia**

- DOE publishes the hourly Air Pollutant Index on its APIMS page and app. No documented public feed or downloadable dataset of current readings was found; the page loads readings from undocumented internal addresses. DOE's open-data page lists the index as an open dataset under the Malaysian Government Open Data Terms of Use, but links to the APIMS page. The licence for reuse is therefore unclear.
- DOE's method document: the index is the highest of seven sub-indices covering six pollutants (ozone has 1-hour and 8-hour sub-indices), each averaged over its own period, with bands from Good (0–50) to Hazardous (above 300). The document has internal inconsistencies, recorded in the registry.
- DOE's only documented API (api.doe.gov.my) is for submitting industrial emissions data (REQUIRES ACCESS; out of scope). Its data request portal is a manual application (MANUAL SOURCE).
- data.gov.my's Open API needs no token, allows 4 requests a minute and is CC BY 4.0. Its monthly air pollution dataset ended in December 2024 when checked, with gaps. The legacy portal lists 18 Air Pollutant Index datasets (13 described as hourly readings for a state or territory) for 2014–2020, but every download attempt failed (relevant to history work, not to `/live`).
- MET Malaysia's forecasts are available through data.gov.my without a token. Values are in Malay only, and the live data uses terms, such as "Jerebu", that the documentation does not list (it lists "Berjerebu" as "Hazy."). MET Malaysia's own API needs a registration token.

**Regional**

- ASMC publishes the official regional haze picture, hotspot information and alert levels, but its terms forbid automated or manual monitoring or copying without NEA's written permission (clause 6.2) and are internally inconsistent about linking (clauses 4.3 and 8.1). MANUAL SOURCE; named, not linked.
- ASMC's WIS 2.0 portal is a pilot. Every request for hotspot data failed (HTTP 502 or 504) in two independent checks; only a daily haze-map image worked. WMO's caches do not keep its "recommended" data, so there is no fallback, and its licence is contradictory. NOT YET VERIFIED.
- ASMC's older AVHRR hotspot-count page still describes counts as "based on the NOAA-19 satellite", which NOAA decommissioned on 13 August 2025. It is not a current series.
- BMKG's open data needs no key and must credit BMKG; SiPongi+ requires the citation "SIPONGI KEMENHUT" but restricts copying. Both are context only.
- A lead, not tested: Meteorological Service Singapore publishes some WMO WIS 2.0 datasets as "core" data, which WMO describes as free and unrestricted, including surface and upper-air observations.

**Maps**

- Natural Earth is public domain and needs no key; `/live` uses a basemap generated from it once and committed. Its land-boundary file also contains water-indicator lines, which the basemap leaves out.
- OpenStreetMap's standard tiles were rejected: they would send every reader's browser to a third party, and OpenStreetMap says it "cannot provide a free-of-charge map API or map tiles for third-parties". Map libraries were not needed.

## Status definitions

Every source moves through three states, in order. No source may skip a state.

| Status | Meaning | Who can change it |
| --- | --- | --- |
| **Candidate** | The source has been located, for example by search, but not evaluated. Nothing about its reliability, method, licence or limits is known beyond what is written here. | Anyone, by pull request |
| **Evaluated** | A named human has opened the source and reviewed its provenance, method, licence or terms, update frequency and known limitations, and the findings are recorded in this document. *Evaluated does not mean "reliable". It means the source's properties are documented.* | A human reviewer, by pull request |
| **Integrated** | The site uses the source in code, and the processing is documented: what is fetched, when, how it is transformed and how it is labelled. | A maintainer, by pull request, as part of a documented experiment |

**Interim status (Experiment 003).** *Integrated, pending evaluation*: integrated on an experiment branch and checked by AI agents, but not yet Evaluated by a human. Such a source must be evaluated, or removed, before the branch is merged. Whether to keep this state at all is a human decision. No entry is in this state now.

**Current counts** (entries in this document): 43 Candidate · 0 Evaluated · 2 Integrated (in Experiment 003, after the maintainer's review on 15 October 2026) · 0 Integrated, pending evaluation. Experiment 003 also integrated five feeds that are not entries here (data.gov.sg PM2.5, wind direction, wind speed and rainfall, and the data.gov.my weather forecast); they are recorded in [`data/live-sources.json`](../data/live-sources.json).

## Evaluation checklist: Candidate to Evaluated

A source becomes **Evaluated** only when a human has worked through this checklist and recorded the answers, with the date, in the source's entry. Leave a gap visible rather than guessing. If AI helped with the evaluation, say so, as described in [`AI_TRANSPARENCY.md`](AI_TRANSPARENCY.md).

- [ ] **Opened and confirmed.** The link loads and is the resource described. Record the date checked and the final URL after any redirects.
- [ ] **Operator.** Confirm who runs it from the source itself, for example an about page, footer or imprint, not from a third party. Check that the domain belongs to that operator.
- [ ] **Primary or secondary.** Is this the original publisher, or an aggregator or mirror? If secondary, identify the upstream source and consider evaluating that instead.
- [ ] **Content.** Record what it measures or contains: variables, units, spatial coverage, time coverage and resolution.
- [ ] **Method and provenance.** Record how the data or documents are produced: instrument, algorithm, station network, model or editorial process. Link the method documentation and note the product version.
- [ ] **Licence and terms.** Record whether reuse and redistribution are allowed, what attribution is required, and any restrictions. Quote the exact wording and link to it.
- [ ] **Access.** Is it a web page, a download or an API? Record whether registration or a key is needed, the rate limits and the cost.
- [ ] **Update frequency and latency.** Record how often it changes, whether recent values are provisional and later corrected, and whether archives and past versions are kept.
- [ ] **Known limitations.** Record the limits the operator itself states, for example detection limits, missing records or quality-control status, as well as any documented criticisms.
- [ ] **Stability.** Look for service notices, deprecations, domain changes and organisational restructuring that affect the source.
- [ ] **Language.** Record the languages it is available in, and whether a translation is needed to evaluate it.
- [ ] **Legal and court material only.** Is the text authoritative or an unofficial version? Which version and date is it? Legal content must not be summarised without the checks planned for Experiment 004 (see [`ROADMAP.md`](ROADMAP.md)).
- [ ] **Personal data.** Does the source contain personal data, such as names in court judgments? If so, note it, and note that it must not be republished without a documented reason and privacy design.
- [ ] **Recorded.** Update the entry in this document and its `status` in [`src/content/sources.ts`](../src/content/sources.ts) in the same pull request, with the evaluator's name or handle and the date.

## How to read an entry

Every entry has the same fields.

- **Operator**: who runs it, as described in search results. This is not independently confirmed.
- **Category**: the kind of source.
- **URL**: the URL to check first. Where the sceptic corrected a URL, the corrected one is given and the originally found URL is also shown.
- **What search results said**: a short, neutral paraphrase of search titles, snippets and summaries. It has not been checked against the page itself.
- **Access**: what results said about how to get at the data, such as keys, downloads or licences. "Not stated in results" means the results said nothing about access, not that access is open.
- **Caveats**: known problems, ambiguities and conflicts. Dated operational notices, such as maintenance windows or satellite changes, are marked *as reported in search results; not verified*.
- **Confidence**: the search agent's own rating (high, medium or low) of how well search results supported the entry. Where the sceptic recommended a change, both ratings are shown. **This is not a rating of data quality**, and no human has reviewed it.
- **Sceptic verdict**: *Keep* or *Keep with caveat*. No entry was removed.
- **Status**: Candidate, for every entry except two that Experiment 003 integrated: they are *Integrated* since the maintainer's review on 15 October 2026.
- **Experiment 003 update**: present where Experiment 003's agents opened the source. It records what they found. Where the same facts appear in the registry shown on `/live`, the maintainer's review of 15 October 2026 covered them.

Entries marked **LEAD** are legal texts or legal databases. For these, **only their existence has been located. Their content has not been read or analysed, and this document makes no claim about what any law, agreement or judgment says or does.** Legal analysis belongs to Experiment 004.

---

## Regional (ASEAN)

### Satellite fire observations

#### ASEAN Specialised Meteorological Centre (ASMC)

- **Operator:** ASEAN Specialised Meteorological Centre, hosted by the Meteorological Service Singapore (National Environment Agency)
- **Category:** Satellite fire observations
- **URL:** <https://asmc.asean.org/home/>
- **What search results said:** ASMC's about page and NEA pages describe ASMC as giving early warning of transboundary smoke haze. They describe its website as offering satellite images, hotspot information, air-quality information and fire danger ratings. Results also showed plain-text daily hotspot count reports under `asmc.asean.org/files/msscommunity/hotspots/`.
- **Access:** Pages and hotspot text files appear to be public. No registration was mentioned. About page: <https://asmc.asean.org/asmc-about/>.
- **Caveats:** According to a portal snippet, hotspots mark *possible* fires detected by satellite and do not necessarily correspond to actual fires on the ground. Cloud cover or incomplete satellite passes can cause missed detections. Some ASMC pages are on a separate subdomain, `wis2.asmc.asean.org` (see the next entry), and how the two relate is unclear.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** ASMC's pages were opened. ASMC publishes the regional haze situation, hotspot information and alert levels. Its terms of use forbid any automatic device or manual process that monitors or copies its pages without NEA's written permission (clause 6.2), and are internally inconsistent about linking (clause 4.3 allows hyperlinking for non-commercial or informational purposes; clause 8.1 asks for notice or permission). Status MANUAL SOURCE. `/evidence` and `/live` now name ASMC without linking to it, pending a human decision. ASMC designates its WIS 2.0 portal (next entry) as the place to download hotspot data. Its hotspot page also links to daily NOAA-20 hotspot coordinate files for each area (near-real-time and reprocessed) under /files/msscommunity/hotspots/: public, plain fixed-width text with no documented format, schedule or stability, so not an API. Clause 6.2 restricts automated copying of them too. MANUAL SOURCE; not used.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `asmc` · Shown on /evidence

#### ASMC Regional Haze Situation (wis2 subdomain)

- **Operator:** ASEAN Specialised Meteorological Centre
- **Category:** Satellite fire observations
- **URL:** <https://wis2.asmc.asean.org/regional-haze-situation/>
- **What search results said:** Snippets describe a daily regional haze map that overlays satellite hotspots (from NOAA satellite data) and wind arrows from model analysis. They say it is updated more often at higher ASMC alert levels.
- **Access:** Public web page. A related NOAA-20 VIIRS satellite image page appeared at <https://wis2.asmc.asean.org/satellite-images-jpss-1-noaa-20>. It has a "data access API" field, but the field's value was not visible in the snippet.
- **Caveats:** A search summary calls `wis2.asmc.asean.org` a pilot portal. The main ASMC homepage has the same "Regional Haze Situation" title, so the main host is probably the canonical one, and this entry overlaps the ASMC entry. Consider merging the two after a human check. A search summary also noted an inconsistent "Updated" date in the page metadata.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** The wis2 host is ASMC's WIS 2.0 data portal, a pilot. Every request for hotspot data failed (HTTP 502 or 504) in two independent checks; only a daily haze-map image worked, and it is kept for about 36 hours. WMO's caches do not keep its "recommended" data, the licence is contradictory (WMO metadata names the Singapore Open Data Licence; the portal repeats ASMC's terms), and its Suomi NPP products are expected to stop when Suomi NPP data delivery ends in November 2026. Status NOT YET VERIFIED.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `asmc-regional-haze-situation`

### Meteorology

#### Fire Danger Rating System (FDRS) ASEAN

- **Operator:** Malaysian Meteorological Department (MetMalaysia)
- **Category:** Meteorology
- **URL:** <https://www.met.gov.my/en/iklim/fdrs-asean/>
- **What search results said:** This MetMalaysia page is titled "Fire Danger Rating System (FDRS) ASEAN". Its snippet says MetMalaysia produces the products daily. A related official page, "FDRS – ASEAN Observation Data", appeared at <https://myclimate.met.gov.my/fdrsWmsObsAseanMetPortal>. The sceptic also saw a page named `fdrsWmsNwpAseanMetPortal` on the same host.
- **Access:** Public web pages. The terms for using the data were not stated in results.
- **Caveats:** This entry is filed under Regional because it covers ASEAN, although a Malaysian agency runs it. It was found by chance while searching for another target. MetMalaysia's own pages name the agency inconsistently. One MetMalaysia page carried metadata suggesting it was old, so check how current each page is.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** The FDRS observation page (myclimate.met.gov.my) was opened. It describes daily fire danger rating products for Southeast Asia and carries "© MET Malaysia, All rights reserved". Its map layers come from a GeoServer service with no documented public use. Status MANUAL SOURCE.
- **Confidence:** Medium · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `metmalaysia-fdrs-asean`

### Government publications

#### ASEAN Haze Portal

- **Operator:** ASEAN Secretariat
- **Category:** Government publications
- **URL:** <https://hazeportal.asean.org/>
- **What search results said:** The portal describes itself as the ASEAN knowledge management platform on sustainable peatland and haze management. It hosts publications, news and training materials from the ASEAN Secretariat, Member States and partners.
- **Access:** Public website. No registration was mentioned.
- **Caveats:** Results present it as a knowledge and publications repository, not a real-time monitoring portal. Results name external partners that support its programmes (the EU, BMU and IFAD). An older "ASEAN Haze Action Online" site appeared only in a 1999 ASEAN Secretariat release, and no live address for it was found (see [Not found](#not-found)).
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `asean-haze-portal` · Shown on /evidence

### Governance reference

#### ASEAN haze page on asean.org (ASEAN Socio-Cultural Community)

- **Operator:** ASEAN Secretariat
- **Category:** Governance reference
- **URL:** <https://asean.org/our-communities/asean-socio-cultural-community/haze-2/>
- **What search results said:** asean.org pages describe the mandate and functions of the ASEAN Coordinating Centre for Transboundary Haze Pollution Control (ACC THPC). They state that the ASEAN Secretariat performs the interim ACC THPC role.
- **Access:** Public web page. A related "Major Sectoral Bodies/Committees" page also appeared.
- **Caveats:** The operational status of the ACC THPC is unclear, and this page may be out of date. News results report an ACC THPC inauguration in 2023 and a secretariat office inaugurated in Jakarta in April 2026. A 2026 report quotes a minister as saying the centre would formally operate only after all parties ratify. *As reported in search results; not verified.* No dedicated ACC THPC website was found. **New lead** from the sceptic, existence only: a PDF titled "Agreement on the Establishment of the ASEAN Co-ordinating Centre…" at <https://agreement.asean.org/media/download/20250714070239.pdf>.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `asean-org-haze-page`

### Legislation (leads)

#### ASEAN Agreement on Transboundary Haze Pollution, text on agreement.asean.org (LEAD)

- **Operator:** ASEAN Secretariat
- **Category:** Legislation (regional agreement)
- **URL:** <https://agreement.asean.org/media/download/20220330063051.pdf>
- **What search results said:** Searches for the agreement's title returned this PDF from ASEAN's agreements repository. The snippet showed the opening of the agreement.
- **Access:** Public PDF download.
- **Caveats:** **LEAD: only its existence has been located. The content has not been read or analysed.** (Experiment 002 note: the haze history research later downloaded this PDF and quoted passages from it, including its preamble, objective and entry-into-force clause, as sources for milestones on `/timeline`. It has still not been analysed or evaluated.) The file has a numeric name, so its identity rests on the search snippet. Other official ASEAN pages seen:
  - a news item, "ASEAN Haze Agreement to Enter Into Force" (<https://asean.org/asean-haze-agreement-to-enter-into-force>);
  - an ASEAN Resource Centre record (<https://resourcecentre.asean.org/Book_Detail/?ID=2131>).

  An asean.org copy of the agreement was referred to only by a third-party page and never appeared as a result itself.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `aathp-text-agreement-asean` · Shown on /evidence

#### ASEAN Agreement on Transboundary Haze Pollution, reprint on environment.asean.org (LEAD)

- **Operator:** ASEAN Secretariat (environment.asean.org)
- **Category:** Legislation (regional agreement)
- **URL:** <https://environment.asean.org/public/uploads/repositories/20220725-AATHP-reprint.pdf>
- **What search results said:** A result titled "20220725 AATHP reprint" is hosted on ASEAN's environment site. A search-engine summary said it contains the agreement text and terms of reference for the ACC THPC, but that rests only on the summary.
- **Access:** Public PDF download.
- **Caveats:** **LEAD: only its existence has been located. The content has not been read or analysed.** Two re-searches by the sceptic did not return this PDF. Unrelated files in the same repository use the same "20220725" prefix, so the prefix is probably an upload date, not a reprint date. A summary called the document a 2016 reprint. Check the file and its date.
- **Confidence:** Medium (search agent); the sceptic recommends **Low** · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `aathp-reprint-environment-asean`

---

## Malaysia

### Air quality

#### Air Pollutant Index Management System (APIMS), on MyEQMS

- **Operator:** Department of Environment Malaysia (Jabatan Alam Sekitar, JAS/DOE)
- **Category:** Air quality
- **URL:** <https://eqms.doe.gov.my/APIMS/main>
- **What search results said:** A result titled "Air Pollutant Index Management System (APIMS) - MyEQMS" appears on the DOE's eqms.doe.gov.my portal. An official document explaining how the Air Pollutant Index is calculated is hosted at <https://eqms.doe.gov.my/Documents/APIMS/API_Calculation.pdf>.
- **Access:** Public web portal. News snippets point to a mobile app, MyJAS EQMS. Requests for historical data appear to go through the DOE data request portal, <https://btm.doe.gov.my/permohonandata/>.
- **Caveats:** Here "API" means Malaysia's Air Pollutant Index, not an application programming interface. A reported renaming (APIMS to MyEQMS, and the app to MyJAS EQMS) is supported only by news reports and a third-party page, not by a DOE page. Search summaries mentioned a host `apims.doe.gov.my`, but no page on that host appeared in results, so do not use it until it is verified. An older DOE announcement refers to an earlier app.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** The APIMS page, its method document and DOE's open-data pages were opened. APIMS shows hourly readings for 68 monitoring stations, but no documented public feed or downloadable dataset of current readings was found: the page loads its data from undocumented internal addresses, which `/live` does not use. DOE's open-data page lists the Air Pollutant Index as an open dataset under the Malaysian Government Open Data Terms of Use, but links back to the APIMS page, so the reuse terms are unclear. The method document (API_Calculation.pdf) was read: the index is the highest of the pollutant sub-indices. Status MANUAL SOURCE. `/live` links to APIMS and summarises the method.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `doe-apims-myeqms` · Shown on /evidence

#### data.gov.my: Monthly Air Pollution

- **Operator:** The Government of Malaysia's open data portal (data.gov.my). The dataset's sources are listed as the Department of Environment and the Department of Statistics Malaysia.
- **Category:** Air quality
- **URL:** <https://data.gov.my/data-catalogue/air_pollution>
- **What search results said:** A "Monthly Air Pollution" dataset of monthly pollutant concentrations compiled from station data, available as CSV and Parquet files. The same dataset also appears on OpenDOSM (open.dosm.gov.my).
- **Access:** Open download (CSV and Parquet). The API is documented at developer.data.gov.my (API ID `air_pollution`), and snippets showed no key requirement. The licence is listed as CC BY 4.0 on the OpenDOSM listing; confirm it on data.gov.my itself.
- **Caveats:** Pages disagree on how current the data is. One summary says it runs to 31 December 2024, with some 2024 values missing. The OpenDOSM copy shows "Data as of 31 Dec 2022", last updated 27 November 2023. The data is monthly and aggregated, not real-time. A legacy portal (archive.data.gov.my) holds older air-quality datasets, and different listings give different coverage years for them.
- **Experiment 002 note:** the haze history research downloaded this dataset's CSV file and cited monthly values from it on `/timeline`, including comparisons the AI agent worked out from the data. The dataset has still not been evaluated or integrated.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** Opened through data.gov.my's Open API (no token; 4 requests a minute; CC BY 4.0, as stated on data.gov.my). The data ran to December 2024, with gaps: PM2.5 is missing for all of 2017, every pollutant for May and June 2017, and carbon monoxide for all of 2024. Monthly national averages only. Status PARTIALLY AVAILABLE; not used on `/live`. data.gov.my's legacy portal lists 18 Air Pollutant Index datasets (13 described as hourly readings for a state or territory) for 2014–2020, but every download attempt failed.
- **Confidence:** High (search agent); the sceptic recommends **Medium** because freshness is uncertain · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `datagovmy-air-pollution` · Shown on /evidence

### Meteorology

#### Malaysian Meteorological Department (MetMalaysia)

- **Operator:** Malaysian Meteorological Department (Jabatan Meteorologi Malaysia)
- **Category:** Meteorology
- **URL:** <https://www.met.gov.my/>
- **What search results said:** The official met.gov.my site carries forecasts, warning bulletins, marine forecasts, research publications and long-range outlooks. Related subdomains include myMETdata (mymetdata.met.gov.my).
- **Access:** Public website. A search summary says climate data requests go through the National Climate Centre, with charges set by a fee schedule. Verify this on the site.
- **Caveats:** MetMalaysia publications name different parent ministries over time, which points to ministry-level restructuring. The department's own name appears unchanged.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** MET Malaysia's API (api.met.gov.my) needs a registration token and allows "up to 1,000 requests a day with a burstable limit of 3 requests per minute"; its version 1 is deprecated (REQUIRES ACCESS; not used). The website's copyright statement restricts reuse without MET Malaysia's prior written consent. MET Malaysia's forecasts are available without a token through data.gov.my's Weather API (CC BY 4.0), which `/live` uses.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `metmalaysia` · Shown on /evidence

### Government publications

#### Department of Environment Malaysia (Jabatan Alam Sekitar, JAS/DOE)

- **Operator:** Department of Environment Malaysia
- **Category:** Government publications
- **URL:** <https://www.doe.gov.my/en/headquarter/>
- **What search results said:** Results include official doe.gov.my pages (contact, FAQ, online services and Acts pages) and subdomains such as eqms.doe.gov.my. A DOE statement reported in the news says the department publishes official statements, reports and statistics only through its official channels, including its website.
- **Access:** Public website. A DOE data request portal, "Permohonan Data Jabatan Alam Sekitar", appeared at <https://btm.doe.gov.my/permohonandata/>.
- **Caveats:** The homepage root never appeared as a result, so the URL given is a subpage on the same host. The sceptic's re-search returned other `/en/` pages but not this one. A legacy section (`doe.gov.my/portalv1/…`) still appears, so some links may be out of date. DOE pages name the parent ministry differently, but there is no sign that the DOE itself was renamed.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `doe-malaysia` · Shown on /evidence

### Legislation (leads)

#### Laws of Malaysia: federal legislation portal (LEAD)

- **Operator:** Attorney General's Chambers of Malaysia (AGC)
- **Category:** Legislation (portal)
- **URL:** <https://lom.agc.gov.my/>
- **What search results said:** The AGC's federal legislation portal lists principal Acts, amendment Acts, ordinances and subsidiary legislation, with individual Acts available as PDFs.
- **Access:** Results say the portal's terms page allows federal legislation to be read and downloaded free of charge: <https://lom.agc.gov.my/tnc.php>. The e-Federal Gazette is a separate portal, which appeared at the non-HTTPS address `http://www.federalgazette.agc.gov.my/`.
- **Caveats:** **LEAD: only its existence has been located. No legislation has been read or analysed.** According to search results, the AGC says its online updated texts are not the official reprint, and the results refer to Section 14 of the Revision of Laws Act 1968 (not verified). Check which version is authoritative before citing any text. An older AGC portal address (`agc.gov.my/agcportal/…`) also appears. A third-party note says no free-text search API was found.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `agc-laws-of-malaysia` · Shown on /evidence

#### Environmental Quality Act 1974 (Act 127) (LEAD)

- **Operator:** Attorney General's Chambers of Malaysia. A copy is also hosted by the Department of Environment.
- **Category:** Legislation
- **URL:** <https://lom.agc.gov.my/act-detail.php?type=original&lang=BM&act=127>
- **What search results said:** The AGC portal has a detail page for Act 127, with PDFs of a reprint and of an online updated text. The DOE's Acts page (<https://www.doe.gov.my/en/act/>) also hosts a copy.
- **Access:** Free PDF download. An online updated text appeared at <https://lom.agc.gov.my/ilims/upload/portal/akta/outputaktap/2194944_BI/Act%20127%20(Online%202025).pdf>.
- **Caveats:** **LEAD: only its existence has been located. Its content and legal effect have not been read or summarised, and its relevance to haze has not been assessed.** Several versions exist: a reprint, an online updated text and the PDF of an amendment Act. Search results say the online versions are not the official reprint (not verified; see the Laws of Malaysia entry). Check which version is current before citing it.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `my-eqa-1974-act127`

### Court records

#### eJudgment (Malaysian Judiciary)

- **Operator:** Office of the Chief Registrar of the Federal Court of Malaysia, Malaysian Judiciary
- **Category:** Court records
- **URL:** <https://ejudgment.kehakiman.gov.my/ejudgmentweb/searchpage.aspx?JurisdictionType=ALL>
- **What search results said:** A search page for written grounds of judgment, by case number, parties and keywords, with filters for court, judge and upload date. The government services portal (malaysia.gov.my) lists a court judgment search service under the Office of the Chief Registrar.
- **Access:** Results describe it as a free public search.
- **Caveats:** Two search pages on different kehakiman.gov.my hosts appear in results. The other is <https://cms2.kehakiman.gov.my/CommonWeb/ejudgment/SearchPage.aspx?JurisdictionType=ALL>, and which is canonical is unresolved. Search summaries say coverage starts from 2007 for the Federal Court, Court of Appeal and High Court (not verified). No judgment has been searched or read. Judgments may name individuals, so see [Rules for future integrations](#rules-for-future-integrations).
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `kehakiman-ejudgment` · Shown on /evidence

---

## Singapore

### Air quality

#### National Environment Agency (NEA)

- **Operator:** National Environment Agency, Singapore
- **Category:** Air quality. This is the agency's main website.
- **URL:** <https://www.nea.gov.sg/>
- **What search results said:** The result is titled "The National Environment Agency". Search summaries say the homepage links to a haze website and to haze situation updates.
- **Access:** Not stated in results.
- **Caveats:** Results did not report any renaming or restructuring of NEA.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `nea-singapore`

#### NEA: Managing Haze

- **Operator:** National Environment Agency, Singapore
- **Category:** Air quality
- **URL:** <https://www.nea.gov.sg/our-services/pollution-control/air-pollution/managing-haze>
- **What search results said:** An NEA page titled "Managing Haze - Singapore", in the Air Pollution section. Snippets say it gives guidance on haze and points readers to NEA's other haze channels.
- **Access:** Not stated in results.
- **Caveats:** A related NEA air-pollution FAQ page also appeared: <https://www.nea.gov.sg/our-services/pollution-control/air-pollution/faqs>.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** NEA's Terms of Use forbid automated copying (clause 6) and ask for notice before linking to NEA's home page and permission before linking to internal pages (clause 12), which conflicts with clause 4.3. `/evidence` now names this page without linking to it, pending a human decision.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `nea-managing-haze` · Shown on /evidence

#### haze.gov.sg

- **Operator:** National Environment Agency, Singapore
- **Category:** Air quality
- **URL:** <https://www.haze.gov.sg/>
- **What search results said:** NEA's haze website, with a health advisory, an air-quality forecast, 1-hour PM2.5 readings and Pollutant Standards Index (PSI) readings. Its sub-pages include readings over the last 24 hours, historical readings and a PDF explaining how the PSI is computed.
- **Access:** Public website. Sub-pages seen:
  - <https://www.haze.gov.sg/resources/1-hr-pm2.5-readings>
  - <https://www.haze.gov.sg/resources/readings-over-the-last-24-hours>
  - <https://www.haze.gov.sg/resources/historical-readings>

  The sceptic's search results indicate that the site says data older than one year is on data.gov.sg.
- **Caveats:** Results say real-time data is published automatically and may later be verified and corrected. The reading tables are dynamic and were empty in the snippets. A legacy path, `/haze-updates/pollutant-concentrations`, also appeared over plain HTTP and may be out of date.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** haze.gov.sg's robots.txt disallows all automated access, so no page on it was opened. The same NEA readings are published through data.gov.sg, which `/live` uses. Whether NEA later verifies and corrects real-time readings remains unconfirmed. `/evidence` now names this site without linking to it, for the reasons given under NEA: Managing Haze.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `haze-gov-sg` · Shown on /evidence

#### data.gov.sg: Pollutant Standards Index (PSI) (API)

- **Operator:** data.gov.sg, the Singapore Government's open data portal. The data comes from NEA.
- **Category:** Air quality
- **URL:** <https://data.gov.sg/datasets/d_fe37906a0182569d891506e815e819b7/view>
- **What search results said:** A data.gov.sg dataset page titled "Pollutant Standards Index (PSI) (API)". The snippet says it is updated every 15 minutes.
- **Access:** Results say the APIs can be used without a key for testing, and a key is recommended for production use. Rate limits apply, and exceeding them returns HTTP 429. Results describe the licence as the Open Data Licence. **This project uses no key.**
- **Caveats:**
  - A data.gov.sg notice moved the deadline for its API-key upgrade (enforcement of rate limits) from 1 November 2025 to 31 December 2025.
  - The status page (status.data.gov.sg) lists the PSI and PM2.5 real-time APIs among its incidents, and notes that data may go stale during scheduled maintenance.

  Both notices are *as reported in search results; not verified.* A separate "Legacy Pollutant Standards Index (PSI) (API)" dataset also appears, with coverage reportedly ending in April 2026, so make sure the current dataset is used. The exact endpoint path and response format were not confirmed.
- **Experiment 002 note:** the haze history research cited nine responses from the v1 real-time endpoint (`api.data.gov.sg/v1/environment/psi`, called without a key) as sources for 2025 and 2026 readings on `/timeline`. That use did not evaluate or integrate the API, and the timeline does not call it; `/live` calls the v2 endpoint (next note).
- **Experiment 003 update (checked by AI agents, 15 October 2026):** Integrated on `/live`. The endpoint is https://api-open.data.gov.sg/v2/real-time/api/psi (JSON). It returns the 24-hour PSI and five pollutant sub-indices for five regions, hourly, and works without a key; data.gov.sg describes keyless access as "for testing purposes" and recommends a key for production. Readings usually appeared 15–61 minutes after their hour on the days checked (three arrived 98–216 minutes late on 14 October 2026). The documented units in the response are inconsistent, so `/live` uses index values only. Licence: Singapore Open Data Licence v1.0, which asks for a conspicuous notice with a link to the licence.
- **Confidence:** High · **Sceptic verdict:** Keep with caveat
- **Status:** Integrated (Experiment 003 branch; reviewed by Kingway87, project maintainer, on 15 October 2026) · ID `datagovsg-psi-api` · Shown on /evidence

#### data.gov.sg: Historical 24-hr PSI

- **Operator:** data.gov.sg. The data comes from NEA.
- **Category:** Air quality
- **URL:** <https://data.gov.sg/datasets/d_b4cf557f8750260d229c49fd768e11ed/view>
- **What search results said:** A data.gov.sg dataset titled "Historical 24-hr PSI", published by NEA. A collection page, "Historical Pollutant Standards Index (PSI)", and separate datasets for individual years also appeared.
- **Access:** Results describe the licence as the Open Data Licence. data.gov.sg API key tiers and rate limits apply (see the previous entry).
- **Caveats:** An older path also appeared: <https://data.gov.sg/dataset/historical-24-hr-psi>. The collection page seen was <https://data.gov.sg/collections/2215/view>.
- **Experiment 002 note:** the haze history research downloaded records from this dataset through the data.gov.sg API and cited them on `/timeline`, including figures the AI agent worked out from them, such as a year's highest 24-hour PSI. The dataset has still not been evaluated or integrated.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `datagovsg-historical-psi`

#### data.gov.sg: Historical 1-hr PM2.5

- **Operator:** data.gov.sg. The data comes from NEA.
- **Category:** Air quality
- **URL:** <https://data.gov.sg/datasets/d_6c0d5fc34838b12472475fdb73c0af29/view>
- **What search results said:** Historical 1-hour PM2.5 values for five regions of Singapore (North, South, East, West and Central), as a CSV file. The snippet says the series starts in April 2014.
- **Access:** Results describe the licence as the Open Data Licence. The page includes a sample API call. data.gov.sg API key tiers and rate limits apply.
- **Caveats:** The sceptic corrected the name. The dataset's title in results is "Historical 1-hr PM2.5", not "Historical regional 1-hr PM2.5" as first recorded. Its legacy address is `data.gov.sg/dataset/historical-1-hr-pm2-5`. The legacy path the search agent first gave, `…/air-pollutant-particulate-matter-pm2-5`, is probably a different dataset of annual values. Some per-year PM2.5 datasets carry a disclaimer that they may contain missing records and have not been quality-controlled. Timestamps are in Singapore time (ISO 8601).
- **Experiment 003 update (checked by AI agents, 15 October 2026):** A sceptic agent downloaded this dataset without a key. The CSV header is `1hr_pm25,north,south,east,west,central`, with day-first date labels and no time zone. It lagged the present by about a month. Status PARTIALLY AVAILABLE; not used on `/live`, which uses the real-time PM2.5 API (https://api-open.data.gov.sg/v2/real-time/api/pm25).
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `datagovsg-pm25-regional-hourly`

#### data.gov.sg Developer Guide: real-time APIs

- **Operator:** data.gov.sg
- **Category:** Air quality (API documentation)
- **URL:** <https://guide.data.gov.sg/developer-guide/real-time-apis>
- **What search results said:** The official developer guide documents the data.gov.sg real-time APIs, including a PM2.5 endpoint. Its OpenAPI specification uses an `x-api-key` header.
- **Access:** Related pages: <https://guide.data.gov.sg/developer-guide/api-overview/api-rate-limits> and <https://guide.data.gov.sg/developer-guide/api-overview/how-to-request-an-api-key>.
- **Caveats:** An API-key upgrade notice gave a deadline that was extended to 31 December 2025 (*as reported in search results; not verified*). The search tool reported that the rate-limits page it saw was old, so re-check the current limits.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** The guide's real-time API page documents only the PM2.5 endpoint; the PSI and weather specifications are on their dataset pages. The rate-limit page gives 6, 12 or 30 calls per 10 seconds for the v2 real-time APIs (no key, development key, production key), and says the limits are still being fine-tuned.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `datagovsg-developer-guide`

### Meteorology

#### Meteorological Service Singapore (MSS)

- **Operator:** Meteorological Service Singapore, part of NEA
- **Category:** Meteorology
- **URL:** <https://www.weather.gov.sg/about-our-organisation/>
- **What search results said:** weather.gov.sg pages are titled "Weather Information Portal". They include an About page, a 24-hour forecast, a 4-day outlook, monsoon updates and "Climate of Singapore". Snippets describe MSS as an operational arm of NEA.
- **Access:** Not stated in results.
- **Caveats:** The homepage root did not appear in results, so the About page is used instead. Results showed no sign of MSS being moved out of NEA. Some third-party sources use a different name ("Singapore Meteorological Service").
- **Experiment 003 update (checked by AI agents, 15 October 2026):** Not opened. `/live` uses MSS's station readings (wind and rainfall) through data.gov.sg instead. weather.gov.sg's terms of use were not read, although `/evidence` still links to this page.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `mss-weather-gov-sg` · Shown on /evidence

### Government publications

#### NEA Haze Situation Update advisories

- **Operator:** National Environment Agency, Singapore
- **Category:** Government publications
- **URL:** <https://www.nea.gov.sg/media/news/advisories/index/haze-situation-update-13-october-2026> (one example from a series)
- **What search results said:** NEA publishes dated "Haze Situation Update" advisories under nea.gov.sg/media/news/advisories. They report PSI and PM2.5 readings and forecasts. Results included updates dated in 2023 and in 2026.
- **Access:** Not stated in results.
- **Caveats:** This is a series of pages, each with its own dated URL. The sceptic's re-search found other October 2026 updates under the same path, but not the 13 October page given here. URL patterns are inconsistent (some use parentheses, for example `haze-situation-update-(21-september-2026)`). The search tool noted that some snippets were internally inconsistent, and that page metadata sometimes conflicted with the dates in the text. **Do not quote any figure without opening the page itself.** When citing, cite the specific update that was actually opened.
- **Confidence:** High · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `nea-haze-situation-updates`

### Legislation (leads)

#### Singapore Statutes Online (SSO) (LEAD)

- **Operator:** Attorney-General's Chambers, Singapore
- **Category:** Legislation (portal)
- **URL:** <https://sso.agc.gov.sg/Index>
- **What search results said:** The AGC's free public website for Singapore legislation. Its About Us page reportedly says it covers current Acts and subsidiary legislation, historical versions, bills, revised editions and Gazette versions.
- **Access:** Free. Results say the SSO FAQ sets conditions for reproducing legislation, including acknowledging Government copyright. AGC page: <https://www.agc.gov.sg/our-roles/drafter-of-laws/singapore-statutes-online>.
- **Caveats:** **LEAD: only its existence has been located. No legislation has been read or analysed.** According to a result summary, SSO's About Us page (<https://sso.agc.gov.sg/About-Us>) says the site provides an unofficial version that should not be relied on as the authoritative text, and that pre-1998 material may be incomplete. Ignore third-party mirrors that describe it otherwise.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `singapore-statutes-online` · Shown on /evidence

#### Transboundary Haze Pollution Act 2014 (LEAD)

- **Operator:** Attorney-General's Chambers, Singapore, via Singapore Statutes Online
- **Category:** Legislation
- **URL:** <https://sso.agc.gov.sg/Act/THPA2014>
- **What search results said:** An SSO result titled "Transboundary Haze" at `/Act/THPA2014` shows that the Act has a page on the official statutes portal.
- **Access:** Free on SSO.
- **Caveats:** **LEAD: only its existence has been located. Its content has not been read or analysed, and this document makes no claim about what the Act says or how it has been applied.** Results mention a 2020 Revised Edition. Related subsidiary legislation appeared at <https://sso.agc.gov.sg/SL/THPA2014-S622-2014>. Because of the SSO caveat above, check the authoritative text before relying on it. Third-party copies exist (FAOLEX, UNEP LEAP, Wikisource); prefer the official source.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `sg-transboundary-haze-pollution-act-2014`

### Court records

#### Singapore Courts: judgments and case summaries

- **Operator:** Singapore Judiciary (Singapore Courts)
- **Category:** Court records
- **URL:** <https://judiciary.gov.sg/judgments/judgments-case-summaries>
- **What search results said:** The page reportedly says it contains the written judgments of the Supreme Court of Singapore since 2000, and links to State Courts and Family Justice Courts judgments. A separate oral judgments page appeared at <https://www.judiciary.gov.sg/judgments/oral-judgments>.
- **Access:** Not stated in results.
- **Caveats:** One cached copy of the page showed "last updated 08 October 2021". A beta site also appeared (`beta.judiciary.gov.sg`). Results say oral judgments stay online for 12 weeks and are not to be cited as authoritative precedents. No judgment has been searched or read.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `sg-judiciary-judgments` · Shown on /evidence

#### eLitigation GD Viewer (Singapore Courts judgments)

- **Operator:** Singapore Courts, according to result titles and official judiciary references. The search agent could not confirm the operator directly.
- **Category:** Court records
- **URL:** <https://www.elitigation.sg/gd/Home/Index?Filter=SUPCT&YearOfDecision=All&SortBy=DateOfDecision&CurrentPage=3&SortAscending=False&PageSize=0&Verbose=False&SearchQueryTime=0&SearchTotalHits=0&SearchMode=True&SpanMultiplePages=False>
- **What search results said:** A listing titled "SG Courts Judgments" that hosts Supreme Court judgments. Registrar's Circular No 1 of 2024 on judiciary.gov.sg, a guide on generative AI tools, names the eLitigation GD Viewer as a case-law resource for self-represented persons. *This description was corrected by the sceptic. It was first overgeneralised as the circular pointing all court users to the viewer.*
- **Access:** Not stated in results.
- **Caveats:**
  - **Not a gov.sg domain.** The search agent marked it "official domain: no" until the operator is confirmed. judiciary.gov.sg describes the eLitigation service (<https://judiciary.gov.sg/services/elitigation>), which supports it being an official Singapore Courts system. Results show that its helpdesk is run by a vendor.
  - **The `/gd/` path may be a legacy address.** The URL above is a paginated search listing on that path, which returned older judgments. Current judgment pages use a `/gdviewer/` path (for example `elitigation.sg/gdviewer/s/2026_SGCA_7`). Once a human has confirmed it, prefer a `/gdviewer/` entry point.
  - No judgment has been read.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `elitigation-gd-viewer`

---

## Indonesia

Indonesian sources are listed because fires and haze also affect people in Indonesia, and because a transboundary problem cannot be understood from one side of a border. Including a source here says nothing about responsibility.

### Satellite fire observations

#### SiPongi+ forest and land fire monitoring (Sistem Pemantauan Karhutla)

- **Operator:** Ministry of Forestry (Kementerian Kehutanan, Kemenhut). It was previously under the former Ministry of Environment and Forestry (KLHK).
- **Category:** Satellite fire observations
- **URL:** <https://sipongi.gakkum.kehutanan.go.id/>
- **What search results said:** The ministry's forest and land fire (*karhutla*) monitoring system. It has a hotspot map ("Peta Hotspot") and hotspot distribution pages ("Sebaran Titik Panas") that can be filtered by period, province, satellite and confidence level. Results quote the ministry as saying that a hotspot is a temperature anomaly detected by satellite, not proof of fire.
- **Access:** Pages seen: `/peta` and `/sebaran-titik-panas`. A summary in the sceptic's results says data can be downloaded (XLSX, TXT or KMZ) with the citation "SIPONGI KEMENHUT". Not verified.
- **Caveats:** The search agent first reported that no page on this domain appeared in results. The sceptic's domain-restricted search then returned the root and the sub-pages directly, and that overclaim has been corrected. An older domain, `sipongi.menlhk.go.id`, still appears in results, for example for a user-guide PDF. **A hotspot is not a confirmed fire**, as the operator itself is quoted as saying.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** Opened. The hotspot page offers XLSX, TXT and KMZ downloads and says "Setiap penggunaan data yang bersumber dari website ini, wajib mencantumkan sumber: SIPONGI KEMENHUT" (any use of its data must cite SIPONGI KEMENHUT), while its disclaimer restricts copying and says information may not be updated in real time. No documented data feed. Status MANUAL SOURCE; not used.
- **Confidence:** Medium (search agent); the sceptic recommends **High** · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `id-sipongi` · Shown on /evidence

### Meteorology

#### Meteorology, Climatology and Geophysics Agency (BMKG)

- **Operator:** Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)
- **Category:** Meteorology
- **URL:** <https://www.bmkg.go.id/>
- **What search results said:** The official website of Indonesia's meteorology, climatology and geophysics agency. Results also included a BMKG press release on the spread of hotspots, and BMKG regulations on air-quality information, hosted on jdih.bmkg.go.id and peraturan.go.id. The regulations are leads only and have not been read.
- **Access:** Not stated in results.
- **Caveats:** The sceptic's re-search returned the homepage and `/profil` as direct results. This corrects the search agent's note that the root appeared only inside a snippet. No live air-quality or hotspot dashboard page was returned. Related subdomains: `iklim.bmkg.go.id` and `jdih.bmkg.go.id`.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** BMKG's open data portal (data.bmkg.go.id) was opened. Its weather forecast API needs no key, allows 60 requests per minute per IP address, and requires BMKG to be credited as the source. Status AVAILABLE, for context only; not used.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `id-bmkg` · Shown on /evidence

### Government publications

#### Ministry of Environment / Environmental Control Agency (KLH/BPLH)

- **Operator:** Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup
- **Category:** Government publications
- **URL:** <https://kemenlh.go.id/news/>
- **What search results said:** Pages on kemenlh.go.id carry the KLH/BPLH header. They have sections for news, publications, regulations, finance and public information (PPID), and include releases from 2025 and 2026.
- **Access:** Not stated in results.
- **Caveats:**
  - **Restructuring.** News results say the former Ministry of Environment and Forestry (KLHK) was split in October 2024 into KLH/BPLH and a separate Ministry of Forestry. Check which body now holds each function. The number of the regulation that made the split was not found.
  - **Domains.** The homepage root was not returned. The old KLHK domain, `menlhk.go.id`, still appears on older pages.
  - **Air-quality host.** A KLH release mentions `ispu.kemenlh.go.id` for air quality, but that host never appeared as a result. Lead only.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `id-klh-bplh` · Shown on /evidence

#### Ministry of Forestry (Kementerian Kehutanan, Kemenhut)

- **Operator:** Kementerian Kehutanan
- **Category:** Government publications
- **URL:** <https://www.kehutanan.go.id/pers> (corrected by the sceptic). The search agent originally found <https://www.kehutanan.go.id/s/uploads/Buku_Statistik_2024_V4_Web_da43ce89cb.pdf>.
- **What search results said:** The ministry's press-release page, titled "Kementerian Kehutanan". The originally found URL is a 2024 forestry statistics book on the same host, which results say covers topics including forest fires.
- **Access:** Not stated in results. Another press-release page also appeared, at `gakkum.kehutanan.go.id/siaran-pers`.
- **Caveats:** News results say the ministry was split from KLHK in October 2024. A claimed move of the website from menlhk.go.id to kehutanan.go.id in 2025 comes from encyclopedia pages, not from an official source; the sceptic moved it here from the description. Older documents remain on subdomains such as `ksdae.kehutanan.go.id` and on `menlhk.go.id`.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `id-kemenhut` · Shown on /evidence

### Legislation (leads)

#### peraturan.go.id: database of laws and regulations (LEAD)

- **Operator:** The Directorate General of Legislation (Direktorat Jenderal Peraturan Perundang-undangan), inferred from hosted documents and a search summary. The current name of its parent ministry is not confirmed.
- **Category:** Legislation (portal)
- **URL:** <https://peraturan.go.id/> (corrected by the sceptic). The search agent originally found <https://peraturan.go.id/files/perpres-no-155-tahun-2024.pdf>, a single regulation document on the same host, which has not been read.
- **What search results said:** The homepage is titled "Database Peraturan Perundang-undangan Indonesia". Many results are regulation PDFs under `peraturan.go.id/files/`, including State Gazette texts and presidential and ministerial regulations.
- **Access:** Pages seen: `/eng`, `/jenis` and `/cariglobal`.
- **Caveats:** **LEAD: only its existence has been located. No regulation has been read or analysed.** A summary named the parent as the "Ministry of Law and Human Rights", which may be the pre-2024 name, so treat the ministry's name with care. Results also show `ppid.peraturan.go.id`, and some older files use a former domain, `djpp.depkumham.go.id`. A news article notes that several agencies publish regulations with limited coordination, so the same text may exist in several places.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `id-peraturan-go-id` · Shown on /evidence

#### JDIH BPK: regulation database (LEAD)

- **Operator:** Badan Pemeriksa Keuangan (BPK)
- **Category:** Legislation (secondary database)
- **URL:** <https://peraturan.bpk.go.id/Jenis/1>
- **What search results said:** BPK's regulation database, part of its legal documentation network (JDIH). It can be browsed by type of regulation and year, and shows status metadata. Its disclaimer says the documents come from the originating agencies' websites and should be checked against them.
- **Access:** Not stated in results.
- **Caveats:** **LEAD: only its existence has been located. No regulation has been read or analysed.** This is a secondary government mirror, not the official place where regulations are first published.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `id-jdih-bpk`

#### JDIHN: national legal documentation and information network (LEAD)

- **Operator:** Badan Pembinaan Hukum Nasional (BPHN). The current name of its parent ministry is not confirmed.
- **Category:** Legislation (portal)
- **URL:** <https://jdihn.go.id/> (supplied by the sceptic). The search agent found no page on this domain and left the URL empty.
- **What search results said:** Government websites describe JDIHN as the national legal documentation network, with BPHN at its centre. They say member JDIH sites are integrated into a single portal for searching legal documents.
- **Access:** The sceptic's search returned the homepage, document detail pages (`jdihn.go.id/pencarian/detail/…`) and member subdomains.
- **Caveats:** **LEAD: only its existence has been located. No document has been read or analysed.** Results name the parent ministry both as Kementerian Hukum and as Kementerian Hukum dan HAM, and which is current is unconfirmed. Figures in results dated from 2023.
- **Confidence:** Low (search agent); the sceptic recommends **Medium** now that the URL is supported · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `id-jdihn`

### Court records

#### Supreme Court of Indonesia: directory of decisions (Direktori Putusan)

- **Operator:** Registry of the Supreme Court of Indonesia (Kepaniteraan Mahkamah Agung Republik Indonesia)
- **Category:** Court records
- **URL:** <https://putusan3.mahkamahagung.go.id/direktori/index/kategori/kehutanan-1.html>
- **What search results said:** The directory groups decisions by case type and subject category (for example "Kehutanan", forestry, and "Konservasi SDA"), with filters for court and year. The registry's annual reports describe it as the national repository of decisions from the Supreme Court, the appellate courts and the first-instance courts.
- **Access:** Not stated in results.
- **Caveats:** The URL is a single category page. **The root homepage never appeared in results.** Some documents cite `putusan.mahkamahagung.go.id` instead of `putusan3`, so the canonical address may vary. Counts in snippets differ between snapshot dates. No decision has been searched or read. Decisions may name individuals, so see [Rules for future integrations](#rules-for-future-integrations).
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `id-ma-direktori-putusan` · Shown on /evidence (the site links to this category page, with a note that the directory root was not seen in search results)

---

## Global

### Satellite fire observations

#### NASA FIRMS (Fire Information for Resource Management System)

- **Operator:** NASA (Earth Science Data Systems Program; served through LANCE/MODAPS, EOSDIS)
- **Category:** Satellite fire observations
- **URL:** <https://firms.modaps.eosdis.nasa.gov>
- **What search results said:** A free NASA web mapping platform that shows near-real-time active fire detections from the MODIS and VIIRS satellite instruments. Data can be viewed on the FIRMS fire map or in NASA Worldview, received as email alerts, or downloaded in several formats (SHP, KML, TXT, WMS).
- **Access:** Viewing the map is free. The API and the WMS/WFS web services need a free MAP_KEY (see the next entry).
- **Caveats:**
  - A mirror host, `firms2.modaps.eosdis.nasa.gov`, also appears in results.
  - Earthdata alerts list past maintenance windows. In January 2026, users were directed to the mirror for downloads, and MODAPS work in June 2026 affected FIRMS and LANCE. *As reported in search results; not verified.*
  - **Satellite transition notice.** Earthdata alerts say delivery of Suomi NPP data products ends on 1 November 2026; another official page gives 2 November 2026. Users are advised to move to NOAA-20 and NOAA-21. The effect on FIRMS's Suomi NPP layers was not confirmed. *As reported in search results; not verified.*
  - A "limited updates" notice that appeared only in a Wikipedia snippet could not be found on any official FIRMS page, so it is not repeated here (see [Not found](#not-found)).
  - A detection marks a thermal anomaly at a place and time. **It is not a confirmed fire, and it is not evidence of who is responsible.**
- **Experiment 003 update (checked by AI agents, 15 October 2026):** Integrated on `/live`, from NASA's open "South East Asia" 24h VIIRS files for NOAA-20 and NOAA-21 (no key). See [Experiment 003: sources opened and checked](#experiment-003-sources-opened-and-checked). The satellite transition notice above is now confirmed: NOAA NESDIS says Suomi NPP VIIRS data "will no longer be available after November 2, 2026, at 13:00 UTC", and `/live` does not use Suomi NPP.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Integrated (Experiment 003 branch; reviewed by Kingway87, project maintainer, on 15 October 2026) · ID `nasa-firms` · Shown on /evidence

#### NASA FIRMS API

- **Operator:** NASA FIRMS
- **Category:** Satellite fire observations (API)
- **URL:** <https://firms.modaps.eosdis.nasa.gov/api/>
- **What search results said:** Official FIRMS pages titled "API - Area", "API - Country", "API - Data Availability" and "API - Map Key" appear, together with a tutorial on using the API in Python. The Area endpoint returns fire detections as CSV for a bounding box, sensor and range of days.
- **Access:** **Requires a free MAP_KEY**, requested at <https://firms.modaps.eosdis.nasa.gov/api/map_key/>. A snippet gives a transaction limit for each time window, so check the current limit on the live page. **This project uses no key.**
- **Caveats:** The search engine flagged some indexed API pages as old, so confirm the current endpoints and limits. Each page also has a `/usfs/` variant, which serves FIRMS for the US and Canada. Do not mix the two.
- **Experiment 003 update (checked by AI agents, 15 October 2026):** Confirmed on the live API pages: a free MAP_KEY, requested with an email address; "MAP_KEY limit is 5000 transactions / 10-minute interval"; the area service takes a bounding box and 1 to 5 days; the country services are "currently not available". `/live` uses the area API only if `NASA_FIRMS_MAP_KEY` is set on the server. Status REQUIRES ACCESS.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `nasa-firms-api`

#### NASA Worldview

- **Operator:** NASA Earthdata / EOSDIS. Imagery comes through the Global Imagery Browse Services (GIBS).
- **Category:** Satellite fire observations (imagery browser)
- **URL:** <https://worldview.earthdata.nasa.gov/> (corrected by the sceptic). The search agent originally gave the information page, <https://www.earthdata.nasa.gov/worldview>.
- **What search results said:** NASA Earthdata pages describe Worldview as a tool to browse, compare, animate and download visualised satellite data products interactively. They list wildfire tracking and air quality among its uses.
- **Access:** Results say Worldview is open source, and that its data, software and services are freely available.
- **Caveats:** The search agent said the app's address appeared only inside third-party pages. The sceptic found it as a direct result, and that overclaim has been corrected. The information page appeared at <https://www.earthdata.nasa.gov/data/tools/worldview>, so the originally given `/worldview` address may be a redirect or out of date. Layer counts differ between sources. The Suomi NPP notice under FIRMS above was also repeated in these results.
- **Confidence:** High · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `nasa-worldview` · Shown on /evidence

### Modelling

#### Copernicus Atmosphere Monitoring Service (CAMS)

- **Operator:** ECMWF, which runs CAMS on behalf of the European Union (according to results)
- **Category:** Modelling
- **URL:** <https://atmosphere.copernicus.eu/>
- **What search results said:** The official CAMS site describes monitoring and forecasting of atmospheric composition and air quality. This includes global fire monitoring, smoke forecasts, an aerosol alerts service and a "Fire Emissions Watch" app.
- **Access:** Data is available through the Atmosphere Data Store (<https://ads.atmosphere.copernicus.eu/>). Account and licence requirements were not stated in results.
- **Caveats:** Related official pages seen:
  - <https://atmosphere.copernicus.eu/global-fire-monitoring>
  - <https://atmosphere.copernicus.eu/fire-monitoring>
  - ECMWF's page on CAMS: <https://www.ecmwf.int/en/about/what-we-do/environmental-services/copernicus-atmosphere-monitoring-service>

  The Copernicus Data Space Ecosystem notes that CAMS data are "currently being onboarded" there (*as reported in search results; not verified*). Ignore a host variant with a trailing dot that appeared in one result. CAMS forecasts and analyses are model outputs. On the evidence ladder they support **interpretation**, not observation.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `copernicus-cams` · Shown on /evidence

#### CAMS Global Fire Assimilation System (GFAS) emissions

- **Operator:** Copernicus Atmosphere Monitoring Service (ECMWF, on behalf of the EU)
- **Category:** Modelling
- **URL:** <https://ads.atmosphere.copernicus.eu/datasets/cams-global-fire-emissions-gfas>
- **What search results said:** GFAS uses satellite observations of fire radiative power to estimate fire emissions, and these estimates feed CAMS smoke forecasts. The dataset page on the Atmosphere Data Store is titled "cams global fire emissions gfas".
- **Access:** Distributed through the Atmosphere Data Store. Results say it is available in GRIB or netCDF format. Registration terms were not stated.
- **Caveats:** **The version is uncertain.** The Data Store and its documentation describe GFAS v1.2, which is based on MODIS. An official CAMS article says VIIRS data was added to GFAS from 4 December 2025 (a secondary result said 1 December), and a summary says GFAS v1.4.2 has been used in CAMS forecasts since an upgrade in May 2026. *As reported in search results; not verified.* Check which version the dataset actually serves. GFAS values are estimates derived from observations, not direct measurements of emissions.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `cams-gfas`

### Secondary aggregators

Aggregators republish data from other providers. Before relying on one, trace each value back to its upstream source and evaluate that source too.

#### Global Forest Watch fire alerts

- **Operator:** World Resources Institute (WRI)
- **Category:** Secondary aggregator
- **URL:** <https://fires.globalforestwatch.org/>
- **What search results said:** GFW pages describe fire alerts, updated daily from NASA and NOAA satellite data, shown on an interactive map that can be overlaid with other GFW datasets. *The sceptic corrected this: the search agent had named NASA only.* A GFW data page titled "VIIRS Active Fires" is also listed.
- **Access:** Other URLs seen: <https://www.globalforestwatch.org/map/> and <https://data.globalforestwatch.org/documents/gfw::viirs-active-fires/about>. Access terms were not stated in results.
- **Caveats:**
  - **Rebrand.** A WRI release is titled "Global Forest Watch Becomes Global Nature Watch", and a summary dates it to September 2026 (*as reported in search results; not verified*). Results say existing data and dashboards remain available, but URLs may change.
  - **Unclear page.** The fires.globalforestwatch.org page is titled "Forest Fires & Climate Change", and it is unclear whether it is the live fire dashboard. The `/map/` page appears to serve the general GFW map.
  - **Upstream data.** The underlying detections come from NASA and NOAA instruments.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `gfw-fires`

#### OpenAQ

- **Operator:** OpenAQ (non-profit)
- **Category:** Secondary aggregator (air quality)
- **URL:** <https://openaq.org/platform/>
- **What search results said:** OpenAQ describes itself as an open-source, open-access platform for ground-level air-quality data. It aggregates government reference monitors and low-cost sensors, and provides physical measurements rather than index values, through its Explorer web app and a REST API.
- **Access:** According to docs.openaq.org, the v3 API **requires a free API key**. The key is sent in an `X-API-Key` header and obtained by registering at <https://explore.openaq.org/register>. The terms (<https://docs.openaq.org/about/terms>) allow one key per individual. **This project uses no key.**
- **Caveats:** OpenAQ republishes data from third-party providers, so provenance and licence must be checked for each provider. The documentation lists an endpoint for licences. Keep reference monitors and low-cost sensors apart until the method for each is documented. About page: <https://openaq.org/about/>.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `openaq` · Shown on /evidence

---

## Research discovery

These services help find and check published research. They are not evidence in themselves. A DOI that resolves shows that a publication exists, not that its findings are correct.

### OpenAlex

- **Operator:** OpenAlex, formerly OurResearch. Results name Impactstory, Inc. as the legal entity. *The sceptic corrected a misspelling of this name in the search agent's output.*
- **Category:** Research discovery
- **URL:** <https://developers.openalex.org/>
- **What search results said:** A free and open (CC0) catalogue of scholarly works, authors, sources, institutions, topics, publishers and funders. It can be used through a web interface, a REST API or a full data snapshot.
- **Access:** Results say the API needs a free API key, with a daily free allowance and paid tiers for heavier use (<https://help.openalex.org/access/pricing/>). The documentation pages disagree on the size of the free allowance, so check the current terms.
- **Caveats:** A blog post ("We're now OpenAlex", on blog.openalex.org) says the OurResearch name was retired. Results say a rewritten system replaced the earlier one. The documentation is spread across developers.openalex.org, docs.openalex.org and help.openalex.org, and an older docsold.openalex.org also exists, so some documentation may be out of date. The root openalex.org interface did not appear in results. A 2025 preprint seen in results reports gaps and inconsistencies in the metadata, so check records against the publisher.
- **Confidence:** Medium · **Sceptic verdict:** Keep with caveat
- **Status:** Candidate · ID `openalex` · Shown on /evidence

### Crossref

- **Operator:** Crossref
- **Category:** Research discovery
- **URL:** <https://www.crossref.org/documentation/retrieve-metadata/>
- **What search results said:** Crossref describes itself as a DOI registration agency that collects metadata with each DOI registered. It offers metadata search, a REST API (JSON), an XML API and content negotiation.
- **Access:** Crossref's documentation says no registration is needed to use its interfaces. A paid "Metadata Plus" option offers higher rate limits and data dumps, and a public data file is released every year.
- **Caveats:** The homepage root and search.crossref.org appeared only through library proxy mirrors, not on the official domain. Avoid proxied mirror URLs. Other official pages seen: <https://www.crossref.org/services/> and <https://www.crossref.org/documentation/retrieve-metadata/content-negotiation/>. Crossref can show that a cited DOI exists, which helps catch fabricated citations. It cannot show that a claim is true.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `crossref` · Shown on /evidence

### Google Scholar

- **Operator:** Google
- **Category:** Research discovery
- **URL:** <https://scholar.google.com/>
- **What search results said:** Google's About page describes a search across articles, theses, books, abstracts, preprints, technical reports, court opinions and patents.
- **Access:** Free to search. The About page says abstracts are freely available for most articles, but reading the full article may need a subscription.
- **Caveats:** About page: <https://scholar.google.com/intl/en/scholar/about.html>. Results did not mention an official bulk API. Use it to discover research, then cite the publisher's version.
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Candidate · ID `google-scholar`

---

## Other references (not data)

### Contributor Covenant Code of Conduct, version 2.1

- **Operator:** Organization for Ethical Source (the steward named on the v2.1 page)
- **Category:** Governance reference. It is not a data source.
- **URL:** <https://www.contributor-covenant.org/version/2/1/code_of_conduct/>
- **Why it is here:** It was found during the same search run. [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) adopts it by reference. Its text could not be fetched, so it is linked rather than reproduced.
- **Caveats:** A version 3.0 also appears on the official site, and results from ethicalsource.dev say it was released in 2025. Whether to move to 3.0 is a decision for the maintainers (see [`ROADMAP.md`](ROADMAP.md#open-decisions-for-humans)).
- **Confidence:** High · **Sceptic verdict:** Keep
- **Status:** Not a data source · ID `contributor-covenant-2-1`

---

## Not found

The search agents looked for these and did not find them. They are listed so that nobody assumes they were checked. Where the sceptic later found something, this is noted.

1. **An official FIRMS notice of "limited updates since October 1, 2025".** This wording appeared only in a Wikipedia snippet. Searches found only general NASA funding-lapse notices, not a FIRMS-specific one.
2. **The NASA Worldview app as a direct search result.** *Later found by the sceptic:* <https://worldview.earthdata.nasa.gov/>.
3. **A live "ASEAN Haze Action Online" site** (`haze-online.or.id`). It is mentioned only in a 1999 ASEAN Secretariat release.
4. **A dedicated website for the ASEAN Coordinating Centre for Transboundary Haze Pollution Control (ACC THPC).**
5. **A copy of the ASEAN haze agreement on asean.org, seen as a direct result.** An asean.org PDF was referenced only by a third-party page. Official copies were found on agreement.asean.org and environment.asean.org instead.
6. **A standalone APIMS host, `apims.doe.gov.my`.** It was named in search summaries but never appeared as a result. Use <https://eqms.doe.gov.my/APIMS/main> instead.
7. **Official confirmation of the reported rename of APIMS to MyEQMS / MyJAS EQMS.** Only news reports and a third-party page say so.
8. **Real-time or hourly air-quality datasets on data.gov.my.** Only the monthly dataset and older annual datasets were found. *Experiment 003 confirmed this for the current catalogue; the legacy portal lists hourly datasets for 2014–2020, which could not be downloaded.*
9. **The doe.gov.my homepage root as a direct result.** Only subpages were found.
10. **The weather.gov.sg homepage root as a direct result.** The About page is used instead.
11. **A dedicated data.gov.sg page for a real-time PM2.5 dataset**, as opposed to the historical PM2.5 datasets. *Found in Experiment 003:* <https://data.gov.sg/datasets/d_e1058d6974c877257e32048ab128ad83/view>.
12. **The exact endpoint path and response format of the data.gov.sg real-time PSI API.** *Found in Experiment 003:* <https://api-open.data.gov.sg/v2/real-time/api/psi>, JSON.
13. **The homepage roots of kemenlh.go.id and www.kehutanan.go.id.** Only subpages and documents appeared. *Partly resolved by the sceptic:* the kehutanan.go.id press-release page (<https://www.kehutanan.go.id/pers>) was found.
14. **Any page hosted on sipongi.gakkum.kehutanan.go.id.** *Later found by the sceptic:* the root, `/peta` and `/sebaran-titik-panas`.
15. **The JDIHN portal, jdihn.go.id.** *Later found by the sceptic:* <https://jdihn.go.id/>.
16. **The peraturan.go.id homepage or about page.** *The homepage was later found by the sceptic*, but the operator is still not confirmed from an official page.
17. **The number of the Indonesian presidential regulation that split the former Ministry of Environment and Forestry (KLHK).** It was not stated in any result.

Not found in Experiment 003, by agents that could open pages:

18. **A documented public feed or downloadable dataset of Malaysia's current Air Pollutant Index readings.** Absence is hard to prove; DOE should be asked.
19. **A working, licensed, machine-readable source for ASMC's regional haze situation or hotspots.**
20. **A DOI for NASA's NOAA-21 FIRMS active-fire product.** DOIs exist for the NOAA-20 and Suomi NPP products.
21. **Whether data.gov.sg's wind direction is the direction the wind blows from** (the usual meteorological convention) or towards. The documentation does not say.
22. **An NEA statement on whether real-time readings are later revised.** The likely page is on haze.gov.sg, which disallows automated access.
23. **A statement from NASA on whether its regional files are intended for regular automated downloads.** FIRMS's robots.txt allows them with a one-second crawl delay.

---

## Rules for future integrations

These rules apply whenever an experiment integrates a source. They extend the eight data and claim safety rules in [`METHODOLOGY.md`](METHODOLOGY.md). Experiment 003 integrated sources. It departed from rule 1 (noted under that rule and in the experiment record) and only partly meets rule 8 (observations carry the registry id, not an ID in this document; no licence, processing steps or raw response are stored with each record; FIRMS is kept only as a summary). [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md#how-the-projects-integration-rules-were-applied) describes how each rule was applied.

**Before integrating**

1. **Evaluated first.** Only an *Evaluated* source may be integrated, and only within a documented experiment that has human approval. *Experiment 003 departed from this rule: its brief authorised integrating public sources that need no credentials, but no human evaluated them first. They were marked* Integrated, pending evaluation *until the project's maintainer reviewed them on 15 October 2026.*
2. **Respect terms and licences.** Follow each source's terms of use, licence and attribution requirements, and record them in the source's entry. Do not scrape where the terms forbid it. Do not redistribute data whose licence does not allow it.
3. **Respect rate limits.** Cache responsibly, and never work around access controls.
4. **Keep V0's static architecture unless a documented decision changes it.** The site is static, and the build fails if any route needs request-time rendering. An integration must either work within that, for example with data fetched at build time and a visible snapshot date, or be preceded by a written, human-approved design change. *Experiment 003 works within it: `/live` is prerendered, and Next.js refreshes its data in the background on a host that runs Next.js, with retrieval times shown.*

**Keys and secrets**

5. **API keys only through environment variables.** Never commit a key or token. `.env` and `.env.*` files are git-ignored. A committed `.env.example` may exist, but it must contain placeholder names only, never real values.
6. **Keep keys out of the browser.** In Next.js, any variable prefixed with `NEXT_PUBLIC_` is inlined into the JavaScript sent to the browser at build time. Never give a secret that prefix.
7. **A leaked key is a security issue.** Report it through [`SECURITY.md`](../SECURITY.md) and rotate it.

**Provenance**

8. **Store provenance with every record:**
   - the source name and its ID in this document;
   - the exact URL or endpoint;
   - the retrieval time, in UTC;
   - the dataset or product version, where one exists;
   - the licence;
   - every processing step applied.

   Keep raw data separate from processed data, so that any processed value can be traced back.
9. **Show provenance on the page.** Every displayed value states its source, its time of observation, when it was retrieved, and its known limits. Label provisional or real-time values as provisional.
10. **Never show stale data as current.** If a source is unavailable, say so. Never fill gaps with invented, interpolated or placeholder values that could be mistaken for real data.
11. **Do not compare unlike things.** For example, Singapore's PSI and Malaysia's Air Pollutant Index are different indices. Do not put different indices, units or instruments on one scale without documenting how each is calculated.
12. **Trace aggregators upstream.** When data comes through an aggregator such as OpenAQ or Global Forest Watch, record and cite the original provider as well.

**Hotspots, attribution and people**

13. **Never present a hotspot as a confirmed fire**, and never as evidence of who is responsible. A hotspot is a satellite detection of a thermal anomaly. Satellites can also miss fires.
14. **No attribution from data alone.** Do not combine hotspot data with land-ownership, concession or company data to suggest responsibility. Attribution needs additional independent evidence and human review, and legal responsibility can only be established by a legal process (see [`METHODOLOGY.md`](METHODOLOGY.md)).
15. **Personal data.** Court records and some other sources may name individuals. Do not republish personal data unless there is a documented reason, a privacy design and human approval.
16. **Record AI involvement.** If AI selects, transforms or summarises source data, record this as described in [`AI_TRANSPARENCY.md`](AI_TRANSPARENCY.md). AI output about a source is not evidence until a human has checked it against the source.

## Maintaining this list

- **Keep the files in step.** Change this document and [`src/content/sources.ts`](../src/content/sources.ts) in the same pull request, and [`data/live-sources.json`](../data/live-sources.json) too for sources used on `/live`. A source is `candidate` until it is evaluated, and `integrated` only when real code uses it. Experiment 003 added the interim `integrated-pending-evaluation`, explained under [Status definitions](#status-definitions).
- **Proposing a source.** Open a pull request or an issue with the same fields as the entries above. Say how you found the source and whether you opened it yourself.
- **Recording an evaluation.** Fill in the checklist above in the source's entry, with your name or handle and the date. Then change its status. There is no evaluation log yet, because nothing has been evaluated.
- **Reporting errors.** If a link is broken, wrong or misdescribed, open an issue. Corrections to published claims are recorded, not silently erased; see [`CORRECTIONS.md`](CORRECTIONS.md) and [`CONTRIBUTING.md`](../CONTRIBUTING.md).

---

<sub>AI involvement: this document is **AI GENERATED**. Claude Code wrote it during Experiment 001 from the output of AI search agents and an AI sceptic agent, none of which could open the pages listed. It was updated during Experiment 002 (the status note on the haze history and the Experiment 002 notes on four entries), and those updates have not yet been reviewed by a human. Claude Code updated it during Experiment 003 with findings from AI research and sceptic agents that did open the pages. **UNVERIFIED**: no link, description or caveat here has yet been checked by a human.</sub>
