/**
 * Core types for the live evidence pipeline (Experiment 003).
 *
 *   SOURCE → FETCH → VALIDATE → NORMALISE → CACHE → DISPLAY
 *
 * Every step is deterministic code. No AI model fetches, validates,
 * normalises or labels any value, and nothing an AI writes can enter these
 * types: an `Observation` is always level "observation", and the separate
 * `Interpretation` type (unused in Experiment 003) keeps any future reading
 * of the data apart from the data itself.
 *
 * Two rules shape every type here:
 *
 * - NO DATA ≠ ZERO. A missing value is `null`, never `0`. A source that could
 *   not be reached produces an "unavailable" snapshot with no observations,
 *   never an empty list that could be read as "nothing happened".
 * - OBSERVATION ≠ ATTRIBUTION. Observations carry where, when, what and how
 *   they were measured. They carry no field for cause, owner or responsibility.
 */

/** Identifier of a source in `data/live-sources.json`. */
export type LiveSourceId = string;

/** Where an observation applies. */
export type ObservationLocation =
  /** A satellite detection: the centre of the pixel that triggered it. */
  | { kind: "pixel"; lat: number; lon: number }
  /** A fixed monitoring or weather station. */
  | { kind: "station"; id: string; name: string; lat: number; lon: number }
  /**
   * A reporting region, such as one of Singapore's five PSI regions. The
   * coordinates are where the source places the region's label, not a
   * station position.
   */
  | { kind: "region"; id: string; name: string; lat: number | null; lon: number | null };

/**
 * Notes about the quality of a single value, taken from the source or added
 * by validation. They never change the value itself.
 */
export type QualityFlag =
  /**
   * Published in real time. The source does not say the value has been
   * quality-controlled, and provides it "as is".
   */
  | "real-time"
  /** Satellite detection confidence class reported by the source. */
  | "confidence-low"
  | "confidence-nominal"
  | "confidence-high"
  /** The observation time is later than the time it was retrieved. */
  | "future-timestamp";

/** One measured or recorded value, as published by its source. */
export interface Observation {
  sourceId: LiveSourceId;
  /** Always "observation". Interpretations use a different type. */
  level: "observation";
  /** Stable machine name of what was measured, e.g. "psi_24h". */
  metric: string;
  /** The published value. `null` when the source gave none. Never `0` for "missing". */
  value: number | null;
  /** Unit as documented by the source, e.g. "µg/m³". */
  unit: string;
  /** When the value applies, ISO 8601 with offset, as published or derived from documented fields. */
  observedAt: string;
  /** Averaging period, when the value is an average, e.g. "24-hour rolling average". */
  averaging?: string;
  location: ObservationLocation;
  qualityFlags: QualityFlag[];
  /** Where in the raw response the value came from. Never contains a credential. */
  rawReference: string;
  /** Other documented fields from the same record, unchanged. */
  attributes?: Record<string, string | number | null>;
}

/** Why a source produced no usable data. */
export type FailureKind =
  /** The credential this source needs is not configured on this deployment. No request was made. */
  | "not-configured"
  /** The source rejected the credential. */
  | "auth"
  /** The source said too many requests were made. */
  | "rate-limited"
  /** The request did not complete in time. */
  | "timeout"
  /** The request could not be made or did not complete (DNS, TLS, connection). */
  | "network"
  /** The source answered with an error status. */
  | "http"
  /** The response could not be read in the documented format. */
  | "parse"
  /** The response was readable but did not match the documented structure. */
  | "validation";

export interface SourceFailure {
  kind: FailureKind;
  /** Plain-language explanation for the page. Never contains a credential. */
  message: string;
  httpStatus?: number;
}

/** One HTTP request made for a snapshot. */
export interface SourceRequest {
  method: "GET";
  /** The URL requested, with any credential replaced by a placeholder. */
  url: string;
  /** What this request was for, e.g. "VIIRS on NOAA-20". */
  label: string;
  /** HTTP status, when a response arrived. */
  httpStatus: number | null;
  /** The responding server's own Date header (ISO 8601), when it sent one. */
  serverDate: string | null;
  /** When the file was last changed, from its Last-Modified header (ISO 8601), when sent. */
  lastModified?: string | null;
  /** Why this request produced nothing usable, if it did not. */
  failure: SourceFailure | null;
}

/** What every retrieval records, whatever kind of data it returns. */
export interface RetrievalRecord {
  sourceId: LiveSourceId;
  outcome: "ok" | "partial" | "unavailable" | "not-configured";
  /** When the requests were made (ISO 8601, UTC). `null` if no request was made. */
  retrievedAt: string | null;
  /** The requests made, with any credential redacted. Empty if none was made. */
  requests: SourceRequest[];
  /** Records in the response, records accepted, records rejected by validation. */
  counts: { received: number; accepted: number; rejected: number };
  /** Validation notes, e.g. why a record was rejected. Plain language. */
  issues: string[];
  /** Why the snapshot is unavailable or not configured. `null` when outcome is "ok" or "partial". */
  failure: SourceFailure | null;
  /** Source-specific facts about the retrieval, e.g. detections outside the map window. */
  meta: Record<string, string | number | null>;
}

/**
 * The result of one attempt to retrieve one source of observations.
 *
 * `outcome` is about retrieval, not about the world: "ok" with zero
 * observations means the source answered and reported nothing for the query
 * (for example, no satellite detections in the area), which is different
 * from "unavailable" (the source could not be read at all). "partial" means
 * some of the source's requests failed: what is shown is incomplete, and the
 * page says which part is missing.
 */
export interface SourceSnapshot extends RetrievalRecord {
  observations: Observation[];
  /**
   * The newest observation time in the response, used to judge freshness.
   * Usually the newest accepted observation. For satellite files it is the
   * newest detection anywhere in the file, including outside the map window,
   * because it shows how current the feed is.
   */
  latestObservedAt: string | null;
}

/**
 * A weather forecast as published by a meteorological agency. A forecast is
 * a prediction, not an observation, so it has its own type and never enters
 * a list of observations.
 */
export interface ForecastRecord {
  sourceId: LiveSourceId;
  level: "forecast";
  /** The day the forecast is for (YYYY-MM-DD, local time). */
  validDate: string;
  location: { kind: "region"; id: string; name: string };
  /** Forecast wording as published, by period of the day. `null` where the source gives none. */
  periods: { morning: string | null; afternoon: string | null; night: string | null };
  summary: string | null;
  /** When in the day the summary applies, as published. */
  summaryWhen: string | null;
  rawReference: string;
}

/** The result of one attempt to retrieve one source of forecasts. */
export interface ForecastSnapshot extends RetrievalRecord {
  forecasts: ForecastRecord[];
  /** The day the forecasts are for (YYYY-MM-DD, local time), or null if none was retrieved. */
  validDate: string | null;
}

/**
 * A reading of one or more observations: an interpretation, the second level
 * of the evidence ladder.
 *
 * Experiment 003 produces none. The type exists so that any future
 * interpretation, whether written by a person, a deterministic rule or an AI
 * model, is stored apart from the observations it is based on, says how it
 * was produced, and says whether a human has reviewed it.
 */
export interface Interpretation {
  level: "interpretation";
  statement: string;
  method: "deterministic-rule" | "human" | "ai-model";
  basedOn: { sourceId: LiveSourceId; metric: string; observedAt: string }[];
  producedAt: string;
  producedBy: string;
  humanReviewed: boolean;
  limitations: string[];
}
