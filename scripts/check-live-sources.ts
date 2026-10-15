/**
 * Check every integrated live source, outside Next.js, and print what came back.
 *
 *   npm run live:check
 *
 * Runs the same loaders the site uses (src/lib/live/loaders.ts): one real
 * request per source, with the same timeouts, validation and failure handling.
 * It prints each source's outcome, times, counts and issues, so a person can
 * see at a glance whether the integrations work and what the site would show.
 *
 * Reads NASA_FIRMS_MAP_KEY and DATA_GOV_SG_API_KEY from the environment, or
 * from .env.local if that file exists (as Next.js does); the values are never
 * printed. Exits with code 1 if any source is unavailable, so it can be used
 * in a scheduled check. It does not change any file.
 *
 * Without a data.gov.sg key, do not run it at the same moment as a build or a
 * serving copy of the site on the same network address: data.gov.sg's keyless
 * limit is 6 calls per 10 seconds, and it does not say how calls are counted.
 */

import {
  loadFirms,
  loadMalaysiaStateForecast,
  loadSingaporePm25,
  loadSingaporePsi,
  loadSingaporeRainfall,
  loadSingaporeWindDirection,
  loadSingaporeWindSpeed,
  type LoaderContext,
} from "../src/lib/live/loaders";
import { classifyFreshness } from "../src/lib/live/freshness";
import { getLiveSource } from "../src/lib/live/registry";
import { summariseDetections } from "../src/lib/live/sources/firms";
import type { ForecastSnapshot, SourceSnapshot } from "../src/lib/live/types";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local: use the shell environment only.
}

const context: LoaderContext = { now: () => new Date(), dataGovSgApiKey: process.env.DATA_GOV_SG_API_KEY };

function freshnessLine(sourceId: string, snapshot: { retrievedAt: string | null; latestObservedAt: string | null }): string {
  const policy = getLiveSource(sourceId).freshness;
  if (!policy) return "no freshness policy";
  const basis = policy.basis === "observedAt" ? snapshot.latestObservedAt : snapshot.retrievedAt;
  if (!basis) return "freshness unknown (nothing to date)";
  const result = classifyFreshness(basis, Date.now(), policy);
  return result ? `${result.state.toUpperCase()} (age ${result.ageMinutes} min, basis ${policy.basis})` : "unreadable basis time";
}

function report(snapshot: SourceSnapshot | ForecastSnapshot, extra: string[] = []): boolean {
  const ok = snapshot.outcome === "ok" || snapshot.outcome === "partial";
  const latest = "latestObservedAt" in snapshot ? snapshot.latestObservedAt : null;
  console.log(`\n■ ${snapshot.sourceId}: ${snapshot.outcome.toUpperCase()}`);
  console.log(`  retrieved      ${snapshot.retrievedAt ?? "not retrieved"}`);
  if ("latestObservedAt" in snapshot) console.log(`  newest data    ${latest ?? "none"}`);
  console.log(`  freshness      ${freshnessLine(snapshot.sourceId, { retrievedAt: snapshot.retrievedAt, latestObservedAt: latest })}`);
  console.log(`  counts         received ${snapshot.counts.received}, accepted ${snapshot.counts.accepted}, rejected ${snapshot.counts.rejected}`);
  for (const request of snapshot.requests) {
    console.log(
      `  request        ${request.label}: HTTP ${request.httpStatus ?? "none"}; server date ${request.serverDate ?? "none"}${request.lastModified ? `; last modified ${request.lastModified}` : ""}${request.failure ? `; FAILED (${request.failure.kind}: ${request.failure.message})` : ""}`,
    );
    console.log(`                 ${request.url}`);
  }
  if (snapshot.failure) console.log(`  failure        ${snapshot.failure.kind}: ${snapshot.failure.message}`);
  for (const line of extra) console.log(`  ${line}`);
  for (const issue of snapshot.issues) console.log(`  issue          ${issue}`);
  return ok;
}

async function main(): Promise<number> {
  const results: boolean[] = [];

  const fire = await loadFirms(context, process.env.NASA_FIRMS_MAP_KEY);
  const fireSummary = fire.outcome === "unavailable" ? null : summariseDetections(fire.observations);
  results.push(
    report(fire, [
      `mode           ${fire.meta.mode}`,
      fireSummary
        ? `detections     ${fireSummary.total} in the map window (${Object.entries(fireSummary.bySatellite)
            .map(([k, v]) => `${k} ${v}`)
            .join(", ")}); ${fire.meta.outsideArea ?? 0} outside it; acquired ${fireSummary.earliest} to ${fireSummary.latest}`
        : "detections     none retrieved",
    ]),
  );

  for (const loader of [loadSingaporePsi, loadSingaporePm25, loadSingaporeWindDirection, loadSingaporeWindSpeed, loadSingaporeRainfall]) {
    const snapshot = await loader(context);
    const values = snapshot.observations.filter((o) => o.value !== null).map((o) => o.value as number);
    results.push(
      report(snapshot, [
        values.length > 0 ? `values         ${values.length} non-null, ${Math.min(...values)} to ${Math.max(...values)}` : "values         none",
      ]),
    );
  }

  const forecast = await loadMalaysiaStateForecast(context);
  results.push(report(forecast, [`forecasts      ${forecast.forecasts.length} for ${forecast.validDate ?? "no date"}`]));

  const failed = results.filter((ok) => !ok).length;
  console.log(`\n${results.length - failed} of ${results.length} sources retrieved.`);
  return failed;
}

main().then(
  (failed) => process.exit(failed > 0 ? 1 : 0),
  (error: unknown) => {
    console.error(error);
    process.exit(2);
  },
);
