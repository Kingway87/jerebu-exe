# Haze history, 1997–2026: research notes

> **Status: AI GENERATED + UNVERIFIED.** The dataset these notes describe is at the SOURCE ATTACHED stage; statements here point to dataset claims where an id is given, and are not themselves source attached. Not human checked or verified.
> Written by an AI agent (Claude Code) on 2026-10-15, during [Experiment 002](../../experiments/002-haze-history.md). The research question, scope, source hierarchy, attribution rules and review stages come from the founder's brief (HUMAN DECISION). The event-selection criteria, the confidence method, the findings and the wording were produced by AI. No human has reviewed this document or the dataset it describes.

This document explains how the haze history in [`data/haze-events.json`](../../data/haze-events.json), shown on the site's `/timeline` page, was researched: what was in scope, how episodes were chosen, which sources were preferred, how confidence was assigned, what was found, where sources disagree, what could not be found, and what needs specialist review.

## Contents

1. [Research question](#research-question)
2. [Scope](#scope)
3. [Method](#method)
4. [Event-selection criteria](#event-selection-criteria)
5. [Source hierarchy](#source-hierarchy)
6. [Claim labels and wording rules](#claim-labels-and-wording-rules)
7. [Confidence](#confidence)
8. [Review stages](#review-stages)
9. [Major findings](#major-findings)
10. [Contradictions between sources](#contradictions-between-sources)
11. [Evidence gaps](#evidence-gaps)
12. [Unresolved questions](#unresolved-questions)
13. [Areas requiring specialist review](#areas-requiring-specialist-review)
14. [Priority claims for human verification](#priority-claims-for-human-verification)
15. [Limitations](#limitations)

---

## Research question

From the founder's brief (HUMAN DECISION):

> Can an AI research agent reconstruct a source-verifiable history of major transboundary haze events affecting Malaysia and Singapore without fabricating facts, overstating evidence, or making unsupported attribution claims?

The core rule, also from the brief: **no source, no claim.** The brief adds that credibility matters more than completeness, and that a missing field is better than an invented one.

## Scope

| | |
| --- | --- |
| **Period** | 1997 to 2026 (to the date of research, 15 October 2026). Milestones from shortly before 1997 are included where they explain what followed. |
| **Primary jurisdictions** | Malaysia and Singapore. |
| **Regional context** | Indonesia and the wider region, where needed to understand an episode: where fires were reported, the weather and climate, and impacts on people in Indonesia, who are also affected by fires and haze. |
| **Topics, per episode** | Period; geographic scope; impact in Malaysia and in Singapore; regional fire context; air-quality measurements; meteorological context; health; disruption to schools, transport, business and public life; government, diplomatic, policy and legal responses; scientific observations; aftermath; unresolved questions. Each only where evidence was found. |
| **Milestones** | Historical legal, policy, institutional, diplomatic and measurement milestones. Not legal analysis: what laws and agreements mean in practice is left to Experiment 004. |
| **Out of scope** | Attributing any fire or haze to a company, person or government; ranking or listing companies; any personal or health data about individuals; live data. |

## Method

The research was done by one orchestrating AI agent (Claude Code) and AI sub-agents it ran in structured workflows. A human wrote the brief; no human took part in the research itself. In order:

1. **Rules first.** The agent read the founder's brief and the project's [methodology](../METHODOLOGY.md) and [AI policy](../AI_TRANSPARENCY.md), then wrote the [event-selection criteria](#event-selection-criteria) and the [confidence method](#confidence) to a time-stamped file **before** reading any research result (2026-10-15 01:48 +08:00, while the first research workflow was running).
2. **Tools that keep the agents honest.** In a scratch directory outside the repository, the agent wrote small scripts that download a page or PDF, extract its text, and check by script whether a quoted passage really appears in it. Downloaded files were treated as untrusted data and never executed. Another script looks up existing copies in the Internet Archive without asking it to save anything.
3. **Discovery.** Nine AI sub-agents searched in different ways — peer-reviewed literature; Singapore government sources; Malaysian government sources; regional and scientific agencies; news for 1997–2006, 2007–2016 and 2017–2026; legal and policy milestones; and health evidence — and a tenth, a completeness critic, looked for what they had missed, spot-checked their work and tested their claims against the sources. Every year from 1997 to 2026 was searched, including years expected to be quiet.
4. **Selection.** The orchestrating agent applied the pre-registered criteria to that evidence, year by year, to decide which episodes to include and which periods to list as [considered, not included](#periods-considered-but-not-included).
5. **Deep research with two adversarial checks.** For each episode, each group of milestones and the list of excluded periods, one sub-agent researched and wrote a draft in which every claim carries the exact passage it rests on. A second sub-agent, told to assume the draft was wrong, re-read every passage in its source and corrected or removed what the source did not support. A third reviewed every statement for attribution, framing, health, measurement and selection-criteria problems.
6. **Assembly by script.** A script, not a model, merged the checked drafts into [`data/haze-events.json`](../../data/haze-events.json): it gave sources and claims stable ids, recorded when each source was downloaded, and looked up existing archive copies. After the fidelity and safety checks, the orchestrating agent also set each episode's origin status and wrote its note, chose the metadata for sources where drafts disagreed, and made two small edits to checked drafts (2010 and 2018). These changes came after the checks in step 5; the final review in step 7 examined them.
7. **Checks and final review.** Every quoted passage marked as matched was re-checked against the downloaded text; the file was validated against its [JSON Schema](../../data/haze-events.schema.json) and by the website's own build-time checks; the pages were tested for accessibility, layout and links; and a final group of AI reviewers examined the dataset, pages and documents, with each serious finding checked by a further sub-agent. The upheld findings were then applied: in the research drafts by one sub-agent per draft, which re-checked every changed passage against its source, and in the site, the documents and the origin notes by the orchestrating agent. The dataset was then assembled and checked again.

The [experiment record](../../experiments/002-haze-history.md) gives the details, including what went wrong. None of these checks is human verification.

## Event-selection criteria

These criteria were written **before** any research result was read, while the first research workflow was still running (the file recording them was time-stamped 2026-10-15 01:48:37 +08:00). They are an AI proposal awaiting human review. They are quoted here as written; "this session" means the research session of 15 October 2026. The dataset reproduces the same text in `meta.selectionCriteria`.

> An episode is INCLUDED when evidence opened in this session shows:
>
> (A) Smoke haze from vegetation and/or peatland fires affected Malaysia and/or Singapore in the period, and an official body, intergovernmental body, scientific agency or peer-reviewed study describes the haze as transboundary (originating at least partly outside the affected country) — or, failing those, at least two independent reputable news reports citing officials say so; AND
>
> (B) at least one significance marker in Malaysia or Singapore:
> (B1) officially reported air quality in the "unhealthy" band or worse (Singapore PSI above 100; Malaysia API above 100), on more than one day or at more than one monitoring location, reported by the responsible agency or by reputable reporting citing it; or
> (B2) extraordinary public measures attributed to the haze: an emergency declaration, school closures, or official advice to reduce outdoor activity beyond routine forecasts; or
> (B3) the episode is described as major, severe or among the worst in peer-reviewed literature or an official retrospective.
>
> A period is EXCLUDED, and listed as "considered", when (A) or (B) is not evidenced, when sources describe the haze as predominantly local in origin, or when the only evidence is low quality. An excluded period is not a statement that there was no haze.

On the site, the criteria have short names taken from their own wording: A "Described as transboundary", B1 "Unhealthy air", B2 "Extraordinary public measures", B3 "Described as major". How they were applied, and the readings a human should review, are described under [How the criteria performed](#how-the-criteria-performed).

Note on (A): that haze was transboundary is itself an interpretation, usually made by an agency from hotspot and wind data. The dataset reports it as that agency's assessment, labelled *analysis*, not as an established fact.

## Source hierarchy

From the founder's brief (HUMAN DECISION). Prefer, where available:

1. primary government sources;
2. legislation and official legal documents;
3. ASEAN and intergovernmental sources;
4. NASA and other scientific agencies;
5. peer-reviewed research;
6. high-quality reputable reporting.

Secondary sources may supplement primary evidence. Low-quality aggregation pages were not used as authoritative evidence; Wikipedia and similar pages were used, at most, to find leads, and are never cited.

In the dataset, each source's `type` records where it sits: `government`, `legal`, `intergovernmental`, `scientific-agency`, `peer-reviewed`, `news`, or `reference` (curated secondary works such as a national library's encyclopaedia articles).

How the hierarchy was applied:

- **An official statement is a primary source for what the official body said.** It is not, by itself, proof that what it said is correct (see [METHODOLOGY.md](../METHODOLOGY.md#5-source-hierarchy), section 5). Statements about the origin of haze are attributed to the body that made them.
- **News reports were used** where primary records were not found online, especially for the 1990s and 2000s, and for official statements reported in the press. Where a claim rests only on news reporting, the confidence rating says so.
- **Peer-reviewed estimates** (for example of burned area, emissions or health effects) are reported as estimates, with the study's own uncertainty where it gives one.

## Claim labels and wording rules

Every claim carries one of the six labels from [METHODOLOGY.md](../METHODOLOGY.md#3-claim-labels), section 3. In this dataset they were applied as follows.

| Label | Used for | Example of the form |
| --- | --- | --- |
| **Observation** | A reported measurement or record, with who reported it, the index or unit, the place and the time. | "[Agency] reported a [index, averaging period] of [value] at [place] on [date]." |
| **Fact** | A documented event or government action. | "[Government] declared an emergency in [place] on [date]." |
| **Analysis** | An assessment or interpretation by a named body or study, including an agency's view of where haze came from, modelled health estimates and cost estimates. Always attributed. | "According to [agency], the haze came from fires in [region]." |
| **Allegation** | A contested claim made by a party, including a denial. Attributed, with the other side where documented. | "[Minister] said … ; [other government] said …" |
| **Hypothesis** | A possible explanation that its source presents as such. | — |
| **Legal finding** | A determination by a court or authorised body. Recorded without party names (see below). | "[Court] ordered [a company] to pay …" |

Wording rules applied to every claim:

- **One checkable statement per claim**, saying no more than its quoted passage supports: the same number, unit, index, averaging period, place, date and speaker.
- **Hotspot ≠ land ownership ≠ fire starter ≠ legal responsibility. Correlation ≠ causation.** No claim names a company or person as responsible for any fire or haze. Where fires were reported, claims say *where* (a province, a land type such as peatland) and *who reported it* — never who caused it. The site's build runs a coarse pattern check that fails if a company-style name (for example "Sdn Bhd", "Tbk" or "PT …") appears in any text in the dataset except web addresses and identifiers; it misses names written without such a marker.
- **Legal outcomes without names.** Where a court or authority has made a finding against a party, the dataset records the finding, the body and the date, but not the party's name. Under [METHODOLOGY.md](../METHODOLOGY.md#8-before-naming-an-organisation-person-or-government), section 8, naming anyone needs human review first.
- **Countries are not causes.** No claim presents Indonesia, or people in Indonesia, as the cause of haze or as an adversary. People in Indonesia are also affected.
- **Health.** Population-level research, records of healthcare use, government health advice and individual causation are kept apart. No claim implies that haze caused a particular person's illness or death. Modelled estimates are labelled *analysis* and described as estimates.
- **Indices.** Malaysia's API and Singapore's PSI are different indices, and both changed over the period. Readings are reported exactly as published, with the index and averaging period, and are never compared across indices.

## Confidence

Each episode has a confidence level: **high**, **medium** or **low**. Like the selection criteria, this method was written before results were read. It is quoted here as written; the dataset reproduces it in `meta.confidenceMethod`.

> Question answered: how well does the evidence opened in this session support the core account of this episode — that it happened, roughly when, and that it affected Malaysia and/or Singapore as described?
>
> - HIGH: the core account is supported by at least one government, legal, intergovernmental, scientific-agency or peer-reviewed source AND corroborated by at least one independent source; key figures are quoted from primary or peer-reviewed sources; no unresolved material conflict about the core account.
> - MEDIUM: credible evidence supports the core account, but important elements (impact in one country, peak readings, the period) rest on a single source, on news reporting only, or are incomplete; or minor conflicts remain.
> - LOW: the core account rests on a single source or on reporting only, or sources materially disagree, or key elements could not be verified.
>
> Confidence describes the evidence for the record as compiled — not the severity of the episode. It is an AI-assigned rating awaiting human review. It never replaces sources: every claim still carries its own.

**How the ratings were applied.** The high and medium definitions overlap: in almost every episode some important element rests on news reporting or a single source, or a minor conflict remains. The research agents first applied the definitions in two ways, keeping some episodes high although their own rationale listed elements that the medium definition names, and lowering others to medium for the same kind of element. The final AI review found this. In the fix stage every rating was re-applied literally: if any medium condition holds, the rating is medium, and no rating was raised. As a result, all 14 episodes are rated medium: the six previously rated high (1997, 2005, 2006, 2010, 2013 and 2015) were lowered. This literal reading is itself an AI choice, made after the results were read. A human should decide which rule to use and re-rate all 14 episodes. Each episode page explains its rating under "Why this confidence level", and lists the disagreements between sources under "Where sources disagree".

## Review stages

Defined in [AI_TRANSPARENCY.md](../AI_TRANSPARENCY.md#review-stages-for-research-content). The stage names come from the founder's brief.

| Stage | State of this dataset |
| --- | --- |
| AI GENERATED | Yes. |
| SOURCE ATTACHED | Yes, for every claim. |
| HUMAN CHECKED | **Not yet.** |
| HUMAN VERIFIED | **Not yet.** No AI agent may mark its own work as human checked or human verified. |

## Major findings

These are findings about what the sources record, assembled by AI agents. They summarise claims in [`data/haze-events.json`](../../data/haze-events.json); where ids are given in brackets, they point to the claims, and the outline under "What changed" summarises the milestone entries on the timeline's milestone pages. None has been checked by a human.

### Episodes included

Fourteen episodes between 1997 and 2026 met the [selection criteria](#event-selection-criteria). Six met all four criteria (1997, 2005, 2006, 2010, 2013, 2015). Five met A, B1 and B2 (2002, 2014, 2019, 2023 and 2026). Three met only A and B1 (2016, 2018 and 2025), on unhealthy readings without extraordinary public measures or a description as major.

| Episode | Period | Places named | Criteria met | Confidence | Origin of the smoke | Claims | Sources |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1997 | July–November 1997 | Malaysia, Singapore, Indonesia, Brunei, Thailand, Philippines | A · B1 · B2 · B3 | Medium | Agency assessment | 55 | 33 |
| 2002 | August–October 2002 | Malaysia, Singapore, Indonesia | A · B1 · B2 | Medium | Agency assessment | 30 | 20 |
| 2005 | August 2005 | Malaysia, Indonesia, Thailand | A · B1 · B2 · B3 | Medium | Agency assessment | 40 | 27 |
| 2006 | July–November 2006, more intense from late September to October | Malaysia, Singapore, Indonesia, Brunei, Thailand | A · B1 · B2 · B3 | Medium | Agency assessment | 58 | 40 |
| 2010 | Mid- to late October 2010 | Malaysia, Singapore, Indonesia | A · B1 · B2 · B3 | Medium | Disputed | 28 | 20 |
| 2013 | June 2013 | Singapore, Malaysia, Indonesia | A · B1 · B2 · B3 | Medium | Agency assessment | 58 | 42 |
| 2014 | June–October 2014 | Malaysia, Singapore, Indonesia | A · B1 · B2 | Medium | Agency assessment | 33 | 21 |
| 2015 | August–October 2015 | Singapore, Malaysia, Indonesia, Thailand, Philippines | A · B1 · B2 · B3 | Medium | Agency assessment | 67 | 45 |
| 2016 | 26–30 August 2016 | Singapore, Malaysia, Indonesia | A · B1 | Medium | Agency assessment | 23 | 20 |
| 2018 | Mid-August 2018 | Malaysia, Indonesia | A · B1 | Medium | Agency assessment | 24 | 28 |
| 2019 | August–early October 2019 | Malaysia, Singapore, Indonesia | A · B1 · B2 | Medium | Disputed | 60 | 47 |
| 2023 | September–October 2023 | Malaysia, Singapore, Indonesia | A · B1 · B2 | Medium | Disputed | 38 | 27 |
| 2025 | Second half of July 2025 | Malaysia, Indonesia | A · B1 | Medium | Agency assessment | 22 | 26 |
| 2026 (ongoing) | August 2026 – ongoing (sources to 15 October 2026) | Malaysia, Singapore, Indonesia, Brunei, Philippines | A · B1 · B2 | Medium | Disputed | 63 | 68 |

"Places named" lists the places the entry's claims mention as affected; Indonesia is named where impacts there were documented. "Confidence" describes the evidence, not severity ([Confidence](#confidence)).

### What the episodes have in common, according to the sources

- **Where the smoke came from.** In every episode, the agencies and studies quoted describe smoke from fires in Sumatra, Kalimantan or both reaching Malaysia or Singapore. These are their assessments, recorded as analysis. In four episodes the dataset marks the origin as disputed: in 2010 Indonesia's forestry ministry first rejected the claim, and the government said the next day that fires in Riau were behind the haze (2010-diplomatic-4); in 2019 Indonesia's environment and forestry minister said that not all of the smog was from Indonesia, and that the smoke entering Malaysia and Kuala Lumpur came from Sarawak and the Malay Peninsula and "maybe also partly from West Kalimantan" (2019-diplomatic-3); in 2023 Indonesia's environment ministry denied that haze from Indonesia was crossing into Malaysia (2023-diplomatic-1); and in 2026 Indonesia's National Disaster Management Agency (BNPB) said that countries should work together rather than make "unfounded claims about the source of the smoke", without saying which claims it meant (2026-diplomatic-1). Several entries also record local fires in Malaysia contributing in some places (for example 2014, 2018, 2025 and 2026).
- **Who caused the fires: NOT ESTABLISHED.** No entry establishes who started any fire or who is legally responsible for any episode. Court and enforcement outcomes appear as milestones, without naming the parties.
- **Weather and climate.** Studies and agencies quoted link several episodes to drought associated with El Niño (1997, 2015) or a positive Indian Ocean Dipole (1997, 2006, 2019) (1997-region-5, 2015-region-1, 2006-sum-4, 2019-region-3); for 2026, ASMC assessed strong El Niño conditions in August and said on 26 August that, with El Niño conditions predicted to strengthen, the hotspot and smoke haze situation could escalate further (2026-region-1, 2026-region-3). They also describe severe haze without El Niño in 2005, 2010 and 2013, which a 2018 peer-reviewed study associates with the Madden–Julian Oscillation (2005-region-6, 2010-region-3, 2013-region-7). The year lists are examples, not a complete count. These are the sources' analyses; this project has not tested them.
- **People in Indonesia were affected too.** Entries record, among other things, school closures in Palangka Raya in 2015, an air pollution emergency in Riau in 2019, acute respiratory infection counts reported by Indonesian authorities in several years, and emergency status in Central and West Kalimantan in 2026 (2015-region-12, 2019-region-9, 2019-region-12, 2026-region-9, 2026-region-10).
- **Measurements changed.** Singapore added PM2.5 to its 24-hour PSI on 1 April 2014 and phased out the 3-hour PSI on 7 December 2016; Malaysia is reported to have published only descriptors, not numbers, from the 1997 haze until the August 2005 haze, and added PM2.5 to its API on 16 August 2018 according to the National Haze Action Plan (a DOE document says 2017; see [Contradictions](#contradictions-between-sources) and the measurement milestones). Readings from different years and countries cannot simply be compared.

### What changed

The dataset records 82 milestones: 20 regional, 16 for Singapore, 18 for Malaysia, 16 for Indonesia and 12 changes to how haze is measured. In outline, as the sources describe them:

- **Regional.** ASEAN's Regional Haze Action Plan (December 1997), the ASEAN Agreement on Transboundary Haze Pollution (signed 10 June 2002; in force 25 November 2003), ratification by all ten member states once Indonesia deposited its instrument on 20 January 2015, two Haze-Free Roadmaps (2016 and 2023), and an ASEAN Coordinating Centre for Transboundary Haze Pollution Control, launched in Jakarta in September 2023, whose establishment agreement was signed by all member states by September 2025.
- **Singapore.** The Transboundary Haze Pollution Act 2014 (in force 25 September 2014); preventive measures notices and an information notice under it in September 2015; a court warrant in 2016 in its 2015 investigation; two of six cases closed in 2017; and a Haze Subsidy Scheme first introduced in 2013, activated again in 2015, and announced on 11 October 2026 for activation from 12 October 2026.
- **Malaysia.** An open-burning offence in force from 2000, amended in 2001 and replaced in 2024; school-closure thresholds set and reset (2006, 2013, 2015, 2019, 2026); a proposed transboundary haze law in 2019, shelved in 2020, not tabled in 2023, and under examination again in 2026.
- **Indonesia.** Law No. 32 of 2009 on environmental protection; a temporary postponement of new licences in primary natural forest and peatland (2011), replaced in 2019 by an instruction halting new licences there; peat ecosystem regulations (2014, amended 2016); peatland restoration agencies (2016–2024); a Supreme Court ruling in a citizen lawsuit over the 2015 fires (2019), reported annulled on case review in 2022 (the case-review judgment was not opened); and enforcement steps announced in 2026, which are proceedings, not findings.

**This is not a verdict.** The timeline shows what was agreed, passed, enforced or decided, and when. It does not show whether any of it reduced haze, and it does not try to: that would need methods this research did not use.

### Periods considered but not included

Fifteen periods were examined and left out: February–April 1998 (northern Borneo); 1999 and 2000; July 2001; March 2002 (Selangor); 2003; May–June 2004; 2007 and 2008; 2009; 2011 and 2012; February–March 2014; 2017; 2020–2022; 2024; March 2025 (Kuantan); and February 2026 (Singapore). For each, the dataset gives the reason in terms of the criteria, what was searched, and any sourced facts. Several involved real haze that the sources attribute mainly to local fires (February–April 1998, March 2025); for February–March 2014, DOE attributes the haze in Peninsular Malaysia to fires in Malaysian states, and NEA attributes Singapore's March haze to smoke from fires in southern Johor (see [How the criteria performed](#how-the-criteria-performed)). Others had haze without the significance markers the criteria require (for example 2004, 2011 and 2012, and 2024). **Leaving a period out is not a claim that there was no haze.**

### How the criteria performed

The pre-registered criteria were applied as a rule. One of them turned out to be permissive, and several readings of them are AI interpretations that a human should review:

- **B1 is permissive.** Unhealthy readings at two stations on one day are enough. Three episodes (2016, 2018 and 2025) qualify on B1 without B2 or B3, and the 2018 entry calls its own inclusion narrow. A human reviewer may want to tighten B1, for example to require more than one day **and** more than one station.
- **B2 and routine advice.** NEA's standard health advisory, tied to its PSI forecast, was treated as routine and not counted for B2 ("beyond routine forecasts"). This was first decided in the 2016 entry and applied to every entry in the fix stage, which removed B2 tags from routine advice in six entries (1997, 2006, 2013, 2015, 2019 and 2023). B2 still holds for each of them through other evidence, such as emergency declarations or school closures, so no inclusion changed.
- **Same country?** The criteria do not say whether A and B must be met in the same country. For February–March 2014 the agent required it: A is met for Singapore (smoke from fires in southern Johor), and B1 and B2 in Malaysia, where DOE attributes the haze to fires in Malaysian states. Read literally, the period would qualify, unless the rule excluding predominantly local haze is read to cover it. It is listed as considered, not included, pending a human decision.
- **Official retrospectives.** For B3, Singapore's environment ministry's 2014 consultation paper, which lists the years in which the haze was "particularly severe", was treated as an official retrospective.
- **Undated yearly figures.** For 1998–2012, a yearly table from the Department of Statistics Malaysia, compiled from DOE data, gives the highest API of each year at seven stations, without dates, pollutants or causes; from 2007, Singapore's yearly statistics give the share of days in each PSI band, also without dates. The excluded entries for those years report these figures (counting, for example, how many yearly maxima were above 100) but do not count them for B1, because without dates or causes they do not by themselves show haze. A human should decide whether undated figures like these can count.

Any change to the criteria, or to these readings, would have to be made, and its effect recorded, by a person.

## Contradictions between sources

Each episode lists its own disagreements between sources, with both sides cited, under "Where sources disagree" on its page and in `contradictions` in the dataset. The dataset records them rather than resolving them, unless primary data settle the point, in which case the entry says which data and why. Some that matter most:

- **Singapore's record 24-hour PSI in 2013.** The value is 246 in every source found, but Singapore's environment ministry (2014) dates it 20 June 2013, while a peer-reviewed study and a medical-journal commentary date it 22 June. No NEA material opened for 20–22 June shows a 24-hour PSI of 246; on NEA's PSI page, 246 appears only as a 24-hour PM2.5 concentration (in µg/m³, for the South region on 20 June and the East region on 21 June), beside 24-hour PSI values of 173 and 180 (`2013-sg-air-4`). Both dates are published; this is the first [priority claim](#priority-claims-for-human-verification).
- **Values that are not what they seem.** Several widely reported Singapore figures are 3-hour PSI values, not 24-hour ones: for example 401 on 21 June 2013 (NEA), and 317 (24 September 2015) and 341 (25 September 2015), which a Reuters photo caption and The Jakarta Post label three-hour values. The Star's 334 (6am, 25 September 2015; index not named) matches no 2015 24-hour value in NEA's data, whose highest 24-hour value at that hour was 318; whether 334 is a 3-hour value is unverified. MSS gives 322 (8am, 25 September) as the highest 24-hour PSI of 2015. In Malaysia, one peer-reviewed article gives "746 µg/m3" for Muar in 2013 and "PM10 above 500 µg/m3" for 2005; the official records, and the news reports that cite them, give these as Air Pollutant Index values, which have no unit.
- **Counts.** Singapore's unhealthy days in 1997 (12 or 14), Muar's schools closed in 2010 (170 or 204), Sarawak's schools closed on 12 August 2026 (108, 107 or six), and Malaysian school closures in 2019 differ between sources.
- **Modelled health estimates for 2015** of premature deaths across the region range from about 11,900 (short-term exposure, September–October 2015) to about 100,300, or 106,000 when one study applies another's exposure–response function; the spread depends mainly on that function (2015-health-5, -8, -10, -11). Malaysia's deputy health director-general was reported in 2016 as saying there were no deaths in Malaysia in 2015 directly related to the haze (2015-after-3). These are different kinds of evidence and are not reconciled.
- **Burned area in Indonesia in 2019:** about 1.64–1.65 million hectares in official figures, against 3.11 million hectares in an independent satellite analysis; the methods differ.
- **Measurement changes:** PM2.5 joined Singapore's PSI on 1 April 2014 (NEA) or "from May 1" (a news report); PM2.5 joined Malaysia's API in 2017 (a DOE document) or on 16 August 2018 (the National Haze Action Plan).
- **Treaty dates:** Singapore's ratification of the ASEAN haze agreement is dated 13 January 2003 by Singapore and 14 January 2003 by the ASEAN depositary listing; the agreement entered into force on 25 November 2003 according to ASEAN, while the explanatory notes to Indonesia's ratification law say it took effect in 2007.
- **Where the smoke came from** in 2010, 2019, 2023 and 2026, described [above](#what-the-episodes-have-in-common-according-to-the-sources).

## Evidence gaps

Gaps specific to an episode are listed on its page ("Evidence not found"). Across the whole research:

- **Malaysian official records.** Historical API readings by station and hour were not found online for most years; of the Department of Environment's Environmental Quality Reports only the 2018 report (through the public "PDF" view link on its record in DOE's Enviro Digital Library, where downloading the full file needs a login) and the 2023 report (from Malaysia's open-data portal) were read, though the library's 2006 and 2025 records show the same "PDF" link; and DOE's live system (APIMS) is not machine-readable. Many Malaysian readings, emergencies and school closures therefore rest on news reports citing the department, the Ministry of Education or the Prime Minister's Office.
- **Singapore's records before April 2014.** NEA's published hourly regional data begin on 1 April 2014. Earlier readings come from NEA's annual reviews and releases, archived web pages and later ministry statements. Singapore's newspaper archive and parliamentary records could not be read by the agents.
- **Indonesian official sources.** Many Indonesian government sites, and the Supreme Court's judgment database, refused automated access or were unreachable, so court outcomes, health figures and provincial measures often rest on Indonesian or international news reports and, for the court cases, on a Judicial Commission journal article.
- **Legislation portals.** Singapore Statutes Online and Indonesia's main regulation database refused automated downloads; several laws were read from official-text mirrors such as FAOLEX or provincial legal databases, and six Indonesian presidential instructions and regulations were read from Pasal.id, an unofficial platform whose texts are marked as not yet reviewed. All of these should be compared with the official versions.
- **1998–2004 and 2007–2009.** Few online sources survive for these years, and search engines returned little; an absence of evidence for these years is weak evidence of absence.
- **Health records.** Records of clinic and hospital visits, or of respiratory infection cases, were found for some episodes (for example Singapore in 2013 and 2015, Malaysia in 2019 and 2026, and Indonesia in 2019 and 2026), but not consistently.
- **Costs.** Economic estimates appear for only a few episodes, most fully for 2015 (the World Bank's estimate for Indonesia); none was found for 2026.
- **2026.** The episode was still under way, NEA's validated data ended on 31 August 2026, and no official retrospective yet existed.

## Unresolved questions

Each episode lists its own. The ones a specialist could most usefully answer:

1. On which date did Singapore's 24-hour PSI reach 246 in June 2013? NEA's validated historical data for that month would settle it.
2. Will NEA's validated historical data, once published, confirm the provisional real-time values used for September–October 2026, such as the 24-hour PSI of 203 in the west at 9pm on 14 October and 207 at 1am on 15 October? This includes the identical range, 118–168, in NEA's updates of 10 October (7pm) and 14 October (4pm). That repetition was checked: NEA's real-time hourly data match both ranges, with different regional distributions (168 was in the central region on 10 October and in the west on 14 October), so it does not point to carried-over text.
3. When exactly did Malaysia stop, and then resume, publishing numeric API readings (1997–2005), and on what decisions?
4. When did PM2.5 join Malaysia's API: 2017 or 16 August 2018?
5. How many days was Singapore's air quality unhealthy in 1997, and on what basis were the 12 and 14 counted?
6. What became of Singapore's Transboundary Haze Pollution Act cases from 2015 that were still open in 2021?
7. Which modelled estimate of 2015 deaths, if any, should be used for public communication, and how should the spread be explained?
8. How much did local fires in Malaysia contribute in the episodes where both local and transboundary sources were reported (for example 2014, 2018 and 2025)?

## Areas requiring specialist review

The AI agents could check that a passage exists and that a claim does not say more than it. They could not bring a specialist's judgement to what the sources say. These areas need one:

- **Air-quality measurement** (someone who knows Singapore's PSI and Malaysia's API and their histories): how each reading should be described; what counts as comparable across the changes recorded in the dataset's measurement milestones (the 3-hour PSI, the addition of PM2.5 to the PSI in April 2014, PM2.5 in Malaysia's API, the years when Malaysia is reported to have published descriptors but not numbers); and the few values that the agents computed from NEA's hourly historical data, which are labelled analysis.
- **Health and epidemiology:** the modelled estimates of deaths attributable to smoke (which differ by up to an order of magnitude between studies, mainly because of the exposure–response functions used), the records of clinic and hospital visits, and how both are worded.
- **Law:** the legislation, enforcement and court milestones for Malaysia, Singapore, Indonesia and ASEAN: whether each date is the right one (signature, assent, gazettal, commencement, deposit), whether later amendments change what is quoted, and the descriptions of court rulings. Some milestone claims describe a provision of a law; each says in its note that it is not legal analysis and needs legal review (Experiment 004). Whether Indonesia's Job Creation laws amended the articles of Law No. 32 of 2009 quoted in the dataset was not checked against an official copy; the agents saw them only on Pasal.id (<https://pasal.id/peraturan/uu/uu-no-11-tahun-2020> and <https://pasal.id/peraturan/uu/uu-no-6-tahun-2023>), an unofficial platform. Also the decision whether any withheld party should ever be named, including the defendants in the citizen lawsuit over the 2015 fires ([METHODOLOGY.md](../METHODOLOGY.md#8-before-naming-an-organisation-person-or-government), section 8).
- **Fire and climate science:** statements about El Niño, the Indian Ocean Dipole and the Madden–Julian Oscillation, burned-area figures (official and satellite estimates differ in method) and emissions inventories.
- **Languages:** every passage quoted in Malay or Indonesian was translated into English by an AI agent, and each such claim says so. A fluent speaker should check them.
- **Regional and diplomatic history:** the wording of public exchanges between governments, which are labelled allegations and attributed, so that no episode is framed as a contest between countries.

## Priority claims for human verification

The brief asks for 5–10 claims to check first: central to the story, numerically specific, legally or scientifically significant, or potentially controversial. For each, open the source and check that the claim says no more than the passage, in context.

| # | Claim (dataset id) | Why it matters | Check this source |
| --- | --- | --- | --- |
| 1 | Singapore's 24-hour PSI reached 246 in June 2013, dated 20 June by one source and 22 June by others (`2013-sg-air-4`) | The best-known figure in the history; the date is disputed | Ministry of the Environment and Water Resources, public consultation on the draft Transboundary Haze Pollution Bill, 19 February 2014, p.1 (<https://www.nas.gov.sg/archivesonline/data/pdfdoc/MSE_20140219001.pdf>); and Gaveau et al., *Scientific Reports* 4:6112 (2014), Results (<https://doi.org/10.1038/srep06112>) |
| 2 | Singapore's 24-hour PSI peaked at 322 at 8am on 25 September 2015 (`2015-sg-air-5`) | Peak of the most severe recent episode; 317 and 341, also in circulation, are labelled 3-hour values by their sources, and 334's averaging period is not stated | Meteorological Service Singapore, *Annual Climate Assessment 2015*, p.12 (<https://www.weather.gov.sg/wp-content/uploads/2016/03/Annual-Climate-Assessment-Report-2015.pdf>), and NEA's historical 24-hour PSI on data.gov.sg, record for 25/9/2015 8:00 |
| 3 | A Haze Emergency was declared in Port Klang (Pelabuhan Klang) and Kuala Selangor on 11 August 2005, where the API exceeded 500, and lifted on 13 August (`2005-sum-1`) | An emergency declaration; numerically specific | Department of Environment Malaysia, *Chronology of Haze Episodes in Malaysia*, p.1, item 3 (<https://www.doe.gov.my/wp-content/uploads/2021/09/Chronology-of-Haze-Episodes-in-Malaysia.pdf>), and DOE's archived API table for 11 August 2005 (<https://web.archive.org/web/20050813012003/http://www.jas.sains.my:80/jas/Air+Pollutant+Index++11-8-05.htm>) |
| 4 | In 1997 the API in Sarawak rose above 500, the level at which a haze emergency was declared (`1997-my-air-1`, `1997-my-response-2`) | Central to the first episode; the later claim rests on a reprinted news report | DOE, *Chronology of Haze Episodes in Malaysia*, item 2 (URL above); *The Korea Times*, 29 September 1997, as reprinted at <https://weather.ou.edu/~spark/AMON/v1_n5/News/fire/Haze_Mal.html>, paragraphs 1 and 7 |
| 5 | An emergency was declared throughout Sarawak's Serian Division on 4 September 2026 and ended on 7 September; Serian's API reached 521 at 2pm on 4 September (`2026-my-response-1`, `2026-my-response-2`, `2026-my-air-2`) | The latest emergency; provisional and news-based | Bernama, 4 September 2026 (<https://www.bernama.com/en/news.php?id=2603021>); RTM, 7 September 2026 (<https://berita.rtm.gov.my/nasional/senarai-berita-nasional/senarai-artikel/agong-perkenan-tamatkan-darurat-jerebu-di-serian/>); *The Star*, 4 September 2026 (<https://www.thestar.com.my/news/nation/2026/09/04/serian-api-reading-reaches-521-on-sept-4>). Prefer the Prime Minister's Office and DOE records if they can be found. |
| 6 | Indonesia's environment and forestry minister said in September 2019 that not all of the smoke came from Indonesia; Malaysia's environment minister replied with ASMC hotspot data (`2019-diplomatic-3`, `2019-diplomatic-4`) | Potentially controversial; labelled allegation; framing must stay neutral | *The Guardian*, 12 September 2019 (<https://www.theguardian.com/world/2019/sep/12/indonesia-forest-fires-spark-blame-game-as-smoke-closes-hundreds-of-malaysia-schools>), paragraphs 2–5; Mongabay, 12 September 2019 (<https://news.mongabay.com/2019/09/indonesian-minister-draws-fire-for-denial-of-transboundary-haze-problem/>) |
| 7 | Indonesia's environment ministry denied on 2 October 2023 that haze from Indonesia was crossing into Malaysia (`2023-diplomatic-1`) | Potentially controversial; the basis for the "disputed" status | *Malay Mail* (Bernama/Antara), 2 October 2023 (<https://www.malaymail.com/news/malaysia/2023/10/02/indonesia-denies-accusations-of-transboundary-haze-crossing-into-malaysia/94027>), paragraphs 1–3 |
| 8 | Modelled estimates of premature deaths from the 2015 haze: 11,880 (95% CI 6,153–17,270), 44,040 and 100,300 (`2015-health-5`, `2015-health-10`, `2015-health-8`) | Scientifically significant and easy to misstate as counted deaths | Crippa et al., *Scientific Reports* 6:37074 (2016), p.5 (<https://doi.org/10.1038/srep37074>); Kiely et al., *Environmental Research Letters* 15:094054 (2020), abstract and Table 2 (<https://doi.org/10.1088/1748-9326/ab9a6c>); Koplitz et al., *Environmental Research Letters* 11:094023 (2016), pp.8–9 (<https://doi.org/10.1088/1748-9326/11/9/094023>) |
| 9 | Indonesia's Supreme Court upheld lower-court rulings in a citizen lawsuit over the 2015 Central Kalimantan fires on 16 July 2019, and granted a case review on 3 November 2022 (`2019-07-16-supreme-court-upholds-lower-court-1`, `2022-11-03-supreme-court-grants-case-review-1`) | Legally significant; parties withheld; rests on secondary sources because the judgments could not be opened | *Jurnal Yudisial* 17(1), 2024, pp.2–3 (<https://doi.org/10.29123/jy.v17i1.611>); Hukumonline, 7 and 21 November 2022, and Mongabay Indonesia, 22 July 2019 (dataset sources `hukumonline-2022-3-catatan-masyarakat-sipil`, `hukumonline-2022-koalisi-putusan-pk-kasus` and `mongabay-2019-soal-kebakaran-hutan-kasasi`). Better still, the judgments 3555 K/Pdt/2018 and 980 PK/PDT/2022 themselves. |
| 10 | In a release dated 25 September 2015, Singapore's environment ministry said NEA had sent preventive measures notices under section 9 of the Transboundary Haze Pollution Act to four companies, and had served a notice under section 10 of the Act on a company seeking information; the release does not say on what date the notices were sent or served (`2015-09-25-nea-sends-preventive-measures-notices-1`, `2015-09-25-nea-sends-preventive-measures-notices-2`) | The earliest enforcement step under the Act recorded in this dataset; legally significant; names withheld | Ministry of the Environment and Water Resources press release, 25 September 2015, p.1 (<https://www.nas.gov.sg/archivesonline/data/pdfdoc/MSE_20150925001.pdf>) |

## Limitations

- **No human has checked this research.** The dataset is AI GENERATED, at the SOURCE ATTACHED stage; these notes, which summarise it, are AI GENERATED + UNVERIFIED. AI agents can misread a source, quote it out of context or choose a weak one, even when the passage is real.
- **A matched quote is not a verified claim.** A script confirmed that each passage marked "verbatim" appears in the text downloaded from the source. Whether the claim is a fair reading of that passage, in context, was judged by AI agents, not by a person.
- **Coverage was limited by access.** Several important records could not be read: Singapore's newspaper archive (NewspaperSG) and parliamentary records were not readable by the agents; DOE's Environmental Quality Reports were read only for 2018 (through the public "PDF" view link in its Enviro Digital Library) and 2023 (from Malaysia's open-data portal); Malaysia's live air-quality site (APIMS) needs JavaScript; and some government and court sites refused automated downloads. Some sites refused or rate-limited automated access during the session, including the Internet Archive. The agents' web-search tool also reached a usage limit part-way through, after which they relied on direct downloads and earlier results. For these reasons, some Malaysian readings, school closures and health figures rest on news reports that cite the official source rather than on the official record itself.
- **Much of the evidence is news reporting.** Of the 535 sources cited, 261 are news reports, 156 government sources, 36 intergovernmental, 34 peer-reviewed, 22 from scientific agencies, 20 legal texts and 6 reference works. Primary sources were preferred wherever they could be opened, and every claim says whose statement it reports, but where only news coverage was found the confidence rating says so.
- **Older years are thinner.** Search engines returned little news from before about 2005, and official online records are sparse for 1998–2004 and 2007–2009. An absent year is a gap in the evidence found, not evidence that there was no haze.
- **The 2026 episode was still under way** when the research was done. Its figures are provisional, and the dataset was not updated after 15 October 2026.
- **The selection criteria were written by an AI**, before the results were read, and turned out to be permissive: a short episode with unhealthy readings at two stations can qualify. A human may want to tighten them. Episode boundaries and confidence ratings are also AI judgements, each with its reasons written down, and the confidence ratings were re-applied after the results were read (see [Confidence](#confidence)).
- **Indonesia is context, not subject.** The research covers Malaysia and Singapore; it records impacts in Indonesia where sources were found, but it is not a history of fires in Indonesia, and impacts there are under-represented.
- **No trend analysis.** The timeline is a set of documented episodes, not a continuous series. It cannot show whether haze has become more or less frequent or severe, and it does not try to.
- **Quotations and archive copies.** Quoted passages remain their publishers' copyright. Where an archive copy is linked, it was found by lookup and was not compared with the text the agent read.

---

<sub>AI involvement: this document is AI GENERATED + UNVERIFIED. It was written by Claude Code during Experiment 002 and has not yet been reviewed by a human.</sub>
