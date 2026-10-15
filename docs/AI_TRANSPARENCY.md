# AI transparency

> **Status: V0 draft policy, awaiting human review.**
> Written by an AI agent (Claude Code) on 2026-10-14, during [Experiment 001](../experiments/001-autonomous-bootstrap.md). The five label names were suggested in the founder's task brief. Their definitions, and the rest of this policy, were written by the AI.
> AI involvement: **AI GENERATED + UNVERIFIED**. No human has reviewed this document yet. During [Experiment 002](../experiments/002-haze-history.md) (2026-10-15), an AI agent added the [review stages for research content](#review-stages-for-research-content), whose names come from the founder's Experiment 002 brief, and [section 10](#10-experiment-002-at-a-glance). It also updated the claims register example under HUMAN DECISION, the cost wording in section 4 and the status notes in section 9.

JEREBU.EXE asks a question about AI: can one person working with AI agents and open public data build useful civic infrastructure around a decades-old environmental problem? The answer depends on being honest about what the AI did. So AI transparency is part of the product, not a footnote.

This policy sets out how AI participation is labelled and recorded. Over time, anyone should be able to see:

- what humans decided;
- what AI performed;
- what data was used;
- what AI got wrong;
- what required human correction;
- what remains uncertain;
- how much agent work and cost was involved, where that is known;
- whether the result is actually useful.

## Contents

1. Principles
2. The five labels
3. AI output is not evidence
4. What is recorded for each experiment
5. Where it is recorded
6. Known AI failure modes
7. Privacy when using AI tools
8. Endorsement and independence
9. Experiment 001 at a glance
10. Experiment 002 at a glance
11. Changing this policy

---

## 1. Principles

1. **AI output is not evidence.** Whatever an AI tool produces (a summary, a figure, a citation, a conclusion) is not automatically considered evidence. It is a lead to be checked against real sources (section 3).
2. **Important factual claims must eventually have traceable sources.** A reader should be able to follow a claim back to the source it rests on. Until then, the claim is marked Unverified.
3. **AI-generated conclusions require human verification** before being presented as established facts. This is safety rule 7 in [METHODOLOGY.md](METHODOLOGY.md).
4. **Humans are accountable.** Whoever submits or merges AI output is responsible for it.
5. **Disclose; do not disguise.** AI involvement is labelled. AI work is never presented as human work, and unchecked work is never presented as checked.
6. **Generated is not checked. Neither is human-written.** Verification is a separate step, whoever wrote the first draft.

## 2. The five labels

The labels answer two separate questions.

- **Who produced it?** HUMAN DECISION, AI ASSISTED or AI GENERATED.
- **Has a human checked it?** HUMAN VERIFIED or UNVERIFIED.

So a piece of work can carry two labels, one from each group: for example, **AI GENERATED + UNVERIFIED**.

### HUMAN DECISION

- **Meaning.** A choice made by a person, who owns it: the project's mission, scope, rules or priorities, or an approval such as merging a pull request or deploying the site.
- **Examples.** The name JEREBU.EXE. The decision to start with Malaysia and Singapore. The eight data and claim safety rules.
- **Notes.** This label applies to decisions, not to content. If an AI suggested the option that a person chose, record that as well. A decision is owned rather than verified, so this label usually stands alone. But if a decision rests on a factual premise, that premise is a claim, and it needs its own source and status. For example, the founder's premise that haze episodes have recurred over decades is itself a claim in the [claims register](../src/content/claims.ts). It was Unverified until Experiment 002, when an AI agent linked it to sourced claims in the haze history dataset and marked it Cited (the SOURCE ATTACHED stage). At the time of writing, no human has checked those sources.

### AI ASSISTED

- **Meaning.** A person did the work and is its author, with help from AI. The person wrote, or substantially rewrote, the result.
- **Examples.** A contributor writes a paragraph and accepts some AI suggestions on wording. A researcher uses an AI search tool to find candidate papers, then reads them and writes the summary themselves.
- **Notes.** AI assistance does not check facts. Any factual claims in the result still need sources.

### AI GENERATED

- **Meaning.** An AI tool or agent produced most of the content (code, text, data, a summary or a translation), even if a person specified or prompted it.
- **Examples.** The V0 website and its documentation, produced by Claude Code in Experiment 001.
- **Notes.** Generated is not the same as checked. Until a human checks it, AI-generated work is also UNVERIFIED.

### HUMAN VERIFIED

- **Meaning.** A named person has checked the work, and recorded what they checked and when.
  - For a factual claim: they opened the cited source and confirmed that it exists and supports the claim as worded. This is the same as "Human verified" in the claims register.
  - For code or documents: they reviewed it, tested it where relevant, and recorded what they looked at, for example in a pull request review.
- **Example (hypothetical).** A maintainer opens a source that an AI found, confirms the relevant passage, and marks the claim Human verified with their name and the date.
- **Notes.** Verification covers only what was actually checked, and only that version. A substantive edit after verification makes the edited part UNVERIFIED again. An AI agent can never apply this label, either to its own work or to another agent's.

### UNVERIFIED

- **Meaning.** Not yet checked by a person. Do not treat it as fact.
- **Example.** Everything produced in Experiment 001, at the time of writing.
- **Notes.** Unverified does not mean wrong. It means unchecked. It is the default for all AI output, and for any human-written claim without a checked source.

### Common combinations

| Labels | Meaning | Example |
| --- | --- | --- |
| AI GENERATED + UNVERIFIED | AI produced it. No human has checked it yet. | All Experiment 001 output, at the time of writing. |
| AI GENERATED + HUMAN VERIFIED | AI produced it. A named person has checked it. | A candidate source list after a maintainer has opened and checked each link. (First reached on 15 October 2026, when the maintainer reviewed the evidence on `/live` and `/evidence` in Experiment 003.) |
| AI ASSISTED + UNVERIFIED | A person wrote it with AI help. Its claims have not been checked yet. | A human-written summary waiting for its sources to be checked. |
| HUMAN DECISION | A person chose this, and owns it. | The project's mission. |

### Applying the labels

- **When unsure, choose the label that claims more AI involvement and less verification.**
- **Labels apply to a version.** Re-label after substantive edits.
- **AI cross-checks are not human verification.** In Experiment 001, a second "sceptic" agent reviewed the output of the source-search agents and caught real errors. That was useful, but its work is still AI GENERATED + UNVERIFIED.
- **Pull requests.** The [pull request template](../.github/pull_request_template.md) asks contributors whether no AI was used, or whether the change was AI assisted or AI generated. That records who produced the change. The change becomes HUMAN VERIFIED only when a named reviewer records what they actually checked.

### Review stages for research content

The founder's brief for [Experiment 002](../experiments/002-haze-history.md) set four stages for research content, such as the haze history dataset ([`data/haze-events.json`](../data/haze-events.json)) and the `/timeline` page built from it. The stage names are a HUMAN DECISION. The definitions below were drafted by AI and are AI GENERATED + UNVERIFIED.

Each stage includes the ones before it.

| Stage | Meaning | Who can record it |
| --- | --- | --- |
| **AI GENERATED** | An AI agent produced the content: it chose what to include, read the sources and wrote the text. | Applies to all AI output. |
| **SOURCE ATTACHED** | Every factual statement links to at least one source that the agent opened during the work, with the exact passage it relied on. Where the source could be downloaded, a script matched each passage against the downloaded text. | An AI agent may record this, because anyone can check it mechanically. |
| **HUMAN CHECKED** | A named person has read the entries and spot-checked their sources, and recorded what they checked and when. Not every claim has been confirmed. | Only a human. |
| **HUMAN VERIFIED** | A named person has opened every cited source and confirmed that each claim says no more than its source, as worded. This is the HUMAN VERIFIED label defined above. | Only a human. |

How the stages relate to the rest of this policy:

- **Source attached is not verification.** An AI agent can attach a real source and still misread it, quote it out of context, or choose a weak one. Until a human verifies it, research content stays UNVERIFIED in the sense of this policy.
- **The stages do not replace the labels.** The dataset is AI GENERATED (who produced it) and, at the time of writing, at the SOURCE ATTACHED stage (how far it has been checked).
- **The claims register.** For a statement in [`src/content/claims.ts`](../src/content/claims.ts), SOURCE ATTACHED corresponds to "Cited" and HUMAN VERIFIED to "Human verified". HUMAN CHECKED has no register status of its own: a register claim stays "Cited" until it is verified.
- **Recording a human stage.** In the dataset, each episode and milestone has a `review` field. Excluded periods have none yet: add one, or record checks of them in the pull request. A human who checks or verifies an entry records their name, the date and what they checked there, in a pull request. An AI agent must never fill in these fields.

## 3. AI output is not evidence

The output of an AI tool is not evidence, and it is not a source. In practice:

- **An AI summary of a document is not the document.** Read the document, then cite it.
- **A figure produced by an AI must be found in the original source before it is used.** If it cannot be found there, it is not used.
- **A reference or web address produced by an AI must be opened and checked** before it is cited (see section 6 of [METHODOLOGY.md](METHODOLOGY.md)).
- **One AI agent agreeing with another is not confirmation.**
- **AI can help find, organise and draft.** Humans decide what is presented as established.

## 4. What is recorded for each experiment

Each numbered experiment has a written record. It should include:

| Item | What to record |
| --- | --- |
| **Task** | The question the experiment asks, and the brief or instructions given. |
| **Agent or tool** | Which AI tools or agents were used, how many, and what each was asked to do. |
| **Human inputs** | What humans provided or decided, before and during the experiment. |
| **Data used** | Which sources or data were used, and how they were accessed. |
| **Outputs** | The files, features or data produced. |
| **Checks run** | Which checks were run and their results, and which checks were not run. |
| **Errors** | What the AI got wrong, including mistakes it caught in its own work. |
| **Human corrections** | What humans changed after review. |
| **Open questions** | What remains uncertain or unresolved. |
| **Cost** | Agent usage and cost, if reliable figures are available. Never estimate without a basis. Otherwise write "To be recorded after session", "Not available" or "Not directly measured". |

## 5. Where it is recorded

| Place | What it holds |
| --- | --- |
| `experiments/`, for example [`experiments/001-autonomous-bootstrap.md`](../experiments/001-autonomous-bootstrap.md) | The full written record of each experiment. |
| [`src/content/experiments.ts`](../src/content/experiments.ts) | The public experiment log shown on the website's `/experiments` page. |
| [`.github/pull_request_template.md`](../.github/pull_request_template.md), "AI involvement" section | Disclosure for each change: whether AI was used, which tools or agents, and what a human checked. |
| Commit messages | A `Co-Authored-By:` trailer on commits that an AI agent wrote or co-wrote, so that `git log` shows AI involvement. |
| [`src/content/claims.ts`](../src/content/claims.ts), the claims register | How well each factual claim on the website is supported: Unverified, Cited or Human verified. |
| [`docs/CORRECTIONS.md`](CORRECTIONS.md) | Corrections to published content, including whether a human or an AI noticed the error, and where the error came from. |

## 6. Known AI failure modes

Anyone reviewing AI output should look for these. Where one occurred during Experiment 001, it is noted.

| Failure mode | What it looks like | What to do |
| --- | --- | --- |
| **Fabricated citations and URLs** | References, case names, document titles, authors or web addresses that look real but do not exist. Or real ones that do not say what is claimed. | Open every source. Confirm the passage. Never cite from memory. |
| **Outdated knowledge** | AI models are trained on data up to a cut-off date. Laws, agencies, web addresses and datasets may have changed since, and recent events may be missing. | Check current official sources. Record the date accessed. |
| **Overconfident tone** | Uncertain things stated as certain. Caveats dropped. Predictions presented as facts. | Ask what each definite statement rests on. *Experiment 001: a draft homepage line predicted that the haze "will be back". It was an unsupported prediction, and it was rewritten.* |
| **Plausible but wrong summaries** | Fluent text that misstates its source: wrong names or numbers, dropped qualifiers, two sources merged into one. | Compare with the original. *Experiment 001: a sceptic agent flagged 14 overclaims in the source-search output, including a misspelt legal entity name, contradictory statements about how current a dataset was, and an overgeneralised description of a court circular.* |
| **Framing bias** | Repeating a dominant or one-sided narrative, for example treating one country as the cause or the adversary. Relying too heavily on English-language or single-country sources. | Review framing deliberately. Ask how people in each affected country, including Indonesia, would read it. |
| **Overstated reports of its own work** | An agent reporting a check as passed, or a task as finished, more confidently than the evidence supports. | Re-run the checks. Rely on CI and human review, not on the agent's own summary. |

Using several agents to check each other reduces these risks, but does not remove them. In Experiment 001 the sceptic agent, like the search agents, could not open any web page, so it could not confirm what the pages said.

## 7. Privacy when using AI tools

- **Do not paste personal or sensitive data into AI tools.** That includes personal data about private individuals (names linked to events, contact details, identity numbers), health information, confidential or leaked documents, material shared with the project in confidence, and passwords, API keys or other secrets.
- **AI tools are run by third parties.** What you paste may be stored or processed under the provider's terms. Check the terms of any tool you use.
- **This repository is public.** AI sessions working on it should only need information that is already public.
- **If sensitive data is pasted or committed by mistake,** stop, do not push it, and if it has already been pushed, report it privately as described in [SECURITY.md](../SECURITY.md).
- The V0 site's code collects no personal data. Using AI tools must not change that.

## 8. Endorsement and independence

- Experiment 001 used Claude Code, an AI coding agent made by Anthropic. **Using Claude Code does not imply endorsement by Anthropic** of JEREBU.EXE, its methods or its content. Using any other AI tool does not imply endorsement by its maker either.
- **The project does not claim that AI findings are independently verified.** When AI agents check each other's work, that is AI cross-checking, not independent verification. Nothing is independently verified unless a named human, or a cited independent source, has verified it, and the record says so.
- JEREBU.EXE is an independent experiment. It is not an official Malaysian or Singaporean initiative.

## 9. Experiment 001 at a glance

Experiment 001 (autonomous project bootstrap) asked how much of V0 an AI agent could build from a nearly empty repository. This is how its artefacts are labelled at the time of writing.

| Artefact | Label | Notes |
| --- | --- | --- |
| Project concept | HUMAN DECISION | Conceived by the founder before the experiment. |
| Name: JEREBU.EXE | HUMAN DECISION | Chosen by the founder. |
| Mission | HUMAN DECISION | Defined by the founder. |
| Project email address | HUMAN DECISION | Created by the founder. |
| Public GitHub repository | HUMAN DECISION | Created by the founder. The MIT licence was already in place, and was kept. |
| Task brief for Experiment 001 | HUMAN DECISION | Written by the founder, who also started the Claude Code session. |
| The eight data and claim safety rules | HUMAN DECISION | From the founder's brief, reproduced word for word on the website and in [METHODOLOGY.md](METHODOLOGY.md). |
| The five AI involvement label names | HUMAN DECISION | Suggested in the founder's brief. Their definitions in this document are AI GENERATED + UNVERIFIED. |
| Website code and design | AI GENERATED + UNVERIFIED | Pending human review. |
| Website copy | AI GENERATED + UNVERIFIED | Pending human review. |
| Repository documentation, including this policy | AI GENERATED + UNVERIFIED | Pending human review. |
| Candidate source list ([DATA_SOURCES.md](DATA_SOURCES.md) and `src/content/sources.ts`) | AI GENERATED + UNVERIFIED | Located by web search only. No page was opened. A human must check each link. |
| Evidence framework wording | AI GENERATED + UNVERIFIED | Based on the rules and distinctions in the founder's brief: the four levels, the two inequalities and the six claim types. The definitions, examples and explanations were written by the AI. |
| Record of AI mistakes | AI GENERATED + UNVERIFIED | Reported by the AI about its own work. No human has checked that it is complete. |
| Cost of the session | Not recorded | To be recorded after session. Cost information was not available inside the session. |

**Nothing produced in Experiment 001 is HUMAN VERIFIED yet.** Human review is required before production deployment, and had not taken place when this section was written. Pull request #1 later merged the Experiment 001 work into `main` (2026-10-15); no human review of it has been recorded. The full record is in [`experiments/001-autonomous-bootstrap.md`](../experiments/001-autonomous-bootstrap.md).

## 10. Experiment 002 at a glance

Experiment 002 (haze history) asked whether an AI research agent could reconstruct a source-verifiable history of major transboundary haze events affecting Malaysia and Singapore without fabricating facts, overstating evidence or making unsupported attribution claims. This is how its artefacts are labelled at the time of writing. The full record is in [`experiments/002-haze-history.md`](../experiments/002-haze-history.md).

| Artefact | Label | Notes |
| --- | --- | --- |
| Task brief for Experiment 002 | HUMAN DECISION | Written by the founder: the research question, the study period, the source hierarchy, the attribution rules, the health distinctions and the four review stages. |
| Event-selection criteria and confidence method | AI GENERATED + UNVERIFIED | Written by the AI before it read any research result. Awaiting human approval. |
| Haze history dataset ([`data/haze-events.json`](../data/haze-events.json)) | AI GENERATED, at the SOURCE ATTACHED stage | Every claim links to a source the AI opened, with the passage relied on. No human has checked it. |
| The `/timeline` page | AI GENERATED + UNVERIFIED | Generated from the dataset, so it is at the same stage. |
| Research notes ([`docs/research/HAZE_HISTORY.md`](research/HAZE_HISTORY.md)) | AI GENERATED + UNVERIFIED | Includes the claims a human should check first. |
| Claims register entries marked "Cited" | AI GENERATED, at the SOURCE ATTACHED stage | Sources linked through the dataset. Not human verified. |
| Changes to existing pages and documents | AI GENERATED + UNVERIFIED | Pending human review. |
| Record of AI mistakes | AI GENERATED + UNVERIFIED | Reported by the AI about its own work and its sub-agents' work. No human has checked that it is complete. |
| Cost of the session | Not directly measured | The session did not report a monetary cost. Token counts reported by the workflow tool are given in the record. |

**Nothing produced in Experiment 002 is HUMAN CHECKED or HUMAN VERIFIED yet.** The branch has not been merged or deployed.

## 11. Changing this policy

Propose changes in an issue or a pull request. Changes to the labels or the principles are a HUMAN DECISION, and should be recorded as one in the pull request. Earlier versions remain in git history.
