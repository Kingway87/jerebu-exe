# Methodology

> **Status: V0 draft, awaiting human review.**
> Written by an AI agent (Claude Code) on 2026-10-14, during [Experiment 001](../experiments/001-autonomous-bootstrap.md). The eight safety rules, the four levels of the evidence ladder, the two inequalities and the six claim types come from the project founder's task brief. The rest of the wording was written by the AI.
> AI involvement: **AI GENERATED + UNVERIFIED** (see [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md)). No human has reviewed this document yet. It will change. Three passages were updated during [Experiment 003](../experiments/003-live-evidence.md), which first applied this method to live data.

This document sets out how JEREBU.EXE handles evidence and claims. It applies to everything the project publishes: website pages, documentation, data, code comments, issues and pull requests. It applies to every contributor, human or AI.

It describes a method, not findings. JEREBU.EXE has made no findings about any haze event, organisation or government. Experiment 003 (on its branch, not yet merged) shows current official observations on `/live`, and produces observations only; it also shows MET Malaysia's forecast, tagged as that agency's own interpretation (Level 2), which this site does not produce or extend. That is the method's first use on real data.

The structured version of the framework is in [`src/content/evidence.ts`](../src/content/evidence.ts), which the website's `/evidence` page displays. This document and that file should say the same thing. If they disagree, treat it as a bug and open an issue.

## Contents

1. The evidence ladder
2. Two inequalities
3. Claim labels
4. Data and claim safety rules
5. Source hierarchy
6. Citation standard
7. Handling conflicting evidence
8. Before naming an organisation, person or government
9. The claims register
10. Corrections
11. Limits of this methodology

---

## 1. The evidence ladder

Every statement about haze sits on one of four levels. Each level needs more evidence, and more scrutiny, than the one before it.

### Level 1: Observation

- **Definition.** Something measured or recorded, with a time, a place and a method.
- **Example.** A satellite instrument records a thermal anomaly — a “hotspot” — at a location and time.
- **Requires.** A named source, the time and method of measurement, and the known limits of that method.

### Level 2: Interpretation

- **Definition.** An analysis of what one or more observations might mean.
- **Example.** Smoke transport modelling suggests that smoke from one area could have reached another.
- **Requires.** A stated method, its assumptions, and an honest account of uncertainty and alternative explanations.

### Level 3: Attribution

- **Definition.** Connecting an event to a specific organisation, person or actor.
- **Example.** Linking a particular fire to land managed by a particular entity.
- **Requires.** Additional, independent evidence beyond observation — and careful human review. A hotspot on a map is not enough.

### Level 4: Legal responsibility

- **Definition.** A determination made under law.
- **Example.** A court or authorised body decides, under applicable evidentiary standards, that a party is legally responsible.
- **Requires.** A legal process. JEREBU.EXE cannot make this determination; it can only report determinations made by those processes, with citations.

### Moving between levels

- **Only further evidence moves a statement up the ladder.** Repeating a claim, mapping it or sharing it widely does not.
- **Each step is a separate question.** An accurate observation does not make an interpretation correct. A well-supported interpretation does not establish who is responsible.
- **Keep the level visible.** A reader should be able to tell which level a published statement belongs to.
- **The last level is not the project's to reach.** JEREBU.EXE reports legal determinations made by courts and authorised bodies. It does not make them (see section 8).

## 2. Two inequalities

```text
HOTSPOT      ≠  RESPONSIBLE COMPANY
CORRELATION  ≠  LEGAL ATTRIBUTION
```

Both guard against the same mistake: skipping levels on the ladder.

**A hotspot is not a responsible company.** A hotspot is a satellite detection of unusual heat at a place and time. It may or may not be a fire. Even a confirmed fire does not, by itself, show who started it, who controls the land, or whether any law was broken. Each of those is a separate question that needs its own evidence.

**A correlation is not a legal attribution.** Two things that rise and fall together are correlated: for example, hotspots detected in one area and haze measured in another. A correlation can be a good reason to investigate. By itself, it does not show that one thing caused the other, rule out something else explaining both, or identify any party. A legal attribution needs evidence linking a specific actor to a specific event, assessed through a legal process under the applicable standards.

## 3. Claim labels

Safety rule 3 asks the project to keep six kinds of statement apart. When the project publishes research, each statement should carry one of these labels, either explicitly or through unambiguous wording.

| Label | Meaning |
| --- | --- |
| **Fact** | Established and supported by a citable, reliable source. |
| **Observation** | A measurement or record, reported with its source and limits. |
| **Analysis** | Reasoning from evidence, with its method and uncertainty shown. |
| **Allegation** | A claim someone has made that has not been established. |
| **Hypothesis** | A possible explanation that still needs testing. |
| **Legal finding** | A determination by a court or authorised body, cited to its source. |

