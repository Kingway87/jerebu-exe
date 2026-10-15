/**
 * Cached snapshots: the CACHE step of the live evidence pipeline.
 *
 * Each function wraps one loader in a `"use cache"` scope with an explicit
 * cache lifetime (profiles defined in `next.config.ts`). The page is therefore
 * still prerendered at build time, as every route on this site must be
 * (`ensureStatic = "navigation"` in the root layout). When the site runs on a
 * Next.js server, a request that arrives after a profile's `revalidate` time
 * is served the cached page while the snapshot is fetched again in the
 * background. On a purely static host the snapshots stay as they were at
 * build time; the page shows their retrieval times, and readers' browsers
 * label them stale as they age.
 *
 * Reading the clock and the FIRMS key happens inside the cached scope, so the
 * retrieval time is the time the request was really made, and the key never
 * becomes part of a cache key or an argument.
 *
 * Unavailable snapshots use a shorter profile so a failed source is retried
 * sooner. Visitors' browsers never contact any of these sources.
 */

import "server-only";

import { cacheLife } from "next/cache";
import {
  loadFirms,
  loadMalaysiaStateForecast,
  loadSingaporePm25,
  loadSingaporePsi,
  loadSingaporeRainfall,
  loadSingaporeWindDirection,
  loadSingaporeWindSpeed,
  type LoaderContext,
} from "./loaders";
import { summariseDetections, type FireSummary } from "./sources/firms";
import type { ForecastSnapshot, SourceSnapshot } from "./types";

/** The real clock, `fetch` and server-side credentials. Never sent to browsers. */
function serverContext(): LoaderContext {
  return { now: () => new Date(), dataGovSgApiKey: process.env.DATA_GOV_SG_API_KEY };
}

/**
 * FIRMS detections, summarised for display. A busy fire season can produce
 * tens of thousands of detections a day, so the cache keeps the retrieval
 * record and a deterministic summary (counts and a density grid), not every
 * detection. The full data stays one link away, at NASA.
 */
export interface FireView {
  snapshot: Omit<SourceSnapshot, "observations">;
  /** `null` when FIRMS could not be read: no summary, not an empty one. */
  summary: FireSummary | null;
}

export async function getFireView(): Promise<FireView> {
  "use cache";
  const { observations, ...snapshot } = await loadFirms(serverContext(), process.env.NASA_FIRMS_MAP_KEY);
  if (snapshot.outcome === "unavailable") cacheLife("liveRetry");
  else cacheLife("liveSatellite");
  return {
    snapshot,
    summary: snapshot.outcome === "unavailable" ? null : summariseDetections(observations),
  };
}

export async function getSingaporePsiSnapshot(): Promise<SourceSnapshot> {
  "use cache";
  const snapshot = await loadSingaporePsi(serverContext());
  if (snapshot.outcome === "unavailable") cacheLife("liveRetry");
  else cacheLife("liveHourly");
  return snapshot;
}

export async function getSingaporePm25Snapshot(): Promise<SourceSnapshot> {
  "use cache";
  const snapshot = await loadSingaporePm25(serverContext());
  if (snapshot.outcome === "unavailable") cacheLife("liveRetry");
  else cacheLife("liveHourly");
  return snapshot;
}

export async function getSingaporeWindDirectionSnapshot(): Promise<SourceSnapshot> {
  "use cache";
  const snapshot = await loadSingaporeWindDirection(serverContext());
  if (snapshot.outcome === "unavailable") cacheLife("liveRetry");
  else cacheLife("liveWeather");
  return snapshot;
}

export async function getSingaporeWindSpeedSnapshot(): Promise<SourceSnapshot> {
  "use cache";
  const snapshot = await loadSingaporeWindSpeed(serverContext());
  if (snapshot.outcome === "unavailable") cacheLife("liveRetry");
  else cacheLife("liveWeather");
  return snapshot;
}

export async function getSingaporeRainfallSnapshot(): Promise<SourceSnapshot> {
  "use cache";
  const snapshot = await loadSingaporeRainfall(serverContext());
  if (snapshot.outcome === "unavailable") cacheLife("liveRetry");
  else cacheLife("liveWeather");
  return snapshot;
}

export async function getMalaysiaForecastSnapshot(): Promise<ForecastSnapshot> {
  "use cache";
  const snapshot = await loadMalaysiaStateForecast(serverContext());
  if (snapshot.outcome === "unavailable") cacheLife("liveRetry");
  else cacheLife("liveForecast");
  return snapshot;
}
