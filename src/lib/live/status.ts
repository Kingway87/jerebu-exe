/**
 * The status shown for each source on the live evidence page.
 *
 * Three statuses describe the age of data that was retrieved (see
 * `freshness.ts`). "Age unknown" describes data that was retrieved but cannot
 * be dated. Three describe why there is no data. None of them says anything
 * about the world: "Unavailable" never means "nothing happened".
 */

import { freshnessAtRetrieval, type FreshnessPolicy, type FreshnessState } from "./freshness";
import type { RetrievalRecord } from "./types";

export type DisplayStatus = FreshnessState | "undated" | "unavailable" | "not-configured" | "not-integrated";

export const displayStatusOrder: readonly DisplayStatus[] = [
  "recent",
  "delayed",
  "stale",
  "undated",
  "unavailable",
  "not-configured",
  "not-integrated",
];

export const displayStatusLabel: Record<DisplayStatus, string> = {
  recent: "Recent",
  delayed: "Delayed",
  stale: "Stale",
  undated: "Age unknown",
  unavailable: "Unavailable",
  "not-configured": "Not configured",
  "not-integrated": "Not integrated",
};

export const displayStatusMeaning: Record<DisplayStatus, string> = {
  recent:
    "Retrieved, and the newest data is within the source’s normal update cycle. Not real time: every source publishes with some delay.",
  delayed:
    "Retrieved, but the newest data is older than the source’s normal update cycle. The source may be late, or this page may not have refreshed.",
  stale:
    "Retrieved, but too old to describe current conditions (or, for a forecast, the day it forecasts has ended). Shown for the record only.",
  undated:
    "Retrieved, but nothing in it shows how old the data is: for example, a satellite file with no detections. It cannot be read as describing current conditions.",
  unavailable:
    "The source could not be retrieved, or its response failed validation. Nothing is shown, and nothing should be inferred from the gap.",
  "not-configured":
    "This copy of the site has no credential for the source, so no request was made. Nothing should be inferred from the gap.",
  "not-integrated":
    "The page does not copy this source’s readings: no documented public data feed was found, or its terms need a human decision first. Where the source is linked, read its readings there.",
};

/** How one retrieval should be labelled, before the reader's browser re-checks its age. */
export type SnapshotStatus =
  | { kind: "unavailable" }
  | { kind: "not-configured" }
  | { kind: "undated" }
  | { kind: "freshness"; basis: string; state: FreshnessState };

/**
 * The status of a retrieval at the time it was made. A retrieval that
 * succeeded but has nothing to date it by is "undated", never "unavailable":
 * the two mean different things on the page.
 */
export function snapshotStatus(
  snapshot: Pick<RetrievalRecord, "outcome" | "retrievedAt"> & { latestObservedAt: string | null },
  policy: FreshnessPolicy | null,
): SnapshotStatus {
  if (snapshot.outcome === "unavailable") return { kind: "unavailable" };
  if (snapshot.outcome === "not-configured") return { kind: "not-configured" };
  const fresh = policy ? freshnessAtRetrieval(snapshot, policy) : null;
  return fresh ? { kind: "freshness", basis: fresh.basis, state: fresh.state } : { kind: "undated" };
}
