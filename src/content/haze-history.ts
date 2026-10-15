/**
 * Haze history (Experiment 002): types, validation and helpers for the
 * dataset in data/haze-events.json.
 *
 * The JSON file is the single source of truth. The /timeline page is
 * generated from it, never written separately. This module checks the file
 * when the site is built: if any claim has no source, a reference points at a
 * missing source, a date is malformed, or a company-style name appears in
 * public text, `next build` fails with a list of every problem.
 *
 * Nothing in this file states a fact about haze. The facts, and the sources
 * they rest on, live in the JSON file.
 */

import raw from "../../data/haze-events.json";

// ── Vocabularies ─────────────────────────────────────────────────────────

/** The six claim labels from docs/METHODOLOGY.md, section 3. */
export const claimLabels = [
  "fact",
  "observation",
  "analysis",
  "allegation",
  "hypothesis",
  "legal-finding",
] as const;
export type ClaimLabel = (typeof claimLabels)[number];

export const claimLabelName: Record<ClaimLabel, string> = {
  fact: "Fact",
  observation: "Observation",
  analysis: "Analysis",
  allegation: "Allegation",
  hypothesis: "Hypothesis",
  "legal-finding": "Legal finding",
};

/**
 * Source types, in the order of the Experiment 002 source hierarchy:
 * primary government sources first, reputable reporting last. "reference"
 * covers curated secondary references, such as a national library's
 * encyclopaedia articles.
 */
export const sourceTypes = [
  "government",
  "legal",
  "intergovernmental",
  "scientific-agency",
  "peer-reviewed",
  "news",
  "reference",
] as const;
export type SourceType = (typeof sourceTypes)[number];

export const sourceTypeName: Record<SourceType, string> = {
  government: "Government",
  legal: "Legal text",
  intergovernmental: "Intergovernmental",
  "scientific-agency": "Scientific agency",
  "peer-reviewed": "Peer-reviewed",
  news: "News report",
  reference: "Reference work",
};

/**
 * How the AI agent read a source.
 * - downloaded: the page or PDF was downloaded and its text extracted, so
 *   every quote could be matched against it by a script.
 * - web-fetch: read through a page-reading tool that summarises; quotes from
 *   it could not be matched by script.
 * - archive-*: the same, but from a copy in the Internet Archive.
 */
export const accessMethods = [
  "downloaded",
  "web-fetch",
  "archive-downloaded",
  "archive-web-fetch",
] as const;
export type AccessMethod = (typeof accessMethods)[number];

/** Whether a quote was matched, by script, against the downloaded text. */
export const quoteChecks = ["verbatim", "not-machine-checked"] as const;
export type QuoteCheck = (typeof quoteChecks)[number];

/**
 * Review stages for research content, from the founder's Experiment 002
 * brief. Each stage includes the ones before it. Only a named human can move
 * content to "human-checked" or "human-verified".
 */
export const reviewStages = [
  "ai-generated",
  "source-attached",
  "human-checked",
  "human-verified",
] as const;
export type ReviewStage = (typeof reviewStages)[number];

export const reviewStageName: Record<ReviewStage, string> = {
  "ai-generated": "AI generated",
  "source-attached": "Source attached",
  "human-checked": "Human checked",
  "human-verified": "Human verified",
};

/**
 * The pre-registered selection criteria. An episode is included when A and at
 * least one of B1–B3 are met. Their wording lives in the dataset's meta.
 */
export const selectionCriteria = ["A", "B1", "B2", "B3"] as const;
export type SelectionCriterion = (typeof selectionCriteria)[number];

/**
 * Short names for the criteria, taken from each criterion's own wording so
 * that they claim no more than it does. The full wording is in the dataset.
 */
export const criterionName: Record<SelectionCriterion, string> = {
  A: "Described as transboundary",
  B1: "Unhealthy air",
  B2: "Extraordinary public measures",
  B3: "Described as major",
};

export const confidenceLevels = ["high", "medium", "low"] as const;
export type ConfidenceLevel = (typeof confidenceLevels)[number];

export const confidenceName: Record<ConfidenceLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

/**
 * Kinds of milestone. They are kept apart on purpose: a regional agreement is
 * not legislation, legislation is not enforcement, and enforcement is not a
 * legal outcome.
 */
export const milestoneKinds = [
  "regional-agreement",
  "ratification",
  "entry-into-force",
  "legislation",
  "policy",
  "institutional",
  "enforcement",
  "legal-outcome",
  "diplomatic",
  "measurement-change",
] as const;
export type MilestoneKind = (typeof milestoneKinds)[number];

export const milestoneKindName: Record<MilestoneKind, string> = {
  "regional-agreement": "Regional agreement",
  ratification: "Ratification",
  "entry-into-force": "Entry into force",
  legislation: "Legislation",
  policy: "Policy",
  institutional: "Institution",
  enforcement: "Enforcement",
  "legal-outcome": "Legal outcome",
  diplomatic: "Diplomatic",
  "measurement-change": "Measurement change",
};

