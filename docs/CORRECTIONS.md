# Corrections

> **Status: V0 draft, awaiting human review.**
> Written by an AI agent (Claude Code) on 2026-10-14, during [Experiment 001](../experiments/001-autonomous-bootstrap.md). AI involvement: **AI GENERATED + UNVERIFIED** (see [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md)).

JEREBU.EXE records its mistakes with their corrections. It does not quietly erase them. This document is the public log of corrections to published content.

## Purpose

- Readers can see what was wrong, what changed, and when.
- Anyone who relied on an earlier version can find out that it changed.
- Over time, the log shows what kinds of mistakes the project makes, including mistakes in AI-generated work. Recording them is part of the experiment.

## What counts as published

Content is **published** once it is on the `main` branch of the public repository, or on a deployed version of the website.

Changes made to drafts during pull request review are part of normal review. They are recorded in the pull request and, for experiments, in the experiment's record in `experiments/`. They are not listed here.

## What counts as a correction

Log a correction when a change to published content fixes any of these:

- a factual error;
- a wrong, broken, misattributed or invented citation or source;
- a misquotation, especially of a legal text;
- a mislabelled statement, for example an allegation presented as a fact, or an analysis presented as an observation (see the claim labels in [METHODOLOGY.md](METHODOLOGY.md));
- a wrong verification status in the claims register ([`src/content/claims.ts`](../src/content/claims.ts));
- an inaccurate description of a data source or method, or of what a source shows;
- an inaccurate account of AI involvement, or of what humans decided;
- wording or framing that misrepresents who is responsible for something, or presents a country or its people as the cause of haze or as an adversary;
- a statement that wrongly connects an organisation, person or government with an event.

These are **not** corrections, and are recorded in git history only:

- fixing a typo that does not change the meaning;
- layout, styling and design changes;
- rewording that does not change the meaning;
- adding new content;
- routine updates, such as an experiment's status moving on.

If you are not sure whether a change is a correction, log it.

## How to report an error

- **Most errors:** open an issue on [GitHub](https://github.com/Kingway87/jerebu-exe/issues). Say where the error is and what is wrong. If you can, link to a source that shows it.
- **Privately,** if public discussion could cause harm, for example where an identifiable person or organisation is wrongly implicated: email [JEREBU.EXE@proton.me](mailto:JEREBU.EXE@proton.me). Please do not send personal health information or confidential documents.

## How corrections are made

1. The correction is made in a pull request, and a human reviews it before it is merged.
2. The log entry is added in the same pull request.
3. If a claim in the claims register is affected, its status is updated in the same pull request.
4. **Serious errors come first.** A statement that wrongly implicates an organisation, person or government is removed promptly, before the full correction is written up if necessary. The log entry describes the error without repeating the harmful claim.
5. Git history keeps the earlier version. The log entry links to the commit or pull request instead of copying the error.

## Entry format

Entries go in the log below, newest first.

```markdown
### YYYY-MM-DD: <short title>

- **Where:** <page, file or claim>
- **What was wrong:** <the error, described plainly, without repeating a harmful claim>
- **What changed:** <the correction>
- **First published:** <date or commit where the error first appeared, if known>
- **Origin of the error:** <human / AI generated / AI assisted / unknown>
- **Who noticed:** <a human (name or handle, with their permission, or "a reader") or an AI (which tool or agent)>
- **Corrected and reviewed by:** <names or handles; human or AI>
- **Link:** <commit or pull request>
```

## Log

**No corrections to published content have been recorded yet.**

When this log was created, on 2026-10-14, nothing had been published. The V0 website has not been deployed, and the Experiment 001 work had not been merged into `main`. It is awaiting human review through a pull request.

During the build, the AI agent caught and fixed mistakes in its own work, such as an unsupported prediction in a homepage draft and overclaims in the source-search results. Those happened before anything was published, so they are not listed here. They are recorded in [`experiments/001-autonomous-bootstrap.md`](../experiments/001-autonomous-bootstrap.md).
