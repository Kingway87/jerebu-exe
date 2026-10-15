/** Shared result types for source adapters. */

import type { Observation } from "../types";

/** The outcome of reading one response: a value, or why it could not be read. */
export type ParseResult<T> = { ok: true; value: T } | { ok: false; kind: "parse" | "validation"; message: string };

/** Observations from one response, with the bookkeeping the page shows. */
export interface Normalised {
  observations: Observation[];
  /** Values or records present in the response. */
  received: number;
  /** Values or records rejected by validation (counted, explained, never shown). */
  rejected: number;
  issues: string[];
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
