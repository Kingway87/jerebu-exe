/**
 * Loader tests: FETCH → VALIDATE → NORMALISE, without a network.
 *
 * A fake `fetch` serves real responses captured from the sources on
 * 2026-10-14 (see tests/fixtures/README.md). The tests check that values pass
 * through unchanged, that gaps stay gaps (null, never zero), that every
 * failure becomes an "unavailable" or "partial" snapshot with a reason, and
 * that a FIRMS key never appears in a snapshot.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import {
  FIRMS_OPEN_FILES,
  FIRMS_REQUEST_GAP_MS,
  FIRMS_TIMEOUT_MS,
  FIRMS_TOTAL_BUDGET_MS,
  MAP_KEY_PLACEHOLDER,
  loadFirms,
  loadSingaporePm25,
  loadSingaporePsi,
  loadSingaporeRainfall,
  loadSingaporeWindDirection,
  loadSingaporeWindSpeed,
  type LoaderContext,
} from "@/lib/live/loaders";
import { firmsTimestamp, summariseDetections } from "@/lib/live/sources/firms";
import type { Observation } from "@/lib/live/types";

const fixture = (name: string) => readFileSync(join(__dirname, "../fixtures/live", name), "utf8");

type Route = { status: number; body: string; contentType?: string } | Error;

/** A fake fetch that answers from a URL → response table and records every URL requested. */
function fakeFetch(routes: (url: string) => Route) {
  const requested: string[] = [];
  const impl = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    requested.push(url);
    const route = routes(url);
    if (route instanceof Error) throw route;
    return new Response(route.body, {
      status: route.status,
      headers: { "content-type": route.contentType ?? "application/json" },
    });
  }) as typeof fetch;
  return { impl, requested };
}

const NOW = new Date("2026-10-14T18:20:00Z");
/** The region or station id of an observation (pixels have none). */
const locationId = (observation: Observation): string | null =>
  "id" in observation.location ? observation.location.id : null;
const context = (impl: typeof fetch): LoaderContext => ({ now: () => NOW, fetchImpl: impl, skipPauses: true });
const ok = (body: string, contentType?: string): Route => ({ status: 200, body, contentType });

