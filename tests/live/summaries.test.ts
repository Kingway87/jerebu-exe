import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import type { FreshnessPolicy } from "@/lib/live/freshness";
import {
  loadFirms,
  loadSingaporePm25,
  loadSingaporePsi,
  loadSingaporeRainfall,
  loadSingaporeWindSpeed,
} from "@/lib/live/loaders";
import { summariseDetections } from "@/lib/live/sources/firms";
import {
  fireSummarySentence,
  fireZeroIsReported,
  pm25Summary,
  psiSummary,
  rainfallSummary,
  windSpeedSummary,
} from "@/lib/live/summaries";
import type { SourceRequest, SourceSnapshot } from "@/lib/live/types";

const fixture = (name: string) => readFileSync(join(__dirname, "../fixtures/live", name), "utf8");
const serve = (body: string) => ({
  now: () => new Date("2026-10-14T18:20:00Z"),
  fetchImpl: (async () => new Response(body, { status: 200 })) as typeof fetch,
  skipPauses: true,
});

/** The FIRMS freshness policy from the registry (16 h recent, 30 h stale). */
const firmsPolicy: FreshnessPolicy = { basis: "observedAt", recentMaxMinutes: 960, staleAfterMinutes: 1800 };

/** A FIRMS retrieval record: complete, current (newest detection about 4 hours old) and with nothing rejected. */
function fireSnapshot(overrides: Partial<Pick<SourceSnapshot, "outcome" | "latestObservedAt" | "counts" | "requests">> = {}) {
  return {
    outcome: "ok" as SourceSnapshot["outcome"],
    retrievedAt: "2026-10-14T18:20:00Z",
    latestObservedAt: "2026-10-14T14:42:00Z" as string | null,
    counts: { received: 12, accepted: 0, rejected: 0 },
    requests: [] as SourceRequest[],
    ...overrides,
  };
}

const failedRequest = (label: string): SourceRequest => ({
  method: "GET",
  url: "https://example.org/file.csv",
  label,
  httpStatus: 404,
  serverDate: null,
  failure: { kind: "http", message: "The source answered with an error (HTTP 404).", httpStatus: 404 },
});

const unavailable: SourceSnapshot = {
  sourceId: "x",
  outcome: "unavailable",
  retrievedAt: "2026-10-14T18:20:00Z",
  requests: [],
  observations: [],
  latestObservedAt: null,
  counts: { received: 0, accepted: 0, rejected: 0 },
  issues: [],
  failure: { kind: "network", message: "The source could not be reached." },
  meta: {},
};

