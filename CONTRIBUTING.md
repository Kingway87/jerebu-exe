# Contributing to JEREBU.EXE

Thank you for considering a contribution. JEREBU.EXE is an early, small project. It currently has one maintainer, its founder, so replies may be slow. Please be patient.

Everyone who takes part agrees to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Contents

- [Review status](#review-status)
- [Before you start](#before-you-start)
- [Ways to contribute](#ways-to-contribute)
- [Ground rules for data and claims](#ground-rules-for-data-and-claims)
- [Development setup](#development-setup)
- [Where things live](#where-things-live)
- [Proposing an experiment](#proposing-an-experiment)
- [Pull requests](#pull-requests)
- [Commit messages](#commit-messages)
- [Accessibility](#accessibility)
- [Writing style](#writing-style)
- [Licence of contributions](#licence-of-contributions)

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

The notice is the maintainer’s own wording (HUMAN DECISION). It covers the evidence presented on `/live` and `/evidence`, which the project’s maintainer (Kingway87) reviewed on 15 October 2026, at commit `56d74b1` of the branch `experiment/003-live-evidence`. The live page’s readings update automatically, so readings published after that date were not part of the review. What the review covered is recorded in [`src/content/review.ts`](src/content/review.ts), in the claims register and in the source registry. It does not cover Experiment 002's haze history (`/timeline` and [`data/haze-events.json`](data/haze-events.json)) or the haze history statements added to `/evidence` after the review: no human has reviewed them yet. How corrections are recorded is set out in [`docs/CORRECTIONS.md`](docs/CORRECTIONS.md).

## Before you start

1. Read the [README](README.md), [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md) and [`docs/AI_TRANSPARENCY.md`](docs/AI_TRANSPARENCY.md).
2. For anything bigger than a small fix, open an issue first, so effort is not wasted on something that will not be merged.
3. Issues and pull requests are public. Do not post personal data, health information or confidential documents in them.
4. Security problems go through [`SECURITY.md`](SECURITY.md), not public issues.

No GitHub account? Write to [JEREBU.EXE@proton.me](mailto:JEREBU.EXE@proton.me).

## Ways to contribute

| Area | What helps |
| --- | --- |
| **Code** | Bug fixes, accessibility fixes, performance and maintainability improvements. V0 is deliberately small. Please do not add databases, accounts, analytics, forms or new dependencies without first agreeing a documented experiment. |
| **Research** | Check the haze history from Experiment 002: open the sources cited in [`data/haze-events.json`](data/haze-events.json) and confirm, or correct, each claim as worded. Start with the priority claims in [`docs/research/HAZE_HISTORY.md`](docs/research/HAZE_HISTORY.md#priority-claims-for-human-verification). Find reliable, citable sources for the site's main factual claims, listed with their status in [`src/content/claims.ts`](src/content/claims.ts): those cited in Experiment 003 were human verified in the maintainer's review, those cited through the haze history are not yet checked by a human, and the rest are unverified. Help scope the planned experiments. |
| **Sources and data** | Check the candidate sources in [`src/content/sources.ts`](src/content/sources.ts) and [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md). Open each link, then confirm who runs it, what it measures, how often it updates, its licence and its known limits. Report links that are broken or wrong. |
| **Legal knowledge** | Lawyers, law students and policy researchers can help scope Experiment 004 (legal landscape) from primary sources. Contributions are not legal advice, and the project does not give legal advice. |
| **Design** | Improve clarity within the existing design system (tokens in [`src/app/globals.css`](src/app/globals.css)). The look is restrained on purpose. Please do not add gradients, shadows, rounded cards or animation. |
| **Accessibility** | Test with a keyboard, a screen reader, browser zoom and reduced motion. Report or fix what fails. |
| **Translation** | There is no translation system yet. If you would like to help, for example in Malay or Indonesian, open an issue first so an approach can be agreed. Machine translation must be disclosed and checked by a fluent speaker. |
| **Review** | Read pull requests and challenge claims, sources and wording. Reviewing AI-generated work is one of the most useful things you can do here. |

## Ground rules for data and claims

These rules apply to humans and AI alike. The founder set them, and they are reproduced here exactly as written. They are explained in full in [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md) and shown on the site's `/evidence` page.

1. Never accuse a company, individual or government of causing a particular haze event without sufficient reliable evidence.
2. A satellite hotspot alone does not establish ownership, responsibility or wrongdoing.
3. Distinguish: fact, observation, analysis, allegation, hypothesis, legal finding.
4. Cite important factual claims.
5. Prefer primary sources where appropriate.
6. When evidence conflicts, expose uncertainty rather than hiding it.
7. AI-generated conclusions require human verification before being presented as established facts.
8. Never fabricate environmental statistics, historical events, laws, cases or citations.

In practice, this also means:

- **Label each statement** as a fact, observation, analysis, allegation, hypothesis or legal finding ([METHODOLOGY section 3](docs/METHODOLOGY.md#3-claim-labels)).
- **Trace secondary sources back to the primary source** (the official dataset, statute, judgment or paper) where one exists. If you cannot, cite the secondary source and say that the primary source was not checked ([METHODOLOGY section 5](docs/METHODOLOGY.md#5-source-hierarchy)).
- **No personal or sensitive data.** Do not add names, addresses, contact details, ID numbers or health information about private individuals, and do not collect any.
- **No fake or placeholder data** that could be mistaken for real data. Unfinished panels use the `NotYetBuilt` component and say plainly that nothing is shown.
- **If something is unknown, say it is unknown.** Leave the gap visible.
- **Check that every citation exists** and says what you claim it says. AI tools can invent references that look real.

## Development setup

**Requirements:** Node.js 22 or later (as in CI) and npm.

```bash
git clone https://github.com/Kingway87/jerebu-exe.git
cd jerebu-exe
npm ci
npm run dev        # http://localhost:3000
```

Before you open a pull request, run:

```bash
npm run check      # lint, typecheck, unit tests and production build
```

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs the same lint, typecheck, test and build steps on every pull request. `npm test` runs the unit tests alone; `npm run live:check` requests each live source once and prints the result.

- Next.js collects anonymous telemetry by default. To turn it off locally, run `npx next telemetry disable`. CI already turns it off.
- No API keys or environment variables are needed. The live evidence page can use two optional keys, listed in [`.env.example`](.env.example). Put them in `.env.local` (ignored by git), never in source files, and never with a `NEXT_PUBLIC_` prefix, which would send them to browsers. **Never commit a key.**
- This project uses Next.js 16, which has APIs that differ from older versions. Check the bundled docs in `node_modules/next/dist/docs/` before relying on memory or older tutorials. This also applies to AI agents: see [`AGENTS.md`](AGENTS.md).

## Where things live

| Path | Contents |
| --- | --- |
| `src/app/` | Routes: `/`, `/timeline`, `/live`, `/evidence`, `/experiments`, `/about`, plus the root layout and the 404 page |
| `src/components/` | UI components. General and homepage components sit at the top level. Some components written for `/timeline`, `/live`, `/evidence`, `/experiments` or `/about` sit in a subfolder named after that page |
| `src/content/` | Typed content modules, the single source of truth for site copy and data |
| `src/lib/live/` | The live evidence pipeline: fetching, validation, normalisation, caching and freshness rules |
| `data/` | The haze history dataset (`haze-events.json`), its JSON Schema and a README; [`src/content/haze-history.ts`](src/content/haze-history.ts) checks it when the site is built. Also `live-sources.json`, the register of sources for `/live`, and its JSON Schema |
| `scripts/` | `npm run live:check` and the basemap generator |
| `tests/` | Unit tests, with real captured responses as fixtures |
| `docs/` | Methodology, data sources, live evidence, AI transparency, roadmap, corrections, and research notes in `docs/research/` |
| `experiments/` | Written experiment records |

**Content goes in `src/content/`, not in page files**, whenever it appears in more than one place or is data rather than layout.

- **Adding a factual claim to the site?** Add it to [`src/content/claims.ts`](src/content/claims.ts) as well. Each entry has the claim, a status and a note. A claim stays `unverified` until a reliable source is linked (`cited`), and becomes `human-verified` only once a named human reviewer has checked that source.
- **Adding or changing a candidate source?** Update [`src/content/sources.ts`](src/content/sources.ts) and [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) together. A source is `candidate` until someone evaluates it, and `integrated` only when real code uses it. Experiment 003 added an interim `integrated-pending-evaluation` status (see [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md#status-definitions)).
- **Changing the haze history?** Edit [`data/haze-events.json`](data/haze-events.json), never the `/timeline` page: the page is generated from the file. Every claim needs a source reference with the exact passage relied on, and the build fails if one is missing. See [`data/README.md`](data/README.md).
- **Changing `/live` or one of its sources?** Read [`docs/LIVE_EVIDENCE.md`](docs/LIVE_EVIDENCE.md) first, update [`data/live-sources.json`](data/live-sources.json), and keep the data path deterministic: no AI model may fetch, transform or summarise a value. Missing data is never shown as zero.
- **Updating an experiment?** Update [`src/content/experiments.ts`](src/content/experiments.ts) and its record in `experiments/`.
- **Reuse existing components** (`Container`, `SectionHeader`, `ButtonLink`, `ExternalLink`, `NotYetBuilt` and others) before you write new ones.
- **Colours** come only from the project tokens in [`src/app/globals.css`](src/app/globals.css). Tailwind's default palette is switched off.

**V0 is static only.** The root layout ([`src/app/layout.tsx`](src/app/layout.tsx)) exports `ensureStatic = "navigation"`, so `next build` fails if any route needs request-time rendering. Do not use `cookies()`, `headers()`, `searchParams`, uncached `fetch` calls or `connection()`. Changing this rule needs a documented experiment and an explicit human decision. Data from outside sources is fetched inside a `"use cache"` function with a cache lifetime, as in [`src/lib/live/snapshots.ts`](src/lib/live/snapshots.ts); the requests themselves use `cache: "no-store"` so that only that function's cache applies.

## Proposing an experiment

The project moves forward as numbered experiments. To propose one, or to challenge an existing one, open an issue that covers:

1. The question the experiment would try to answer.
2. The public sources or data it would rely on.
3. What humans would decide, and what AI would do.
4. How the result would be checked, and by whom.
5. What could go wrong, or be misread.

If the proposal is accepted, it gets a number and an entry in [`src/content/experiments.ts`](src/content/experiments.ts) with the status `planned`. It gets a written record in `experiments/` once it starts (see [`experiments/README.md`](experiments/README.md)). A planned experiment states its question only. It must never describe results that do not exist.

## Pull requests

1. **Keep them small and focused.** One concern per pull request is easier to review and to revert.
2. **Fill in the [pull request template](.github/pull_request_template.md).**
   - **AI disclosure is required.** Tick the box that applies (no AI, AI assisted, or AI generated), name the tools or agents you used, and say what a human checked.
   - Complete the claims and sources checklist if your change adds or edits any factual statement, data or source.
3. **CI must pass:** lint, typecheck, unit tests and build.
4. **A human reviews every pull request** before it is merged, including pull requests opened by AI agents.
5. **If you correct a factual error**, record the correction in [`docs/CORRECTIONS.md`](docs/CORRECTIONS.md). Mistakes are recorded with their corrections, not quietly erased.

You are responsible for everything you submit, whoever or whatever wrote it.

## Commit messages

Use the Conventional Commits style: a type, a colon, and a short summary in the imperative mood.

```text
feat: add /evidence page
fix: correct broken link to the data sources document
docs: explain how candidate sources are evaluated
chore: update dependencies
```

Common types are `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test` and `ci`. Add a body when the reason for a change is not obvious. If an AI agent wrote or co-wrote a commit, say so, for example with a `Co-Authored-By:` trailer.

## Accessibility

Every change should keep the site usable for everyone. The site has not been formally audited. The target is WCAG 2.2 level AA.

- **Semantic HTML.** Use one `h1` per page, headings in order, and landmarks. Use lists for lists and buttons or links for actions.
- **Keyboard.** Everything works without a mouse, and focus is always visible.
- **Contrast.** Use the colour tokens as documented in `globals.css`. For example, `signal` is never used as text on a light background; use `signal-ink` there.
- **Meaningful link text.** Avoid "click here". External links follow the existing pattern: a `↗` marked `aria-hidden`, plus screen-reader text " (external site)".
- **Motion.** Respect `prefers-reduced-motion`. Do not add new animation.
- **Small screens.** Check layouts at phone width (around 375 px) with no horizontal scrolling.
- **Images and icons.** Decorative elements get `aria-hidden="true"`. Meaningful images get alt text.

## Writing style

- **British spelling:** organisation, normalise, colour, licence (noun) and license (verb).
- Plain, calm and precise. Use short sentences. No hype, no marketing voice, no exclamation marks.
- Do not describe Indonesia, Indonesians or the Indonesian government as the cause of haze or as an adversary. People in Indonesia are also affected by fires and haze. The subject is transboundary haze accountability.
- Do not imply that Anthropic or any government endorses the project.

## Licence of contributions

By contributing, you agree that your contribution is licensed under the project's [MIT License](LICENSE). Only submit work you have the right to submit. Do not paste copyrighted text, such as paywalled articles, into the repository: quote briefly and cite instead. Check a data source's licence before you add any of its data.

## Questions

Open an issue, or write to [JEREBU.EXE@proton.me](mailto:JEREBU.EXE@proton.me).

---

<sub>AI involvement: this guide is AI GENERATED. It was written by Claude Code during Experiment 001 and updated during Experiments 002 and 003. Pull request #1 merged the Experiment 001 version into `main`; no human review of it has been recorded. The Experiment 002 and 003 changes have not yet been reviewed by a human.</sub>