describe("data.gov.sg loaders", () => {
  test("PSI: every regional value passes through unchanged, flagged as real-time", async () => {
    const raw = JSON.parse(fixture("datagovsg-psi.json"));
    const { impl } = fakeFetch(() => ok(fixture("datagovsg-psi.json")));
    const snapshot = await loadSingaporePsi(context(impl));

    assert.equal(snapshot.outcome, "ok");
    assert.equal(snapshot.failure, null);
    assert.equal(snapshot.retrievedAt, NOW.toISOString());
    const item = raw.data.items[0];
    const psi = snapshot.observations.filter((o) => o.metric === "psi_24h");
    assert.equal(psi.length, raw.data.regionMetadata.length);
    for (const observation of psi) {
      assert.equal(observation.location.kind, "region");
      assert.equal(observation.value, item.readings.psi_twenty_four_hourly[locationId(observation) ?? ""]);
      assert.equal(observation.observedAt, item.timestamp);
      assert.equal(observation.unit, "index");
      assert.ok(observation.qualityFlags.includes("real-time"));
      assert.equal(observation.level, "observation");
    }
    assert.equal(snapshot.latestObservedAt, item.timestamp);
  });

  test("PM2.5: five 1-hour regional values in µg/m³", async () => {
    const raw = JSON.parse(fixture("datagovsg-pm25.json"));
    const { impl } = fakeFetch(() => ok(fixture("datagovsg-pm25.json")));
    const snapshot = await loadSingaporePm25(context(impl));
    assert.equal(snapshot.outcome, "ok");
    const values = Object.fromEntries(snapshot.observations.map((o) => [locationId(o), o.value]));
    assert.deepEqual(values, raw.data.items[0].readings.pm25_one_hourly);
    assert.ok(snapshot.observations.every((o) => o.unit === "µg/m³" && o.metric === "pm25_1h"));
  });

  test("a region listed without a value becomes null, never zero", async () => {
    const raw = JSON.parse(fixture("datagovsg-pm25.json"));
    delete raw.data.items[0].readings.pm25_one_hourly.west;
    const { impl } = fakeFetch(() => ok(JSON.stringify(raw)));
    const snapshot = await loadSingaporePm25(context(impl));
    assert.equal(snapshot.outcome, "ok");
    const west = snapshot.observations.find((o) => locationId(o) === "west");
    assert.ok(west);
    assert.equal(west.value, null);
    assert.equal(snapshot.counts.accepted, 4);
  });

  test("wind direction: one observation per listed station, gaps as null", async () => {
    const raw = JSON.parse(fixture("datagovsg-wind-direction.json"));
    const { impl } = fakeFetch(() => ok(fixture("datagovsg-wind-direction.json")));
    const snapshot = await loadSingaporeWindDirection(context(impl));
    assert.equal(snapshot.outcome, "ok");
    assert.equal(snapshot.observations.length, raw.data.stations.length);
    const reported = new Map<string, number>(
      raw.data.readings[0].data.map((d: { stationId: string; value: number }) => [d.stationId, d.value]),
    );
    for (const observation of snapshot.observations) {
      const expected = reported.get(locationId(observation) ?? "");
      assert.equal(observation.value, expected === undefined ? null : expected);
      assert.equal(observation.unit, "degrees");
    }
  });

  test("wind speed is read in knots", async () => {
    const { impl } = fakeFetch(() => ok(fixture("datagovsg-wind-speed.json")));
    const snapshot = await loadSingaporeWindSpeed(context(impl));
    assert.equal(snapshot.outcome, "ok");
    assert.ok(snapshot.observations.every((o) => o.unit === "knots"));
  });

  test("rainfall: a reported 0 mm stays 0, because the station reported it", async () => {
    const raw = JSON.parse(fixture("datagovsg-rainfall.json"));
    const { impl } = fakeFetch(() => ok(fixture("datagovsg-rainfall.json")));
    const snapshot = await loadSingaporeRainfall(context(impl));
    assert.equal(snapshot.outcome, "ok");
    const zeros = raw.data.readings[0].data.filter((d: { value: number }) => d.value === 0).length;
    assert.equal(snapshot.observations.filter((o) => o.value === 0).length, zeros);
  });

  test("a unit that differs from the documentation is a validation failure, not a conversion", async () => {
    const raw = JSON.parse(fixture("datagovsg-wind-speed.json"));
    raw.data.readingUnit = "m/s";
    const { impl } = fakeFetch(() => ok(JSON.stringify(raw)));
    const snapshot = await loadSingaporeWindSpeed(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "validation");
    assert.deepEqual(snapshot.observations, []);
  });

  test("an error reported in the response body makes the source unavailable", async () => {
    const { impl } = fakeFetch(() => ok(JSON.stringify({ code: 4, data: {}, errorMsg: "Something went wrong" })));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "validation");
    assert.match(snapshot.failure?.message ?? "", /code 4/);
  });

  test("an empty item list is a failure, not clean air", async () => {
    const raw = JSON.parse(fixture("datagovsg-psi.json"));
    raw.data.items = [];
    const { impl } = fakeFetch(() => ok(JSON.stringify(raw)));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.observations.length, 0);
    assert.equal(snapshot.latestObservedAt, null);
  });

  test("a value outside the plausible range is rejected and counted, not shown", async () => {
    const raw = JSON.parse(fixture("datagovsg-pm25.json"));
    raw.data.items[0].readings.pm25_one_hourly.north = -3;
    const { impl } = fakeFetch(() => ok(JSON.stringify(raw)));
    const snapshot = await loadSingaporePm25(context(impl));
    assert.equal(snapshot.outcome, "ok");
    assert.equal(snapshot.counts.rejected, 1);
    assert.equal(snapshot.observations.find((o) => locationId(o) === "north"), undefined);
    assert.match(snapshot.issues.join(" "), /north/);
  });

  test("a PSI response without its headline PSI values is a failure, even when sub-indices arrived", async () => {
    const raw = JSON.parse(fixture("datagovsg-psi.json"));
    const readings = raw.data.items[0].readings;
    readings.psi_24h_renamed = readings.psi_twenty_four_hourly;
    delete readings.psi_twenty_four_hourly;
    const { impl } = fakeFetch(() => ok(JSON.stringify(raw)));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "validation");
    assert.match(snapshot.failure?.message ?? "", /psi_twenty_four_hourly/);
  });

  test("a reading dated after the retrieval time is shown but not used to judge freshness", async () => {
    const raw = JSON.parse(fixture("datagovsg-psi.json"));
    raw.data.items[0].timestamp = "2026-10-16T03:00:00+08:00";
    const { impl } = fakeFetch(() => ok(JSON.stringify(raw)));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "ok");
    assert.ok(snapshot.observations.every((o) => o.qualityFlags.includes("future-timestamp")));
    assert.equal(snapshot.latestObservedAt, null);
    assert.match(snapshot.issues.join(" "), /after the retrieval time/);
  });

  test("HTTP 429 is reported as rate limiting", async () => {
    const { impl } = fakeFetch(() => ({ status: 429, body: '{"code":429}' }));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "rate-limited");
    assert.equal(snapshot.requests[0].httpStatus, 429);
  });

  test("an HTML error page with status 200 is a parse failure", async () => {
    const { impl } = fakeFetch(() => ok("<html><body>Maintenance</body></html>", "text/html"));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "parse");
  });

  test("a network failure is reported as such", async () => {
    const { impl } = fakeFetch(() => new TypeError("fetch failed"));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "network");
    assert.equal(snapshot.requests[0].httpStatus, null);
  });

  test("a timeout is reported as such", async () => {
    const { impl } = fakeFetch(() => new DOMException("The operation timed out.", "TimeoutError"));
    const snapshot = await loadSingaporePsi(context(impl));
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "timeout");
  });
});

