# JEREBU.EXE

**CLEAN AIR NOT FOUND.**

An open-source experiment using AI agents and public data to investigate recurring transboundary haze in Southeast Asia.

> **Status (15 October 2026):** V0, bootstrapped by an AI coding agent in [Experiment 001](experiments/001-autonomous-bootstrap.md); no human review of it has been recorded. [Experiment 003](experiments/003-live-evidence.md) adds a `/live` page of current official observations; the project’s maintainer reviewed its evidence on 15 October 2026. [Experiment 002](experiments/002-haze-history.md) adds a sourced haze history at `/timeline`, compiled by an AI research agent: AI GENERATED + SOURCE ATTACHED, not yet checked by a human. Not deployed.

[Methodology](docs/METHODOLOGY.md) · [Data sources](docs/DATA_SOURCES.md) · [Live evidence](docs/LIVE_EVIDENCE.md) · [AI transparency](docs/AI_TRANSPARENCY.md) · [Roadmap](docs/ROADMAP.md) · [Experiments](experiments/README.md) · [Contributing](CONTRIBUTING.md)

---

## What

JEREBU.EXE is an independent, open-source civic-tech experiment. It explores whether AI agents, public environmental data and community participation can help people understand recurring transboundary haze affecting Malaysia and Singapore. _Jerebu_ is the Malay word for haze.

V0 is a small static website with four pages: `/` (overview), `/evidence` (how evidence is judged), `/experiments` (the public experiment log) and `/about`. Experiment 002 adds `/timeline`: a history of major transboundary haze episodes affecting Malaysia, Singapore or both since 1997, with a page for each episode, pages of legal, policy and other milestones, and a page of the periods considered but left out, all generated from a sourced dataset in [`data/`](data/README.md). Experiment 003 adds `/live`: current satellite fire detections, Singapore's air-quality readings, Singapore's weather measurements and MET Malaysia's forecast, each with its source, its time and its limits. It shows evidence, not accusations.

It is **not** an official Malaysian or Singaporean initiative, a law firm, a scientific authority, an accusation platform, or a system for identifying guilty companies. It is not an anti-Indonesia or anti-government campaign: people in Indonesia are also affected by fires and haze. The project is **not affiliated with or endorsed by Anthropic or any government.**

## Why

The project starts from its founder's premise that haze episodes keep returning. The AI that wrote this README added a second assumption that is not in the founder's brief: that the information needed to understand haze episodes is scattered across agencies, satellites, courts and archives. Both are logged in [`src/content/claims.ts`](src/content/claims.ts), with how well each is supported. Experiment 002 linked sources to the first, through the haze history dataset; no human has checked those sources yet. The second is still unverified.

Behind it sits a second question, from the founder's brief:

> Can one person working with AI agents and open public data build useful civic infrastructure around a decades-old environmental problem?

The long-term subject is transboundary haze accountability: how evidence, law and public attention work across borders. It is not a contest between countries or their people.

## How

