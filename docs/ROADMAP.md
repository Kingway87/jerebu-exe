# Roadmap

> **Draft, subject to human decision.** An AI agent (Claude Code) wrote this roadmap during [Experiment 001](../experiments/001-autonomous-bootstrap.md), from the founder's brief, and updated the parts about Experiment 003 during [that experiment](../experiments/003-live-evidence.md). No human has reviewed it yet.
>
> **No dates are committed.** There are no timelines, deadlines or release targets. Within *Next* and *Later*, the order is not a commitment either. Any experiment may be changed, merged, split, reordered or dropped.

## Contents

- [How to read this roadmap](#how-to-read-this-roadmap)
- [Now](#now)
- [Next](#next)
- [Later](#later)
- [Conceptual pipeline (not implemented)](#conceptual-pipeline-not-implemented)
- [Not planned for now](#not-planned-for-now)
- [Open decisions for humans](#open-decisions-for-humans)
- [How this roadmap changes](#how-this-roadmap-changes)

## How to read this roadmap

JEREBU.EXE moves forward through numbered, public **experiments**. Each experiment starts from a question, not a promised feature. It records what humans decided, what AI did, what came out, what went wrong and what still needs review.

- **Now** is the work in progress.
- **Next** is what is most likely to come after it.
- **Later** is work that depends on earlier experiments, or needs decisions that have not been made.

**Planned experiments have not started, and none has results.** Their questions are taken from [`src/content/experiments.ts`](../src/content/experiments.ts), which feeds the site's `/experiments` page. Each section below says what an experiment *might* produce. These are possibilities to discuss, not commitments.

Every experiment follows the project's evidence rules in [`METHODOLOGY.md`](METHODOLOGY.md) and its AI policy in [`AI_TRANSPARENCY.md`](AI_TRANSPARENCY.md). Every experiment's output goes through a pull request and human review before it is merged or published.

---

## Now

### 001: Autonomous project bootstrap

**Status:** In progress. AI build complete; awaiting human review; **not deployed**.

**Question:** How much of JEREBU.EXE V0 can Claude Code Cloud autonomously build from a nearly empty repository?

**What it produced:**

- A static website (Next.js, TypeScript, Tailwind CSS) with four routes: `/`, `/evidence`, `/experiments` and `/about`.
- An evidence framework that separates observation, interpretation, attribution and legal responsibility.
- A list of candidate public data sources, located by web search only and not yet evaluated (see [`DATA_SOURCES.md`](DATA_SOURCES.md)).
- Repository documentation, including this roadmap.

The full record is in [`experiments/001-autonomous-bootstrap.md`](../experiments/001-autonomous-bootstrap.md).

**Still to happen (human):**

- Review the pull request.
- Correct or reject anything wrong, and record any corrections.
- Check the site's main factual claims, which are listed in [`src/content/claims.ts`](../src/content/claims.ts); none has yet been checked by a human.
- Record the cost of the session.
- Decide whether, where and when to deploy (see [Open decisions](#open-decisions-for-humans)).

**What it does not do:** It does not deploy, display live data, collect personal data, publish to social media, or contact anyone.

### 003: Live evidence

**Status:** In progress on the branch `experiment/003-live-evidence`. AI build complete; evidence reviewed by the project's maintainer on 15 October 2026; **not merged, not deployed**. Experiment 002 ran independently and was not required.

**Question:** Can JEREBU.EXE collect, normalise and present current public environmental observations relevant to transboundary haze affecting Malaysia and Singapore without confusing observation, interpretation, attribution or legal responsibility?

This question comes from the founder's brief for Experiment 003. It replaces the earlier planned question for 003, "Satellite evidence", which the brief folded into a wider experiment.

**What it produced (on the branch):**

- A `/live` page showing NASA FIRMS satellite fire detections (counts and a map), Singapore's PSI and PM2.5 by region, wind and rainfall at Singapore's weather stations, and MET Malaysia's forecast by state. Each comes with its source, observation time, retrieval time and a freshness status, and fails honestly: missing data is never shown as zero.
- A machine-readable register of the 17 sources investigated: [`data/live-sources.json`](../data/live-sources.json).
- Malaysia's Air Pollutant Index linked, not copied, because no documented public feed of current readings was found; ASMC named, not linked, because of its terms of use.
- Deterministic code with tests. No AI model processes any value.

Details: [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md) and the record, [`experiments/003-live-evidence.md`](../experiments/003-live-evidence.md).

**Still to happen (human):** the remaining decisions in the record: how to refer to NEA and ASMC, whether to ask DOE and ASMC for data, how to host a page whose data refreshes, and the merge order with Experiment 002.

**What it does not do:** attribution of any kind, company or land-ownership data, history or trends, AI interpretation, tracking, or deployment.

---

## Next

### 002: Haze history

**Question:** Can a sourced, checkable timeline of past haze episodes affecting Malaysia and Singapore be assembled from public records?

**What it might produce:**

- A timeline in which every entry cites a primary or otherwise reliable source. A human must verify each entry before it is published.
- A short method note on what counts as an "episode", and which records are used.
- A visible list of the places where sources disagree, or where records are missing.
- Possibly the `/timeline` route that V0 deliberately left out, but only once there is sourced content to show.
- Sources for the site's own framing claims, which are currently unverified. For example, the claims that haze has recurred over decades and that people in Indonesia are also affected.

**Preconditions and risks:**

- **Fabricated history.** AI tools can invent events, dates and figures. No entry is added without a citation that a human has checked.
- **Unevaluated sources.** The relevant sources must first move from *Candidate* to *Evaluated* (see the checklist in [`DATA_SOURCES.md`](DATA_SOURCES.md)).
- **Inconsistent measures.** Measurement methods and air-quality indices may differ between countries and over time. Any comparison must say so.
- **Conflicting accounts.** Where accounts conflict, the conflict is shown, not resolved by assumption.

**What it will not do:**

- Assign the cause of any episode to a country, organisation or person.
- Rank or blame jurisdictions.
- Make health claims of its own.
- Present an uncited event as fact.

### 004: Legal landscape

**Question:** Which laws, agreements and policies are relevant to transboundary haze in Malaysia and Singapore, according to primary sources?

**What it might produce:**

- An index of primary legal sources at three levels: regional agreements, Malaysian law and Singaporean law. Each item is linked to its official text and labelled with its version and date.
- Careful, plain-language descriptions that are clearly labelled as not legal advice.
- A list of open legal questions that the project cannot answer itself.

**Preconditions and risks:**

- **Primary sources only.** Read the official texts themselves, not commentary about them. [`DATA_SOURCES.md`](DATA_SOURCES.md) lists official portals and texts as *leads*. Nobody has read them yet.
- **Unofficial versions.** Search results indicate that some official portals describe their online texts as unofficial or not authoritative. Check which version is authoritative before anything is cited.
- **Legal review.** AI summaries of law are high-risk. Qualified legal review is likely needed before any description of what a law says or does is published. Whether, how and by whom that review is done is an [open decision](#open-decisions-for-humans).
- **Laws change.** Every description must state the version and date of the text it describes.
- **Scope.** Whether Indonesian law and other jurisdictions' law is in scope, and how, is an open decision.

**What it will not do:**

- Give legal advice.
- Assess whether any person, company or government has broken any law.
- Predict the outcome of any case.
- Describe a judgment that no one has read.

---

## Later

### 005: Evidence agent

**Question:** Can an AI research agent find and cite public evidence reliably enough to assist — not replace — human reviewers?

**What it might produce:**

- A small, documented workflow in which an AI agent proposes sources and citations, and human reviewers accept or reject them.
- Automatic checks, such as confirming that a cited DOI exists.
- A published, measured record of the agent's errors, including fabricated or misattributed citations.

**Preconditions and risks:**

- **Fabricated citations.** AI agents can produce plausible but non-existent citations. Every citation must be checked against the source itself.
- **AI output is not evidence** ([`AI_TRANSPARENCY.md`](AI_TRANSPARENCY.md)). Nothing the agent produces is published without human review.
- **Depends on earlier experiments.** It needs the standards from 002–004 to exist first.
- **Logging and cost.** Prompts, tools, models and cost should be logged where available.
- **Minimal tooling.** Any new dependency or framework must be justified.

**What it will not do:**

- Publish anything on its own.
- Decide attribution or responsibility.
- Replace human reviewers.
- Contact any person or organisation.

### 006: Community action

**Question:** Which legitimate, lawful forms of civic participation can the project support without collecting sensitive personal data?

**What it might produce:**

- A guide to legitimate ways to take part. For example: contributing research, code or review to the project, and using official public channels where they exist.
- Clear pathways for contributors.

**Preconditions and risks:**

- **No personal data without a privacy design.** No petitions, signature storage, mailing lists, contact forms or other collection of personal data without a documented privacy design that a human has approved. V0 collects none.
- **Lawfulness.** What is lawful and appropriate may differ between Malaysia, Singapore and other places. This must be checked, not assumed.
- **Harassment.** Participation must never target, harass or pile on individuals, companies, officials or communities.
- **Framing.** The project's subject is transboundary haze accountability. It must not drift into adversarial framing of Indonesia or Indonesians, who are also affected by fires and haze.
- **Moderation and conduct.** Any participation channel needs moderation, and the [Code of Conduct](../CODE_OF_CONDUCT.md) applies.

**What it will not do:**

- Launch petitions or collect signatures.
- Run campaigns against named people or organisations.
- Contact officials, companies, journalists or NGOs on anyone's behalf.
- Collect health or location data.

### 007: Automated public monitoring

**Question:** Can recurring public data be monitored automatically, with human review before anything is published?

**What it might produce:**

- Scheduled collection of data from sources that have been *Evaluated*. (Experiment 003's `/live` page refreshes its data in the background, but it stores no history, monitors nothing and sends no alerts.)
- Draft reports or alerts, sent to maintainers for review, never directly to the public.

**Preconditions and risks:**

- **Human review before publication** is not optional.
- **New infrastructure.** This needs things V0 deliberately does not have: scheduled jobs, storage and managed secrets. Each one needs a documented, human-approved decision.
- **Outages and stale data.** Source outages and stale data must be shown as such.
- **Practicalities.** Costs, rate limits and source terms must be respected.
- **Depends on earlier experiments.** It builds on 003 and 005.

**What it will not do:**

- Publish automatically.
- Post to social media automatically.
- Attribute events to anyone automatically.
- Present provisional readings as final.

---

## Conceptual pipeline (not implemented)

The founder's brief sketches a long-term evidence pipeline:

```text
PUBLIC DATA → INGESTION → NORMALISATION → EVIDENCE STORE → AI ANALYSIS → SOURCE VERIFICATION → HUMAN REVIEW → PUBLIC REPORT
```

> **Not implemented as a whole.** The site shows this diagram on `/evidence`, labelled "Not implemented in V0". It is a direction of travel, not a design, and it may change as experiments teach us more. Experiment 003 implements a narrow, separate path for current observations on `/live` (source → fetch → validate → normalise → cache → display), described in [`LIVE_EVIDENCE.md`](LIVE_EVIDENCE.md). It keeps no evidence store and has no AI stage.

| Stage | Intended purpose | Status |
| --- | --- | --- |
| Public data | Official and open sources, evaluated first | Partly, on the Experiment 003 branch: seven official feeds on `/live`, evaluated by AI agents only |
| Ingestion | Collected with provenance: source, URL, retrieval time, version, licence | Partly, on the Experiment 003 branch: each retrieval records source, URL, retrieval time, server date and validation results |
| Normalisation | Comparable formats and units, without hiding differences between methods | Partly, on the Experiment 003 branch: one observation format; units kept as published, different indices not converted |
| Evidence store | Versioned and citable, with raw data kept apart from processed data | Not implemented (Experiment 003 caches the latest snapshots only) |
| AI analysis | Assists; does not decide | Not implemented |
| Source verification | Every claim traced back to a source | Not implemented |
| Human review | Required before publication | Not implemented |
| Public report | Published with its uncertainty shown | Not implemented |

Three principles would hold at every stage:

1. **AI analysis comes before source verification and human review, never after them.** AI output is never the last step.
2. **Uncertainty and conflicts between sources are carried through to the public report**, not smoothed away.
3. **The pipeline produces observations and interpretations.** Attribution needs additional independent evidence and human review. Legal responsibility is established only by legal processes, which the project can report on but never replace.

---

## Not planned for now

The following are deliberately left out of V0. They are not planned for any current experiment.

- Databases
- User accounts and authentication
- Payments
- A content management system (CMS)
- Vector databases
- Analytics and tracking, including cookies and third-party scripts
- Automatic posting to social media
- Petitions and storage of signatures
- Mailing lists, contact forms, and collection of health, location or identity data
- Complex agent frameworks

None of these would be added without a documented experiment, a stated need and human approval. Anything involving personal data would also need a privacy design.

---

## Open decisions for humans

These decisions belong to the founder or future maintainers. They are listed so that they are not made by default, or by an AI.

- **Review of Experiment 001.** Accept, change or reject the bootstrap pull request, and record any corrections.
- **Review of Experiment 003.** The maintainer reviewed the evidence on `/live` and `/evidence` on 15 October 2026. Still to decide, using the checklist in its record: merging the branch, and the order in which Experiments 002 and 003 are merged.
- **Referring to NEA and ASMC.** Their terms of use set conditions on linking and forbid automated copying, and are internally inconsistent. Whether to link to them, ask them, or only name them.
- **Asking DOE and ASMC for data.** Whether to ask DOE Malaysia for a documented feed of current Air Pollutant Index readings, and ASMC about its regional data, and who asks.
- **Live data hosting and keys.** `/live` refreshes its data only on a host that runs Next.js. Whether to use such a host, and whether to obtain a data.gov.sg API key (recommended for production) and a NASA FIRMS MAP_KEY (optional).
- **Hosting and deployment.** Whether to deploy at all, and if so where, when and under whose account. The site is static, so many hosts would work. Nothing is deployed, and an AI agent must not deploy to production without human approval.
- **Domain.** Whether to register a domain, and which one. The AI was instructed not to buy one.
- **Languages.** Whether to add Malay (Bahasa Melayu) and Indonesian (Bahasa Indonesia) versions, and possibly other languages used in the region. Also how translations would be produced and checked.
- **Governance and maintainers.** Who reviews and merges changes, and how decisions are made and recorded. This includes who handles Code of Conduct reports, and whether to stay on Contributor Covenant 2.1 or move to version 3.0, which search results say exists.
- **Legal review.** Whether, and how, to obtain qualified legal review: before Experiment 004 publishes anything, and of the project's own disclaimer and wording.
- **Order and scope of experiments.** Which experiment comes next, and whether Indonesian law or other jurisdictions are in scope for Experiment 004.
- **Source evaluation.** Who evaluates candidate sources, and which first.
- **Content licence.** The repository is under the MIT licence. Whether written content and any future datasets need a separate licence.
- **Official channels.** Whether the project should have any social media presence. None exists, and AI agents must not create accounts.
- **Recording cost.** How to record the cost of AI agent work for each experiment.

---

## How this roadmap changes

- Changes are made by pull request, and a human decides.
- When an experiment starts, finishes or is dropped, update [`src/content/experiments.ts`](../src/content/experiments.ts) and this file in the same pull request, so the site and the documentation agree.
- Each experiment gets its own record in [`experiments/`](../experiments/).
- Dates are added only when a human commits to them.

---

<sub>AI involvement: this document is **AI GENERATED**. Claude Code wrote it during Experiment 001 from the founder's brief, and updated it during Experiment 003. It is a **draft** and has not been reviewed by a human. The experiment questions are taken from `src/content/experiments.ts`. The descriptions of what each experiment might produce are proposals, not commitments.</sub>
