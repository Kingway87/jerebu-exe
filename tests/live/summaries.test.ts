import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import { loadSingaporePm25, loadSingaporePsi, loadSingaporeRainfall, loadSingaporeWindSpeed } from "@/lib/live/loaders";
import { summariseDetections } from "@/lib/live/sources/firms";
import {
  fireSummarySentence,
  pm25Summary,
  psiSummary,
  rainfallSummary,
  windSpeedSummary,
} from "@/lib/live/summaries";
import type { SourceSnapshot } from "@/lib/live/types";

const fixture = (name: string) => readFileSync(join(__dirname, "../fixtures/live", name), "utf8");
const serve = (body: string) => ({
  now: () => new Date("2026-10-14T18:20:00Z"),
  fetchImpl: (async () => new Response(body, { status: 200 })) as typeof fetch,
  skipPauses: true,
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
    assert.equal(fireSummarySentence(unavailable, null), null);
  });

  test("zero satellite detections is stated as zero detections, never as zero fires", () => {
    const sentence = fireSummarySentence({ outcome: "ok" }, summariseDetections([]));
    assert.ok(sentence);
    assert.match(sentence.text, /no VIIRS detections/);
    assert.match(sentence.text, /not zero fires/);
  });

  test("no summary names a company, a government or a cause", async () => {
    const sentences = [
      psiSummary(await loadSingaporePsi(serve(fixture("datagovsg-psi.json")))),
      pm25Summary(await loadSingaporePm25(serve(fixture("datagovsg-pm25.json")))),
      fireSummarySentence({ outcome: "ok" }, summariseDetections([])),
    ].map((s) => s?.text ?? "");
    for (const text of sentences) {
      assert.doesNotMatch(text, /\b(caused|because|due to|blame|responsible|company|government)\b/i);
    }
  });
});