How to apply them:

- **Fact** is for statements that are established. Do not use it for anything contested. Use analysis, allegation or hypothesis instead, and show the disagreement.
- **Observation** names the source, time, place and method, and notes the method's known limits.
- **Analysis** shows its method, inputs and uncertainty, so that someone else could check it.
- **Allegation** says who made the claim, when and where, and cites it. It is never restated as fact, however often it is repeated.
- **Hypothesis** says what evidence would support or weaken it.
- **Legal finding** names the court or body, the decision and its date, quotes the relevant wording, and cites the official record.

### Three separate questions

A published statement can be described in three ways. Keep them apart.

| Question | Answered by | Where it is defined |
| --- | --- | --- |
| What kind of statement is this? | Claim label: fact, observation, analysis, allegation, hypothesis, legal finding | This section, and `claimTypes` in `src/content/evidence.ts` |
| How far has this factual claim been checked? | Verification status: Unverified, Cited, Human verified | The claims register (section 9) |
| Who produced this work, and has a human checked it? | AI involvement labels: HUMAN DECISION, AI ASSISTED, AI GENERATED, HUMAN VERIFIED, UNVERIFIED | [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md) |

For a factual claim, "Human verified" in the claims register and the HUMAN VERIFIED label mean the same thing: a named person has checked the claim against its source.

## 4. Data and claim safety rules

The founder set these eight rules in the task brief for Experiment 001. They apply to humans and AI alike. They are reproduced here exactly as the founder wrote them.

1. Never accuse a company, individual or government of causing a particular haze event without sufficient reliable evidence.
2. A satellite hotspot alone does not establish ownership, responsibility or wrongdoing.
3. Distinguish: fact, observation, analysis, allegation, hypothesis, legal finding.
4. Cite important factual claims.
5. Prefer primary sources where appropriate.
6. When evidence conflicts, expose uncertainty rather than hiding it.
7. AI-generated conclusions require human verification before being presented as established facts.
8. Never fabricate environmental statistics, historical events, laws, cases or citations.

The website shows the same wording, from `safetyRules` in [`src/content/evidence.ts`](../src/content/evidence.ts).

The rest of this document explains how to follow these rules in practice.

## 5. Source hierarchy

Rule 5 asks for primary sources where appropriate. For supporting a factual claim, prefer sources in this order.

1. **Primary official sources.** The original record, from the body that produced it. For example: a dataset published by the agency that operates the instrument or monitoring network; a law as published by the government that made it; a judgment published by the court that delivered it; a statement or report from the body that issued it.
2. **Peer-reviewed research.** Published scientific, legal or policy scholarship that has been through peer review and shows its methods.
3. **Reputable secondary sources.** Established news organisations, reference works, and reports by research or civil-society organisations that describe or analyse primary sources. "Reputable" here means that authors or publishers are named, sources are cited and corrections are published.
4. **Aggregators.** Websites, portals, dashboards, databases and search tools that collect or repackage other people's data or documents.

How to use the hierarchy:

- **Trace claims back to the original.** Use secondary sources and aggregators to find primary sources, not to replace them. If only a secondary source can be found, cite it and say that the primary source was not checked.
- **"Where appropriate" matters.** Raw data often needs expert interpretation. A peer-reviewed analysis may support an interpretation better than the project's own reading of raw data.
- **Official does not mean correct.** An official statement is a primary source for what an official body said. On its own, it is not proof that what it said is correct, especially where that body has an interest in the question. Label it accordingly.
- **Peer review is not a guarantee.** Check the date, the scope, any corrections or retractions, and any funding or conflict-of-interest statements. One study is not a consensus.
- **Some things are not sources.** The output of an AI tool is not a source (see [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md)). A social media post is a primary source only for the fact that its author said something.

### Why provenance matters

Provenance is the chain from the original measurement or document to the statement the project publishes. Every link in that chain can introduce error: units converted wrongly, timestamps shifted between time zones, quality flags dropped, context lost, a translation that changes the meaning, a summary that drops a qualifier.

Without that chain, nobody, including the project, can judge how far to trust a statement, check it, or correct it. Provenance is also what stops a rumour from becoming a "fact" just because it has been repeated in many places.

For every piece of evidence, record the original source, any intermediate source it passed through, and any change the project made to it.

## 6. Citation standard

Every citation should include:

