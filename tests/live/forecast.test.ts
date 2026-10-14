import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import { loadMalaysiaStateForecast, malaysiaStateForecastUrl } from "@/lib/live/loaders";
import { documentedMeaning, isHazeTerm, malaysiaDate, normaliseForecasts } from "@/lib/live/sources/datagovmy";

const fixture = readFileSync(join(__dirname, "../fixtures/live/datagovmy-forecast-states.json"), "utf8");
// 02:30 on 15 October 2026 in Malaysia.
const NOW = new Date("2026-10-14T18:30:00Z");

describe("MET Malaysia forecast (data.gov.my)", () => {
  test("uses the calendar date in Malaysia, not UTC", () => {
    assert.equal(malaysiaDate(NOW), "2026-10-15");
    assert.match(malaysiaStateForecastUrl("2026-10-15"), /date_start=2026-10-15@date&date_end=2026-10-15@date$/);
  });

  test("reads every state-level forecast for the day, as forecasts, not observations", async () => {
    const raw = JSON.parse(fixture) as unknown[];
    const fetchImpl = (async () => new Response(fixture, { status: 200 })) as typeof fetch;
    const snapshot = await loadMalaysiaStateForecast({ now: () => NOW, fetchImpl });
    assert.equal(snapshot.outcome, "ok");
    assert.equal(snapshot.validDate, "2026-10-15");
    assert.equal(snapshot.forecasts.length, raw.length);
    assert.ok(snapshot.forecasts.every((f) => f.level === "forecast"));
    assert.ok(!("observations" in snapshot));
  });

  test("keeps the Malay wording exactly as published", async () => {
    const fetchImpl = (async () => new Response(fixture, { status: 200 })) as typeof fetch;
    const snapshot = await loadMalaysiaStateForecast({ now: () => NOW, fetchImpl });
    const raw = JSON.parse(fixture) as { location: { location_id: string }; morning_forecast: string }[];
    for (const forecast of snapshot.forecasts) {
      const row = raw.find((r) => r.location.location_id === forecast.location.id);
      assert.equal(forecast.periods.morning, row?.morning_forecast);
    }
  });

  test("translates only values the documentation lists, and flags the rest", async () => {
    assert.equal(documentedMeaning("Berjerebu"), "Hazy.");
    assert.equal(documentedMeaning("Tiada Hujan"), "No rain.");
    assert.equal(documentedMeaning("Jerebu"), null);
    assert.equal(isHazeTerm("Jerebu"), true);
    assert.equal(isHazeTerm("Berjerebu"), true);
    assert.equal(isHazeTerm("Tiada hujan"), false);

    const result = normaliseForecasts(fixture, { sourceId: "x", validDate: "2026-10-15", endpoint: "e" });
    assert.ok(result.ok);
    assert.match(result.value.issues.join(" "), /not listed in the API documentation/);
  });

  test("a forecast for another day is rejected, and no forecast for today is a failure", () => {
    const result = normaliseForecasts(fixture, { sourceId: "x", validDate: "2026-10-16", endpoint: "e" });
    assert.equal(result.ok, false);
  });

  test("an unreachable API is unavailable, with no forecasts", async () => {
    const fetchImpl = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    const snapshot = await loadMalaysiaStateForecast({ now: () => NOW, fetchImpl });
    assert.equal(snapshot.outcome, "unavailable");
    assert.deepEqual(snapshot.forecasts, []);
    assert.equal(snapshot.validDate, null);
  });

  test("HTTP 429 from the 4-requests-a-minute limit is reported as rate limiting", async () => {
    const fetchImpl = (async () => new Response("Too Many Requests", { status: 429 })) as typeof fetch;
    const snapshot = await loadMalaysiaStateForecast({ now: () => NOW, fetchImpl });
    assert.equal(snapshot.failure?.kind, "rate-limited");
  });
});