describe("NASA FIRMS loader", () => {
  const [noaa20, noaa21] = FIRMS_OPEN_FILES;

  test("without a key: reads the open files, keeps detections in the map window, counts the rest", async () => {
    const { impl, requested } = fakeFetch((url) =>
      url === noaa20.url ? ok(fixture("firms-noaa20-sea-24h-subset.csv"), "text/csv") : ok(fixture("firms-header-only.csv"), "text/csv"),
    );
    const snapshot = await loadFirms(context(impl), undefined);

    assert.deepEqual(requested.sort(), [noaa20.url, noaa21.url].sort());
    assert.equal(snapshot.outcome, "ok");
    assert.equal(snapshot.meta.mode, "open-files");
    assert.equal(snapshot.counts.received, 20);
    assert.equal(snapshot.counts.accepted, 15);
    assert.equal(snapshot.meta.outsideArea, 5);
    assert.ok(snapshot.observations.every((o) => o.metric === "fire_radiative_power" && o.unit === "MW"));
    assert.ok(snapshot.observations.every((o) => o.location.kind === "pixel"));
    // Freshness is judged from the newest detection anywhere in NASA's file.
    assert.equal(snapshot.latestObservedAt, "2026-10-13T16:01:00Z");
  });

  test("acquisition date and HHMM time become a UTC timestamp", async () => {
    const { impl } = fakeFetch(() => ok(fixture("firms-noaa20-sea-24h-subset.csv"), "text/csv"));
    const snapshot = await loadFirms(context(impl), undefined);
    const first = snapshot.observations[0];
    assert.equal(first.observedAt, "2026-10-13T04:55:00Z");
    assert.equal(first.attributes?.satellite, "N20");
    assert.equal(first.attributes?.instrument, "VIIRS");
  });

  test("a header with no rows is zero detections, which is still a successful retrieval", async () => {
    const { impl } = fakeFetch(() => ok(fixture("firms-header-only.csv"), "text/csv"));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "ok");
    assert.equal(snapshot.counts.accepted, 0);
    assert.equal(snapshot.failure, null);
  });

  test("one satellite file failing makes the snapshot partial and says which data is missing", async () => {
    const { impl } = fakeFetch((url) =>
      url === noaa20.url ? ok(fixture("firms-noaa20-sea-24h-subset.csv"), "text/csv") : { status: 404, body: "Not found" },
    );
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "partial");
    assert.equal(snapshot.counts.accepted, 15);
    assert.match(snapshot.issues.join(" "), /NOAA-21.*missing/);
  });

  test("both files failing makes FIRMS unavailable, never 'no detections'", async () => {
    const { impl } = fakeFetch(() => new TypeError("fetch failed"));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "network");
    assert.deepEqual(snapshot.observations, []);
    assert.equal(snapshot.latestObservedAt, null);
  });

  test("with a key: uses the area API, and the key appears nowhere in the snapshot", async () => {
    const key = "abc123SECRETkey";
    const { impl, requested } = fakeFetch(() => ok(fixture("firms-noaa20-sea-24h-subset.csv"), "text/csv"));
    const snapshot = await loadFirms({ now: () => new Date("2026-10-13T20:00:00Z"), fetchImpl: impl, skipPauses: true }, key);

    assert.equal(snapshot.meta.mode, "area-api");
    assert.ok(requested.every((url) => url.includes(`/api/area/csv/${key}/`)));
    assert.ok(snapshot.requests.every((r) => r.url.includes(MAP_KEY_PLACEHOLDER)));
    assert.equal(JSON.stringify(snapshot).includes(key), false);
  });

  test("with a key: detections older than 24 hours before retrieval are left out and counted", async () => {
    const { impl } = fakeFetch(() => ok(fixture("firms-noaa20-sea-24h-subset.csv"), "text/csv"));
    // The fixture's in-window rows were acquired 2026-10-13 04:55–06:35 UTC.
    const snapshot = await loadFirms({ now: () => new Date("2026-10-14T05:30:00Z"), fetchImpl: impl, skipPauses: true }, "k");
    // 04:55 rows are older than 05:30 the previous day; 06:35 rows are not.
    assert.ok((snapshot.meta.outsideWindow as number) > 0);
    assert.ok(snapshot.observations.every((o) => Date.parse(o.observedAt) >= Date.parse("2026-10-13T05:30:00Z")));
  });

  test("an invalid key is reported as an authentication failure, without the key", async () => {
    const key = "INVALID_TEST_KEY";
    const { impl } = fakeFetch(() => ({ status: 400, body: fixture("firms-area-invalid-key.txt"), contentType: "text/plain" }));
    const snapshot = await loadFirms(context(impl), key);
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "auth");
    assert.match(snapshot.failure?.message ?? "", /MAP_KEY/);
    assert.equal(JSON.stringify(snapshot).includes(key), false);
  });

  test("a file whose rows all fail validation is a failure, never 'no detections'", async () => {
    // A format change: every data row gains a trailing comma, so no row matches the header.
    const [header, ...rows] = fixture("firms-noaa20-sea-24h-subset.csv").trim().split("\n");
    const broken = [header, ...rows.map((row) => `${row},`)].join("\n");
    const { impl } = fakeFetch(() => ok(broken, "text/csv"));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "validation");
    assert.match(snapshot.failure?.message ?? "", /None of the file's 20 rows could be read/);
    assert.equal(snapshot.latestObservedAt, null);
  });

  test("one file with no readable row makes the snapshot partial", async () => {
    const csv = fixture("firms-noaa20-sea-24h-subset.csv");
    const [header, ...rows] = csv.trim().split("\n");
    const hhmm = [header, ...rows.map((row) => row.replace(/,(\d{2})(\d{2}),N20,/, ",$1:$2,N20,"))].join("\n");
    const { impl } = fakeFetch((url) => (url === noaa20.url ? ok(csv, "text/csv") : ok(hhmm, "text/csv")));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "partial");
    assert.match(snapshot.issues.join(" "), /NOAA-21.*could be read/);
  });

  test("a row dated after the retrieval time is kept but does not set the feed's age", async () => {
    const csv = fixture("firms-noaa20-sea-24h-subset.csv").replaceAll("2026-10-13,1601", "2027-01-01,1601");
    const { impl } = fakeFetch(() => ok(csv, "text/csv"));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "ok");
    // The newest real detection, not the 2027 one.
    assert.equal(snapshot.latestObservedAt, "2026-10-13T14:18:00Z");
    assert.match(snapshot.issues.join(" "), /dated after the retrieval time/);
  });

  test("a header after a leading blank line is still read", async () => {
    const { impl } = fakeFetch(() => ok(`\n${fixture("firms-noaa20-sea-24h-subset.csv")}`, "text/csv"));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "ok");
  });

  test("when the two files fail differently, the message gives each reason", async () => {
    const { impl } = fakeFetch((url) => (url === noaa20.url ? { status: 503, body: "Unavailable" } : new TypeError("fetch failed")));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "unavailable");
    assert.match(snapshot.failure?.message ?? "", /VIIRS on NOAA-20: .*HTTP 503/);
    assert.match(snapshot.failure?.message ?? "", /VIIRS on NOAA-21: The source could not be reached\./);
    assert.doesNotMatch(snapshot.failure?.message ?? "", /request list/);
  });

  test("all FIRMS requests together fit inside Next.js's 54-second prerender limit", () => {
    assert.ok(FIRMS_TOTAL_BUDGET_MS + FIRMS_REQUEST_GAP_MS < 54_000);
    assert.ok(FIRMS_TIMEOUT_MS <= FIRMS_TOTAL_BUDGET_MS);
  });

  test("a response that is not a FIRMS CSV is a parse failure", async () => {
    const { impl } = fakeFetch(() => ok("<html>Service temporarily unavailable</html>", "text/html"));
    const snapshot = await loadFirms(context(impl), undefined);
    assert.equal(snapshot.outcome, "unavailable");
    assert.equal(snapshot.failure?.kind, "parse");
  });
});