| Field | Notes |
| --- | --- |
| **Title** | The exact title of the document, page or dataset. |
| **Author or publisher** | The person or organisation responsible for it. |
| **Date published** | As stated by the source. If none is given, write "undated". |
| **URL** | Where it was read. Add a stable identifier, such as a DOI, where one exists. |
| **Date accessed** | The date someone actually read it. |
| **Archived copy** | A link to a copy in a public web archive, where possible. If no copy could be made, say why. |

Where relevant, also include:

- **Pinpoint.** The page, section, paragraph, table or figure relied on.
- **For datasets.** The product name and version, the time range and area, any query parameters, and the date the data was retrieved. Datasets can be revised, so say which version was used.
- **For legal texts.** Quote the exact wording. Do not paraphrase what a law says or does. Give the section or article number, where the text came from (preferably an official publication), the version or date in force if known, and which language version was read. If a translation was used, say whose it was and that it may not be authoritative.
- **Who read it.** The person or agent who read the source, so a reviewer can tell whether a human has checked it.

A template:

```text
Title:            <exact title>
Author/publisher: <person or organisation>
Date published:   <YYYY-MM-DD, or "undated">
URL:              <address where it was read>
Accessed:         <YYYY-MM-DD>
Archived copy:    <archive URL, or "none" and why>
Pinpoint:         <page / section / paragraph / table>
Quoted text:      "<exact words relied on; required for legal texts>"
Read by:          <name or handle; human or AI agent>
```

Rules for citing:

- **Never cite something you have not read.** Read the part you rely on, not just a search snippet, an abstract or someone else's summary of it.
- **AI-generated citations must be checked against the real source.** AI tools can produce references that look real but do not exist, and real references that do not say what is claimed. Before using a citation an AI found or wrote: open it, confirm the title, author and date, and confirm that the passage supports the claim as worded. Record who did this.
- **Leads are not citations.** The candidate sources listed in [DATA_SOURCES.md](DATA_SOURCES.md) and [`src/content/sources.ts`](../src/content/sources.ts) were located by AI web search during Experiment 001. No page was opened during that work. They are leads. None of them can support a claim until someone has read it.
- **Say when a source is not openly available.** If a source is paywalled or otherwise restricted, say so, and prefer an openly available version where one exists.
- **Never invent a citation (rule 8).** A missing citation is better than a made-up one. Leave the gap and mark the claim Unverified.

## 7. Handling conflicting evidence

Rule 6 asks the project to expose uncertainty rather than hide it. When sources disagree:

- **Show both.** Present each source, what it says, its method and its date. Do not silently pick one, average figures that are not comparable, or leave out the inconvenient source.
- **Explain the uncertainty.** Say why the sources might differ, where that is known: different instruments, methods, definitions, areas, time periods, revisions or translations. If the reason is not known, say so.
- **If you judge one source stronger, say why,** and still show the other.
- **Say what would resolve the disagreement,** if anything could.
- **Leave open questions open.** "The sources disagree, and the reason is not known" is an acceptable conclusion.
- **Missing is not zero.** The absence of a record is not evidence that something did not happen. Show gaps as gaps.

## 8. Before naming an organisation, person or government

Rule 1 forbids accusing anyone of causing a particular haze event without sufficient reliable evidence. This section proposes what "sufficient" should mean in practice.

> This section is a draft written by an AI. It has not been reviewed by a lawyer or approved by the founder. A human must approve it before it is used for the first time.

**Current position.** At the time of writing, JEREBU.EXE does not connect any organisation, person or government with causing or contributing to any fire or haze event. The project will not build a system that identifies responsible parties automatically.

Before the project names anyone in connection with an event, all of the following should be true.

1. **Evidence threshold.** The claim reaches the attribution level of the ladder: there is evidence, beyond observation, linking that specific party to that specific event. A hotspot, a correlation or a map overlay is never enough on its own.
2. **Independent corroboration.** There are at least two independent lines of evidence (a proposed minimum). Independent means not derived from the same original report or dataset. Ten articles repeating one report count as one source.
3. **Human review.** A named human reviewer has read the evidence, approved the exact wording, and recorded the approval. An AI agent may help find and organise evidence. It may not decide to name anyone, and it may not publish.
4. **Legal review considered.** Publishing an allegation about an identifiable party can carry legal risk, and the rules differ between countries. The reviewer should consider getting advice from a qualified lawyer in the relevant jurisdictions, and record whether that was done.
5. **Right of reply considered.** Where practical, the named party should be offered a chance to respond before publication, and the response published, or a note made that none was received. Contacting anyone is a human decision. AI agents must not contact organisations, people or governments on the project's behalf. The Experiment 001 brief did not permit contacting government agencies, companies, journalists or NGOs, or sending emails.
6. **Official findings preferred.** Where a court or authorised body has made a determination, report that finding rather than reaching a new attribution. Say who decided, what was decided, when, and where it is published. Quote the relevant wording. Say whether the decision is final or under appeal, if that is known. Do not stretch a finding beyond its scope: a finding about one event, place or period says nothing, by itself, about others.
7. **Labels and wording.** Label the statement (allegation, analysis or legal finding). Attribute allegations to whoever made them. Avoid loaded words. Say what is not known.

