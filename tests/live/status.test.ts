import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { FreshnessPolicy } from "@/lib/live/freshness";
import { displayStatusLabel, displayStatusMeaning, displayStatusOrder, snapshotStatus } from "@/lib/live/status";

const policy: FreshnessPolicy = { basis: "observedAt", recentMaxMinutes: 30, staleAfterMinutes: 180 };
const retrievedAt = "2026-10-14T18:20:00Z";

describe("snapshotStatus", () => {
  test("a failed retrieval is unavailable, or not configured, whatever its times", () => {
    assert.deepEqual(snapshotStatus({ outcome: "unavailable", retrievedAt, latestObservedAt: null }, policy), {
      kind: "unavailable",
    });
    assert.deepEqual(snapshotStatus({ outcome: "not-configured", retrievedAt: null, latestObservedAt: null }, policy), {
      kind: "not-configured",
    });
  });

  test("a successful retrieval with nothing to date it by is 'age unknown', never 'unavailable'", () => {
    assert.deepEqual(snapshotStatus({ outcome: "ok", retrievedAt, latestObservedAt: null }, policy), { kind: "undated" });
    assert.deepEqual(snapshotStatus({ outcome: "partial", retrievedAt, latestObservedAt: "not a time" }, policy), {
      kind: "undated",
    });
  });

  test("a datable retrieval gets its freshness state at the time of retrieval", () => {
    assert.deepEqual(snapshotStatus({ outcome: "ok", retrievedAt, latestObservedAt: "2026-10-14T18:00:00Z" }, policy), {
      kind: "freshness",
      basis: "2026-10-14T18:00:00Z",
      state: "recent",
    });
    assert.equal(
      (snapshotStatus({ outcome: "ok", retrievedAt, latestObservedAt: "2026-10-14T12:00:00Z" }, policy) as { state: string }).state,
      "stale",
    );
  });

  test("every status has a label and a meaning for the key on the page", () => {
    for (const status of displayStatusOrder) {
      assert.ok(displayStatusLabel[status].length > 0, status);
      assert.ok(displayStatusMeaning[status].length > 20, status);
    }
  });
});
