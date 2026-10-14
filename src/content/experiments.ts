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
      "A list of candidate public data sources, located by web search and marked as not yet verified or integrated.",
      "Repository documentation: README, contributing guide, code of conduct, security policy, methodology, data sources, AI transparency policy, roadmap and this experiment’s record.",
      "No live data, no database, no accounts, no tracking and no forms.",
    ],
    aiErrors: [
      "Drafted a homepage line predicting that the haze “will be back” — an unsupported claim. Rewritten before review.",
      "The source-search agents overstated some details, such as a misspelt organisation name and contradictory dataset dates. A second, sceptical agent caught 14 such overclaims, and they were corrected.",
      "The orchestrating agent miscounted its own source review (it reported 17 sources kept with caveats; the true number was 20). Another agent caught the error by recounting the raw data.",
      "Several layout problems — misaligned labels, doubled rules, a navigation bar that wrapped on phones — were found in screenshot review and fixed.",
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
