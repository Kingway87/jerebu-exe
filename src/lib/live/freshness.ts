/**
 * Freshness: how old the newest data from a source is, compared with how
 * often that source normally publishes.
 *
 * Environmental data becomes misleading when readers cannot tell how old it
 * is. Every integrated source in `data/live-sources.json` declares a policy
 * with two thresholds, and the reasons for them. The states are:
 *
 *   RECENT   age ≤ recentMaxMinutes                     within the normal update cycle
 *   DELAYED  recentMaxMinutes < age ≤ staleAfterMinutes  later than expected
 *   STALE    age > staleAfterMinutes                    too old to describe current conditions
 *
 * Age is measured from the basis the policy names: the observation time where
 * the source publishes one per reading, or the retrieval time where it does
 * not (MET Malaysia's forecast gives only the day it is for). For satellite
 * files the observation time is the newest detection anywhere in NASA's file,
 * and the thresholds allow for the gap between overpasses, so a feed that has
 * stopped updating shows as delayed, then stale.
 *
 * The functions here are pure. The page computes freshness once on the server,
 * at retrieval time, and again in the reader's browser against the reader's
 * clock, because a cached page can be served long after it was built.
 */

export type FreshnessState = "recent" | "delayed" | "stale";

export interface FreshnessPolicy {
  /** Which time the age is measured from. */
  basis: "observedAt" | "retrievedAt";
  /** Up to and including this age, in minutes, data is RECENT. */
  recentMaxMinutes: number;
  /** Beyond this age, in minutes, data is STALE. In between, it is DELAYED. */
  staleAfterMinutes: number;
}

export interface FreshnessResult {
  state: FreshnessState;
  /** Whole minutes between the basis time and now. Zero if the basis time is in the future. */
  ageMinutes: number;
  /** The basis time is later than now by more than the clock tolerance. */
  inFuture: boolean;
}

/** Clocks on different machines disagree a little. Smaller differences are ignored. */
export const FUTURE_TOLERANCE_MINUTES = 5;

const MINUTE_MS = 60_000;

/** True if a policy's thresholds are usable: positive, whole and in order. */
export function isValidPolicy(policy: FreshnessPolicy): boolean {
  return (
    (policy.basis === "observedAt" || policy.basis === "retrievedAt") &&
    Number.isInteger(policy.recentMaxMinutes) &&
    Number.isInteger(policy.staleAfterMinutes) &&
    policy.recentMaxMinutes > 0 &&
    policy.staleAfterMinutes > policy.recentMaxMinutes
  );
}

/**
 * Classify data whose basis time is `basisIso`, as seen at `nowMs`.
 * Returns `null` if the basis time cannot be read: unknown age is not "recent".
 */
export function classifyFreshness(
  basisIso: string,
  nowMs: number,
  policy: FreshnessPolicy,
): FreshnessResult | null {
  const basisMs = Date.parse(basisIso);
  if (Number.isNaN(basisMs) || !Number.isFinite(nowMs)) return null;

  const ageMs = nowMs - basisMs;
  const inFuture = ageMs < -FUTURE_TOLERANCE_MINUTES * MINUTE_MS;
  const ageMinutes = Math.max(0, Math.floor(ageMs / MINUTE_MS));

  let state: FreshnessState;
  if (ageMinutes <= policy.recentMaxMinutes) state = "recent";
  else if (ageMinutes <= policy.staleAfterMinutes) state = "delayed";
  else state = "stale";

  return { state, ageMinutes, inFuture };
}

/** A whole-minute age in words: "less than a minute", "45 min", "3 h 5 min", "4 days". */
export function formatAge(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 1) return "less than a minute";
  const whole = Math.floor(minutes);
  if (whole < 60) return `${whole} min`;
  const hours = Math.floor(whole / 60);
  const rest = whole % 60;
  if (hours < 48) return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
  return `${Math.floor(hours / 24)} days`;
}

/** A threshold in minutes in words, for documentation: "90 minutes", "6 hours", "2 days". */
export function formatThreshold(minutes: number): string {
  if (minutes % (60 * 24) === 0 && minutes >= 60 * 48) return `${minutes / (60 * 24)} days`;
  if (minutes % 60 === 0) return minutes === 60 ? "1 hour" : `${minutes / 60} hours`;
  return `${minutes} minutes`;
}

/**
 * The basis time for a snapshot under a policy, and its state at retrieval
 * time. `null` when there is nothing to date (for example, no observations).
 */
export function freshnessAtRetrieval(
  snapshot: { retrievedAt: string | null; latestObservedAt: string | null },
  policy: FreshnessPolicy,
): { basis: string; state: FreshnessState } | null {
  const basis = policy.basis === "observedAt" ? snapshot.latestObservedAt : snapshot.retrievedAt;
  if (!basis || !snapshot.retrievedAt) return null;
  const result = classifyFreshness(basis, Date.parse(snapshot.retrievedAt), policy);
  return result ? { basis, state: result.state } : null;
}