/**
 * Milestones are grouped as the Experiment 002 brief lists them: regional
 * (ASEAN) agreements and institutions, then each country, then changes to how
 * air quality is measured. Each group has its own page.
 */
export const milestoneGroups = ["regional", "singapore", "malaysia", "indonesia", "measurement"] as const;
export type MilestoneGroup = (typeof milestoneGroups)[number];

export const milestoneGroupInfo: Record<MilestoneGroup, { title: string; intro: string }> = {
  regional: {
    title: "Regional (ASEAN)",
    intro: "Regional agreements, their ratification and entry into force, and ASEAN institutions and plans on transboundary haze.",
  },
  singapore: {
    title: "Singapore",
    intro: "Singapore's laws, policies, institutions and enforcement on transboundary haze, and related exchanges with Indonesia.",
  },
  malaysia: {
    title: "Malaysia",
    intro: "Malaysia's laws, policies, institutions and enforcement on haze and open burning.",
  },
  indonesia: {
    title: "Indonesia",
    intro: "Indonesia's laws, policies and institutions on fires and peatland, enforcement actions and court outcomes.",
  },
  measurement: {
    title: "How haze is measured",
    intro: "Changes to how Singapore and Malaysia measure and report air quality, which is why readings from different years cannot always be compared.",
  },
};

export const jurisdictions = ["MY", "SG", "ID", "BN", "TH", "PH", "ASEAN"] as const;
export type Jurisdiction = (typeof jurisdictions)[number];

export const jurisdictionName: Record<Jurisdiction, string> = {
  MY: "Malaysia",
  SG: "Singapore",
  ID: "Indonesia",
  BN: "Brunei",
  TH: "Thailand",
  PH: "Philippines",
  ASEAN: "ASEAN",
};

// ── Types ────────────────────────────────────────────────────────────────

export interface SourceRef {
  /** Id of an entry in `sources`. */
  source: string;
  /** The exact passage relied on, copied from the source. */
  quote: string;
  /** Page, section, paragraph or table, where known. */
  pinpoint?: string;
  /** Language of the passage, where it differs from the source's (BCP 47 tag). */
  language?: string;
  check: QuoteCheck;
}

export interface Claim {
  id: string;
  text: string;
  label: ClaimLabel;
  refs: SourceRef[];
  /** Context a reader needs, such as which index a reading uses. */
  note?: string;
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  author?: string;
  /** YYYY, YYYY-MM or YYYY-MM-DD as stated by the source, or "undated". */
  published: string;
  url: string;
  /** A copy in a public web archive, where one already existed. */
  archivedUrl?: string;
  /** The address actually read, if it differs from `url`. */
  readFrom?: string;
  /** YYYY-MM-DD. */
  accessed: string;
  accessMethod: AccessMethod;
  type: SourceType;
  /** BCP 47 language tag of the text that was read, e.g. "en", "ms", "id". */
  language: string;
  access?: "open" | "paywalled" | "partial";
  doi?: string;
  note?: string;
}

export interface Period {
  /** YYYY, YYYY-MM or YYYY-MM-DD. */
  start: string;
  end: string;
  /** How the period is shown, e.g. "June 2013". */
  label: string;
  refs: SourceRef[];
  note?: string;
}

export interface CountryRecord {
  impact: Claim[];
  airQuality: Claim[];
  responses: Claim[];
}

export interface Contradiction {
  text: string;
  /** Ids of the sources that disagree. */
  sources: string[];
}

export interface HumanReview {
  by: string;
  date: string;
  note?: string;
}

export interface ReviewState {
  stage: ReviewStage;
  humanChecked: HumanReview | null;
  humanVerified: HumanReview | null;
}

export interface Confidence {
  level: ConfidenceLevel;
  rationale: string;
}

/**
 * Attribution status, as the Experiment 002 brief requires. Origin: whether
 * the bodies quoted agree on where the smoke came from ("assessed") or
 * publicly disagree ("disputed"). Responsibility: this record does not
 * establish who caused the fires, so "not-established" is the only value the
 * build accepts. Allowing another would take a code change, which a human
 * reviews (docs/METHODOLOGY.md, section 8).
 */
export const originStatuses = ["assessed", "disputed"] as const;
export type OriginStatus = (typeof originStatuses)[number];
export const responsibilityStatuses = ["not-established"] as const;
export type ResponsibilityStatus = (typeof responsibilityStatuses)[number];

export const originStatusName: Record<OriginStatus, string> = {
  assessed: "Agency assessment",
  disputed: "Disputed",
};

export const responsibilityStatusName: Record<ResponsibilityStatus, string> = {
  "not-established": "Not established",
};

export interface Attribution {
  origin: OriginStatus;
  responsibility: ResponsibilityStatus;
  note: string;
}

/** Why an episode is included: each criterion met, and the claims that show it. */
export interface Selection {
  criteria: { criterion: SelectionCriterion; claims: string[] }[];
  note: string;
}

