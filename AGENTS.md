<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## JEREBU.EXE project rules (for humans and AI agents)

Read `docs/METHODOLOGY.md` and `docs/AI_TRANSPARENCY.md` before changing content.

- **Never fabricate** environmental statistics, historical events, laws, cases, citations or data. If evidence is missing, leave it missing and say so.
- **Never accuse** a company, individual or government of causing a haze event without sufficient reliable evidence. A satellite hotspot alone does not establish ownership, responsibility or wrongdoing.
- **Label claims**: fact, observation, analysis, allegation, hypothesis or legal finding.
- **No fake live data.** Unfinished components must use `NotYetBuilt` and say so plainly.
- **Static only in V0.** The root layout sets `ensureStatic = "navigation"`; do not add request-time rendering, databases, auth, analytics or forms without a documented experiment.
- **Content lives in `src/content/`** as typed modules. Update `src/content/claims.ts` when the site makes a new factual claim.
- **Record AI involvement** in the pull request template and, for experiments, in `experiments/`.
- Run `npm run check` (lint, typecheck, build) before opening a pull request.
