/**
 * The maintainer's review of the evidence on /live and /evidence.
 *
 * HUMAN DECISION: the notice text below is the project maintainer's own
 * wording, supplied on 15 October 2026, and must not be reworded without
 * the maintainer. The record of the review is the maintainer's attestation,
 * entered by Claude Code at the maintainer's instruction: an AI agent never
 * marks anything as human reviewed on its own judgement.
 *
 * A review covers only the version reviewed. Anything substantively changed
 * after `version` is not covered until it is reviewed again.
 */

export interface HumanReview {
  /** Who reviewed: a named person, with their role. */
  by: string;
  /** When, as YYYY-MM-DD. */
  on: string;
  /** What was reviewed, in the maintainer's terms. */
  scope: string;
  /** The version of the site that was reviewed. */
  version: string;
  /** How the review was done, as far as the maintainer recorded it. */
  method: string;
}

export const maintainerReview: HumanReview = {
  by: "Kingway87 (project maintainer)",
  on: "2026-10-15",
  scope: "The evidence presented on /live and /evidence, against JEREBU.EXE’s evidence rules.",
  version: "Branch experiment/003-live-evidence at commit 56d74b1",
  method:
    "Stated by the maintainer in the Experiment 003 session on 15 October 2026. The individual checks made were not itemised.",
};

/** The notice's heading, as the maintainer wrote it. */
export const reviewNoticeHeading = "Human reviewed · Open for contribution";

/**
 * The notice, paragraph by paragraph, exactly as the maintainer wrote it.
 * The paragraph that asks for contributions is rendered with links.
 */
export const reviewNoticeParagraphs: readonly string[] = [
  "The evidence currently presented here has been reviewed by the project’s human maintainer against JEREBU.EXE’s evidence rules.",
  "Review does not mean final or unquestionable.",
  "JEREBU.EXE is an open-source public-interest project. Evidence can change, sources can improve, and interpretations can be challenged.",
  "If you find a better primary source, missing context, conflicting evidence, an error, or a claim that needs stronger qualification, please contribute.",
  "Open an issue, submit a pull request, or propose a correction.",
  "The goal is not to prove a predetermined narrative.",
  "The goal is to make the evidence easier for everyone to inspect.",
];