export interface HazeEvent {
  id: string;
  title: string;
  /** True if the episode was still under way when the research was done. */
  ongoing: boolean;
  period: Period;
  jurisdictions: Jurisdiction[];
  summary: Claim[];
  malaysia: CountryRecord;
  singapore: CountryRecord;
  health: Claim[];
  regionalContext: Claim[];
  diplomaticResponse: Claim[];
  policyDevelopments: Claim[];
  legalDevelopments: Claim[];
  aftermath: Claim[];
  /** Every source cited anywhere in this event. Checked against the claims. */
  sources: string[];
  selection: Selection;
  attribution: Attribution;
  confidence: Confidence;
  contradictions: Contradiction[];
  evidenceGaps: string[];
  unresolvedQuestions: string[];
  relatedMilestones: string[];
  review: ReviewState;
}

export interface Milestone {
  id: string;
  /** YYYY, YYYY-MM or YYYY-MM-DD. */
  date: string;
  kind: MilestoneKind;
  group: MilestoneGroup;
  jurisdictions: Jurisdiction[];
  title: string;
  claims: Claim[];
  relatedEvents: string[];
  review: ReviewState;
}

export interface ExcludedPeriod {
  id: string;
  /** e.g. "2010" or "February–March 2014". */
  period: string;
  /** Why it is not in the timeline, in terms of the selection criteria. */
  reason: string;
  /** Any factual statements about the period, each sourced. */
  claims: Claim[];
}

export interface DatasetMeta {
  title: string;
  description: string;
  experiment: string;
  studyPeriod: { start: number; end: number };
  primaryJurisdictions: Jurisdiction[];
  /** The criteria every included episode had to meet, as written before research began. */
  selectionCriteria: {
    /** YYYY-MM-DD. */
    written: string;
    note: string;
    definitions: { id: SelectionCriterion; text: string }[];
  };
  /** How confidence levels were assigned, as written before research began. */
  confidenceMethod: {
    /** YYYY-MM-DD. */
    written: string;
    question: string;
    note: string;
    definitions: { level: ConfidenceLevel; text: string }[];
  };
  compiledBy: string;
  compiled: string;
  review: ReviewState;
  notes: string[];
}

export interface HazeDataset {
  $schema?: string;
  schemaVersion: string;
  meta: DatasetMeta;
  sources: Source[];
  events: HazeEvent[];
  milestones: Milestone[];
  excluded: ExcludedPeriod[];
}

// ── Validation ───────────────────────────────────────────────────────────

const DATE = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
const DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\/\S+$/;

/**
 * Company-style names must not appear in public text without human review
 * (docs/METHODOLOGY.md, section 8). This is a coarse guard, not a guarantee.
 */
const COMPANY_PATTERNS: readonly RegExp[] = [
  /\bPT\.? [A-Z]/,
  /\bSdn\.? Bhd\b/i,
  /\bBhd\b/,
  /\bBerhad\b/,
  /\bTbk\b/,
  /\bPte\.? Ltd\b/i,
  /\b(Ltd|Inc|Corp|LLC|PLC)\b\.?/,
];

type Rec = Record<string, unknown>;

class Problems {
  readonly list: string[] = [];
  private readonly seen = new Set<string>();
  add(where: string, message: string) {
    const line = `${where}: ${message}`;
    if (this.seen.has(line)) return;
    this.seen.add(line);
    this.list.push(line);
  }
}

/** True for a real calendar date, e.g. not 1997-02-31. Partial dates pass. */
export function isRealDate(date: string): boolean {
  if (date.length !== 10) return true;
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** A BCP 47 language tag such as "en", "ms" or "id". */
const LANGUAGE_TAG = /^[a-z]{2,3}(-[A-Za-z0-9]+)*$/;

/** Fields that hold addresses or identifiers, not readable text. */
const NOT_TEXT = new Set(["url", "archivedUrl", "readFrom", "doi", "id", "source", "$schema", "sources", "claims"]);

/**
 * Runs the company-name check on every string in the file except addresses
 * and identifiers, so that no field shown on the site can carry one.
 */
function checkAllText(p: Problems, where: string, value: unknown) {
  if (typeof value === "string") {
    checkCompanyNames(p, where, value);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => checkAllText(p, `${where}[${i}]`, item));
  } else if (isRec(value)) {
    for (const [key, item] of Object.entries(value)) {
      if (NOT_TEXT.has(key) && (typeof item === "string" || (Array.isArray(item) && item.every((x) => typeof x === "string")))) continue;
      checkAllText(p, `${where}.${key}`, item);
    }
  }
}

/** Reviewer names that are not a person: AI agents may never record a human review. */
export const NOT_A_PERSON = /\b(claude|anthropic|gpt|openai|gemini|copilot|ai agent|bot)\b/i;

