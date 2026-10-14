# JEREBU.EXE

**CLEAN AIR NOT FOUND.**

An open-source experiment using AI agents and public data to investigate recurring transboundary haze in Southeast Asia.

> **Status (15 October 2026):** V0, bootstrapped by an AI coding agent in [Experiment 001](experiments/001-autonomous-bootstrap.md). Awaiting human review. Not deployed. On the branch `experiment/003-live-evidence`, [Experiment 003](experiments/003-live-evidence.md) adds a `/live` page of current official observations; it is not merged and awaits human review.

[Methodology](docs/METHODOLOGY.md) · [Data sources](docs/DATA_SOURCES.md) · [Live evidence](docs/LIVE_EVIDENCE.md) · [AI transparency](docs/AI_TRANSPARENCY.md) · [Roadmap](docs/ROADMAP.md) · [Experiments](experiments/README.md) · [Contributing](CONTRIBUTING.md)

---

## What

JEREBU.EXE is an independent, open-source civic-tech experiment. It explores whether AI agents, public environmental data and community participation can help people understand recurring transboundary haze affecting Malaysia and Singapore. _Jerebu_ is the Malay word for haze.

V0 is a small static website with four pages: `/` (overview), `/evidence` (how evidence is judged), `/experiments` (the public experiment log) and `/about`. Experiment 003 adds a fifth, `/live`: current satellite fire detections, Singapore's air-quality readings, Singapore's weather measurements and MET Malaysia's forecast, each with its source, its time and its limits. It shows evidence, not accusations.

It is **not** an official Malaysian or Singaporean initiative, a law firm, a scientific authority, an accusation platform, or a system for identifying guilty companies. It is not an anti-Indonesia or anti-government campaign: people in Indonesia are also affected by fires and haze. The project is **not affiliated with or endorsed by Anthropic or any government.**

## Why

The project starts from its founder's premise that haze episodes keep returning. The AI that wrote this README added a second assumption that is not in the founder's brief: that the information needed to understand haze episodes is scattered across agencies, satellites, courts and archives. Neither has been sourced in this repository yet. Both are logged as unverified in [`src/content/claims.ts`](src/content/claims.ts); the first is planned to be sourced in Experiment 002.

Behind it sits a second question, from the founder's brief:

> Can one person working with AI agents and open public data build useful civic infrastructure around a decades-old environmental problem?

The long-term subject is transboundary haze accountability: how evidence, law and public attention work across borders. It is not a contest between countries or their people.

## How

- **Numbered public experiments.** Each one records its question, what humans provided, what the AI did, what came out, what went wrong, what still needs human review, and its cost where known. See [`experiments/`](experiments/README.md).
- **An explicit evidence ladder:** observation → interpretation → attribution → legal responsibility. Each step needs more evidence than the last, and only a legal process can establish legal responsibility. See [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md).
- **AI involvement is documented**, not hidden. See [AI transparency](#ai-transparency).
- **Changes go through pull requests**, and a human reviews them before they are merged or deployed.

A future evidence pipeline is sketched on `/evidence` (public data → ingestion → normalisation → evidence store → AI analysis → source verification → human review → public report). **None of it is implemented.**

## Status

At the time of writing (15 October 2026):

| Area | State |
| --- | --- |
| V0 build | Bootstrapped by Claude Code, an AI coding agent made by Anthropic, in Experiment 001, from a written brief by the human founder |
| Human review | Pending. The work is submitted as a pull request against `main` |
| Deployment | **Not deployed.** There is no production URL |
| Data | On `main`: none. On the Experiment 003 branch: `/live` reads seven official feeds (NASA FIRMS; NEA and MSS via data.gov.sg; MET Malaysia via data.gov.my) on the server, with no credentials, and shows each with its source and age. The 17 sources investigated are in [`data/live-sources.json`](data/live-sources.json). AI agents checked them; no human has evaluated any source yet. 27 candidate sources are listed on `/evidence` (from [`src/content/sources.ts`](src/content/sources.ts)), a curated subset of the 45 recorded with caveats in [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) |
| Experiment 002 | Running independently on its own branch |
| Experiment 003 | AI build complete on `experiment/003-live-evidence`; human review pending; not merged |
| Experiments 004–007 | Planned. Not started |
| Cost of Experiment 001 | To be recorded after session |

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router), React 19, TypeScript 5
- Tailwind CSS 4, with the default colour palette replaced by a small set of project tokens in [`src/app/globals.css`](src/app/globals.css)
- ESLint 9 (`eslint-config-next`)
- **Static only.** The root layout exports `ensureStatic = "navigation"`, so `next build` fails if any route needs request-time rendering.
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
- **AI built** the V0 code and its first documentation (including this README) during Experiment 001. That work has not yet been reviewed by a human.
- **AI output is not evidence.** AI-generated research must be checked by a human, and important claims need traceable sources, before anything is presented as fact.
- Contributions are labelled **HUMAN DECISION**, **AI ASSISTED**, **AI GENERATED**, **HUMAN VERIFIED** or **UNVERIFIED**. The pull request template asks every contributor to disclose AI use.

Read the policy in [`docs/AI_TRANSPARENCY.md`](docs/AI_TRANSPARENCY.md) and the full record of the bootstrap in [`experiments/001-autonomous-bootstrap.md`](experiments/001-autonomous-bootstrap.md).

---

## Getting started

**Requirements:** Node.js 20.9 or later (CI uses Node 22) and npm.

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
    evidence/page.tsx       /evidence     Evidence ladder, safety rules, candidate sources, claims register
    experiments/page.tsx    /experiments  Experiment log
    about/page.tsx          /about        Why the project exists, disclaimer, contact
    live/page.tsx           /live         Live evidence (Experiment 003): current observations with source, time and status
    layout.tsx              Root layout: fonts, header, footer, ensureStatic
    not-found.tsx           404 page
    globals.css             Design tokens and custom utilities
  components/               Shared UI (Container, SectionHeader, ButtonLink, NotYetBuilt, EvidenceLadder, ...)
    evidence/, experiments/, about/, live/   Components used by a single page
  content/                  Typed content modules: the single source of truth for site copy and data
    site.ts                 Name, tagline, repository URL, contact address, navigation
    experiments.ts          The experiment log (001 in progress, 002–007 planned)
    evidence.ts             Evidence ladder, claim labels, the 8 safety rules, inequalities, pipeline
    sources.ts              Candidate public sources for /evidence (two integrated on the Experiment 003 branch)
    claims.ts               The site's main factual claims and how well each is supported
    loop.ts                 Steps of "the loop" on the homepage
    live.ts                 Framing for /live: evidence levels, what the data can and cannot answer
    geo/basemap.ts          Generated map outline (Natural Earth, public domain)
  lib/live/                 Live evidence pipeline: fetch, validate, normalise, cache; freshness rules
data/                       live-sources.json (source registry) and its JSON Schema
scripts/                    check-live-sources.ts (npm run live:check), build-basemap.mjs
tests/                      Unit tests, with real captured responses as fixtures
docs/                       Methodology, data sources, live evidence, AI transparency, roadmap, corrections
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

<sub>AI involvement: this README is AI GENERATED. It was written by Claude Code during Experiment 001, updated during Experiment 003, and has not yet been reviewed by a human.</sub>