describe("summariseDetections", () => {
  test("counts by confidence, satellite and day/night, and bins detections into cells", async () => {
    const { impl } = fakeFetch(() => ok(fixture("firms-noaa20-sea-24h-subset.csv"), "text/csv"));
    const snapshot = await loadFirms(
      { now: () => NOW, fetchImpl: impl, skipPauses: true },
      undefined,
    );
    // Both open files return the same fixture here, so every in-window row appears twice.
    const summary = summariseDetections(snapshot.observations);
    assert.equal(summary.total, 30);
    assert.deepEqual(summary.byConfidence, { low: 10, nominal: 10, high: 10, unknown: 0 });
    assert.deepEqual(summary.bySatellite, { N20: 30 });
    assert.deepEqual(summary.byDayNight, { day: 30, night: 0, unknown: 0 });
    assert.equal(summary.earliest, "2026-10-13T04:55:00Z");
    assert.equal(summary.latest, "2026-10-13T06:35:00Z");
    assert.equal(
      summary.cells.reduce((sum, cell) => sum + cell.count, 0),
      30,
    );
    assert.equal(summary.maxFrp, 32.71);
    // A detection at 3.16401°S, 119.49605°E falls in the cell whose south-west corner is 3.2°S, 119.4°E.
    assert.ok(summary.cells.some((cell) => cell.lat === -3.2 && cell.lon === 119.4));
  });

  test("bins each detection into the 0.1° cell that contains it, including at cell edges", () => {
    const at = (lat: number, lon: number): Observation => ({
      sourceId: "nasa-firms",
      level: "observation",
      metric: "fire_radiative_power",
      value: 1,
      unit: "MW",
      observedAt: "2026-10-13T04:55:00Z",
      location: { kind: "pixel", lat, lon },
      qualityFlags: [],
      rawReference: "test",
    });
    const summary = summariseDetections([at(-3.16401, 119.49605), at(-0.1, 100), at(0.05, 103.85), at(0.05, 103.86)]);
    assert.deepEqual(summary.cells, [
      { lon: 119.4, lat: -3.2, count: 1 },
      { lon: 100, lat: -0.1, count: 1 },
      { lon: 103.8, lat: 0, count: 2 },
    ]);
  });

  test("FIRMS times without leading zeros are read as HHMM", () => {
    assert.equal(firmsTimestamp("2026-10-13", "3"), "2026-10-13T00:03:00Z");
    assert.equal(firmsTimestamp("2026-10-13", "130"), "2026-10-13T01:30:00Z");
    assert.equal(firmsTimestamp("2026-10-13", "2400"), null);
    assert.equal(firmsTimestamp("2026-02-31", "1200"), null);
  });

  test("an empty list summarises to zero detections and no cells", () => {
    const summary = summariseDetections([]);
    assert.equal(summary.total, 0);
    assert.deepEqual(summary.cells, []);
    assert.equal(summary.earliest, null);
  });
});