function isRec(value: unknown): value is Rec {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(p: Problems, where: string, obj: Rec, key: string, optional = false): string {
  const value = obj[key];
  if (value === undefined && optional) return "";
  if (typeof value !== "string" || value.trim() === "") {
    p.add(where, `"${key}" must be a non-empty string`);
    return "";
  }
  return value;
}

function arr(p: Problems, where: string, obj: Rec, key: string): unknown[] {
  const value = obj[key];
  if (!Array.isArray(value)) {
    p.add(where, `"${key}" must be an array`);
    return [];
  }
  return value;
}

function oneOf<T extends string>(
  p: Problems,
  where: string,
  value: unknown,
  allowed: readonly T[],
  key: string,
): value is T {
  if (typeof value !== "string" || !(allowed as readonly string[]).includes(value)) {
    p.add(where, `"${key}" must be one of ${allowed.join(", ")} (got ${JSON.stringify(value)})`);
    return false;
  }
  return true;
}

function checkCompanyNames(p: Problems, where: string, text: string) {
  for (const pattern of COMPANY_PATTERNS) {
    if (pattern.test(text)) {
      p.add(where, `possible company name (${pattern}) in public text; naming needs human review`);
      return;
    }
  }
}

function dateValue(date: string, end = false): string {
  // Compare partial dates by padding: a start "1997-07" is 1997-07-01, an end
  // "1997-11" is 1997-11-31 (only ever compared, never displayed).
  if (date.length === 4) return end ? `${date}-12-31` : `${date}-01-01`;
  if (date.length === 7) return end ? `${date}-31` : `${date}-01`;
  return date;
}

class Validator {
  readonly p = new Problems();
  readonly ids = new Set<string>();
  readonly sourceIds = new Set<string>();
  readonly citedSources = new Set<string>();

  uniqueId(where: string, id: string) {
    if (!ID.test(id)) this.p.add(where, `id "${id}" must be lowercase kebab-case`);
    if (this.ids.has(id)) this.p.add(where, `duplicate id "${id}"`);
    this.ids.add(id);
  }

  review(where: string, value: unknown) {
    if (!isRec(value)) {
      this.p.add(where, `"review" must be an object`);
      return;
    }
    if (!oneOf(this.p, where, value.stage, reviewStages, "review.stage")) return;
    for (const key of ["humanChecked", "humanVerified"] as const) {
      const r = value[key];
      if (r === null) continue;
      if (!isRec(r)) {
        this.p.add(where, `"review.${key}" must be null or an object`);
        continue;
      }
      const by = str(this.p, `${where}.review.${key}`, r, "by");
      if (by && NOT_A_PERSON.test(by)) {
        this.p.add(where, `"review.${key}.by" must name a person; an AI agent cannot record a human review`);
      }
      const date = str(this.p, `${where}.review.${key}`, r, "date");
      if (date && (!DAY.test(date) || !isRealDate(date))) this.p.add(where, `"review.${key}.date" must be a real YYYY-MM-DD date`);
    }
    // Each stage includes the ones before it, and records no stage above it.
    const level = reviewStages.indexOf(value.stage);
    if (level >= 2 && !value.humanChecked) {
      this.p.add(where, `stage "${value.stage}" needs review.humanChecked (who and when)`);
    }
    if (level >= 3 && !value.humanVerified) {
      this.p.add(where, `stage "human-verified" needs review.humanVerified (who and when)`);
    }
    if (level < 2 && value.humanChecked) this.p.add(where, `review.humanChecked is set but the stage is "${value.stage}"`);
    if (level < 3 && value.humanVerified) this.p.add(where, `review.humanVerified is set but the stage is "${value.stage}"`);
  }

  refs(where: string, value: unknown, cited: Set<string>) {
    if (!Array.isArray(value) || value.length === 0) {
      this.p.add(where, "needs at least one source reference (no source, no claim)");
      return;
    }
    value.forEach((ref, i) => {
      const at = `${where}.refs[${i}]`;
      if (!isRec(ref)) {
        this.p.add(at, "must be an object");
        return;
      }
      const source = str(this.p, at, ref, "source");
      if (source && !this.sourceIds.has(source)) this.p.add(at, `unknown source "${source}"`);
      if (source) {
        cited.add(source);
        this.citedSources.add(source);
      }
      const quote = str(this.p, at, ref, "quote");
      if (quote.length > 600) this.p.add(at, "quote is longer than 600 characters");
      if (quote) checkCompanyNames(this.p, at, quote);
      str(this.p, at, ref, "pinpoint", true);
      const language = str(this.p, at, ref, "language", true);
      if (language && !LANGUAGE_TAG.test(language)) this.p.add(at, `"language" must be a language tag such as "en"`);
      oneOf(this.p, at, ref.check, quoteChecks, "check");
    });
  }

  /** Checks a list of claims; adds each claim's id to `ids` when given. */
  claims(where: string, value: unknown, cited: Set<string>, ids?: Set<string>) {
    if (!Array.isArray(value)) {
      this.p.add(where, "must be an array of claims");
      return;
    }
    value.forEach((claim, i) => {
      const at = `${where}[${i}]`;
      if (!isRec(claim)) {
        this.p.add(at, "must be an object");
        return;
      }
      const id = str(this.p, at, claim, "id");
      if (id) {
        this.uniqueId(at, id);
        ids?.add(id);
      }
      const text = str(this.p, at, claim, "text");
      if (text) checkCompanyNames(this.p, `${at} (${id})`, text);
      oneOf(this.p, `${at} (${id})`, claim.label, claimLabels, "label");
      this.refs(`${at} (${id})`, claim.refs, cited);
      if (typeof claim.note === "string") checkCompanyNames(this.p, `${at} (${id}).note`, claim.note);
    });
  }

  /** The compilation date: no date in the dataset may be later. */
  compiled = "";

  date(where: string, obj: Rec, key: string) {
    const value = str(this.p, where, obj, key);
    if (value && (!DATE.test(value) || !isRealDate(value))) {
      this.p.add(where, `"${key}" must be a real date written YYYY, YYYY-MM or YYYY-MM-DD`);
    } else if (value && this.compiled && dateValue(value) > this.compiled) {
      this.p.add(where, `"${key}" (${value}) is after the compilation date ${this.compiled}`);
    }
    return value;
  }
}

/**
 * Checks the dataset and returns it typed. Throws an error that lists every
 * problem found, so a broken dataset cannot reach the site.
 */
export function parseHazeDataset(input: unknown): HazeDataset {
  const v = new Validator();
  const p = v.p;
  if (!isRec(input)) throw new Error("Haze dataset: the file must contain a JSON object.");

  str(p, "dataset", input, "schemaVersion");
  const meta = isRec(input.meta) ? input.meta : {};
  if (!isRec(input.meta)) p.add("dataset", `"meta" must be an object`);
  str(p, "meta", meta, "title");
  str(p, "meta", meta, "compiledBy");
  if (str(p, "meta", meta, "compiled") && !DAY.test(String(meta.compiled))) {
    p.add("meta", `"compiled" must be YYYY-MM-DD`);
  }
  v.review("meta", meta.review);
  v.compiled = typeof meta.compiled === "string" ? meta.compiled : "";
  const period = isRec(meta.studyPeriod) ? meta.studyPeriod : {};
  const first = typeof period.start === "number" ? period.start : NaN;
  const last = typeof period.end === "number" ? period.end : NaN;
  if (!Number.isInteger(first) || !Number.isInteger(last) || first > last) {
    p.add("meta", `"studyPeriod" must have integer start <= end`);
  }
  if (!isRec(meta.confidenceMethod)) {
    p.add("meta", `"confidenceMethod" must be an object`);
  } else {
    const cm = meta.confidenceMethod;
    const written = str(p, "meta.confidenceMethod", cm, "written");
    if (written && !DAY.test(written)) p.add("meta.confidenceMethod", `"written" must be YYYY-MM-DD`);
    str(p, "meta.confidenceMethod", cm, "question");
    str(p, "meta.confidenceMethod", cm, "note");
    const levels = arr(p, "meta.confidenceMethod", cm, "definitions")
      .filter(isRec)
      .map((d) => {
        str(p, `meta.confidenceMethod (${String(d.level)})`, d, "text");
        return d.level;
      });
    for (const level of confidenceLevels) {
      if (levels.filter((l) => l === level).length !== 1) {
        p.add("meta.confidenceMethod", `level "${level}" must be defined exactly once`);
      }
    }
  }
  if (!isRec(meta.selectionCriteria)) {
    p.add("meta", `"selectionCriteria" must be an object`);
  } else {
    const sc = meta.selectionCriteria;
    const written = str(p, "meta.selectionCriteria", sc, "written");
    if (written && !DAY.test(written)) p.add("meta.selectionCriteria", `"written" must be YYYY-MM-DD`);
    str(p, "meta.selectionCriteria", sc, "note");
    const defined = arr(p, "meta.selectionCriteria", sc, "definitions")
      .filter(isRec)
      .map((d) => {
        str(p, `meta.selectionCriteria (${String(d.id)})`, d, "text");
        return d.id;
      });
    for (const c of selectionCriteria) {
      if (defined.filter((id) => id === c).length !== 1) {
        p.add("meta.selectionCriteria", `criterion "${c}" must be defined exactly once`);
      }
    }
  }

  // Sources first, so references can be resolved.
  const sources = arr(p, "dataset", input, "sources");
  sources.forEach((s, i) => {
    const at = `sources[${i}]`;
    if (!isRec(s)) {
      p.add(at, "must be an object");
      return;
    }
    const id = str(p, at, s, "id");
    if (id) {
      v.uniqueId(at, id);
      v.sourceIds.add(id);
    }
    const title = str(p, `${at} (${id})`, s, "title");
    if (title) checkCompanyNames(p, `${at} (${id}).title`, title);
    str(p, `${at} (${id})`, s, "publisher");
    const published = str(p, `${at} (${id})`, s, "published");
    if (published && published !== "undated" && (!DATE.test(published) || !isRealDate(published))) {
      p.add(`${at} (${id})`, `"published" must be a real date written YYYY, YYYY-MM or YYYY-MM-DD, or "undated"`);
    } else if (published && published !== "undated" && v.compiled && dateValue(published) > v.compiled) {
      p.add(`${at} (${id})`, `"published" (${published}) is after the compilation date`);
    }
    for (const key of ["url", "archivedUrl", "readFrom"]) {
      const value = s[key];
      if (value === undefined && key !== "url") continue;
      if (typeof value !== "string" || !URL_RE.test(value)) p.add(`${at} (${id})`, `"${key}" must be an http(s) URL`);
    }
    const accessed = str(p, `${at} (${id})`, s, "accessed");
    if (accessed && (!DAY.test(accessed) || !isRealDate(accessed))) {
      p.add(`${at} (${id})`, `"accessed" must be a real YYYY-MM-DD date`);
    } else if (accessed && v.compiled && accessed > v.compiled) {
      p.add(`${at} (${id})`, `"accessed" (${accessed}) is after the compilation date`);
    }
    oneOf(p, `${at} (${id})`, s.accessMethod, accessMethods, "accessMethod");
    oneOf(p, `${at} (${id})`, s.type, sourceTypes, "type");
    str(p, `${at} (${id})`, s, "language");
    if (s.access !== undefined) oneOf(p, `${at} (${id})`, s.access, ["open", "paywalled", "partial"] as const, "access");
  });

  // Events.
  const events = arr(p, "dataset", input, "events");
  const eventIds = new Set<string>();
  for (const e of events) if (isRec(e) && typeof e.id === "string") eventIds.add(e.id);
  const milestones = arr(p, "dataset", input, "milestones");
  const milestoneIds = new Set<string>();
  for (const m of milestones) if (isRec(m) && typeof m.id === "string") milestoneIds.add(m.id);

  events.forEach((e, i) => {
    const at = `events[${i}]`;
    if (!isRec(e)) {
      p.add(at, "must be an object");
      return;
    }
    const id = str(p, at, e, "id");
    const where = `event ${id || i}`;
    if (id) v.uniqueId(where, id);
    const title = str(p, where, e, "title");
    if (title) checkCompanyNames(p, `${where}.title`, title);
    if (typeof e.ongoing !== "boolean") p.add(where, `"ongoing" must be true or false`);
    const cited = new Set<string>();
    const claimIds = new Set<string>();

    if (!isRec(e.period)) {
      p.add(where, `"period" must be an object`);
    } else {
      const start = v.date(`${where}.period`, e.period, "start");
      const end = v.date(`${where}.period`, e.period, "end");
      const label = str(p, `${where}.period`, e.period, "label");
      if (label) checkCompanyNames(p, `${where}.period.label`, label);
      if (typeof e.period.note === "string") checkCompanyNames(p, `${where}.period.note`, e.period.note);
      v.refs(`${where}.period`, e.period.refs, cited);
      if (start && end && dateValue(start) > dateValue(end, true)) {
        p.add(`${where}.period`, "start is after end");
      }
      const year = Number(start.slice(0, 4));
      if (start && (year < first || year > last)) p.add(`${where}.period`, `starts outside the study period`);
    }

    const codes = arr(p, where, e, "jurisdictions");
    if (codes.length === 0) p.add(where, "needs at least one jurisdiction");
    codes.forEach((c) => oneOf(p, where, c, jurisdictions, "jurisdictions[]"));

    v.claims(`${where}.summary`, e.summary, cited, claimIds);
    if (!Array.isArray(e.summary) || e.summary.length === 0) p.add(where, "needs at least one summary claim");
    for (const country of ["malaysia", "singapore"] as const) {
      const record = e[country];
      if (!isRec(record)) {
        p.add(where, `"${country}" must be an object`);
        continue;
      }
      for (const key of ["impact", "airQuality", "responses"] as const) {
        v.claims(`${where}.${country}.${key}`, record[key], cited, claimIds);
      }
    }
    for (const key of [
      "health",
      "regionalContext",
      "diplomaticResponse",
      "policyDevelopments",
      "legalDevelopments",
      "aftermath",
    ] as const) {
      v.claims(`${where}.${key}`, e[key], cited, claimIds);
    }

    // Selection: criterion A and at least one of B1–B3, each shown by claims
    // in this event.
    if (!isRec(e.selection)) {
      p.add(where, `"selection" must be an object`);
    } else {
      const met = new Set<string>();
      arr(p, `${where}.selection`, e.selection, "criteria").forEach((c, j) => {
        const at = `${where}.selection.criteria[${j}]`;
        if (!isRec(c)) {
          p.add(at, "must be an object");
          return;
        }
        if (oneOf(p, at, c.criterion, selectionCriteria, "criterion")) {
          if (met.has(c.criterion)) p.add(at, `criterion "${c.criterion}" is listed twice`);
          met.add(c.criterion);
        }
        const ids = arr(p, at, c, "claims");
        if (ids.length === 0) p.add(at, "must cite at least one claim");
        if (new Set(ids).size !== ids.length) p.add(at, "lists a claim more than once");
        ids.forEach((id) => {
          if (typeof id !== "string" || !claimIds.has(id)) {
            p.add(at, `claim ${JSON.stringify(id)} is not a claim in this event`);
          }
        });
      });
      if (!met.has("A")) p.add(`${where}.selection`, "criterion A is not shown");
      if (!["B1", "B2", "B3"].some((c) => met.has(c))) {
        p.add(`${where}.selection`, "none of B1, B2 or B3 is shown");
      }
      const note = str(p, `${where}.selection`, e.selection, "note");
      if (note) checkCompanyNames(p, `${where}.selection.note`, note);
    }

    if (!isRec(e.attribution)) {
      p.add(where, `"attribution" must be an object`);
    } else {
      oneOf(p, `${where}.attribution`, e.attribution.origin, originStatuses, "origin");
      oneOf(p, `${where}.attribution`, e.attribution.responsibility, responsibilityStatuses, "responsibility");
      const note = str(p, `${where}.attribution`, e.attribution, "note");
      if (note) checkCompanyNames(p, `${where}.attribution.note`, note);
    }

    if (!isRec(e.confidence)) {
      p.add(where, `"confidence" must be an object`);
    } else {
      oneOf(p, `${where}.confidence`, e.confidence.level, confidenceLevels, "level");
      const rationale = str(p, `${where}.confidence`, e.confidence, "rationale");
      if (rationale) checkCompanyNames(p, `${where}.confidence.rationale`, rationale);
    }
    arr(p, where, e, "contradictions").forEach((c, j) => {
      const cat = `${where}.contradictions[${j}]`;
      if (!isRec(c)) {
        p.add(cat, "must be an object");
        return;
      }
      const text = str(p, cat, c, "text");
      if (text) checkCompanyNames(p, cat, text);
      const ids = arr(p, cat, c, "sources");
      if (new Set(ids).size < 2) p.add(cat, "must name at least two different sources that disagree");
      ids.forEach((s) => {
        if (typeof s !== "string" || !v.sourceIds.has(s)) p.add(cat, `unknown source ${JSON.stringify(s)}`);
        else {
          cited.add(s);
          v.citedSources.add(s);
        }
      });
    });

    // `sources` must list exactly the sources the event cites, in its claims,
    // its period or its contradictions.
    const listed = arr(p, where, e, "sources").filter((s): s is string => typeof s === "string");
    const listedSet = new Set(listed);
    if (listedSet.size !== listed.length) p.add(where, `"sources" has duplicates`);
    for (const s of cited) if (!listedSet.has(s)) p.add(where, `"sources" is missing "${s}", which the event cites`);
    for (const s of listedSet) if (!cited.has(s)) p.add(where, `"sources" lists "${s}", which the event never cites`);
    for (const key of ["evidenceGaps", "unresolvedQuestions"] as const) {
      const items = arr(p, where, e, key);
      if (new Set(items).size !== items.length) p.add(where, `"${key}" has duplicates`);
      items.forEach((q, j) => {
        if (typeof q !== "string" || !q.trim()) p.add(`${where}.${key}[${j}]`, "must be a non-empty string");
        else checkCompanyNames(p, `${where}.${key}[${j}]`, q);
      });
    }
    // An ongoing episode runs to the compilation date and no further.
    if (e.ongoing === true && isRec(e.period) && e.period.end !== v.compiled) {
      p.add(where, `an ongoing episode's period must end on the compilation date (${v.compiled})`);
    }
    arr(p, where, e, "relatedMilestones").forEach((m) => {
      if (typeof m !== "string" || !milestoneIds.has(m)) p.add(where, `unknown milestone ${JSON.stringify(m)}`);
    });
    v.review(where, e.review);
  });

  milestones.forEach((m, i) => {
    const at = `milestones[${i}]`;
    if (!isRec(m)) {
      p.add(at, "must be an object");
      return;
    }
    const id = str(p, at, m, "id");
    const where = `milestone ${id || i}`;
    if (id) v.uniqueId(where, id);
    const date = v.date(where, m, "date");
    const year = Number(date.slice(0, 4));
    // Milestones may predate the study period when they explain it (e.g. the
    // first regional plan), but not by more than a few years.
    if (date && (year < first - 5 || year > last)) p.add(where, "date is outside the range covered");
    oneOf(p, where, m.kind, milestoneKinds, "kind");
    oneOf(p, where, m.group, milestoneGroups, "group");
    const codes = arr(p, where, m, "jurisdictions");
    if (codes.length === 0) p.add(where, "needs at least one jurisdiction");
    codes.forEach((c) => oneOf(p, where, c, jurisdictions, "jurisdictions[]"));
    const title = str(p, where, m, "title");
    if (title) checkCompanyNames(p, `${where}.title`, title);
    v.claims(`${where}.claims`, m.claims, new Set());
    if (!Array.isArray(m.claims) || m.claims.length === 0) p.add(where, "needs at least one claim");
    arr(p, where, m, "relatedEvents").forEach((ev) => {
      if (typeof ev !== "string" || !eventIds.has(ev)) p.add(where, `unknown event ${JSON.stringify(ev)}`);
    });
    v.review(where, m.review);
  });

  arr(p, "dataset", input, "excluded").forEach((x, i) => {
    const at = `excluded[${i}]`;
    if (!isRec(x)) {
      p.add(at, "must be an object");
      return;
    }
    const id = str(p, at, x, "id");
    const where = `excluded ${id || i}`;
    if (id) v.uniqueId(where, id);
    str(p, where, x, "period");
    const reason = str(p, where, x, "reason");
    if (reason) checkCompanyNames(p, `${where}.reason`, reason);
    v.claims(`${where}.claims`, x.claims, new Set());
  });

  for (const id of v.sourceIds) {
    if (!v.citedSources.has(id)) p.add("sources", `"${id}" is never cited; remove it or cite it`);
  }

  // Every text field the site can show, not only the ones checked above.
  checkAllText(p, "dataset", input);

  if (p.list.length > 0) {
    throw new Error(
      `Haze dataset (data/haze-events.json) failed validation with ${p.list.length} problem(s):\n- ` +
        p.list.join("\n- "),
    );
  }
  return input as unknown as HazeDataset;
}

// ── The dataset, checked at build time ──────────────────────────────────

export const hazeHistory: HazeDataset = parseHazeDataset(raw);

const byStart = (a: HazeEvent, b: HazeEvent) =>
  dateValue(a.period.start).localeCompare(dateValue(b.period.start));
const byDate = (a: Milestone, b: Milestone) => dateValue(a.date).localeCompare(dateValue(b.date));

export const hazeEvents: readonly HazeEvent[] = [...hazeHistory.events].sort(byStart);
export const hazeMilestones: readonly Milestone[] = [...hazeHistory.milestones].sort(byDate);
export const excludedPeriods: readonly ExcludedPeriod[] = hazeHistory.excluded;

const sourceMap = new Map(hazeHistory.sources.map((s) => [s.id, s]));

export function getSource(id: string): Source {
  const source = sourceMap.get(id);
  if (!source) throw new Error(`Unknown source "${id}".`);
  return source;
}

export function getMilestone(id: string): Milestone | undefined {
  return hazeHistory.milestones.find((m) => m.id === id);
}

export function getEvent(id: string): HazeEvent | undefined {
  return hazeHistory.events.find((e) => e.id === id);
}

/** An event's claims grouped as the timeline shows them, in reading order. */
export function eventSections(event: HazeEvent): { title: string; claims: Claim[] }[] {
  return [
    { title: "What happened", claims: event.summary },
    { title: "Malaysia: impact", claims: event.malaysia.impact },
    { title: "Malaysia: air quality", claims: event.malaysia.airQuality },
    { title: "Malaysia: government response", claims: event.malaysia.responses },
    { title: "Singapore: impact", claims: event.singapore.impact },
    { title: "Singapore: air quality", claims: event.singapore.airQuality },
    { title: "Singapore: government response", claims: event.singapore.responses },
    { title: "Health evidence", claims: event.health },
    { title: "Regional context", claims: event.regionalContext },
    { title: "Response between governments", claims: event.diplomaticResponse },
    { title: "What changed: policy", claims: event.policyDevelopments },
    { title: "What changed: law and courts", claims: event.legalDevelopments },
    { title: "What changed: aftermath", claims: event.aftermath },
  ];
}

/** Every claim in an event, in reading order. */
export function eventClaims(event: HazeEvent): Claim[] {
  return eventSections(event).flatMap((s) => s.claims);
}

/** Every claim in the dataset. */
export function allClaims(): Claim[] {
  return [
    ...hazeHistory.events.flatMap(eventClaims),
    ...hazeHistory.milestones.flatMap((m) => m.claims),
    ...hazeHistory.excluded.flatMap((x) => x.claims),
  ];
}

let claimIndex: Map<string, Claim> | undefined;

/** A claim anywhere in the dataset, by id. */
export function getClaim(id: string): Claim {
  claimIndex ??= new Map(allClaims().map((c) => [c.id, c]));
  const claim = claimIndex.get(id);
  if (!claim) throw new Error(`Unknown dataset claim "${id}".`);
  return claim;
}

/** The years of the study period, each with what the dataset holds for it. */
export function yearIndex(): { year: number; events: HazeEvent[]; milestones: Milestone[] }[] {
  const { start, end } = hazeHistory.meta.studyPeriod;
  const years = [];
  for (let year = start; year <= end; year++) {
    years.push({
      year,
      events: hazeEvents.filter((e) => {
        const from = Number(e.period.start.slice(0, 4));
        const to = Number(e.period.end.slice(0, 4));
        return year >= from && year <= to;
      }),
      milestones: hazeMilestones.filter((m) => Number(m.date.slice(0, 4)) === year),
    });
  }
  return years;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2013-06-21" → "21 June 2013"; "2013-06" → "June 2013"; "2013" → "2013". */
export function formatDate(date: string): string {
  if (date === "undated") return "Undated";
  const [y, m, d] = date.split("-");
  if (!m) return y;
  const month = MONTHS[Number(m) - 1];
  return d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`;
}
