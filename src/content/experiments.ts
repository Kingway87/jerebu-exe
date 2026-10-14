/**
 * The public experiment log.
 *
 * Every experiment is a typed record so the homepage and /experiments stay in
 * sync. Planned experiments must not describe results: they only state the
 * question being considered. Update the record when the real state changes.
 */

export type ExperimentStatus = "planned" | "in-progress" | "complete";

export const statusLabel: Record<ExperimentStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  complete: "Complete",
};

export interface ExperimentPhase {
  label: string;
  state: string;
}

export interface Experiment {
  /** Zero-padded identifier, e.g. "001". */
  id: string;
  name: string;
  status: ExperimentStatus;
  question: string;
  /** Short sub-status lines, e.g. "AI build: complete". */
  phases?: ExperimentPhase[];
  humanInput?: string;
  ai?: string;
  task?: string;
  output?: string[];
  /** Mistakes the AI made, or caught in itself, during the experiment. */
  aiErrors?: string[];
  humanReview?: string;
  cost?: string;
  /** Repository path of the full written record, if one exists. */
  record?: string;
}

export const experiments: readonly Experiment[] = [
  {
    id: "001",
    name: "Autonomous project bootstrap",
    status: "in-progress",
    question:
      "How much of JEREBU.EXE V0 can Claude Code Cloud autonomously build from a nearly empty repository?",
    phases: [
      { label: "AI build", state: "Complete" },
      { label: "Human review", state: "Pending" },
      { label: "Production deployment", state: "Not deployed" },
    ],
    humanInput:
      "Project concept, the name JEREBU.EXE, the project email address, the public GitHub repository, the mission, and the written task brief for this session.",
    ai: "Claude Code, an AI coding agent made by Anthropic, running as a cloud session against the public repository.",
    task: "Bootstrap V0 of the website and its documentation: inspect the repository, choose an implementation, build and check it, document the methodology and AI involvement, and prepare everything as a pull request for human review — without deploying, publishing or contacting anyone.",
    output: [
      "A static Next.js, TypeScript and Tailwind CSS website with four routes: /, /evidence, /experiments and /about.",
      "An evidence framework separating observation, interpretation, attribution and legal responsibility.",
      "A list of candidate public data sources, located by web search and marked as not yet evaluated or integrated.",
      "A claims register on /evidence listing the site’s main factual statements about the world, all currently unverified.",
      "Repository documentation: README, contributing guide, code of conduct, security policy, methodology, data sources, AI transparency policy, roadmap, corrections log, an experiment index and template, and this experiment’s record.",
      "A CI check (lint, typecheck, build), a pull request template that asks for AI disclosure, and AGENTS.md rules for AI agents.",
      "No live data, no database, no accounts, no tracking and no forms.",
    ],
    aiErrors: [
      "Drafted a homepage line predicting that the haze “will be back” — an unsupported claim. Rewritten before review.",
      "Lightly reworded two of the founder’s eight safety rules when copying them onto the site. Another agent flagged it, and the exact wording was restored.",
      "The source-search agents overstated some details, such as a misspelt organisation name and contradictory dataset dates. A second, sceptical agent caught 14 such overclaims, and they were corrected.",
      "Linked the Indonesian Supreme Court directory to a root address that never appeared in search results; replaced with the address that did.",
      "The orchestrating agent miscounted its own source review (it reported 17 sources kept with caveats; the true number was 20). Another agent caught the error by recounting the raw data.",
      "Several layout problems — misaligned labels, doubled rules, a navigation bar that wrapped on phones — were found in screenshot review and fixed.",
      "Before any human review, AI reviewer agents checked the first complete build and reported 70 problems; AI verifier agents upheld 67 (12 rated major). Examples: source notes that presented search snippets as what agencies say, an organisation detail not found in the research, and a privacy promise in the code of conduct that contradicted the AI policy.",
      "A second AI review round upheld 16 more problems, including layout regressions introduced by the first round’s fixes. Upheld problems were fixed before the pull request, apart from one optional clean-up listed in the written record.",
    ],
    humanReview:
      "Required before production deployment. Not yet performed at the time this record was written.",
    cost: "To be recorded after session",
    record: "experiments/001-autonomous-bootstrap.md",
  },
  {
    id: "002",
    name: "Haze history",
    status: "planned",
    question:
      "Can a sourced, checkable timeline of past haze episodes affecting Malaysia and Singapore be assembled from public records?",
  },
  {
    id: "003",
    name: "Live evidence",
    status: "in-progress",
    question:
      "Can JEREBU.EXE collect, normalise and present current public environmental observations relevant to transboundary haze affecting Malaysia and Singapore without confusing observation, interpretation, attribution or legal responsibility?",
    phases: [
      { label: "AI build", state: "Complete" },
      { label: "Human review", state: "Pending" },
      { label: "Merged", state: "No" },
      { label: "Production deployment", state: "Not deployed" },
    ],
    humanInput:
      "The experiment and its question, and a written brief: the evidence model, the rules (no attribution, no data shown as zero, no fake live data, no tracking), the sources to research, the security and privacy requirements, and instructions not to merge, deploy or publish. Experiment 002 ran independently and was not required.",
    ai: "Claude Code, an AI coding agent made by Anthropic, running locally (Claude Opus 5.5), with 5 AI research agents and 5 AI sceptic agents that opened official pages, and 10 AI review agents that reviewed the finished branch.",
    task: "Research authoritative public sources for satellite fires, Malaysian and Singaporean air quality and regional weather; build a source registry, a provenance model and the integrations that can be done safely; build a /live page that fails honestly; test, document and prepare the branch for human review.",
    output: [
      "A /live page: NASA FIRMS satellite fire detections (counts and a map), Singapore’s PSI and PM2.5 by region, wind and rainfall at Singapore’s stations, and MET Malaysia’s forecast by state — each with its source, observation time, retrieval time and status.",
      "Freshness states with documented thresholds (recent, delayed, stale), and honest failure states: unavailable data is never shown as zero.",
      "A machine-readable register of 17 sources investigated, with licences, rate limits, limitations and quotes from the official pages.",
      "Malaysia’s Air Pollutant Index linked, not copied: no documented public feed of current readings was found.",
      "Deterministic code only: no AI model fetches, checks or summarises any value. Unit tests use real captured responses.",
      "Documentation: docs/LIVE_EVIDENCE.md, updated data-source notes, and this experiment’s record.",
    ],
    aiErrors: [
      "Source requests at first went through Next.js’s fetch cache, so a rebuild could show old data with a new retrieval time. Caught in testing before any commit, fixed, and covered by a test.",
      "The first design would have dropped a whole satellite overpass by trimming NASA’s “24h” files; changed to show the files’ actual time range.",
      "Flagged Singapore’s readings as “provisional” on the strength of a search snippet; replaced with wording verified on data.gov.sg.",
      "Overstated how Malaysia’s and Singapore’s indices differ, twice: the first rewrite still used a nitrogen dioxide example that NEA’s own data contradicts. Now based on sulphur dioxide, which the data supports.",
      "AI sceptic agents corrected the research: map boundary lines that included sea lines, terms of use summarised as stricter than written, a data portal rated more available than it was, and more. The written record lists the main ones.",
      "Research and sceptic agents made some requests they should not have: before reading three sites’ terms or robots.txt, to paths FIRMS’s robots.txt disallows, and to undocumented endpoints; they also made about 65 one-off requests to ASMC’s websites, whose terms restrict copying. NEA pages read before NEA’s terms are the source of the Singapore PSI and PM2.5 bands on /live; whether that use is acceptable is a human decision.",
      "A final AI review of the finished branch upheld 84 problems. Among them: the page could call unreadable or undated satellite files “no detections”, a slow NASA server could fail the build, a forecast for a day that had ended could be labelled current, and this record claimed checks that had not yet run. All were fixed before the final commit.",
    ],
    humanReview:
      "Required before the branch is merged or deployed. Not yet performed at the time this record was written.",
    cost: "To be recorded after session",
    record: "experiments/003-live-evidence.md",
  },
  {
    id: "004",
    name: "Legal landscape",
    status: "planned",
    question:
      "Which laws, agreements and policies are relevant to transboundary haze in Malaysia and Singapore, according to primary sources?",
  },
  {
    id: "005",
    name: "Evidence agent",
    status: "planned",
    question:
      "Can an AI research agent find and cite public evidence reliably enough to assist — not replace — human reviewers?",
  },
  {
    id: "006",
    name: "Community action",
    status: "planned",
    question:
      "Which legitimate, lawful forms of civic participation can the project support without collecting sensitive personal data?",
  },
  {
    id: "007",
    name: "Automated public monitoring",
    status: "planned",
    question:
      "Can recurring public data be monitored automatically, with human review before anything is published?",
  },
];

export function getExperiment(id: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.id === id);
}
