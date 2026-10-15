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
      { label: "Merged into main", state: "Yes, pull request #1" },
      { label: "Human review", state: "Not recorded" },
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
      "A claims register on /evidence listing the site’s main factual statements about the world, all marked unverified when this experiment’s AI build was completed. Experiment 002 has since linked sources to three of them.",
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
      "Required before production deployment. Pull request #1 merged this work into main on 15 October 2026; no human review of it has been recorded.",
    cost: "To be recorded after session",
    record: "experiments/001-autonomous-bootstrap.md",
  },
  {
    id: "002",
    name: "Haze history",
    status: "in-progress",
    question:
      "Can an AI research agent reconstruct a source-verifiable history of major transboundary haze events affecting Malaysia and Singapore without fabricating facts, overstating evidence, or making unsupported attribution claims?",
    phases: [
      { label: "AI research, build and review", state: "Complete" },
      { label: "Review stage", state: "AI generated · source attached" },
      { label: "Human review", state: "Pending" },
      { label: "Merged / deployed", state: "No / no" },
    ],
    humanInput:
      "The research question, study period, scope, source hierarchy, attribution and health rules, review stages and list of things not to do, set out in the founder’s written brief for this experiment.",
    ai: "Claude Code (model: Claude Opus 5.5), running locally, with AI sub-agents for searching, drafting and checking, run without a model override.",
    task: "Research major transboundary haze episodes affecting Malaysia and Singapore from 1997 to 2026, build a sourced dataset and a /timeline generated from it, document the method and findings, and prepare the branch for human review, without merging, deploying, publishing or contacting anyone.",
    output: [
      "A dataset of 14 haze episodes, 82 legal, policy, institutional, diplomatic and measurement milestones and 15 periods considered but not included, in data/haze-events.json, with a JSON Schema. Every one of its 920 claims carries its source and the exact passage relied on.",
      "A /timeline overview, a page for each episode, pages of milestones and a page of the periods left out, all generated from the dataset at build time.",
      "Research notes on the method, the pre-registered selection criteria and confidence method, the findings, the contradictions between sources, the gaps, and ten claims for a human to check first.",
      "Sources for three of the site’s framing claims, which the claims register now marks as cited, not verified.",
      "No company or person is named as responsible for any fire or haze. Who caused the fires is recorded as not established for every episode.",
    ],
    aiErrors: [
      "Before any research, the orchestrating agent guessed a journal article identifier from memory; it pointed to an unrelated paper and was not used.",
      "AI fact-checkers found and fixed or flagged 514 problems in the first drafts (4 critical, 97 major), for example school closures stated as done when only announced, an air-quality reading reported without its averaging period, and a newspaper’s own sentence attributed to a government department. A second round found 406 more framing and safety problems (52 major).",
      "One critical error came from the orchestrating agent’s own instructions: it described Singapore’s 2015 enforcement notices as the “first” under the law, which no source says. A checker removed the word.",
      "The orchestrating agent treated drafts as finished when their files appeared, before the last checks had ended, and edited one of them early; it re-checked them once the checks finished.",
      "A final AI review of the assembled dataset, pages and documents reported 237 problems (7 critical, 72 major); AI verifiers upheld all 79 critical and major ones. Among them: search-result descriptions that named Singapore for episodes where it was not affected, short criterion names that said more than the criteria, origin notes that credited agencies with more than they said, confidence ratings applied inconsistently, and a change by the orchestrating agent that dropped human review from the evidence page’s rule for data panels. The critical and major problems were all fixed or recorded as decisions for a human; some minor ones were declined, with reasons.",
    ],
    humanReview:
      "Required. Not yet performed: nothing in this experiment is human checked or human verified.",
    cost: "Not directly measured. The workflow tool reported about 57.3 million sub-agent tokens across four workflows (discovery, deep research, final review and fixes; 184 sub-agents, plus 12 stopped when a workflow was restarted); the session reported no money cost.",
    record: "experiments/002-haze-history.md",
  },
  {
    id: "003",
    name: "Satellite evidence",
    status: "planned",
    question:
      "Can public satellite fire observations be presented so that non-specialists understand what a hotspot does — and does not — show?",
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