Also:

- **Private individuals.** Do not name private individuals in connection with an event, and do not publish their personal data. If a case ever seems to require it, treat it as a human decision and record the reasons.
- **Governments and countries.** A government's documented actions and official positions can be reported, cited to official sources. A country, or its people, is never presented as the cause of haze. People in Indonesia are also affected by fires and haze, and the subject of this project is transboundary haze accountability, not a contest between countries.
- **If the project gets it wrong.** Remove or correct the statement promptly. Record the correction in [CORRECTIONS.md](CORRECTIONS.md) without repeating the harmful claim.

## 9. The claims register

The project applies its own rules to its own website. [`src/content/claims.ts`](../src/content/claims.ts) lists the main factual statements the website makes about the world, each with a verification status and a note. The website's `/evidence` page displays it. Descriptions of candidate sources are tracked, with their provenance, in [docs/DATA_SOURCES.md](DATA_SOURCES.md).

| Status | Meaning |
| --- | --- |
| **Unverified** | No reliable source is linked yet. |
| **Cited** | A reliable source is linked. |
| **Human verified** | A named human reviewer has checked the linked source. |

How a claim moves:

1. **Unverified to Cited.** Find a reliable source, preferring a primary one (section 5). Read it. Confirm that it supports the claim as worded, or reword the claim to match what the source actually says. Add the citation (section 6) and change the status in a pull request. Anyone, human or AI, may propose this. A human reviews the pull request.
2. **Cited to Human verified.** A named human reviewer opens the cited source. They confirm that it exists, that it is the version cited, and that it supports the claim as worded. They record their name and the date. An AI agent cannot mark a claim Human verified.
3. **Moving back down.** If a source changes or disappears without an archived copy, is found to be unreliable, or the claim's wording changes, the status goes back down. If a published claim turns out to be wrong, it is corrected and the correction is logged (section 10).

Other rules:

- **New claims are registered.** When the website adds a factual statement about the world, add it to the register in the same pull request.
- **Unsupportable claims are removed.** A claim that cannot be supported should be reworded or removed, not left in place indefinitely as Unverified.
- **Status is not a label.** Verification status says how far a claim has been checked. It does not replace the claim label (section 3).

**Current state.** On the Experiment 003 branch, 10 of the 18 entries in the register are Cited and 8 are Unverified; none is Human verified. Each Cited entry records its citations: title, publisher, URL, date published, date accessed, the words relied on, who read it, an archived copy where one was read, and whether it may be linked. All were read by AI agents. The register does not yet have fields for a human reviewer's name and date.

## 10. Corrections

Mistakes are recorded with their corrections, not quietly erased. [CORRECTIONS.md](CORRECTIONS.md) sets out what counts as a correction, how to report an error, and the format of each entry.

Most errors can be reported in a public GitHub issue. Report privately, by email to [JEREBU.EXE@proton.me](mailto:JEREBU.EXE@proton.me), if public discussion could cause harm: for example, where an identifiable person or organisation is wrongly implicated.

## 11. Limits of this methodology

- **It is a V0 draft written by an AI.** It was written during Experiment 001 from rules set by the founder. No human has reviewed it yet, and no legal, scientific or data specialist has reviewed it.
- **It is barely tested.** Only Experiment 003 has handled real data under it, at the observation level only: no interpretation, attribution or finding has been made.
- **Its thresholds are proposals.** For example, the minimum of two independent lines of evidence in section 8 needs a human decision.
- **It cannot replace judgement.** Following it reduces the risk of error. It does not guarantee that a statement is correct.
- **It is not legal advice,** and it does not describe what any law requires.
- **It is written in English only.** Relevant sources may be in other languages. Beyond the notes on translation in section 6, it does not yet say how translations should be checked.
- **It will change.** Later experiments will test it and should improve it. Changes are made through pull requests, recorded in git history, and approved by a human.

It is open to challenge. If you think a rule is wrong, unclear or missing, please open an issue. Disagreement that comes with a source is especially welcome.

---

*JEREBU.EXE is an independent educational and open-source civic-tech experiment. It does not provide legal, medical or scientific advice. AI-generated research must be independently verified before being treated as factual evidence.*