- **Numbered public experiments.** Each one records its question, what humans provided, what the AI did, what came out, what went wrong, what still needs human review, and its cost where known. See [`experiments/`](experiments/README.md).
- **An explicit evidence ladder:** observation → interpretation → attribution → legal responsibility. Each step needs more evidence than the last, and only a legal process can establish legal responsibility. See [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md).
- **AI involvement is documented**, not hidden. See [AI transparency](#ai-transparency).
- **Changes go through pull requests**, and a human reviews them before they are merged or deployed.

A future evidence pipeline is sketched on `/evidence` (public data → ingestion → normalisation → evidence store → AI analysis → source verification → human review → public report). **It is not implemented as a whole.** On its branch, Experiment 003's `/live` uses a narrow, separate path (source → fetch → validate → normalise → cache → display), with no evidence store and no AI stage; see [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Status

At the time of writing (15 October 2026):

| Area | State |
| --- | --- |
| V0 build | Bootstrapped by Claude Code, an AI coding agent made by Anthropic, in Experiment 001, from a written brief by the human founder |
| Human review | Experiment 001's pull request (#1) was merged into `main` as `5d12fad` on 15 October 2026; no human review of it has been recorded, and whether that merge followed one is for the founder to record. The project's maintainer reviewed Experiment 003's evidence on `/live` and `/evidence` on 15 October 2026. Experiment 002 is waiting for human review |
| Deployment | **Not deployed.** There is no production URL |
| Data | `/live` reads seven official feeds (NASA FIRMS; NEA and MSS via data.gov.sg; MET Malaysia via data.gov.my) on the server, with no credentials, and shows each with its source and age. The 17 sources investigated are in [`data/live-sources.json`](data/live-sources.json). AI agents checked them, and the project’s maintainer reviewed the evidence on `/live` and `/evidence` on 15 October 2026. 27 candidate sources are listed on `/evidence` (from [`src/content/sources.ts`](src/content/sources.ts)), a curated subset of the 45 recorded with caveats in [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) |
| Haze history | Experiment 002: a dataset of haze episodes, legal and policy milestones, and periods considered but left out, in [`data/haze-events.json`](data/haze-events.json), shown on `/timeline`. Every claim carries its source and the exact passage relied on. Compiled by an AI agent from public documents; AI GENERATED + SOURCE ATTACHED, not human verified. It is a static file, not a live data feed |
| Experiment 002 | In progress. AI research, build, AI review and fixes complete; human review pending (pull request #3) |
| Experiment 003 | In progress. AI build complete; evidence reviewed by the maintainer on 15 October 2026 (pull request #2) |
| Experiments 004–007 | Planned. Not started |
| Cost of Experiment 001 | To be recorded after session |
| Cost of Experiment 002 | Not directly measured (see the [record](experiments/002-haze-history.md#cost)) |

## Review status

> **Human reviewed · Open for contribution**
>
> The evidence currently presented here has been reviewed by the project’s human maintainer against JEREBU.EXE’s evidence rules.
>
> Review does not mean final or unquestionable.
>
> JEREBU.EXE is an open-source public-interest project. Evidence can change, sources can improve, and interpretations can be challenged.
>
> If you find a better primary source, missing context, conflicting evidence, an error, or a claim that needs stronger qualification, please contribute.
>
> [Open an issue](https://github.com/Kingway87/jerebu-exe/issues), [submit a pull request](https://github.com/Kingway87/jerebu-exe/pulls), or [propose a correction](docs/CORRECTIONS.md).
>
> The goal is not to prove a predetermined narrative.
>
> The goal is to make the evidence easier for everyone to inspect.

The notice is the maintainer’s own wording (HUMAN DECISION). It covers the evidence presented on `/live` and `/evidence`, which the project’s maintainer (Kingway87) reviewed on 15 October 2026, at commit `56d74b1` of the branch `experiment/003-live-evidence`. The live page’s readings update automatically, so readings published after that date were not part of the review. What the review covered is recorded in [`src/content/review.ts`](src/content/review.ts), in the claims register and in the source registry. It does not cover Experiment 002's haze history (`/timeline` and [`data/haze-events.json`](data/haze-events.json)) or the haze history statements added to `/evidence` after the review: no human has reviewed them yet.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router), React 19, TypeScript 5
- Tailwind CSS 4, with the default colour palette replaced by a small set of project tokens in [`src/app/globals.css`](src/app/globals.css)
- ESLint 9 (`eslint-config-next`)
- **Static only.** The root layout exports `ensureStatic = "navigation"`, so `next build` fails if any route needs request-time rendering. Every page is prerendered at build time. One exception: under `next start`, an unknown id on the dynamic timeline routes (for example `/timeline/1999`) is rendered on the server when requested and then returns "not found" (see the comment in `next.config.ts`).
- Fonts (Inter, JetBrains Mono, Newsreader) via `next/font`. They are downloaded at build time and served from the site itself.
- GitHub Actions CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): lint, typecheck, unit tests and build on every pull request and every push to `main`, on Node 22.
- Runtime dependencies: `next`, `react`, `react-dom`. Nothing else. Development-only additions in Experiment 003: `tsx` (runs the TypeScript tests and scripts) and `ajv` (validates the source registry against its schema).
- No database, accounts, authentication, forms, analytics, cookies, third-party scripts or external images. `/live` fetches public data on the server only; readers' browsers contact no other site.

## Contributing

Code, research, sources, legal knowledge, design, accessibility, translation and review are all welcome. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md). The short version:

- Read the [evidence rules](#evidence-rules) first. Never accuse anyone without sufficient reliable evidence, and never invent a statistic, event, law, case or citation.
- Disclose any AI use in the pull request template.
- Keep pull requests small, run `npm run check`, and expect human review.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately, as described in [`SECURITY.md`](SECURITY.md).

## AI transparency

AI transparency is part of the product, not a footnote.

- **Humans decided** the concept, the name, the project email, the public repository, the mission, and the task brief that started Experiment 001. Claude did not conceive this project.
- **AI built** the V0 code and its first documentation (including this README) during Experiment 001. No human review of that work has been recorded.
- **AI researched and wrote** the haze history (dataset, `/timeline` and research notes) during Experiment 002, from the founder's brief. Every claim in the dataset has a source attached, but no human has checked it yet.
- **AI output is not evidence.** AI-generated research must be checked by a human, and important claims need traceable sources, before anything is presented as fact.
- Contributions are labelled **HUMAN DECISION**, **AI ASSISTED**, **AI GENERATED**, **HUMAN VERIFIED** or **UNVERIFIED**. Research content also carries a review stage (AI GENERATED, SOURCE ATTACHED, HUMAN CHECKED, HUMAN VERIFIED; see [`docs/AI_TRANSPARENCY.md`](docs/AI_TRANSPARENCY.md#review-stages-for-research-content)). The pull request template asks every contributor to disclose AI use.

Read the policy in [`docs/AI_TRANSPARENCY.md`](docs/AI_TRANSPARENCY.md), the full record of the bootstrap in [`experiments/001-autonomous-bootstrap.md`](experiments/001-autonomous-bootstrap.md) and the record of the haze history research in [`experiments/002-haze-history.md`](experiments/002-haze-history.md).

---

## Getting started

**Requirements:** Node.js 22 or later (as in CI) and npm.

```bash
git clone https://github.com/Kingway87/jerebu-exe.git
cd jerebu-exe
npm ci
npm run dev
```

Then open <http://localhost:3000>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build. Fails if any route is not static |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types (`next typegen`), then `tsc --noEmit` |
| `npm test` | Unit tests (no network needed) |
| `npm run live:check` | Request each live source once and print what `/live` would show. Needs the network |
| `npm run check` | Lint, typecheck, tests and build. Run this before opening a pull request |

Notes:

- `next/font` fetches the font files from Google Fonts while you develop and build, so you need internet access for that. Visitors' browsers never contact a font provider.
- Next.js collects anonymous telemetry by default. CI turns it off. To turn it off locally, run `npx next telemetry disable`.
- No environment variables or API keys are needed. `/live` can use two optional, server-side keys, listed in [`.env.example`](.env.example): `NASA_FIRMS_MAP_KEY` and `DATA_GOV_SG_API_KEY`. Put them in `.env.local` (git-ignored) or the host's settings. Never commit a key, and never give one a `NEXT_PUBLIC_` prefix. See [`docs/LIVE_EVIDENCE.md`](docs/LIVE_EVIDENCE.md#9-credentials-and-security).
- `npm run build` fetches the live sources once. If a source cannot be reached, the build still succeeds and `/live` shows that source as unavailable.

## Project structure

```text
src/
  app/                      Routes (Next.js App Router)
    page.tsx                /             Overview: the loop, the question, the two jurisdictions
    timeline/               /timeline     Haze history, generated from data/haze-events.json:
                                          an overview, one page per episode (/timeline/<year>)
                                          and milestone pages (/timeline/milestones/...)
    evidence/page.tsx       /evidence     Evidence ladder, safety rules, candidate sources, claims register
    experiments/page.tsx    /experiments  Experiment log
    about/page.tsx          /about        Why the project exists, disclaimer, contact
    live/page.tsx           /live         Live evidence (Experiment 003): current observations with source, time and status
    layout.tsx              Root layout: fonts, header, footer, ensureStatic
    not-found.tsx           404 page
    globals.css             Design tokens and custom utilities
  components/               Shared UI (Container, SectionHeader, ButtonLink, NotYetBuilt, EvidenceLadder, ...)
    evidence/, experiments/, about/, live/, timeline/   Components used by a single page
  content/                  Typed content modules: the single source of truth for site copy and data
    site.ts                 Name, tagline, repository URL, contact address, navigation
    experiments.ts          The experiment log (001, 002 and 003 in progress, 004–007 planned)
    haze-history.ts         Types, build-time validation and helpers for the haze history dataset
    evidence.ts             Evidence ladder, claim labels, the 8 safety rules, inequalities, pipeline
    sources.ts              Candidate public sources for /evidence (two integrated in Experiment 003)
    claims.ts               The site's main factual claims and how well each is supported
    loop.ts                 Steps of "the loop" on the homepage
    live.ts                 Framing for /live: evidence levels, what the data can and cannot answer
    geo/basemap.ts          Generated map outline (Natural Earth, public domain)
  lib/live/                 Live evidence pipeline: fetch, validate, normalise, cache; freshness rules
data/                       The haze history dataset (haze-events.json), live-sources.json (the source
                            registry for /live), their JSON Schemas and a README
scripts/                    check-live-sources.ts (npm run live:check), build-basemap.mjs
tests/                      Unit tests, with real captured responses as fixtures
docs/                       Methodology, data sources, live evidence, AI transparency, roadmap, corrections
  research/                 Research notes, e.g. HAZE_HISTORY.md (Experiment 002)
experiments/                Written experiment records, one file per experiment
.github/                    CI workflow and pull request template
AGENTS.md                   Rules for AI coding agents (and humans) working in this repository
```

## Evidence rules

The whole project rests on two inequalities:

```text
HOTSPOT      ≠  RESPONSIBLE COMPANY
CORRELATION  ≠  LEGAL ATTRIBUTION
```

A satellite hotspot alone does not establish ownership, responsibility or wrongdoing. A correlation between observations is not a legal finding. The project separates fact, observation, analysis, allegation, hypothesis and legal finding, and important claims must be cited. The site's main factual claims, and how well each is supported, are tracked in [`src/content/claims.ts`](src/content/claims.ts).

The full method and the eight data and claim safety rules are in [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md). Found an error? Open an issue, or see [`docs/CORRECTIONS.md`](docs/CORRECTIONS.md) for how corrections are recorded.

## Disclaimer

JEREBU.EXE is an independent educational and open-source civic-tech experiment. It does not provide legal, medical or scientific advice. AI-generated research must be independently verified before being treated as factual evidence.

## Licence

MIT. See [`LICENSE`](LICENSE).

## Contact

[JEREBU.EXE@proton.me](mailto:JEREBU.EXE@proton.me)

Please do not send personal health information or confidential documents. For security issues, follow [`SECURITY.md`](SECURITY.md).

---

<sub>AI involvement: this README is AI GENERATED. It was written by Claude Code during Experiment 001 and updated during Experiments 002 and 003. Pull request #1 merged the Experiment 001 version into `main`; no human review of it has been recorded. The Experiment 002 and 003 changes have not yet been reviewed by a human.</sub>
