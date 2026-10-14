# Experiment 001 — AUTONOMOUS PROJECT BOOTSTRAP

> **Record status: AI GENERATED + UNVERIFIED.**
> A Claude Code build agent drafted this record on 2026-10-14, during the experiment it describes, while other agents were still working. The orchestrating agent completed it after two review rounds and the final checks. This is the AI's own account of its own work. No human has reviewed it yet. See [`docs/AI_TRANSPARENCY.md`](../docs/AI_TRANSPARENCY.md) for what the labels mean.

| Field | Value |
| --- | --- |
| **ID** | 001 |
| **Name** | AUTONOMOUS PROJECT BOOTSTRAP |
| **Status** | **IN PROGRESS** — AI build phase complete; human review pending; not deployed |
| **Date** | 2026-10-14 |
| **AI** | Claude Code, an AI coding agent made by Anthropic, running as a cloud session (the brief calls this "Claude Code Cloud"). The model version is not recorded in this document. |
| **Data used** | No environmental data. Candidate sources were located from web search results only (see [section 6](#data-used)) |
| **Branch** | `claude/elegant-brown-k5c0dw` (see the note below) |
| **Pull request** | [Kingway87/jerebu-exe#1](https://github.com/Kingway87/jerebu-exe/pull/1), against `main`, for human review. Not merged |
| **Human review** | Required before production deployment. Not yet performed. |
| **Deployment** | None. Nothing has been deployed. |
| **Cost** | To be recorded after session |

**Note on the branch name.** The founder's brief suggested the branch name `experiment/001-bootstrap`. The cloud environment required the work to happen on `claude/elegant-brown-k5c0dw`, so that name was used. Neither the founder nor the AI chose it.

## Contents

1. [Question](#1-question)
2. [Starting state](#2-starting-state)
3. [Human input](#3-human-input)
4. [AI task](#4-ai-task)
5. [Method](#5-method)
6. [Environment constraints](#6-environment-constraints), including [data used](#data-used)
7. [Decisions made by the AI](#7-decisions-made-by-the-ai)
8. [Files and features produced](#8-files-and-features-produced)
9. [Checks performed](#9-checks-performed)
10. [What the AI got wrong / self-corrections](#10-what-the-ai-got-wrong--self-corrections)
11. [Human corrections](#11-human-corrections)
12. [Limitations](#12-limitations)
13. [Requires human review](#13-requires-human-review)
14. [Cost](#14-cost)
15. [Evaluation](#15-evaluation)
16. [Next experiment](#16-next-experiment)
17. [Record history](#17-record-history)

---

## 1. Question

> How much of JEREBU.EXE V0 can Claude Code Cloud autonomously build from a nearly empty repository?

This is the question exactly as the founder wrote it in section 10 of the brief. Section 03 of the brief states the objective: "Determine how much of the initial JEREBU.EXE product can be created autonomously by Claude Code Cloud from a nearly empty public repository."

Experiment 001 is the first step towards the project's broader question (brief, section 02): "Can one person working with AI agents and open public data build useful civic infrastructure around a decades-old environmental problem?" It does not answer that question. It covers only the project's starting point.

## 2. Starting state

This was recorded at the start of the session on 2026-10-14, then checked against git history when this record was written.

- **Repository.** The public GitHub repository `Kingway87/jerebu-exe`, default branch `main`.
- **History.** One commit: `470119b Initial commit`, authored by 0x187WAY, dated 2026-10-14 19:26:04 +0800.
- **Files.** Three:
  - `README.md`, two lines:

    ```text
    # jerebu-exe
    Open-source AI experiment for transboundary haze intelligence and civic action in Southeast Asia.
    ```

  - `LICENSE`: the MIT License, "Copyright (c) 2026 0x187WAY".
  - `.gitignore`: GitHub's Node template (149 lines).
- **Not present.** No application code, no package manifest, no documentation beyond the two-line README, no CI and no pull request template.
- **Environment.** The cloud container had Node.js 22.22 and npm 10.9.

"Nearly empty" in the question refers to this state.

## 3. Human input

**Claude did not conceive this project.** Before the experiment began, the founder (HUMAN DECISION):

1. conceived the initial project;
2. selected the name JEREBU.EXE;
3. created the project email address, JEREBU.EXE@proton.me;
4. created the public GitHub repository, with the README, MIT licence and `.gitignore` described above;
5. defined the broad mission;
6. initiated this Claude Code cloud session.

The founder also wrote the **task brief** for this experiment. The brief was detailed. Anyone judging how much the AI did on its own should know what the brief had already decided:

- the name, the tagline ("CLEAN AIR NOT FOUND."), the mission and the framing, including what the project is not, and that people in Indonesia are also affected by fires and haze;
- the four questions V0 should answer within about 30 seconds;
- the preferred technology (Next.js, TypeScript, Tailwind CSS, modern React, static-first), and things not to add;
- the design direction and palette;
- the homepage sections in order, including the line "Same haze. Different year.", the seven steps of the loop, and the two call-to-action labels;
- the required routes: `/`, `/evidence`, `/experiments` and `/about`;
- the four evidence levels, each with an example, and the two inequalities (HOTSPOT ≠ RESPONSIBLE COMPANY; CORRELATION ≠ LEGAL ATTRIBUTION);
- the fields of the Experiment 001 log entry, and the names of the planned Experiments 002 to 006 (and of 007, in the brief's future architecture section);
- the topics the `/about` page must cover, the exact disclaimer and the contact address;
- the list of repository documents to create;
- the five AI involvement labels;
- the eight data and claim safety rules;
- the privacy, accessibility and quality-control requirements, and a list of things not to do.

The AI's part was to implement all of this: the code, the design system, the page copy beyond the phrases set by the brief, the documentation, the definitions of the labels, and the candidate source list. Section 8 lists what was produced.

**During the session.** No further human instructions are recorded in the material available to the agent that drafted this record. If the founder gave instructions or approvals during the session, they should be added here.

## 4. AI task

The brief asked the AI to bootstrap V0 of the project into "a working, reviewable, documented web application", and to leave a transparent record that the work was AI-assisted. In summary, the AI was asked to:

- build a polished but intentionally small static website with four routes that answers the four questions, without over-engineering it;
- set out the project's evidence philosophy on `/evidence`, with clearly labelled placeholders for future data sources, and with no invented API integrations and no fake live data;
- create an experiment log on `/experiments` that reflects the actual state, does not pretend that planned experiments have happened, and does not invent a cost;
- explain the project on `/about`, with the required disclaimer and the contact address;
- create or improve the ten repository documents listed in section 12 of the brief, including this record;
- follow the data and claim safety rules, and the privacy and accessibility requirements;
- run quality control: install dependencies, lint, typecheck, run a production build, fix errors, review the responsive layout, check for broken internal links and obvious accessibility problems, check that there are no fake statistics or citations and no secrets, and check that the documentation matches what was built;
- prepare everything for human review through a pull request.

The brief also said what **not** to do.

- **Section 20.** Do not: deploy to production automatically; purchase a domain; create social accounts; send emails; publish social posts; launch a petition; collect signatures; contact government agencies, companies, journalists or NGOs; claim Anthropic endorses the project; claim Claude's findings are independently verified; add API keys to source control; fabricate live environmental data; identify companies as polluters without verified evidence; create unnecessary infrastructure.
- **Section 05.** Do not add in V0: Supabase, databases, authentication, user accounts, payment systems, a custom CMS, complex agent frameworks, vector databases, unnecessary analytics, automatic social-media publishing, petition signature storage, unnecessary third-party dependencies.
- **Section 15.** Do not create: petition databases, medical-information forms, location tracking, identity verification, mailing lists.
- **Section 13.** Do not claim that Claude independently conceived the project.

## 5. Method

This is the order in which the AI worked. It is based on the session log kept by the orchestrating agent, and on git history.

The main Claude Code session, called the **orchestrating agent** in this record, did the foundation work itself. For larger tasks it used a workflow tool to run **sub-agents** in parallel. A sub-agent is a further instance of the AI agent, given a narrower task and, when building, a defined set of files. Every agent in this experiment was an AI. None was a human.

1. **Inspected the repository** and recorded the starting state (section 2).
2. **Probed the environment.** Node.js 22.22 and npm 10.9 were available. Google Fonts could be reached from the container. NASA and ASEAN hosts were blocked from the container. The web page fetching tool failed with DNS errors. Web search worked. Raw access to other GitHub repositories was blocked. See section 6.
3. **Ran source discovery as a background workflow: 6 agents, search only.** Five search agents each covered one group: satellite and regional sources, Malaysia, Singapore, Indonesia, and global research and governance. A sixth, **sceptic** agent then re-searched and challenged their results. The workflow was reported as using about 173 tool calls (searches). It produced:
   - 46 entries, each with the URL seen in search results: 45 candidate data sources and one governance reference (the Contributor Covenant);
   - 17 targets that could not be found on an official domain, listed as not found rather than guessed;
   - a sceptic verdict on all 46: 26 "keep", 20 "keep with caveat", none dropped, and 4 corrected URLs;
   - 14 flagged overclaims (see section 10).

   No agent opened any of the pages. The orchestrating agent selected 27 of the candidate sources for `src/content/sources.ts`, which the `/evidence` page displays. Each is labelled as a candidate that has not been evaluated or integrated. The fuller list, with caveats, is in [`docs/DATA_SOURCES.md`](../docs/DATA_SOURCES.md).
4. **Scaffolded the application.** Ran `create-next-app@16.4.0` in a scratch directory, so that the existing README, LICENSE and `.gitignore` would not be overwritten. Read the Next.js 16 documentation bundled with the package (static pages, `ensureStatic`, partial prefetching, the upgrade guide and metadata), because this version differs from older ones. Copied the scaffold in, renamed the package, extended `.gitignore`, removed the default Next.js and Vercel assets and favicon, and added an SVG icon. Added the CI workflow, the pull request template and `AGENTS.md`.
5. **Built the foundation:** the design system (colour tokens, fonts and utilities), the root layout, the header and footer, the typed content modules in `src/content/`, and the homepage. A production build passed, with every route static.
6. **Visual QA.** Took Playwright (Chromium) screenshots of the homepage at widths of 375, 768 and 1280 pixels, and inspected them. No horizontal overflow was found. Layout problems found this way were fixed (section 10). The contrast ratios of the colour tokens were calculated with a small script and recorded in `src/app/globals.css`.
7. **Committed the foundation:** commits `c615e5d` (scaffold, CI, pull request template, `AGENTS.md`) and `177ca16` (design system, layout and homepage).
8. **Parallel build: 7 agents.** Seven build agents worked in parallel, each owning a separate set of files: the `/evidence`, `/experiments` and `/about` pages, and the repository documentation. Their rules were: edit only your own files; do not run builds or the development server, because parallel builds would clash over Next.js's build lock; do not run git commands that change state; do not install dependencies; and report any change needed to a shared file instead of making it. Some agents rendered their pages to screenshots to check the layout. The results were committed as each part was completed. The full list of commits is in the branch's git history and the pull request.
9. **Multi-dimension review with adversarial verification.** Seven reviewer agents each examined one dimension of the first complete build:
   1. data and claim safety;
   2. accessibility (WCAG 2.2 AA), with an automated axe scan and a code review;
   3. visual design and responsive layout, with screenshots at 375, 768 and 1280 pixels;
   4. whether the documentation matches the implementation;
   5. code quality and Next.js 16 correctness;
   6. privacy, security and secrets;
   7. compliance with the brief.

   Each reviewer's findings went to an adversarial verifier agent for the same dimension. The verifier tried to refute each finding, and corrected its severity or proposed fix. Reviewers and verifiers reported only; they did not edit files. The verifiers are AI agents too, so this is AI cross-checking, not independent verification.

   **Round 1 results** (counted from the workflow output; "kept" means confirmed or partly confirmed by the verifier; severities as corrected by the verifier):

   | Dimension | Reported | Refuted by verifier | Kept: confirmed / partly | Kept: major / minor | Fixed | Not fixed |
   | --- | --- | --- | --- | --- | --- | --- |
   | Data and claim safety | 11 | 0 | 6 / 5 | 3 / 8 | 11 | 0 |
   | Accessibility | 7 | 0 | 6 / 1 | 0 / 7 | 7 | 0 |
   | Visual design and responsive layout | 13 | 1 | 8 / 4 | 2 / 10 | 12 | 0 |
   | Documentation matches implementation | 12 | 0 | 5 / 7 | 2 / 10 | 12 | 0 |
   | Code quality and Next.js 16 correctness | 13 | 2 | 4 / 7 | 0 / 11 | 10 | 1 |
   | Privacy, security and secrets | 6 | 0 | 4 / 2 | 1 / 5 | 6 | 0 |
   | Compliance with the brief | 8 | 0 | 4 / 4 | 4 / 4 | 8 | 0 |
   | **Total** | **70** | **3** | **37 / 30** | **12 / 55** | **66** | **1** |

   No finding was rated a blocker. The 66 kept findings marked "Fixed" were applied by four fix agents, each owning a separate set of files, and by the orchestrating agent where a fix spanned two owners; they were committed in `31f436d` (site) and `2c3e2cc` (documentation). One of them, `brief-6`, was fixed only in part on purpose: the public Output list now names everything produced, but agent counts and cost stay in this record rather than on the site.

   **Round 2.** Because fixes can introduce new problems, a second round ran three more reviewers, each with a verifier: regressions introduced by the round-1 fixes, a claim-safety re-sweep, and a brief-compliance re-check.

   | Dimension | Reported | Refuted by verifier | Kept: confirmed / partly | Kept: major / minor | Fixed | Not fixed |
   | --- | --- | --- | --- | --- | --- | --- |
   | Regressions from round-1 fixes | 6 | 0 | 2 / 4 | 0 / 6 | 6 | 0 |
   | Data and claim safety (re-sweep) | 6 | 0 | 3 / 3 | 0 / 6 | 6 | 0 |
   | Compliance with the brief (re-check) | 4 | 0 | 1 / 3 | 1 / 3 | 4 | 0 |
   | **Total** | **16** | **0** | **6 / 10** | **1 / 15** | **16** | **0** |

   Round-2 fixes were applied by the orchestrating agent and committed in the final commit before the pull request. No third round was run; that is a judgement, not proof that nothing remains.

   **Fixed.** Every finding, with its location, the problem, the endorsed fix and its outcome, is listed in [`001-review-log.md`](001-review-log.md), generated from the workflow output. Highlights are in section 10.

   **Deliberately not fixed.** `cq-6` (code quality, minor): an optional refactor into shared `ArrowLink` and "On this page" components. It was judged not worth the extra abstraction for V0; the About page's table-of-contents styling was aligned instead (`layout-8`). Three round-1 findings were refuted by their verifiers and not applied (`layout-9`, `cq-5`, `cq-12`); the log gives the verifiers' reasons.

10. **Final checks, commit and pull request.** Ran the final checks in section 9, completed this record, committed, pushed the branch, and opened a pull request against `main` for human review. Nothing was deployed.

## 6. Environment constraints

| Constraint | Effect |
| --- | --- |
| **Web page fetching did not work.** Every host failed with a DNS error. | The AI could not open any web page. Every candidate source was located from search results only. No page content was read, quoted or checked. |
| **The container's network blocked most government hosts**, such as NASA and ASEAN hosts. | No public data source could be reached from code, even as a trial. No API was called. |
| **Web search worked.** | Search was the only research method available. Search results can be stale or incomplete, and a search snippet is not the page. |
| **Raw access to other GitHub repositories was blocked.** | The text of the Contributor Covenant could not be fetched. Its official URL was confirmed by search. So [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) adopts version 2.1 by reference, with a link, instead of reproducing it from memory. |
| **The environment set the branch name.** | The brief suggested `experiment/001-bootstrap`. The environment required `claude/elegant-brown-k5c0dw`. |
| **No cost or usage information was available inside the session.** | Cost is not recorded (section 14). |
| **Parallel agents shared one working tree and one Next.js build lock.** | Build agents could not run builds. Only the orchestrating agent ran them, between phases. |

### Data used

- **No environmental data was used.** No air-quality readings, fire or hotspot observations, weather data or other measurements were retrieved, displayed or analysed.
- **Web search results only.** On 2026-10-14, the source-discovery agents used web search results (titles, snippets and the search tool's summaries, not the contents of the pages) to compile the list of candidate sources. See section 5, step 3, and [`docs/DATA_SOURCES.md`](../docs/DATA_SOURCES.md).
- **No API was called and no data was retrieved.** The only requests to public data hosts were reachability checks during the environment probe (section 5, step 2), and the container's network blocked them.
- **No dataset was downloaded.**

## 7. Decisions made by the AI

These choices were made by the AI, not by the founder. Each is open to human review and reversal. Choices that the brief itself made are not listed here.

1. **Stack versions.** Next.js 16.4.0 (App Router, Turbopack), React 19.3, TypeScript 5, Tailwind CSS 4, and ESLint 9 with `eslint-config-next`, as installed by `create-next-app@16.4.0`. *Reason:* this is the brief's preferred stack. The only runtime dependencies are `next`, `react` and `react-dom`.
2. **`ensureStatic = "navigation"` in the root layout,** with Cache Components and Partial Prefetching turned on in `next.config.ts`. *Reason:* the production build fails if any route starts to need request-time rendering. That enforces the brief's static-first requirement instead of relying on contributors to remember it.
3. **Tailwind's default colour palette cleared.** Only a small set of named project colour tokens exists, and each one's contrast ratio is documented in `globals.css`. *Reason:* it keeps the site to the brief's restrained palette (white, near-black, charcoal and grey, with one sparing accent), and makes it hard to add an unchecked colour by accident.
4. **Self-hosted fonts** (Inter, JetBrains Mono and Newsreader) through `next/font`. *Reason:* the font files are downloaded at build time and served from the site, so visitors' browsers never contact a third-party font service.
5. **No `/timeline` route.** *Reason:* the brief allowed one only if it improved V0 without fabricated historical content. No sourced historical content exists yet, so a timeline would have been empty or invented. A timeline belongs to Experiment 002.
6. **No social preview (Open Graph) image.** *Reason:* there is no production URL yet. This should be revisited once a deployment target is chosen.
7. **Experiment 007 listed as planned.** Section 10 of the brief lists Experiments 002 to 006 as planned. Section 21 also lists 007, automated public monitoring, as future architecture. *Reason:* listing it keeps the public log consistent with the brief's roadmap. It is marked Planned and not started. A human may remove it.
8. **Status wording: "In progress", not "Complete".** The public log shows three phases: AI build, Complete; Human review, Pending; Production deployment, Not deployed. *Reason:* the brief asked for the actual state. The site defines Complete as finished and reviewed by a human, and no human has reviewed the work yet.
9. **External links open in the same tab,** with `rel="noopener noreferrer"`, a visible "↗" that is hidden from screen readers, and the screen-reader text "(external site)". *Reason:* this is predictable for keyboard and screen-reader users. Anyone can still choose to open a link in a new tab.
10. **A claims register** ([`src/content/claims.ts`](../src/content/claims.ts), shown on `/evidence`). It lists the main factual statements the website itself makes about the world, each with a status. All eight are currently Unverified (descriptions of candidate sources are tracked separately, with their provenance, in [`docs/DATA_SOURCES.md`](../docs/DATA_SOURCES.md)). *Reason:* the project applies its own evidence rules to its own copy.
11. **A CI workflow** ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)): lint, typecheck and build on every pull request and every push to `main`, on Node 22, with telemetry turned off and a read-only token. *Reason:* a reviewer can see that the checks pass without running them.
12. **A pull request template** ([`.github/pull_request_template.md`](../.github/pull_request_template.md)) with an AI involvement section and a claims-and-sources checklist. *Reason:* every future change, not only this one, should disclose AI use and pass the claim-safety checks.
13. **Project rules in [`AGENTS.md`](../AGENTS.md).** The file keeps the Next.js agent rules block, which `next dev` writes and re-adds, and adds the project's claim-safety rules. *Reason:* AI coding agents that work in this repository in future read this file.
14. **Typed content modules** in `src/content/` as the single source of truth for site copy and data. *Reason:* pages that show the same information, such as the homepage and `/experiments`, cannot drift apart, and a reviewer can check content without reading layout code.
15. **"Not yet built" placeholders** for future data panels on `/evidence`. *Reason:* the brief asked for unfinished components to be clearly labelled. Each panel says plainly that it shows nothing, so it cannot be mistaken for data.
16. **27 candidate sources shown on the site,** selected from the 45 found. Each row is marked "Candidate", and each jurisdiction group's header states that its sources are not evaluated and not integrated. *Reason:* a starting list for later experiments that does not imply any source has been checked.
17. **The code of conduct adopted by reference** (see section 6).
18. **An extra document, [`docs/CORRECTIONS.md`](../docs/CORRECTIONS.md),** which was not in the brief's list. *Reason:* the brief commits the project to documenting mistakes and corrections, and that needed a defined place.
19. **A "What AI got wrong" field** in the public experiment log on `/experiments`. *Reason:* the brief says the public should be able to see what AI got wrong.
20. **A known development-only `npm audit` advisory left in place,** and documented in [`SECURITY.md`](../SECURITY.md). See section 12.

## 8. Files and features produced

The list below was checked against `git ls-files` at the end of the session.

### The website (V0)

Four static routes and a 404 page:

- **`/`**: the hero; a "thirty seconds" summary that answers the four questions; the loop; the question; the two jurisdictions; the evidence ladder and both inequalities; the experiment log; the open-source commitments; the calls to action.
- **`/evidence`**: the evidence ladder with an example and the requirements for each level; the two inequalities; the claim labels; the eight safety rules; candidate sources grouped by jurisdiction; three empty "not yet built" data panels (a haze history timeline, satellite fire observations and the legal landscape, in experiment order); the planned evidence pipeline, labelled as not implemented; and the claims register.
- **`/experiments`**: a status key; the full record of Experiment 001; Experiments 002 to 007, marked as planned and not started; and how to propose or challenge an experiment.
- **`/about`**: why the project exists; why it is open source; why Malaysia and Singapore come first; why Indonesia is not framed as an adversary; why evidence standards matter; how AI fits in; what the project is not; the disclaimer; and the contact address.

Every page shares a layout with a skip link, a header with navigation, and a footer with project links, a short disclaimer and a note that using Claude Code does not imply endorsement by Anthropic.

Deliberately **not** produced: live data, API integrations, a database, user accounts, forms, cookies set by the site's code, analytics, third-party scripts, a deployment, social accounts and outgoing emails.

### Repository files

```text
.github/
  pull_request_template.md       new
  workflows/ci.yml               new
.gitignore                       extended (Next.js additions)
AGENTS.md                        new
CODE_OF_CONDUCT.md               new
CONTRIBUTING.md                  new
LICENSE                          unchanged
README.md                        rewritten (replaces the two-line original)
SECURITY.md                      new
docs/
  AI_TRANSPARENCY.md             new
  CORRECTIONS.md                 new (not in the brief's list)
  DATA_SOURCES.md                new
  METHODOLOGY.md                 new
  ROADMAP.md                     new
experiments/
  README.md                      new: what an experiment is, index and template
  001-autonomous-bootstrap.md    new: this record
  001-review-log.md              new: every review finding and its outcome
eslint.config.mjs                new
next.config.ts                   new
package.json                     new
package-lock.json                new
tsconfig.json                    new
src/app/
  layout.tsx  page.tsx  not-found.tsx  globals.css  icon.svg
  evidence/page.tsx  experiments/page.tsx  about/page.tsx
src/components/
  button-link  container  evidence-ladder  experiment-log  external-link
  inequality  loop-diagram  nav-links  not-yet-built  pipeline-diagram
  section-header  site-footer  site-header  status-badge  wordmark      (.tsx)
  about/         about-section  transparency-label                     (.tsx)
  evidence/      candidate-source-list  claims-register                 (.tsx)
  experiments/   experiment-record                                      (.tsx)
src/content/
  site.ts  experiments.ts  evidence.ts  sources.ts  claims.ts  loop.ts
```

The default Next.js and Vercel assets and favicon that came with the scaffold were removed before the first commit.

## 9. Checks performed

### During the build

These are recorded in the session log, from before the final checks:

- **Production build of the foundation:** passed, with every route static (method, step 5).
- **Homepage screenshots** at 375, 768 and 1280 pixels: no horizontal overflow (step 6).
- **Contrast ratios** of the colour tokens: calculated and documented in `globals.css` (step 6).

Checks that individual build agents may have run on their own files are not recorded here.

### Final checks

Run by the orchestrating agent on 2026-10-14, after the round-2 fixes, on the code in the pull request.

| Check | Method | Result |
| --- | --- | --- |
| Lint | `npm run lint` (ESLint) | Passed, no warnings |
| Typecheck | `npm run typecheck` (`next typegen`, then `tsc --noEmit`) | Passed |
| Production build | `npm run check` (lint, typecheck, then `next build`). Every route must be static | Passed. `/`, `/evidence`, `/experiments`, `/about`, the 404 page and the icon are all prerendered as static content |
| Link check | Headless-browser crawl of every route: every internal link must return 200 and every `#anchor` must exist on its target page | Passed: no broken internal links, no missing anchors, no duplicate ids. Relative links between Markdown files were checked by the round-1 documentation reviewer. External links were listed but not opened (see "Not performed") |
| Accessibility | axe-core scan (WCAG 2.0, 2.1 and 2.2 A/AA rules and best practices) of every route, including the 404 page; heading-outline check; first Tab stop | Passed: 0 violations on every route; one `h1` per page; the first Tab stop is the skip link |
| Responsive layout | Horizontal-overflow measurement of every route at 320, 375, 768 and 1280 pixels, plus screenshots inspected by eye at 320 to 1280 pixels | Passed: 0 pixels of overflow everywhere. Layout defects found in screenshots were fixed in both review rounds |
| Secrets | Pattern scan of the working tree and of `git log --all -p` for API keys, tokens and private keys; check that no `.env` file is tracked | Passed: no matches; no `.env` file tracked |
| Privacy and network | Headless-browser audit of every route, including the 404 page, recording the host of every request | Passed: every request went to the site's own origin. No forms or third-party scripts. Cookies and web storage were checked in round 1 (empty) and the code that could set them did not change |
| Production dependencies | `npm audit --omit=dev` | Passed: 0 vulnerabilities. The full `npm audit` shows only the documented development-only advisory (section 12) |
| Claim safety | Two AI review rounds over all user-facing copy and documentation against the eight safety rules (section 5, step 9) | 17 claim-safety findings upheld across both rounds; all fixed. No human has checked this yet |

### Not performed

- **No unit or end-to-end tests.** There is no logic worth unit-testing yet (see section 12).
- **No testing with a screen reader or on physical devices.** Screenshots came from a headless browser.
- **No check of external links.** The container could not reach most external sites, so the candidate source URLs were not opened.
- **No human review.**

## 10. What the AI got wrong / self-corrections

These are the AI's own reports about its own work. Mistakes that no agent noticed cannot be on this list. Human reviewers may find more.

1. **An unsupported prediction in the homepage copy.** The first draft of the closing call to action said "The haze will be back". That is a prediction with no source. It was rewritten to "Haze seasons come and go. The record should stay."
2. **Evidence-ladder layout.** At desktop width, the level labels wrapped unevenly and the headings were misaligned. The labels were replaced with a decorative meter.
3. **Doubled rules.** Full-width section borders doubled up with the rules in the section headers. The extra borders were removed.
4. **Mobile navigation.** On phones, the navigation wrapped onto two lines. The spacing was tightened.

   Problems 2 to 4 were found by inspecting screenshots.
5. **A QA tooling failure.** A QA helper script used `pkill -f "next start"`, which matched and killed the script's own shell. A stale server then kept serving an old build, so one screenshot showed unstyled HTML. The helper script was fixed. This was a mistake in tooling, not a bug in the product, but it briefly produced misleading QA evidence.
6. **Overclaims by the source-search agents.** The sceptic agent flagged 14 overclaims in the search agents' output. Examples: a misspelt name of a legal entity, contradictory statements about how current a dataset was, and an overgeneralised description of a court circular. The corrections were applied in [`docs/DATA_SOURCES.md`](../docs/DATA_SOURCES.md), and each is noted in the entry it affects. The sceptic could not open pages either, so its checks were also based only on search, and a human should confirm the corrections when checking the source list.
7. **A miscount in the working notes, found while drafting this record.** The orchestrating agent's working notes said that the sceptic gave 17 "keep with caveat" verdicts. A recount of the raw output found 20 (and 26 "keep"). This record uses the recount.
8. **The founder's wording was altered.** Two of the eight data and claim safety rules shown on the site (rules 3 and 6) had been lightly copy-edited by the AI when they were copied from the brief. A build agent flagged this, and the founder's exact wording was restored (commit `308611a`).
9. **The pull request template overstated checking.** Its "AI generated" option said that a human had reviewed the work. It now says that the work stays unverified until a named reviewer records what they checked (commit `308611a`).
10. **A link to a URL never seen in search.** The site's entry for the Indonesian Supreme Court's directory of decisions linked to the directory's root address, which never appeared in search results. It now links to the category page that did (commit `6d6934c`).

### Found by the AI review rounds

The two review rounds (section 5, step 9) upheld 83 problems in the AI's own work. All but one optional refactor were fixed before the pull request. The full list is in [`001-review-log.md`](001-review-log.md). The most significant, in the project's own terms:

11. **Search snippets presented as what agencies say** (`claims-2`). Source notes on `/evidence` stated, as plain fact, what ASMC, Singapore's NEA and Indonesia's forestry ministry "note" or "describe", although no page had been opened and one statement reached the ministry only through news snippets. The notes now say where each statement came from.
12. **An organisation detail not found in the research** (`claims-7`). The site named a legal entity as OpenAlex's operator. The research did not support it, so it probably came from model memory. It was removed.
13. **An incomplete claims register** (`claims-1`). The register left out the site's central empirical claim (what a hotspot is), while the methodology described the register as complete. Two entries were added, and the documents now say the register lists the main claims. Round 2 found a third gap: the README credited the founder with a premise the AI had added (`claims2-1`). It is now labelled as AI framing and registered.
14. **A privacy promise that contradicted the AI policy** (`privacy-1`). The code of conduct allowed conduct reports, which name people, to be processed with AI tools. The AI transparency policy forbids that. The code of conduct now matches the policy.
15. **AI reasoning presented under a HUMAN DECISION label** (`claims-10`). The `/about` page gave a reason for starting with Malaysia and Singapore that the founder never gave. It is now labelled as the AI's suggestion.
16. **This record understated the AI's errors** (`claims-4`, `brief-2`). Items 8 to 10 above were missing from the first draft.
17. **Fixes that introduced regressions** (round 2, `reg-1` to `reg-4`). A round-1 accessibility fix added line-wrapping that broke four layouts at phone widths. All four were fixed.
18. **Smaller defects:** a blinking cursor that never stopped (WCAG 2.2.2), a decorative gradient that lowered text contrast below 4.5:1 at phone widths, diagram arrows that pointed the wrong way at tablet widths, a footer that broke the contact address mid-domain, misuse of `<blockquote>`, stale statements in the documentation, and counts that disagreed between files.

## 11. Human corrections

**None yet.** No human has reviewed the work.

When the founder or another reviewer changes anything, record it here: what changed, why, and who decided.

## 12. Limitations

- **Source discovery was search-only.** The candidate sources were located from search results, and no agent opened any page. A URL may be wrong or outdated, or the page may not say what its note suggests. The list is a set of leads, not evidence.
- **No human has reviewed anything yet.** Everything produced is AI GENERATED + UNVERIFIED.
- **The copy and design are AI-generated.** The wording, tone, framing and visual design are the AI's interpretation of the brief. They may read differently to people in Malaysia, Singapore or Indonesia than intended.
- **AI checked AI.** The sceptic agent and the review verifiers are AI agents of the same kind as the builders. They reduce errors, but they are not independent verification, and they may share blind spots.
- **Links to files on `main` will return "not found" until the pull request is merged.** The site links to repository documents on the `main` branch, for example "Read the full record on GitHub". Until the merge, those files exist only on the working branch.
- **No production URL and no social preview image.** Nothing is deployed, and no deployment target has been chosen.
- **English only.**
- **No tests beyond static checks:** lint, typecheck, build and the QA scans in section 9. There are no unit tests, because there is no logic worth unit-testing yet. The site renders static content from typed modules.
- **A development-only `npm audit` advisory.** `npm audit` reports five high-severity vulnerable packages, all from one advisory in one development-only chain: `braces` ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)), through `micromatch`, `fast-glob` and `@next/eslint-plugin-next`, to `eslint-config-next`. `npm audit --omit=dev` reports none. This code runs only when the project's own source is linted. It is never sent to browsers. npm's only fix is a breaking downgrade of `eslint-config-next`, so the chain was left as it is and documented in [`SECURITY.md`](../SECURITY.md).
- **The record is self-reported.** The AI wrote it about its own work, partly while that work was still going on. It may be incomplete. This document does not record the model version. The attribution trailers that the cloud environment added to each of the AI's commits name the model and link to the Claude Code session, which is access-controlled. No usage data was available.
- **The brief was detailed.** This experiment shows what an AI agent built from a detailed written brief (section 3), not from a one-line request. The result may not carry over to a vaguer brief.

### Open questions

- Is this AI-written account of its own errors complete? Mistakes that no agent noticed cannot be in section 10.
- Do the candidate source URLs work, and do they belong to the operators stated? No page was opened.
- How do the copy and framing read to people in Malaysia, Singapore and Indonesia?
- Does the site answer the brief's four questions within about thirty seconds for a first-time visitor? Only people can test that.
- How much did the session cost? No figures were available (section 14).

## 13. Requires human review

- [ ] **Every page's copy and framing:** `/`, `/evidence`, `/experiments`, `/about` and the 404 page. Is anything overstated, unclear or off in tone?
- [ ] **Indonesia framing.** Read the site and the documents as a reader in Indonesia might. Nothing should present Indonesia, Indonesians or the Indonesian government as the cause of haze or as an adversary.
- [ ] **The reasons for starting with Malaysia and Singapore.** The scope is the founder's decision, but the brief gives no reason for it. The `/about` page's scope section says so, and gives a reason for starting narrow that the AI drafted. State the actual reasons, or confirm or replace the AI's.
- [ ] **The claims register** ([`src/content/claims.ts`](../src/content/claims.ts)). Does it list every factual claim the site makes? Is any of them wrong? Can any be cited now?
- [ ] **The candidate source list** ([`src/content/sources.ts`](../src/content/sources.ts) and [`docs/DATA_SOURCES.md`](../docs/DATA_SOURCES.md)). Open every link. Check the operator, what the source is, and that the URL is current. Fix or remove entries that fail.
- [ ] **The methodology** ([`docs/METHODOLOGY.md`](../docs/METHODOLOGY.md)), especially the proposed threshold for naming anyone (section 8). Also confirm that the eight safety rules (section 4, and `safetyRules` in `src/content/evidence.ts`) match the brief word for word. Two had been copy-edited by the AI and were restored (see section 10).
- [ ] **The AI transparency policy** ([`docs/AI_TRANSPARENCY.md`](../docs/AI_TRANSPARENCY.md)). The definitions of the five labels were written by the AI.
- [ ] **The code of conduct and the security contact.** Is adopting the Contributor Covenant by reference acceptable? Is JEREBU.EXE@proton.me monitored for conduct and security reports? The code of conduct says that reports, and the personal data in them, are not pasted into AI tools, as section 7 of [`docs/AI_TRANSPARENCY.md`](../docs/AI_TRANSPARENCY.md) requires. Confirm that conduct reports are never processed with AI tools, or define an explicit consent-based exception in both documents.
- [ ] **The licence holder's name.** `LICENSE` reads "Copyright (c) 2026 0x187WAY". It was kept unchanged, as the brief asked. Confirm that this is the intended holder.
- [ ] **The experiment status wording.** Is "In progress — AI build phase complete; human review pending; not deployed" right? When should Experiment 001 become Complete?
- [ ] **The planned experiments.** The questions for 002 to 007 were drafted by AI. Should 007 be listed at all?
- [ ] **The deployment target.** None has been chosen. Decide whether and where to deploy, then revisit social preview metadata and hosting security settings. Also revisit the privacy statements on `/about`, in `SECURITY.md` and in `docs/AI_TRANSPARENCY.md`: they describe what the site's code does, and a host may keep its own request logs.
- [ ] **GitHub settings.** Decide whether to enable private vulnerability reporting, which `SECURITY.md` mentions, and issues, which the site and the documents link to.
- [ ] **Commit attribution.** Decide whether the model name and session link in the commit trailers, which the environment added, should stay in the public history.
- [ ] **The development-only `npm audit` advisory.** Accept or change the decision recorded in `SECURITY.md`.
- [ ] **This record.** Does it match what happened in the session and in git history? Is anything missing?

## 14. Cost

**To be recorded after session.**

No reliable cost or usage information (such as tokens, compute time or money) was available inside the environment, so none is given here. The AI does not know where the founder can find this information afterwards, so this record does not speculate about it.

The amount of agent work is partly known. This is not a cost figure:

- 1 orchestrating agent session, which also wrote the foundation, the homepage and the final edits;
- 37 sub-agents in five workflows, with tool calls and sub-agent tokens as reported by the workflow tool:

| Workflow | Agents | Tool calls | Sub-agent tokens |
| --- | --- | --- | --- |
| Source discovery (5 search agents, 1 sceptic) | 6 | 173 | 638,637 |
| Parallel build of pages and documents | 7 | 230 | 1,290,648 |
| Review round 1 (7 reviewers, 7 verifiers) | 14 | 690 | 2,625,653 |
| Review fixes (4 fix agents) | 4 | 95 | 533,238 |
| Review round 2 (3 reviewers, 3 verifiers) | 6 | 300 | 1,316,453 |
| **Total** | **37** | **1,488** | **6,404,629** |

These figures leave out the orchestrating session's own tokens, which were not reported. Token counts are not a cost: the price per token was not available.

When reliable figures are available, record them here with where they came from, and update [`src/content/experiments.ts`](../src/content/experiments.ts).

## 15. Evaluation

This record does not answer the experiment's question. The answer depends on human review, which has not happened yet.

These are suggested ways for a human to judge the experiment. They are suggestions, not a standard.

1. **The brief's success criteria (section 22).** For each criterion, record yes, partly or no, with a reason: the app runs; the production build passes; the identity is coherent; the mission is understandable; evidence standards are documented; AI involvement is transparent; there are no fake environmental claims; the repository is contributor-friendly; it is a clean foundation for future experiments; a human can review everything through a pull request.
2. **Correction burden.** How much did a human have to change before merging? Count and group the changes: claim safety or framing; factual errors; code defects; design or taste. Record them in section 11.
3. **Claim-safety failures.** Did any fabricated statistic, event, law, case, citation or URL, any accusation, or any implied endorsement reach the pull request? Given the project's purpose, even one would be significant.
4. **The thirty-second test.** Show the homepage to a few people who have not seen the project. Can they answer the brief's four questions: what it is, why recurring haze matters, what it is investigating, and how to follow or contribute?
5. **Source-list yield.** Once a human has opened every candidate link: how many work, belong to the operator stated, and are what the note says?
6. **Accuracy of this record.** Does it match git history and the pull request? Did it leave out anything that went wrong?
7. **Autonomy, relative to the brief.** How many times did a human step in during the session? How much of the result was already specified in the brief (section 3)? "Autonomous" means something different for a detailed brief than for a one-line request.
8. **Maintainability.** Can a human contributor understand and change the code and content without AI help?
9. **Cost,** once it is known. Was the agent work proportionate to the result?

The reviewer could close the review with a short verdict and its reasons, for example "usable after minor edits", "usable after substantial edits" or "not usable as a foundation". Experiment 001 should move to Complete only after that review.

> **Human verdict: not yet given.**

## 16. Next experiment

This is a suggestion from the AI. Choosing the next experiment is a HUMAN DECISION.

**Suggestion: Experiment 002 — HAZE HISTORY.**

> Can a sourced, checkable timeline of past haze episodes affecting Malaysia and Singapore be assembled from public records?

The question was drafted by AI in [`src/content/experiments.ts`](../src/content/experiments.ts) and is awaiting human review.

### Why this next

- **Everything else depends on it.** The project's central premise, that haze episodes recur, has not been sourced yet. Most entries in the claims register, including the premise that haze episodes recur, are to be sourced in Experiment 002. Later experiments, such as satellite evidence, the legal landscape and monitoring, need a sourced historical baseline to refer to.
- **It is lower-risk than attribution.** It asks what public records say happened, and when. It does not ask who caused it. That keeps the work at the observation level of the evidence ladder, away from naming any organisation, person or government.
- **It tests the methodology on real sources for the first time.** The citation standard, the claims register and human verification have not yet been used on actual evidence.
- **It fills placeholders that already exist:** the "Haze history timeline" panel on `/evidence`, and the `/timeline` route that was deliberately not built in V0.

### Method sketch

1. **Human decisions first.** The founder sets the scope: the time range, the places covered, what counts as a "haze episode" for this purpose, which languages to search, and who will verify the entries.
2. **Solve the access problem.** Agents in Experiment 001 could not open web pages. Experiment 002 needs either an environment where agents can open and archive pages, or a human who retrieves and reads the sources. Without one of these, it should not go beyond a list of leads.
3. **Extend the claims register before adding entries.** Add fields for a citation and for the reviewer's name and date, as section 9 of [`docs/METHODOLOGY.md`](../docs/METHODOLOGY.md) says will be needed.
4. **Search and draft (AI).** Agents look for primary sources: official agency publications and archives, regional meteorological records, government statements, and peer-reviewed literature. Each draft entry records the citation fields from section 6 of the methodology, including the exact passage relied on.
5. **Sceptic pass (AI).** A separate agent challenges each entry. Does the source exist? Does it say this? Do other sources disagree?
6. **Human verification.** A named human opens every source and confirms each entry before it is published. Only entries marked Human verified appear on the site.
7. **Build.** A static timeline generated from a typed content module. Gaps and conflicting sources are shown as gaps and conflicts.
8. **Record.** A full record in `experiments/002-haze-history.md`, using the [template](README.md#template), including cost.

### Safeguards

- **Observations, not causes.** Entries describe what was observed and officially reported. No entry attributes an episode to any company, person or government. Causes and responsibility belong to later experiments and, ultimately, to legal processes.
- **No unsourced figures.** No figure, such as an index reading or a duration, is published unless it appears in a primary source and is cited to it. Where sources disagree, both are shown.
- **Health effects are out of scope** unless a human decides otherwise. If they are included, they need authoritative sources.
- **Fair framing.** People in Indonesia are also affected by fires and haze. Indonesia is not presented as the adversary.
- **Nothing unverified is published.** AI-drafted entries stay unpublished until a human has verified them.
- **Missing is not zero.** A year or place with no record found is shown as missing, not as "no haze".

## 17. Record history

| Date | Change | By |
| --- | --- | --- |
| 2026-10-14 | First draft, written while the build was in progress | Claude Code build agent (AI) |
| 2026-10-14 | Review fixes to this record: data used (section 6), AI errors 8 to 10 (section 10), limitations and review checklist (sections 12 and 13); committed in `2c3e2cc` | Review-fix agent (AI) |
| 2026-10-14 | Review results, round 2, final checks, final file list, open questions, agent work and review findings | Orchestrating agent (AI) |
| Not yet | Human review | **Pending:** the founder |

---

<sub>AI involvement: this record is AI GENERATED + UNVERIFIED. It was written by Claude Code during Experiment 001 and has not yet been reviewed by a human.</sub>
