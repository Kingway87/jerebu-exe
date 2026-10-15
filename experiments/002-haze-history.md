# Experiment 002 — HAZE HISTORY

> **Record status:** AI GENERATED + UNVERIFIED. Written by Claude Code, the AI agent that ran the experiment, on 2026-10-15. It is the agent's own account of its work, including its mistakes. No human has reviewed it.
> **Research status:** the haze history it produced is **AI GENERATED + SOURCE ATTACHED**. It is not HUMAN CHECKED or HUMAN VERIFIED.
> See [docs/AI_TRANSPARENCY.md](../docs/AI_TRANSPARENCY.md) for what these labels mean.
> **Update, 2026-10-15:** at the founder's request, the agent pushed the branch to GitHub after the work was complete. This record was then updated to say so; nothing else in it was changed.
> **Update 2, 2026-10-15:** at the founder's request, the agent opened pull request #3 for this branch, then merged Experiment 003 into the branch and resolved the conflicts between the two experiments (see [Integration with Experiment 003](#integration-with-experiment-003)). The haze history, its labels and its review status did not change. This record was updated to say so in the status rows, that section and the last review item.

| Field | Value |
| --- | --- |
| **ID** | 002 |
| **Name** | HAZE HISTORY |
| **Status** | In progress: AI research, build, AI review and fixes complete; human review pending. Committed on the branch below and pushed to GitHub at the founder's request; pull request #3 is open. Experiment 003 has been merged into the branch. Not merged into `main`. Not deployed. |
| **Dates** | 2026-10-15 (one working session) |
| **Branch and pull request** | Branch `experiment/002-haze-history`, pushed to the project's GitHub repository (`origin`) on 2026-10-15 at the founder's request. [Pull request #3](https://github.com/Kingway87/jerebu-exe/pull/3), against `main`, opened by the agent at the founder's request on 2026-10-15. |

## Question

From the founder's brief (HUMAN DECISION):

> Can an AI research agent reconstruct a source-verifiable history of major transboundary haze events affecting Malaysia and Singapore without fabricating facts, overstating evidence, or making unsupported attribution claims?

Study period 1997–2026. Primary jurisdictions Malaysia and Singapore; Indonesia and the wider region as context.

This replaces the question that an AI drafted for Experiment 002 during Experiment 001 ("Can a sourced, checkable timeline of past haze episodes affecting Malaysia and Singapore be assembled from public records?"). The new wording is the founder's.

## Environment

| | |
| --- | --- |
| **Environment** | Claude Code, running locally on the founder's computer (macOS), in the repository's working copy. |
| **Model** | Claude Opus 5.5 (model id `claude-opus-5-5[1m]`) for the orchestrating agent, as reported by the session. The sub-agents ran in Claude Code's workflow tool without a model override; the tool's run records list the same model id for each of the 184 sub-agents in the four completed workflow runs. |
| **Tools** | Shell (curl for downloads, Python 3.9 with BeautifulSoup and PyMuPDF for text extraction, Node.js 24), Claude Code's web search and page-reading tools, and its workflow tool for running sub-agents. For checks: Ajv 8.17.1 (JSON Schema), Playwright 1.64.1 with axe-core 4.10.3 (accessibility and layout), installed in a scratch directory, not in the project. |
| **Network** | Outbound web access worked for most sites. Some sites refused automated downloads (see [Limitations](#limitations)). |

## Starting state

- `main` and the branch `experiment/002-haze-history` both at commit `5d12fad` ("Merge pull request #1 from Kingway87/claude/elegant-brown-k5c0dw"), which merged Experiment 001.
- A static Next.js 16 site with four routes (`/`, `/evidence`, `/experiments`, `/about`), the evidence methodology, the AI transparency policy, a roadmap and the Experiment 001 record. No environmental data. The site's claims register listed eight framing claims, all unverified.
- No `/timeline` route, no `data/` directory and no `docs/research/` directory.

## Human input

All HUMAN DECISION:

- The Experiment 002 brief: the research question, the study period, the jurisdictions, the core rule ("no source → no claim"), the source hierarchy, the attribution distinctions (hotspot ≠ land ownership ≠ fire starter ≠ legal responsibility; correlation ≠ causation), the health distinctions, the requested dataset shape, the timeline's order of exploration, the review stages (AI GENERATED, SOURCE ATTACHED, HUMAN CHECKED, HUMAN VERIFIED), the list of things not to do, the quality-control checklist and the completion report.
- The list of years to look at first (1997, 2005, 2013, 2015, 2019, 2023, 2026), given in the brief as leads only, "NOT an instruction that every listed year must appear".
- Starting the session on the branch and reviewing the result.
- After the work was complete, instructing the agent to push the branch to GitHub (`git push -u origin experiment/002-haze-history`) and to record the push in this record.

No human took part in the research during the session.

## AI responsibility

From the brief: research, dataset construction, implementation and initial validation. Claude Code (the orchestrating agent) planned the work, wrote the tools, wrote the selection criteria and confidence method, decided which episodes to include, ran the sub-agents, assembled and checked the dataset, built the page and wrote the documents. Sub-agents searched, read sources, drafted entries and checked each other's work. The agent did not merge, deploy or contact anyone. Its only external action came after the work was complete: at the founder's request, it pushed the branch to the project's GitHub repository. It did not open a pull request.

## Process

1. **Read the rules.** The brief, `AGENTS.md`, `docs/METHODOLOGY.md`, `docs/AI_TRANSPARENCY.md` and the other Experiment 001 documents, and the Next.js 16 documentation bundled with the project, before writing code.
2. **Built the structure before the data.** Types and build-time validation for the dataset (`src/content/haze-history.ts`), a JSON Schema, the `/timeline` page and its components, and the dataset README. While there was no research yet, the build used a temporary one-entry file, which was never committed.
3. **Wrote research tools** in a scratch directory outside the repository: download-and-extract, a quote checker that confirms a passage appears in a source's downloaded text, a read-only Internet Archive lookup, a draft linter, a deterministic assembler and a dataset re-checker. Downloads were treated as untrusted data: never executed, parsed as text only, with Python run in isolated mode.
4. **Pre-registered the criteria.** Wrote the event-selection criteria and the confidence method to a file at 2026-10-15 01:48:37 +08:00, before reading any research result (SHA-256 `26e6fedea282c6f0933895e19c43af20c2856a6c6c5767594a14c5a709777fe5`). Both are reproduced verbatim in the dataset (`meta.selectionCriteria` and `meta.confidenceMethod`) and quoted in [`docs/research/HAZE_HISTORY.md`](../docs/research/HAZE_HISTORY.md#event-selection-criteria).
5. **Discovery workflow** (10 sub-agents). Nine searched in different ways (peer-reviewed literature; Singapore government sources; Malaysian government sources; regional and scientific agencies; news 1997–2006, 2007–2016 and 2017–2026; legal and policy milestones; health evidence). A tenth, a completeness critic, searched for what they had missed, re-checked 1,165 quoted passages by script (all matched) and re-read 24 high-risk items against their sources. About 830 source documents were downloaded.
6. **Selection.** The agent applied the criteria year by year to the discovery evidence and chose 14 episodes to research in depth; the rest of the period was covered by an "excluded periods" item. The research later confirmed that all 14 meet the criteria, three of them (2016, 2018, 2025) on unhealthy readings alone.
7. **Deep research workflow** (60 sub-agents: 20 items × 3 stages). For each episode, each of five groups of milestones, and the list of excluded periods, one sub-agent researched and wrote a draft; a second, told to assume the draft was wrong, re-checked every passage in its source and fixed or removed what the source did not support; a third reviewed the result for attribution, framing, health, measurement and selection-criteria problems. The fidelity checkers re-read 873 claims and fixed or flagged 514 problems (4 critical, 97 major, 413 minor). The safety reviewers re-read 891 claims and fixed or flagged 406 problems (52 major, 354 minor). Every draft had to pass a linter that re-ran every quote check before it could move on.
8. **Assembly.** A script (no model) merged the checked drafts into `data/haze-events.json`. After the fidelity and safety checks, the agent set, for each episode, whether the origin of the smoke was disputed, and wrote the note explaining it. It also made two small edits to checked drafts: in the 2010 entry it moved a disagreement found within a single source to the unresolved questions, and in the 2018 entry it shortened the period label to "Mid-August 2018", moving the rest of the label, unchanged, into the period note. Responsibility for the fires is "not established" for every episode, and the build rejects any other value.
9. **Resolution of metadata conflicts.** Where drafts described the same source differently (titles, publishers, dates), the agent checked the source's own text or metadata and recorded the chosen values in an overrides file applied by the assembler (34 sources).
10. **Integration.** Types and build-time checks for two new fields (`selection`, `attribution`) and an `ongoing` flag; the timeline split into an overview, a page per episode and milestone pages after a test build showed that a single page would carry several megabytes of HTML (a milestones section of 2.3 MB and episode sections of up to 0.9 MB); three framing claims in the claims register linked to dataset claims and marked "Cited"; documents across the repository updated.
11. **Final review** (94 sub-agents). Fifteen AI reviewers, each with one remit (framing and claim safety, by section of the dataset; a re-check in context of 120 high-risk claims chosen by script; the 136 numbers not found verbatim; consistency across entries; the site; the code; the documents; compliance with the brief), reported 237 findings. A separate verifier sub-agent checked each of the 79 critical or major findings and upheld all of them.
12. **Fixes** (20 sub-agents, one per research draft). Each applied the upheld findings for its draft under shared rules written by the orchestrating agent: reader-facing section names in notes, no workflow language, consistent names for agencies, routine health advice not counted for criterion B2, health estimates worded as estimates, agencies' characterisations labelled analysis, disagreements found within a single source moved to the unresolved questions, and the confidence definitions applied literally. Each re-checked every changed passage against its source by script and re-ran the linter. The orchestrating agent fixed the site, the documents and the origin notes itself. It stopped the fix workflow once, about 30 seconds after starting it, to add four late findings, and restarted it.
13. **Reassembly and final checks.** The orchestrating agent made a few edits of its own after the fix stage: it corrected two period notes that pointed to the wrong section (2013 and 2014), rewrote the origin notes for 2005, 2016, 2019, 2023 and 2025 where the fixed drafts showed they were inexact, merged two byte-identical copies of a DOE document into one source, marked three English passages inside a Malay and an Indonesian source as English, and moved NEA's forecast of 14 October 2026 from the 2026 entry's aftermath to Singapore's air quality, since the episode was still under way. It then reassembled the dataset and re-ran every check (see [Checks performed](#checks-performed)).

## Outputs

- **Dataset:** [`data/haze-events.json`](../data/haze-events.json): 14 episodes, 82 milestones (20 regional, 16 Singapore, 18 Malaysia, 16 Indonesia, 12 measurement changes), 15 periods considered but not included, 920 claims and 535 sources. Labels: 424 fact, 250 analysis, 191 observation, 48 allegation, 4 legal finding, 3 hypothesis. All 14 episodes are rated medium confidence; the origin of the smoke is marked disputed for 2010, 2019, 2023 and 2026. Plus [`data/haze-events.schema.json`](../data/haze-events.schema.json) and [`data/README.md`](../data/README.md).
- **Website:** `/timeline` (overview: years at a glance, the episodes, what changed, periods not included, method), `/timeline/<year>` for each episode, `/timeline/milestones` and one page per milestone group, and `/timeline/not-included` with the sourced statements about the periods left out. All are generated from the dataset at build time, and the build fails if the dataset breaks its rules. "Timeline" added to the site navigation. Code: `src/app/timeline/`, `src/components/timeline/`, `src/content/haze-history.ts`.
- **Research notes:** [`docs/research/HAZE_HISTORY.md`](../docs/research/HAZE_HISTORY.md).
- **AI review log:** [`002-review-log.md`](002-review-log.md), every final-review finding and its outcome, generated from the workflow output.
- **This record**, the entry in `src/content/experiments.ts`, and updates to the README, contributing guide, roadmap, methodology, AI transparency policy, data sources document, experiments index, the status rows of the Experiment 001 record, the evidence, about and home pages, the footer, the claims register and the candidate-source notes.
- **Deliberately not produced:** no attribution of any fire or haze to a company, person or government; no ranking or list of companies; no live data; no personal or health data about individuals; no deployment, social media post, email or contact with anyone. The only external action was pushing this branch to the project's GitHub repository, at the founder's request, after the work was complete.

## Sources

535 sources are cited: 261 news reports, 156 government sources (agencies, ministries, statistics offices, parliaments and archived government documents), 36 intergovernmental (ASEAN, ASMC, WHO, World Bank), 34 peer-reviewed articles, 22 scientific-agency sources (NASA, ESA, NOAA, Copernicus), 20 legal texts and 6 reference works. 450 are in English, 48 in Indonesian and 37 in Malay; the Malay and Indonesian passages were translated by AI agents and each such claim says so. Every cited source was downloaded and its text extracted (418 at the cited address; 67 from another copy recorded in `readFrom`, such as a repository, abstract or syndicated copy; and 50 from existing Internet Archive copies), so every quoted passage could be checked by script against the text actually read. In all, 1,540 addresses were fetched during the session; about 1,000 of them (including failed downloads and duplicates) are not cited.

## Checks performed

| Check | Method | Result |
| --- | --- | --- |
| Quotes | Every passage marked "verbatim" re-matched against the downloaded text of its source (`check_dataset.py`), after the fixes | 2,613 of 2,613 matched; none failed; none unchecked |
| Numbers | Every number in a claim's text looked for in its quoted passages | Before the fixes, 136 were not found verbatim. Two AI reviewers in the final review checked all 136 against the quotes and the downloaded sources, recomputing every figure the agents had worked out from NEA's data: 134 were correct (dates from datelines or weekdays, numbers written differently, computed values reproduced). In 2 claims a date rested on a dateline or hidden page metadata rather than the quoted passage; both were fixed. After the fixes, 142 were flagged; the orchestrating agent checked the 36 in new or reworded claims against their passages, and all are dates from datelines or publication lines, or numbers written differently in the source (for example "13 705" or "919.516"). |
| Schema | JSON Schema draft 2020-12, Ajv 8.17.1 in strict mode | Valid |
| Build-time rules | `src/content/haze-history.ts` validates the dataset during `next build` | Pass |
| Lint, types, build | `npm run check`, after the last change to the site | Pass; 31 static pages |
| Accessibility, layout, links | Playwright 1.64.1 and axe-core 4.10.3 on all 27 routes at 320, 375, 768 and 1280 px, with all sections closed and then open; one h1; skip link; internal links and anchors (178); no requests to other origins | No problems found in the final run. Earlier runs found that `/experiments` overflowed at 320 px (status rows that could not wrap) and that the home page had two `aside` landmarks nested in other landmarks, which predated this experiment; both were fixed. |
| Final review | 94 AI sub-agents in 15 review groups examined the assembled dataset, the pages and the documents: framing and claim safety (4 groups, by section of the dataset), a re-check in context of 120 high-risk claims chosen by script (4), the 136 numbers (2), consistency across entries, the site, the code, the documents, and compliance with the brief. Each critical or major finding was then checked by a separate verifier sub-agent. | 237 findings: 7 critical, 72 major, 158 minor. The verifiers upheld all 79 critical and major findings. All 79 were applied, or recorded under [Requires human review](#requires-human-review) as decisions for a human. Most minor findings were applied; the rest were declined with reasons. Every finding and its outcome is listed in [`002-review-log.md`](002-review-log.md). |
| Fixes | One AI sub-agent per research draft (20) applied the findings for its draft, re-checked every new or changed passage against its source by script, and re-ran the draft linter; the orchestrating agent fixed the site, the documents and the origin notes, and assembled and checked the dataset again | All 20 drafts pass the linter. The sub-agents recorded what they applied and declined, with reasons, for each finding. Six episodes went from high to medium confidence; no inclusion or exclusion changed. |
| Source addresses | Every cited `url` and `archivedUrl` requested with curl, following redirects, at most two requests a second (`url_check.py`), on 15 October 2026, after the fixes | 492 of 535 original addresses responded. Of the other 43, 30 have an Internet Archive copy linked or were read from one (mostly 2005–2013 news and agency pages that no longer exist); 8 are DOI links whose publishers refused the automated request (HTTP 403), read from repository or abstract copies recorded in `readFrom`; and 5 are pages on Antara's English news site, which refused every connection at the time of the check, including to its home page, although the pages had been downloaded earlier in the session. 105 of 109 archive links responded; 3 were rate-limited by the Internet Archive (HTTP 429) and 1 returned a server error (HTTP 500). |
| Secrets and personal data | Searched every changed and new file for keys, tokens, private keys and credentials, and the dataset for e-mail addresses | None found, in a final scan after the fixes. The only matches were ordinary words (such as "secretariat" and "State secret") and existing documentation about how keys must be handled. |

Not run: no check by a human; no comparison of archive copies with the text the agents read; no legal, scientific, medical or translation review.

## What AI got wrong / self-corrections

Mistakes nobody noticed cannot be listed. These were noticed.

**The orchestrating agent (the one writing this record)**

- Guessed a journal article identifier (a PubMed Central id) from memory for a haze-health study; it belonged to an unrelated paper. Caught before use; the rule against guessing identifiers was then written into every sub-agent's instructions.
- Wrote "first" into its own assignment for Singapore's September 2015 enforcement notices ("first enforcement steps under the THPA"). No source says so; a fidelity checker marked it critical and removed it.
- Treated a discovery summary's conclusion that PM2.5 joined Malaysia's API in 2017 as settled; the measurement research found a government plan giving 16 August 2018, and both are now recorded as a disagreement.
- Built the first version of a script that sorts discovery evidence into research packs with mistakes (school-closure thresholds filed as measurement changes, episode diplomacy filed as ASEAN milestones). Corrected before the research began.
- Treated research drafts as finished when their files appeared, though the last checker was still working on them, and edited one of them (2010) early. Noticed when the workflow log showed the checkers still running; every affected decision was re-checked against the final files.
- Planned a single `/timeline` page; a test build showed episode sections of up to 0.9 MB and a milestones section of 2.3 MB of HTML, so the timeline was split into separate pages.
- Used a Next.js setting (`dynamicParams`) that this project's configuration (Cache Components) does not allow; the build failed and the setting was removed.
- Wrote a JSON Schema that Ajv's strict mode rejected (`minItems` without `type`); fixed.
- Used a grey text colour (`text-subtle`) that fails contrast on the light grey background in the first version of the timeline page; replaced.
- A file watcher it wrote silently failed for 30 minutes because of a shell globbing rule; replaced.
- Wrote origin notes that credited agencies with more than they said: for several episodes the notes said the Department of Environment or NASA had named where the smoke came from, when the passage quoted said only "transboundary", or less. The final review rated three of them critical (2010, 2013, 2014); all the notes were rewritten.
- Generated the description used in search results and link previews for every episode page from a template that said "affecting Malaysia and Singapore", which is wrong for 2005, 2018 and 2025, where Singapore is not listed as affected. Replaced with a description built from each episode's own title.
- Gave the selection criteria short names that said more than the criteria: "Crossed borders" for criterion A, which only requires that a source describes the haze as transboundary, and "Emergency measures" for B2, which is also met by school closures or official advice. Renamed "Described as transboundary" and "Extraordinary public measures".
- Rewrote the evidence page's rule for data panels so that it no longer required human review, which let its own unreviewed timeline satisfy the rule. The rule is a safeguard from Experiment 001, and whether to show the timeline before human verification is an open human decision. The final review flagged it; the rule was restored and the timeline is now marked as the one exception, pending that decision.
- Summarised the confidence definitions on the page without their conditions about conflicts, and applied the definitions inconsistently across episodes (see [Process](#process)).
- In the research notes, stated as fact that a reported Singapore reading of 334 in September 2015 was a 3-hour value, an inference that the dataset itself had already corrected to "unverified".
- Counted a claim's quoted passages as its sources in the page's "show sources" control, so a claim resting on one document could read "4 sources".
- Recorded in this document that the sub-agents used the same model as the orchestrating agent, inferring it from the absence of a model override; the final review flagged the unstated basis. The workflow tool's run records, checked afterwards, list the model of every sub-agent, and the record now cites them.
- Layout faults on `/experiments` at phone widths: the new status rows for Experiment 002 could not wrap, squeezing a label to one letter per line at 375 px and running past the screen at 320 px, and long file paths in the entry also overflowed at 320 px. The rows now wrap, and the paths were removed from the public text.

**Sub-agents, as found by other sub-agents**

- The discovery critic found eight claim-level errors in the discovery sweeps, including a wrong statement that ASMC's alert records start in 2022 (they start in 2015), "nine corporate suspects" for what the source calls nine people, a 2015 school closure dated a day early, an outdated 2026 figure, and an index value presented as a concentration.
- The fidelity checkers found 514 problems in the first drafts, 4 of them critical: the "first" above; a speaker misattributed (a newspaper's own sentence presented as the Department of Environment's); a wrong date for a Singapore release in 2002; and a wrong time for when part of Singapore entered the unhealthy band in 2023. Examples of major problems: a closure stated as done when only announced; selection-criteria tags that the passage did not support; a syndicated report credited to the wrong agency.
- The safety reviewers found 406 problems, none critical and 52 major, mostly wording that overstated a source, mislabelled allegations, or statements that needed attribution.
- One safety reviewer gave a report a full title that could not be found in the downloaded file; the orchestrating agent replaced it with a bracketed description.
- The final review found 237 problems (7 critical, 72 major, 158 minor) in the assembled dataset, pages and documents (see [Checks performed](#checks-performed)). Among those in the research itself: B2 counted for routine health advice in some entries but not others; single-source "contradictions"; workflow language ("an earlier sweep", "see the research log") in public notes; an exclusion reason that relied on unopened search results; characterisations by agencies labelled observation instead of analysis; and descriptions of legal provisions without a note that they need legal review.

## Human corrections

None yet. No human has reviewed this experiment.

## Limitations

The research limitations are set out in [HAZE_HISTORY.md](../docs/research/HAZE_HISTORY.md#limitations). In addition, for the experiment itself:

- **The AI checked itself.** Every check was run by AI agents or by scripts the AI wrote. Separate sub-agents and scripts reduce the risk of error, but they are not independent of the model that ran them.
- **Access shaped the result.** The session's web-search tool reached a usage limit part-way through the deep research; several government, court and legislation sites refused automated downloads; and the Internet Archive rate-limited the session (HTTP 429), so archive links exist for only 109 of 535 sources.
- **The session was interrupted once** when the account's usage limit was reached; research sub-agents stopped and resumed. No work is known to have been lost, but the workflow log shows that some stages restarted. The fix workflow was also stopped once by the orchestrating agent, about 30 seconds after it started, to add four late findings, and then restarted from the beginning.
- **Links to GitHub return "not found" until the branch is merged.** Links from `/timeline` and `/experiments` to the dataset, the research notes and this record point to `main` on GitHub.
- **The pages are heavy.** Each page carries every quoted passage in its HTML, even inside closed sections: the episode pages are 0.45–0.99 MB (57–115 KB compressed), the milestone group pages 0.48–0.68 MB, the page of periods not included 0.77 MB, and the `/timeline` overview 0.36 MB, against 0.1–0.3 MB for the other pages of the site. Moving the passages of the periods not included to their own page cut the overview from 0.98 MB.
- **This record is the AI's account** of its own work, written at the end of a long session.

## Open questions

- The research questions a specialist should answer are listed in [HAZE_HISTORY.md](../docs/research/HAZE_HISTORY.md#unresolved-questions).
- **Did the experiment answer its question?** On the evidence of its own checks, the agents produced a history in which every claim carries a matched source passage, and the checks found and removed overstatements and unsupported attributions before assembly. But the checkers were AI; the 920 problems they found in the first drafts, and the 237 the final review found in the assembled work, show how many errors the AI's work contained before checking; and only a human check of the [priority claims](../docs/research/HAZE_HISTORY.md#priority-claims-for-human-verification) can show how many remain. The honest answer is "partly, pending human verification".

## Integration with Experiment 003

On 2026-10-15, at the founder's request, the agent merged Experiment 003 (live evidence) into this branch, so that pull request #3 holds both experiments. The founder's sequence was to merge Experiment 003's pull request (#2) into `main` first and then update this branch from `main`. The agent's tool permissions refused the merge of pull request #2, so the agent merged that pull request's head commit, `10a6428`, into this branch directly. Unless something else reaches `main` first, merging pull request #2 will add nothing to `main` that this branch lacks. The Experiment 003 branch and record were not changed.

Both experiments started from `5d12fad`, and 14 files that both had changed conflicted. How they were resolved:

- **Both experiments' content was kept.** Where a statement by one had become untrue after the other, it was reworded to cover both: for example "no live data is shown on this site" (this experiment) and "the only environmental data on this site is on the live evidence page" (Experiment 003).
- **Experiment 003's human review covers only its own evidence.** Its "Human reviewed · Open for contribution" notice is the maintainer's wording and was not changed. On `/evidence`, in the README and in `CONTRIBUTING.md` it is now followed by a statement that it does not cover this experiment's additions, and the `/evidence` page status says the same. The notice component gained an optional `notCovered` statement for this. Nothing from this experiment is marked as human reviewed or human verified.
- **The claims register holds both kinds of support.** Experiment 003's citations and this experiment's `evidence` (claims in the dataset) are both kept. Human verification uses Experiment 003's `humanVerification` record. This experiment's `verifiedBy` field, which no entry used, was removed, and its build-time checks (a named human, a real date, known dataset claims) now apply to `humanVerification`. Experiment 003's test that every cited claim has a citation now also accepts dataset evidence. The three claims sourced here are still Cited, not human verified.
- **Navigation** lists both new pages: Timeline, then Live.

Checks on the merged code: `npm run lint`, `npm run typecheck`, `npm test` (95 of 95, Experiment 003's tests, now run against both experiments' content) and `npm run build` all passed. Every route was prerendered; `/live` revalidates every 10 minutes.

## Requires human review

- [ ] Check the ten [priority claims](../docs/research/HAZE_HISTORY.md#priority-claims-for-human-verification) against their sources, then spot-check other entries, and record the review in each entry's `review` field.
- [ ] Decide whether the timeline may be published before every entry is human verified (the roadmap said a human must verify each entry first; this experiment's brief sets the end state as AI GENERATED / SOURCE ATTACHED).
- [ ] Approve, change or reject the selection criteria and the confidence method, both written by the AI. Consider whether criterion B1 is too permissive (2016, 2018 and 2025 qualify on it alone).
- [ ] Decide how to apply the confidence definitions, which overlap: in the fix stage the AI rated every episode medium if any medium condition held (see [HAZE_HISTORY.md](../docs/research/HAZE_HISTORY.md#confidence)). Choose one rule and re-rate all 14 episodes.
- [ ] Rule on three readings of the criteria that the AI made: NEA's routine, forecast-linked health advisory does not count for B2; criteria A and B must be met in the same country (this decides whether February–March 2014 is excluded); and undated yearly maxima do not count for B1 (see [How the criteria performed](../docs/research/HAZE_HISTORY.md#how-the-criteria-performed)).
- [ ] Review the attribution statuses (four episodes marked "disputed": 2010, 2019, 2023 and 2026) and the rule that responsibility is always "not established".
- [ ] Review the parties withheld from enforcement and court milestones, and the officials described by role only; decide whether any should ever be named (METHODOLOGY section 8).
- [ ] Check the AI translations of Malay and Indonesian passages.
- [ ] Check the legal milestones against official texts (several were read from unofficial mirrors, including six Indonesian instruments from Pasal.id), and the measurement milestones with someone who knows the PSI and API. Claims that describe a provision of a law are marked in their notes as needing legal review.
- [ ] Review the use of quoted passages (copyright) and decide the dataset's licence.
- [ ] Decide what to do about the 2026 entry, which was ongoing and is not updated.
- [ ] Look over the findings that were declined or only partly fixed, listed with their reasons in the [AI review log](002-review-log.md).
- [ ] Decide whether the evidence page's data-panel rule should change, and whether the `/timeline` exception stands.
- [ ] Record whether Experiment 001 (pull request #1, merged into `main`) was reviewed by a human; the documents now say no review has been recorded.
- [ ] Decide whether the rule that every new factual statement on the site is added to the claims register (`AGENTS.md`, `CONTRIBUTING.md`, METHODOLOGY section 9) should cover the haze history's claims, which are tracked in the dataset instead.
- [ ] Review the code and the changes to existing pages and documents in pull request #3, including how the conflicts with Experiment 003 were resolved (see [Integration with Experiment 003](#integration-with-experiment-003)).

## Cost

**Not directly measured.** The session did not report a monetary cost, and none is estimated here. The workflow tool reported these sub-agent figures:

| Workflow | Sub-agents | Sub-agent tokens | Tool calls | Duration |
| --- | --- | --- | --- | --- |
| Discovery (9 sweeps and a critic) | 10 | 6,227,483 | 1,936 | about 2 hours |
| Deep research (20 items × 3 stages) | 60 | 27,186,242 | 6,113 | about 4.3 hours |
| Final review (15 review groups, then a verifier for each critical or major finding) | 94 | 17,291,231 | 4,371 | about 74 minutes |
| Fixes (one sub-agent per research draft) | 20 | 5,573,614 | 1,012 | about 37 minutes |
| Fixes, first run (stopped after about 30 seconds and restarted) | 12 started | 1,016,686 | 86 | about 30 seconds |
| **Total** | **184, plus 12 stopped** | **57,295,256** | **13,518** | **about 8.2 hours** |

The orchestrating agent's own token use was not reported in a form that can be quoted reliably.

## Next experiment

Choosing the next experiment is a HUMAN DECISION. The agent suggests, first, a human check of the priority claims, because it would measure how many errors survived the AI's own checks: the answer to this experiment's question. After that, the 82 milestones give Experiment 004 (legal landscape) a dated list of laws, agreements and court outcomes to read in full, and the hotspot statements quoted throughout the timeline are a reason to do Experiment 003 (satellite evidence) carefully.

## Status

**AI GENERATED / SOURCE ATTACHED.** Not HUMAN CHECKED. Not HUMAN VERIFIED. The agent must not, and did not, mark its own work as human checked or verified.

---

<sub>AI involvement: this document is AI GENERATED + UNVERIFIED. It was written by Claude Code during Experiment 002 and has not yet been reviewed by a human.</sub>
