"use client";

import {
  classifyFreshness,
  formatAge,
  type FreshnessPolicy,
  type FreshnessState,
} from "@/lib/live/freshness";
import { StatusChip } from "./status-chip";
import { useNow } from "./use-now";

interface FreshnessLabelProps {
  /** ISO time the age is measured from (the policy's basis). */
  basis: string;
  /** What the basis time is, in words: "observed" or "retrieved". */
  basisVerb: string;
  policy: FreshnessPolicy;
  /** The state worked out on the server at retrieval time. Shown until the reader's clock is known. */
  atRetrieval: FreshnessState;
  /**
   * When the data stops describing the present regardless of its age, as for
   * a forecast whose day has ended. From then on the state is "stale".
   */
  expiresAt?: string | null;
  /** What to say once `expiresAt` has passed, e.g. "the day it forecasts has ended". */
  expiredText?: string;
}

/**
 * Freshness status for one source.
 *
 * On the server, and in browsers without JavaScript, it shows the state at
 * the time the data was retrieved, and says so. In the browser it re-checks
 * the age against the reader's clock every 30 seconds, because a cached page
 * can be served long after the data was retrieved.
 */
export function FreshnessLabel({
  basis,
  basisVerb,
  policy,
  atRetrieval,
  expiresAt,
  expiredText = "no longer current",
}: FreshnessLabelProps) {
  const now = useNow();
  const current = now === null ? null : classifyFreshness(basis, now, policy);
  const expiresMs = expiresAt ? Date.parse(expiresAt) : Number.NaN;
  const expired = now !== null && Number.isFinite(expiresMs) && now >= expiresMs;

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <StatusChip status={expired ? "stale" : (current?.state ?? atRetrieval)} />
      <span className="text-sm text-muted">
        {current
          ? `${basisVerb} ${formatAge(current.ageMinutes)} ago`
          : "status when retrieved"}
        {expired ? `; ${expiredText}` : null}
        {current?.inFuture ? " (timestamp is ahead of your clock)" : null}
      </span>
    </span>
  );
}
