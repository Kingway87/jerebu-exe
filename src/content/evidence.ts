/**
 * The evidence framework: how JEREBU.EXE separates what is seen from what is
 * claimed. This content is methodology, not findings. It makes no factual
 * claims about any event, organisation or government.
 */

export interface EvidenceLevel {
  id: string;
  name: string;
  definition: string;
  example: string;
  requires: string;
}

/** Each level needs more evidence, and more scrutiny, than the one before. */
export const evidenceLadder: readonly EvidenceLevel[] = [
  {
    id: "observation",
    name: "Observation",
    definition: "Something measured or recorded, with a time, a place and a method.",
    example:
      "A satellite instrument records a thermal anomaly — a “hotspot” — at a location and time.",
    requires:
      "A named source, the time and method of measurement, and the known limits of that method.",
  },
  {
    id: "interpretation",
    name: "Interpretation",
    definition: "An analysis of what one or more observations might mean.",
    example:
      "Smoke transport modelling suggests that smoke from one area could have reached another.",
    requires:
      "A stated method, its assumptions, and an honest account of uncertainty and alternative explanations.",
  },
  {
    id: "attribution",
    name: "Attribution",
    definition: "Connecting an event to a specific organisation, person or actor.",
    example:
      "Linking a particular fire to land managed by a particular entity.",
    requires:
      "Additional, independent evidence beyond observation — and careful human review. A hotspot on a map is not enough.",
  },
  {
    id: "legal-responsibility",
    name: "Legal responsibility",
    definition: "A determination made under law.",
    example:
      "A court or authorised body decides, under applicable evidentiary standards, that a party is legally responsible.",
    requires:
      "A legal process. JEREBU.EXE cannot make this determination; it can only report determinations made by those processes, with citations.",
  },
];

export interface ClaimType {
  name: string;
  meaning: string;
}

/** Labels used to describe any statement the project publishes. */
export const claimTypes: readonly ClaimType[] = [
  { name: "Fact", meaning: "Established and supported by a citable, reliable source." },
  { name: "Observation", meaning: "A measurement or record, reported with its source and limits." },
  { name: "Analysis", meaning: "Reasoning from evidence, with its method and uncertainty shown." },
  { name: "Allegation", meaning: "A claim someone has made that has not been established." },
  { name: "Hypothesis", meaning: "A possible explanation that still needs testing." },
  { name: "Legal finding", meaning: "A determination by a court or authorised body, cited to its source." },
];

export interface SafetyRule {
  number: number;
  rule: string;
}

/**
 * Data and claim safety rules, exactly as the project's human founder wrote
 * them in the Experiment 001 brief. Do not reword. They apply to humans and
 * AI alike.
 */
export const safetyRules: readonly SafetyRule[] = [
  {
    number: 1,
    rule: "Never accuse a company, individual or government of causing a particular haze event without sufficient reliable evidence.",
  },
  {
    number: 2,
    rule: "A satellite hotspot alone does not establish ownership, responsibility or wrongdoing.",
  },
  {
    number: 3,
    rule: "Distinguish: fact, observation, analysis, allegation, hypothesis, legal finding.",
  },
  { number: 4, rule: "Cite important factual claims." },
  { number: 5, rule: "Prefer primary sources where appropriate." },
  {
    number: 6,
    rule: "When evidence conflicts, expose uncertainty rather than hiding it.",
  },
  {
    number: 7,
    rule: "AI-generated conclusions require human verification before being presented as established facts.",
  },
  {
    number: 8,
    rule: "Never fabricate environmental statistics, historical events, laws, cases or citations.",
  },
];

/** The two inequalities the whole project is built around. */
export const inequalities = [
  { left: "Hotspot", right: "Responsible company" },
  { left: "Correlation", right: "Legal attribution" },
] as const;

export interface SourceCategory {
  id: string;
  name: string;
  description: string;
}

/** Kinds of public evidence the project expects to investigate. */
export const sourceCategories: readonly SourceCategory[] = [
  {
    id: "satellite-fire-observations",
    name: "Satellite fire observations",
    description: "Thermal anomalies detected from orbit.",
  },
  {
    id: "air-quality",
    name: "Air-quality measurements",
    description: "Readings published by monitoring networks and agencies.",
  },
  {
    id: "meteorology",
    name: "Meteorological information",
    description: "Wind, rainfall and seasonal conditions that move or clear smoke.",
  },
  {
    id: "historical-records",
    name: "Historical records",
    description: "Archived reports and records of past episodes.",
  },
  {
    id: "legislation",
    name: "Legislation",
    description: "Laws and regional agreements, read from official texts.",
  },
  {
    id: "court-records",
    name: "Court records",
    description: "Published judgments and decisions.",
  },
  {
    id: "government-publications",
    name: "Government publications",
    description: "Official statements, advisories and reports.",
  },
  {
    id: "peer-reviewed-research",
    name: "Peer-reviewed research",
    description: "Published scientific and legal scholarship.",
  },
];

export interface PipelineStage {
  name: string;
  note: string;
}

/**
 * The future evidence pipeline. Conceptual only: none of these stages are
 * implemented in V0.
 */
export const pipeline: readonly PipelineStage[] = [
  { name: "Public data", note: "Official and open sources" },
  { name: "Ingestion", note: "Collected with provenance" },
  { name: "Normalisation", note: "Comparable formats and units" },
  { name: "Evidence store", note: "Versioned and citable" },
  { name: "AI analysis", note: "Assists; does not decide" },
  { name: "Source verification", note: "Every claim traced to a source" },
  { name: "Human review", note: "Required before publication" },
  { name: "Public report", note: "With uncertainty shown" },
];