describe("observation summaries", () => {
  test("PSI: restates the lowest and highest published regional values, with the reading time", async () => {
    const raw = JSON.parse(fixture("datagovsg-psi.json"));
    const values: Record<string, number> = raw.data.items[0].readings.psi_twenty_four_hourly;
    const snapshot = await loadSingaporePsi(serve(fixture("datagovsg-psi.json")));
    const summary = psiSummary(snapshot);
    assert.ok(summary);
    const min = Math.min(...Object.values(values));
    const max = Math.max(...Object.values(values));
    assert.match(summary.text, new RegExp(`from ${min} `));
    assert.match(summary.text, new RegExp(`to ${max} `));
    assert.match(summary.text, /UTC\+8/);
  });

  test("PM2.5 states its unit", async () => {
    const snapshot = await loadSingaporePm25(serve(fixture("datagovsg-pm25.json")));
    assert.match(pm25Summary(snapshot)?.text ?? "", /µg\/m³/);
  });

  test("wind speed and rainfall restate station readings", async () => {
    const wind = await loadSingaporeWindSpeed(serve(fixture("datagovsg-wind-speed.json")));
    assert.match(windSpeedSummary(wind)?.text ?? "", /knots/);
    const rain = await loadSingaporeRainfall(serve(fixture("datagovsg-rainfall.json")));
    assert.match(rainfallSummary(rain)?.text ?? "", /rain gauges/);
  });

  test("an unavailable source produces no sentence, rather than a sentence about nothing", () => {
    assert.equal(psiSummary(unavailable), null);
    assert.equal(pm25Summary(unavailable), null);
    assert.equal(windSpeedSummary(unavailable), null);
    assert.equal(rainfallSummary(unavailable), null);
    assert.equal(fireSummarySentence(unavailable, null, firmsPolicy), null);
  });

  test("zero satellite detections is stated as zero detections, never as zero fires", () => {
    const sentence = fireSummarySentence(fireSnapshot(), summariseDetections([]), firmsPolicy);
    assert.ok(sentence);
    assert.match(sentence.text, /no VIIRS detections/);
    assert.match(sentence.text, /not zero fires/);
  });

  test("zero is reported as NASA's zero only for a complete, current, fully readable retrieval", () => {
    assert.equal(fireZeroIsReported(fireSnapshot(), firmsPolicy), true);
    // Nothing dates the files (for example, both header-only): the feed may have stopped.
    assert.equal(fireZeroIsReported(fireSnapshot({ latestObservedAt: null }), firmsPolicy), false);
    // The newest detection is two days old: the feed is not current.
    assert.equal(fireZeroIsReported(fireSnapshot({ latestObservedAt: "2026-10-12T18:20:00Z" }), firmsPolicy), false);
    // Some rows could not be read.
    assert.equal(fireZeroIsReported(fireSnapshot({ counts: { received: 12, accepted: 0, rejected: 3 } }), firmsPolicy), false);
    // One satellite's file is missing.
    assert.equal(fireZeroIsReported(fireSnapshot({ outcome: "partial" }), firmsPolicy), false);

    const sentence = fireSummarySentence(fireSnapshot({ latestObservedAt: null }), summariseDetections([]), firmsPolicy);
    assert.match(sentence?.text ?? "", /not a report of zero detections/);
    assert.doesNotMatch(sentence?.text ?? "", /NASA FIRMS reported no/);
  });

  test("a partial retrieval says which data is missing and that the count is incomplete", async () => {
    const fire = await loadFirms(serve(fixture("firms-noaa20-sea-24h-subset.csv")), undefined);
    const sentence = fireSummarySentence(
      fireSnapshot({ outcome: "partial", requests: [failedRequest("VIIRS on NOAA-21")] }),
      summariseDetections(fire.observations),
      firmsPolicy,
    );
    assert.match(sentence?.text ?? "", /VIIRS on NOAA-21 could not be retrieved, so this count is incomplete/);
  });

  test("rainfall is described as the 5-minute totals for the reading time, without assuming the interval", async () => {
    const rain = await loadSingaporeRainfall(serve(fixture("datagovsg-rainfall.json")));
    assert.match(rainfallSummary(rain)?.text ?? "", /^In the 5-minute rainfall totals for /);
  });

  test("no summary names a company, a government or a cause", async () => {
    const fire = await loadFirms(serve(fixture("firms-noaa20-sea-24h-subset.csv")), undefined);
    const wetRaw = JSON.parse(fixture("datagovsg-rainfall.json"));
    wetRaw.data.readings[0].data[0].value = 1.2;
    const sentences = [
      psiSummary(await loadSingaporePsi(serve(fixture("datagovsg-psi.json")))),
      pm25Summary(await loadSingaporePm25(serve(fixture("datagovsg-pm25.json")))),
      windSpeedSummary(await loadSingaporeWindSpeed(serve(fixture("datagovsg-wind-speed.json")))),
      rainfallSummary(await loadSingaporeRainfall(serve(fixture("datagovsg-rainfall.json")))),
      rainfallSummary(await loadSingaporeRainfall(serve(JSON.stringify(wetRaw)))),
      fireSummarySentence(fireSnapshot(), summariseDetections(fire.observations), firmsPolicy),
      fireSummarySentence(
        fireSnapshot({ outcome: "partial", requests: [failedRequest("VIIRS on NOAA-21")] }),
        summariseDetections(fire.observations),
        firmsPolicy,
      ),
      fireSummarySentence(fireSnapshot(), summariseDetections([]), firmsPolicy),
      fireSummarySentence(fireSnapshot({ latestObservedAt: null }), summariseDetections([]), firmsPolicy),
    ].map((s) => s?.text ?? "");
    assert.equal(sentences.filter((text) => text === "").length, 0, "every sentence form was produced");
    assert.match(sentences[4], /1 of the/);
    for (const text of sentences) {
      assert.doesNotMatch(text, /\b(caused|causes|because|due to|blame|responsible|company|companies|government|polluter)\b/i);
    }
  });
});
