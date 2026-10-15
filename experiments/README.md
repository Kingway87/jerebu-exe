# Experiments

JEREBU.EXE moves forward as numbered, public experiments. This folder holds the full written record of each one.

The website's `/experiments` page shows a shorter version of the same log. Its data comes from [`src/content/experiments.ts`](../src/content/experiments.ts). The two must say the same thing. If they disagree, treat it as a bug and open an issue.

## What an experiment is

An experiment is a bounded piece of work that asks one question, and writes down honestly how the attempt to answer it went. Each record says:

- what question was asked;
- what existed before the work started;
- what humans provided and decided;
- what AI agents or tools did;
- what data was used, and how it was accessed;
- what was produced;
- what was checked, and what was not;
- what went wrong, including mistakes the AI made or caught in its own work;
- what humans corrected;
- what still needs human review;
- what it cost, where that is reliably known.

The experiments are how the project tests its broader question, from the founder's brief: *"Can one person working with AI agents and open public data build useful civic infrastructure around a decades-old environmental problem?"*

**An experiment record is not a finding about haze.** The records describe how the project itself is being built. Experiment 002 also produced research about haze — a sourced haze history — but its record describes how that research was done; the research itself is in [`docs/research/HAZE_HISTORY.md`](../docs/research/HAZE_HISTORY.md) and [`data/haze-events.json`](../data/haze-events.json), and is not yet human verified.

## Rules for records

1. **One file per experiment,** named `NNN-short-name.md`, for example `001-autonomous-bootstrap.md`. IDs have three digits and are never reused.
2. **Statuses.** These mean the same here as on the website:

   | Status | Meaning |
   | --- | --- |
   | Planned | Proposed, not started. Nothing has been produced. |
   | In progress | Work has started, or has finished and is waiting for human review. |
   | Complete | Finished and reviewed by a human, with the outcome recorded. |

   An experiment is not Complete until a human has reviewed it.
3. **Planned experiments state their question only.** They must never describe results, findings or progress that do not exist.
4. **Label AI involvement** with the labels in [`docs/AI_TRANSPARENCY.md`](../docs/AI_TRANSPARENCY.md): HUMAN DECISION, AI ASSISTED, AI GENERATED, HUMAN VERIFIED, UNVERIFIED. Research content also carries a review stage (AI GENERATED, SOURCE ATTACHED, HUMAN CHECKED, HUMAN VERIFIED; see the same document). A record drafted by an AI agent is that agent's own account until a human has reviewed it.
5. **Record mistakes; do not erase them.** Mistakes found during an experiment go in its record. Corrections to content that has already been published go in [`docs/CORRECTIONS.md`](../docs/CORRECTIONS.md).
6. **Never estimate cost without a basis.** If reliable figures are not available, write "To be recorded after session", "Not available" or "Not directly measured".
7. **Follow the evidence rules** in [`docs/METHODOLOGY.md`](../docs/METHODOLOGY.md). A record must not invent statistics, events, laws, cases, citations or URLs. If something is unknown, say it is unknown.
8. **Keep the log in sync.** When a record changes status, update [`src/content/experiments.ts`](../src/content/experiments.ts) and the index below in the same pull request.

