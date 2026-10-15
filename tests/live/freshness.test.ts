import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  classifyFreshness,
  formatAge,
  formatThreshold,
  isValidPolicy,
  type FreshnessPolicy,
} from "@/lib/live/freshness";

const hourly: FreshnessPolicy = { basis: "observedAt", recentMaxMinutes: 90, staleAfterMinutes: 360 };
const t0 = Date.parse("2026-10-15T06:00:00Z");
const minutes = (n: number) => t0 + n * 60_000;

describe("classifyFreshness", () => {
  test("is recent up to and including the recent threshold", () => {
    assert.equal(classifyFreshness("2026-10-15T06:00:00Z", minutes(0), hourly)?.state, "recent");
    assert.equal(classifyFreshness("2026-10-15T06:00:00Z", minutes(90), hourly)?.state, "recent");
  });

  test("is delayed after the recent threshold, up to and including the stale threshold", () => {
    assert.equal(classifyFreshness("2026-10-15T06:00:00Z", minutes(91), hourly)?.state, "delayed");
    assert.equal(classifyFreshness("2026-10-15T06:00:00Z", minutes(360), hourly)?.state, "delayed");
  });

  test("is stale after the stale threshold", () => {
    assert.equal(classifyFreshness("2026-10-15T06:00:00Z", minutes(361), hourly)?.state, "stale");
    assert.equal(classifyFreshness("2026-10-15T06:00:00Z", minutes(60 * 24 * 30), hourly)?.state, "stale");
  });

  test("respects the time-zone offset in the basis time", () => {
    // 14:00 at UTC+8 is 06:00 UTC.
    const result = classifyFreshness("2026-10-15T14:00:00+08:00", minutes(30), hourly);
    assert.deepEqual(result, { state: "recent", ageMinutes: 30, inFuture: false });
  });

  test("returns null for an unreadable basis time instead of guessing", () => {
    assert.equal(classifyFreshness("not a date", minutes(0), hourly), null);
    assert.equal(classifyFreshness("", minutes(0), hourly), null);
  });

  test("flags basis times ahead of the clock beyond the tolerance, with age zero", () => {
    const slightlyAhead = classifyFreshness("2026-10-15T06:04:00Z", minutes(0), hourly);
    assert.deepEqual(slightlyAhead, { state: "recent", ageMinutes: 0, inFuture: false });

    const wellAhead = classifyFreshness("2026-10-15T07:00:00Z", minutes(0), hourly);
    assert.deepEqual(wellAhead, { state: "recent", ageMinutes: 0, inFuture: true });
  });
});

describe("isValidPolicy", () => {
  test("accepts ordered, positive, whole thresholds", () => {
    assert.equal(isValidPolicy(hourly), true);
  });

  test("rejects thresholds that are out of order, zero, negative or fractional", () => {
    assert.equal(isValidPolicy({ ...hourly, staleAfterMinutes: 90 }), false);
    assert.equal(isValidPolicy({ ...hourly, recentMaxMinutes: 0 }), false);
    assert.equal(isValidPolicy({ ...hourly, recentMaxMinutes: -5 }), false);
    assert.equal(isValidPolicy({ ...hourly, recentMaxMinutes: 1.5 }), false);
  });
});

describe("formatAge", () => {
  test("uses minutes, then hours and minutes, then days", () => {
    assert.equal(formatAge(0), "less than a minute");
    assert.equal(formatAge(45), "45 min");
    assert.equal(formatAge(60), "1 h");
    assert.equal(formatAge(185), "3 h 5 min");
    assert.equal(formatAge(60 * 47 + 59), "47 h 59 min");
    assert.equal(formatAge(60 * 48), "2 days");
  });
});

describe("formatThreshold", () => {
  test("reads naturally", () => {
    assert.equal(formatThreshold(90), "90 minutes");
    assert.equal(formatThreshold(60), "1 hour");
    assert.equal(formatThreshold(360), "6 hours");
    assert.equal(formatThreshold(60 * 24 * 2), "2 days");
  });
});
