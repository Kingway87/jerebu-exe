/**
 * The status shown for each source on the live evidence page.
 *
 * Three statuses describe the age of data that was retrieved (see
 * `freshness.ts`). Three describe why there is no data. None of them says
 * anything about the world: "Unavailable" never means "nothing happened".
 */

import type { FreshnessState } from "./freshness";

export type DisplayStatus = FreshnessState | "unavailable" | "not-configured" | "not-integrated";

export const displayStatusOrder: readonly DisplayStatus[] = [
  "recent",
  "delayed",
  "stale",
  "unavailable",
  "not-configured",
  "not-integrated",
];

export const displayStatusLabel: Record<DisplayStatus, string> = {
  recent: "Recent",
  delayed: "Delayed",
  stale: "Stale",
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
    "Retrieved, but too old to describe current conditions. Shown for the record only.",
  unavailable:
    "The source could not be retrieved, or its response failed validation. Nothing is shown, and nothing should be inferred from the gap.",
  "not-configured":
    "This copy of the site has no credential for the source, so no request was made. Nothing should be inferred from the gap.",
  "not-integrated":
    "The page does not copy this source’s readings: no documented public data feed was found, or its terms need a human decision first. Where the source is linked, read its readings there.",
};