To propose a new experiment, or to challenge an existing one, see [Proposing an experiment](../CONTRIBUTING.md#proposing-an-experiment) in the contributing guide. Choosing which experiment runs next is a HUMAN DECISION.

## Index

| ID | Name | Status | Record |
| --- | --- | --- | --- |
| 001 | AUTONOMOUS PROJECT BOOTSTRAP | In progress — AI build complete; merged into `main` through pull request #1; no human review recorded | [001-autonomous-bootstrap.md](001-autonomous-bootstrap.md) |
| 002 | HAZE HISTORY | In progress — AI research, build, AI review and fixes complete; human review pending; pull request #3 | [002-haze-history.md](002-haze-history.md) |
| 003 | LIVE EVIDENCE | In progress — AI build complete; evidence reviewed by the maintainer on 15 October 2026; pull request #2 | [003-live-evidence.md](003-live-evidence.md) |
| 004 | LEGAL LANDSCAPE | Planned | No record yet |
| 005 | EVIDENCE AGENT | Planned | No record yet |
| 006 | COMMUNITY ACTION | Planned | No record yet |
| 007 | AUTOMATED PUBLIC MONITORING | Planned | No record yet |

Experiments 001, 002 and 003 are not deployed. Human review is required before production deployment. Experiment 003 was defined by a later brief from the founder, which replaced the earlier planned question for 003 ("Satellite evidence") with the question in its record.

### Experiment 002 question

The founder's Experiment 002 brief set the question (HUMAN DECISION). It replaces the question drafted by AI during Experiment 001 ("Can a sourced, checkable timeline of past haze episodes affecting Malaysia and Singapore be assembled from public records?"):

> Can an AI research agent reconstruct a source-verifiable history of major transboundary haze events affecting Malaysia and Singapore without fabricating facts, overstating evidence, or making unsupported attribution claims?

### Planned questions

None of these experiments had started when this list was written, and it describes no results. The names of 004 to 006 come from the founder's brief for Experiment 001, which also named 002 and 003; both have since started, 003 under a new name and question (see the index). Experiment 007 comes from the brief's list of future architecture. The questions below were drafted by AI during Experiment 001 and are awaiting human review. Their order, scope and wording may change.

- **004 Legal landscape.** Which laws, agreements and policies are relevant to transboundary haze in Malaysia and Singapore, according to primary sources?
- **005 Evidence agent.** Can an AI research agent find and cite public evidence reliably enough to assist — not replace — human reviewers?
- **006 Community action.** Which legitimate, lawful forms of civic participation can the project support without collecting sensitive personal data?
- **007 Automated public monitoring.** Can recurring public data be monitored automatically, with human review before anything is published?

## Adding a record

1. Copy the template below into a new file, `NNN-short-name.md`.
2. Add or update the matching entry in [`src/content/experiments.ts`](../src/content/experiments.ts).
3. Update the index table above.
4. Open a pull request. Fill in the AI involvement section of the [pull request template](../.github/pull_request_template.md).

Fill in every field. If a field does not apply, say why. If something is not known, write "Not known" rather than leaving it out.

## Template

````markdown
# Experiment NNN — NAME

> **Record status:** <AI GENERATED | AI ASSISTED | written by a human> + <UNVERIFIED | HUMAN VERIFIED by NAME on YYYY-MM-DD>
> See docs/AI_TRANSPARENCY.md for what these labels mean.

| Field | Value |
| --- | --- |
| **ID** | NNN |
| **Name** | NAME IN CAPITALS |
| **Status** | Planned / In progress / Complete, plus a plain description of the actual state |
| **Dates** | YYYY-MM-DD to YYYY-MM-DD, or "ongoing" |
| **Branch and pull request** | <branch name, pull request link> |

## Question

<!-- The one question this experiment asks. Phrase it so the answer could turn out to be "no". -->

## Starting state

<!-- What existed before the work began: commits, files, data, tools, environment. Be exact. -->

## Human input

<!-- What humans provided or decided, before and during the experiment. Label these HUMAN DECISION. -->

## AI involvement (agent/tool)

<!-- Which AI agents or tools were used, how many, what each was asked to do, and what access they had (for example: could they open web pages?). Do not claim an AI conceived something a human decided. -->

## Task

<!-- The instructions or brief that were given, including anything the AI was told not to do. -->

## Method

<!-- What was actually done, in order. Include changes of plan and why they happened. -->

## Data used

<!-- Which sources or data were used, how they were accessed, and when. Write "None" if no data was used. -->

## Outputs

<!-- Files, features, data or documents produced. Link to them. Say what was deliberately not produced. -->

## Checks performed

<!-- Each check, the command or method, and its result. List checks that were NOT run, and why. -->

## What AI got wrong / self-corrections

<!-- Mistakes the AI made, including ones it caught itself, and how each was fixed. Note that mistakes nobody noticed cannot be listed. -->

## Human corrections

<!-- What humans changed after review, and why. Write "None yet" if review has not happened. -->

## Limitations

<!-- What this experiment cannot show, and the known weaknesses of its method and outputs. -->

## Open questions

<!-- What remains uncertain or unresolved. -->

## Requires human review

<!-- A concrete checklist of what a human must check before the outputs are relied on, merged or deployed. -->

- [ ] ...

## Cost

<!-- Agent usage and money spent, only if reliable figures exist, with where they came from. Otherwise: "To be recorded after session", "Not available" or "Not directly measured". Never estimate without a basis. -->

## Next experiment

<!-- What this experiment suggests should come next, and why. Choosing the next experiment is a HUMAN DECISION. -->
````

---

<sub>AI involvement: this document is AI GENERATED + UNVERIFIED. It was written by Claude Code during Experiment 001 and updated during Experiments 002 and 003. Pull request #1 merged the Experiment 001 version into `main`; no human review of it has been recorded. The Experiment 002 and 003 changes have not yet been reviewed by a human.</sub>
