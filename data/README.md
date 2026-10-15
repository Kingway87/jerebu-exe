# Data

> **Status: AI GENERATED + SOURCE ATTACHED. Not human verified.**
> An AI research agent (Claude Code) compiled this dataset during [Experiment 002](../experiments/002-haze-history.md) on 2026-10-15. Every claim links to a source the agent opened, with the exact passage it relied on. No human has checked it yet. Do not treat it as established fact until a named person has verified it.

| File | What it is |
| --- | --- |
| [`haze-events.json`](haze-events.json) | The haze history dataset: episodes, milestones, periods considered but not included, and the sources behind every claim. The website's `/timeline` pages are generated from this file. |
| [`haze-events.schema.json`](haze-events.schema.json) | A JSON Schema (draft 2020-12) describing the file's structure. |

## What the dataset covers

- **Episodes.** Major transboundary haze episodes affecting Malaysia, Singapore or both between 1997 and 2026, selected by the criteria in [`docs/research/HAZE_HISTORY.md`](../docs/research/HAZE_HISTORY.md#event-selection-criteria).
- **Milestones.** Legal, policy, institutional, diplomatic and measurement milestones that help explain the episodes. They are historical markers, not legal analysis.
- **Considered, not included.** Years and periods that were checked and left out, with the reason. Leaving a year out is not a claim that there was no haze.

It does **not** contain live data, continuous air-quality or hotspot series, maps, or any attribution of fires or haze to a company or person. Some claims quote hotspot counts as agencies or news outlets reported them. A hotspot is a satellite detection of heat, not a confirmed fire, and it does not show who caused a fire.

## Structure

```text
{
  schemaVersion, meta,
  sources:    [ Source ],
  events:     [ Event ],
  milestones: [ Milestone ],
  excluded:   [ Excluded ]
}
```

The unit of evidence is the **claim**: one checkable statement.

```jsonc
{
  "id": "…",
  "text": "…",                       // the statement, in neutral words
  "label": "observation",            // fact | observation | analysis | allegation | hypothesis | legal-finding
  "refs": [{
    "source": "…",                   // id of an entry in `sources`
    "quote": "…",                    // the exact passage relied on
    "pinpoint": "p. 3",              // where in the source, if known
    "check": "verbatim"              // or "not-machine-checked"
  }],
  "note": "…"                        // optional context, e.g. which index a reading uses
}
```

An **event** groups claims by what the founder's brief asks a visitor to explore:

| Field | Holds |
| --- | --- |
| `ongoing` | `true` if the episode was still under way when the research was done. Its figures are provisional, and the file is not updated as the situation changes. |
| `period` | Start, end and display label, with the references that support them. |
| `summary` | What happened, in one to four claims. |
| `malaysia`, `singapore` | `impact`, `airQuality` and `responses` claims for each country. |
| `health` | Health evidence, kept apart so its caveats stay visible. |
| `regionalContext` | Fires, weather and climate, and the regional scale. |
| `diplomaticResponse` | Responses between governments or at ASEAN level. |
| `policyDevelopments`, `legalDevelopments`, `aftermath` | What changed, where sources link it to the episode. |
| `sources` | Every source the event cites, in order of first use. |
| `selection` | Why the episode is included: each selection criterion it met (`A`, and at least one of `B1`, `B2`, `B3`), with the ids of the claims in the event that show it. The criteria's wording is in `meta.selectionCriteria`. |
| `attribution` | `origin`: `assessed` if the bodies quoted agree on where the smoke came from, `disputed` if governments or officials publicly disagreed. `responsibility`: always `not-established` — the dataset does not establish who caused any fire, and the build rejects any other value. With a short note. |
| `confidence` | `high`, `medium` or `low`, with a rationale. The definitions are in `meta.confidenceMethod`, quoted from the method written before the research. |
| `contradictions`, `evidenceGaps`, `unresolvedQuestions` | Where sources disagree, what could not be found, and what remains open. |
| `relatedMilestones` | Links to milestones. |
| `review` | The review stage reached, and who checked it and when. |

A **milestone** has a date, a `kind` (regional agreement, ratification, entry into force, legislation, policy, institution, enforcement, legal outcome, diplomatic, or measurement change; `legislation` is kept for laws and subsidiary legislation that were passed, made or brought into force, and steps towards a proposed law, such as a public consultation on a draft bill, are `policy`), a `group` (`regional`, `singapore`, `malaysia`, `indonesia` or `measurement`, which decides the page it appears on), the jurisdictions involved, a title, sourced claims, and the episodes its sources connect it with (`relatedEvents`). A milestone that followed an episode was not necessarily caused by it.

An **excluded** entry names a period that was considered and left out, the reason in terms of the selection criteria, and any sourced claims about it.

A **source** records its title, publisher, author (if any), publication date and URL; a DOI (`doi`) where it has one; an existing web archive copy (`archivedUrl`), if one was found; the address the text was actually read from (`readFrom`), where that differs from the URL, such as a repository copy or an abstract page; the date the agent read it (`accessed`) and how (`accessMethod`); whether it is `open`, `partial`ly paywalled or `paywalled` (`access`), where that was recorded; its type; the language of the text read; and an optional `note`.

Fields that are empty are empty because no evidence was found, not because nothing happened.

## Review stages

| Stage | Meaning |
| --- | --- |
| `ai-generated` | An AI agent produced the content. |
| `source-attached` | Every statement links to a source the agent opened, with the exact passage relied on. **The whole dataset is at this stage.** |
| `human-checked` | A named person has read the entries and spot-checked sources, but not every claim. |
| `human-verified` | A named person has opened every cited source and confirmed each claim as worded. |

The stage names come from the founder's Experiment 002 brief. Only a human can record `human-checked` or `human-verified`, with their name and the date, in `review.humanChecked` or `review.humanVerified`. See [`docs/AI_TRANSPARENCY.md`](../docs/AI_TRANSPARENCY.md).

## How it is checked

- **On every build.** `src/content/haze-history.ts` validates the file when the site is built. The build fails if a claim has no source, a reference points to a missing source, an id is repeated, a date is malformed, an event's `sources` list does not match what it cites, a source is never cited, an event does not show criterion A and one of B1–B3 through its own claims, an event's responsibility status is anything but `not-established`, a date is not a real calendar date or is later than the compilation date, a contradiction cites fewer than two different sources, a review stage lacks the reviewer's name and date or names an AI as the reviewer, or a coarse pattern check finds a company-style name (such as "Sdn Bhd" or "PT …") in any text in the file except web addresses and identifiers. That check misses names written without such a marker. Run `npm run build`.
- **During the experiment.** Each quoted passage marked `verbatim` was matched by script against the text downloaded from the source on the date in `accessed`. Pages can change, so a passage that matched then may not match now. The experiment record describes the checks and their results.
- **By a human.** Nothing replaces opening the source. [`docs/research/HAZE_HISTORY.md`](../docs/research/HAZE_HISTORY.md#priority-claims-for-human-verification) lists the claims to check first.

## Reading air-quality figures

Readings are recorded exactly as each source published them, with the index, averaging period, place and time the source gives. Some figures, labelled `analysis`, were worked out by the AI agent from an agency's published data, such as the highest 24-hour PSI in a year; the claim's note says how. Malaysia's Air Pollutant Index (API) and Singapore's Pollutant Standards Index (PSI) are different indices, and both changed during the study period. The dataset's measurement-change milestones record the changes that were found. Do not compare readings across countries or years without accounting for this.

## Licence and quotations

For now, the dataset's structure and the text written for it fall under the repository's [MIT licence](../LICENSE). Whether the dataset needs a separate licence is an open decision for humans (see the [roadmap](../docs/ROADMAP.md#open-decisions-for-humans)). The quoted passages remain the copyright of their publishers. They are short excerpts, included so that each claim can be checked against its source. Whether this approach suits every jurisdiction has not been reviewed by a lawyer.

## Reporting a problem

If a claim misstates its source, a source is wrong, or something important is missing, please [open an issue](https://github.com/Kingway87/jerebu-exe/issues) or see [`docs/CORRECTIONS.md`](../docs/CORRECTIONS.md).

---

<sub>AI involvement: this document is AI GENERATED + UNVERIFIED. It was written by Claude Code during Experiment 002 and has not yet been reviewed by a human.</sub>
