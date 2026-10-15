/**
 * Loaders: FETCH → VALIDATE → NORMALISE for each integrated source, ending in
 * a `SourceSnapshot`.
 *
 * Loaders never throw. Whatever goes wrong becomes an "unavailable" (or
 * "partial") snapshot that says what failed, so the page can say so instead
 * of showing nothing, or worse, showing zero.
 *
 * Everything a loader needs from the outside world (the clock, `fetch`, the
 * FIRMS key) is passed in, so the tests can run every path without a network
 * or a credential. `snapshots.ts` wraps these loaders in Next.js caching and
 * supplies the real clock, `fetch` and environment.
 */

import { fetchText, serverDateIssue } from "./http";
import { malaysiaDate, normaliseForecasts } from "./sources/datagovmy";
import { normaliseFirmsCsv, type FirmsNormalised } from "./sources/firms";
import {
  normaliseRegionalAir,
  normaliseStationReadings,
  parseEnvelope,
  type Envelope,
  type RegionalMetricSpec,
} from "./sources/datagovsg";
import type { Normalised, ParseResult } from "./sources/common";
import { STUDY_AREA } from "./study-area";
import type { ForecastSnapshot, Observation, SourceFailure, SourceRequest, SourceSnapshot } from "./types";

export interface LoaderContext {
  /** The clock. Read once per snapshot, as the retrieval time. */
  now: () => Date;
  /** Defaults to the global `fetch`. */
  fetchImpl?: typeof fetch;
  /**
   * Optional data.gov.sg API key, sent as `x-api-key`. Keyless access works,
   * but data.gov.sg describes it as for testing and recommends a key for
   * production use (higher rate limits).
   */
  dataGovSgApiKey?: string;
  /** Tests only: skip the polite pauses between requests to the same host. */
  skipPauses?: boolean;
}

/* ─────────────────────────────── Shared helpers ─────────────────────────────── */

/** The newest observation time among real values. Future-dated values are not used to judge freshness. */
function latestObservedAt(observations: readonly Observation[]): string | null {
  let latest: string | null = null;
  let latestMs = -Infinity;
  for (const observation of observations) {
    if (observation.value === null || observation.qualityFlags.includes("future-timestamp")) continue;
    const ms = Date.parse(observation.observedAt);
    if (ms > latestMs) {
      latestMs = ms;
      latest = observation.observedAt;
    }
  }
  return latest;
}

function unavailable(
  sourceId: string,
  retrievedAt: string,
  requests: SourceRequest[],
  failure: SourceFailure,
  issues: string[] = [],
  meta: SourceSnapshot["meta"] = {},
): SourceSnapshot {
  return {
    sourceId,
    outcome: "unavailable",
    retrievedAt,
    requests,
    observations: [],
    latestObservedAt: null,
    counts: { received: 0, accepted: 0, rejected: 0 },
    issues,
    failure,
    meta,
  };
}

/* ───────────────────────────────── data.gov.sg ───────────────────────────────── */

/** Base URL of the data.gov.sg real-time APIs (v2). */
export const DATAGOVSG_REALTIME_BASE = "https://api-open.data.gov.sg/v2/real-time/api";

const DATAGOVSG_TIMEOUT_MS = 15_000;
const DATAGOVSG_MAX_BYTES = 2_000_000;

type EnvelopeNormaliser = (
  envelope: Envelope,
  retrievedAt: string,
) => ParseResult<Normalised & { sourceUpdatedAt?: string | null }>;

async function loadDataGovSg(
  context: LoaderContext,
  sourceId: string,
  path: string,
  label: string,
  normalise: EnvelopeNormaliser,
): Promise<SourceSnapshot> {
  const retrievedAt = context.now().toISOString();
  const url = `${DATAGOVSG_REALTIME_BASE}${path}`;
  const apiKey = context.dataGovSgApiKey?.trim();
  const response = await fetchText(url, {
    timeoutMs: DATAGOVSG_TIMEOUT_MS,
    maxBytes: DATAGOVSG_MAX_BYTES,
    headers: { accept: "application/json", ...(apiKey ? { "x-api-key": apiKey } : {}) },
    fetchImpl: context.fetchImpl,
  });

  const request: SourceRequest = {
    method: "GET",
    url,
    label,
    httpStatus: response.ok ? response.status : (response.status ?? null),
    serverDate: response.serverDate ?? null,
    failure: null,
  };

  if (!response.ok) {
    request.failure = response.failure;
    return unavailable(sourceId, retrievedAt, [request], response.failure);
  }
  const staleCopy = serverDateIssue(label, response.serverDate, retrievedAt);

  const envelope = parseEnvelope(response.text);
  if (!envelope.ok) {
    const failure: SourceFailure = { kind: envelope.kind, message: envelope.message };
    request.failure = failure;
    return unavailable(sourceId, retrievedAt, [request], failure);
  }

  const normalised = normalise(envelope.value, retrievedAt);
  if (!normalised.ok) {
    const failure: SourceFailure = { kind: normalised.kind, message: normalised.message };
    request.failure = failure;
    return unavailable(sourceId, retrievedAt, [request], failure);
  }

  const { observations, received, rejected, sourceUpdatedAt } = normalised.value;
  const issues = staleCopy ? [...normalised.value.issues, staleCopy] : normalised.value.issues;
  return {
    sourceId,
    outcome: "ok",
    retrievedAt,
    requests: [request],
    observations,
    latestObservedAt: latestObservedAt(observations),
    counts: { received, accepted: observations.filter((o) => o.value !== null).length, rejected },
    issues,
    failure: null,
    meta: sourceUpdatedAt ? { sourceUpdatedAt } : {},
  };
}

/**
 * NEA's 24-hour PSI by region, and the pollutant sub-indices it is computed
 * from (NEA: the PSI is the highest sub-index). All are dimensionless index
 * values. Pollutant concentrations in the same response are not used: their
 * units are not consistently documented.
 */
export const PSI_METRICS: readonly RegionalMetricSpec[] = [
  { key: "psi_twenty_four_hourly", metric: "psi_24h", unit: "index", averaging: "24-hour", min: 0, max: 1000, required: true },
  { key: "pm25_sub_index", metric: "pm25_sub_index", unit: "index", min: 0, max: 1000 },
  { key: "pm10_sub_index", metric: "pm10_sub_index", unit: "index", min: 0, max: 1000 },
  { key: "o3_sub_index", metric: "o3_sub_index", unit: "index", min: 0, max: 1000 },
  { key: "co_sub_index", metric: "co_sub_index", unit: "index", min: 0, max: 1000 },
  { key: "so2_sub_index", metric: "so2_sub_index", unit: "index", min: 0, max: 1000 },
];

/** NEA's 1-hour PM2.5 concentration, by region. */
export const PM25_METRICS: readonly RegionalMetricSpec[] = [
  {
    key: "pm25_one_hourly",
    metric: "pm25_1h",
    unit: "µg/m³",
    averaging: "1-hour",
    min: 0,
    max: 2000,
    required: true,
  },
];

export function loadSingaporePsi(context: LoaderContext): Promise<SourceSnapshot> {
  return loadDataGovSg(context, "datagovsg-psi", "/psi", "24-hour PSI by region", (envelope, retrievedAt) =>
    normaliseRegionalAir(envelope, {
      sourceId: "datagovsg-psi",
      endpoint: "/v2/real-time/api/psi",
      metrics: PSI_METRICS,
      flags: ["real-time"],
      retrievedAt,
    }),
  );
}

export function loadSingaporePm25(context: LoaderContext): Promise<SourceSnapshot> {
  return loadDataGovSg(context, "datagovsg-pm25", "/pm25", "1-hour PM2.5 by region", (envelope, retrievedAt) =>
    normaliseRegionalAir(envelope, {
      sourceId: "datagovsg-pm25",
      endpoint: "/v2/real-time/api/pm25",
      metrics: PM25_METRICS,
      flags: ["real-time"],
      retrievedAt,
    }),
  );
}

export function loadSingaporeWindDirection(context: LoaderContext): Promise<SourceSnapshot> {
  return loadDataGovSg(context, "datagovsg-wind-direction", "/wind-direction", "Wind direction by station", (envelope, retrievedAt) =>
    normaliseStationReadings(envelope, {
      sourceId: "datagovsg-wind-direction",
      endpoint: "/v2/real-time/api/wind-direction",
      metric: "wind_direction",
      unit: "degrees",
      // The live API says "degrees"; the published spec says "°".
      acceptedUnits: ["degrees", "°"],
      min: 0,
      max: 360,
      flags: ["real-time"],
      retrievedAt,
    }),
  );
}

export function loadSingaporeWindSpeed(context: LoaderContext): Promise<SourceSnapshot> {
  return loadDataGovSg(context, "datagovsg-wind-speed", "/wind-speed", "Wind speed by station", (envelope, retrievedAt) =>
    normaliseStationReadings(envelope, {
      sourceId: "datagovsg-wind-speed",
      endpoint: "/v2/real-time/api/wind-speed",
      metric: "wind_speed",
      unit: "knots",
      acceptedUnits: ["knots"],
      min: 0,
      max: 150,
      flags: ["real-time"],
      retrievedAt,
    }),
  );
}

export function loadSingaporeRainfall(context: LoaderContext): Promise<SourceSnapshot> {
  return loadDataGovSg(context, "datagovsg-rainfall", "/rainfall", "Rainfall by station", (envelope, retrievedAt) =>
    normaliseStationReadings(envelope, {
      sourceId: "datagovsg-rainfall",
      endpoint: "/v2/real-time/api/rainfall",
      metric: "rainfall_5min",
      unit: "mm",
      acceptedUnits: ["mm"],
      averaging: "5-minute total",
      min: 0,
      max: 200,
      flags: ["real-time"],
      retrievedAt,
    }),
  );
}

/* ───────────────────────────────── NASA FIRMS ───────────────────────────────── */

/** Placeholder shown wherever the FIRMS key would appear in a URL. */
export const MAP_KEY_PLACEHOLDER = "{MAP_KEY}";

/**
 * Keyless path: FIRMS's openly downloadable "South East Asia" 24h VIIRS
 * files, one per satellite, linked from its Active Fire Data page. Suomi NPP
 * is left out: NOAA and NASA announced that its data delivery ends on
 * 2 November 2026 at 13:00 UTC (earlier FIRMS notices said 1 November).
 */
export const FIRMS_OPEN_FILES = [
  {
    label: "VIIRS on NOAA-20",
    url: "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_SouthEast_Asia_24h.csv",
  },
  {
    label: "VIIRS on NOAA-21",
    url: "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-21-viirs-c2/csv/J2_VIIRS_C2_SouthEast_Asia_24h.csv",
  },
] as const;

/** Keyed path: the FIRMS area API, one request per satellite. */
export const FIRMS_API_PRODUCTS = [
  { label: "VIIRS on NOAA-20", product: "VIIRS_NOAA20_NRT" },
  { label: "VIIRS on NOAA-21", product: "VIIRS_NOAA21_NRT" },
] as const;

/**
 * The area API returns whole UTC days ("today" back to today − (days − 1)),
 * so it is asked for two days, and the result is trimmed to detections
 * acquired in the 24 hours before retrieval. The keyless files are already
 * NASA's "last 24 hours" product and are shown as published.
 */
export const FIRMS_API_DAY_RANGE = 2;
export const FIRMS_API_WINDOW_HOURS = 24;

/** Timeout for one FIRMS request, including reading the body. */
export const FIRMS_TIMEOUT_MS = 30_000;
/**
 * Time allowed for all FIRMS requests together. Next.js stops a "use cache"
 * function that runs longer than 54 seconds while prerendering (0.9 × the
 * default staticPageGenerationTimeout of 60 s), which would fail the build
 * instead of showing FIRMS as unavailable. The second request gets whatever
 * remains of this budget.
 */
export const FIRMS_TOTAL_BUDGET_MS = 45_000;
const FIRMS_MAX_BYTES = 30_000_000;
/** FIRMS's robots.txt asks for "Crawl-delay: 1", so its requests are made one at a time, a second apart. */
export const FIRMS_REQUEST_GAP_MS = 1_000;

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** The FIRMS area API URL for one product and the map window. */
export function firmsAreaUrl(mapKey: string, product: string, dayRange: number = FIRMS_API_DAY_RANGE): string {
  const { west, south, east, north } = STUDY_AREA;
  return `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(mapKey)}/${product}/${west},${south},${east},${north}/${dayRange}`;
}

/** Replace every occurrence of a secret in a string with the placeholder. */
export function redactSecret(text: string, secret: string | undefined): string {
  if (!secret) return text;
  return text.split(secret).join(MAP_KEY_PLACEHOLDER).split(encodeURIComponent(secret)).join(MAP_KEY_PLACEHOLDER);
}

/** A FIRMS error body, mapped to a failure. FIRMS explains key problems in plain text. */
function firmsFailure(status: number | undefined, body: string | undefined, fallback: SourceFailure): SourceFailure {
  const text = (body ?? "").slice(0, 300);
  const withStatus = status ? { httpStatus: status } : {};
  if (/invalid\s+map_key/i.test(text)) {
    return { kind: "auth", message: "NASA FIRMS rejected the configured MAP_KEY as invalid.", ...withStatus };
  }
  if (/exceeded your transaction/i.test(text)) {
    return {
      kind: "rate-limited",
      message: "NASA FIRMS reported that the MAP_KEY is invalid or has exceeded its transaction limit.",
      ...withStatus,
    };
  }
  return fallback;
}

/**
 * Load FIRMS VIIRS detections inside the map window.
 *
 * Without a MAP_KEY (the default), it reads NASA's openly downloadable
 * "South East Asia, last 24 hours" files. With a MAP_KEY, it uses the
 * documented area API for the map window and keeps the 24 hours before
 * retrieval. Either way the key never appears in the snapshot: request URLs
 * are stored with a placeholder.
 *
 * `latestObservedAt` is the newest detection anywhere in the response,
 * because that is what shows whether NASA's feed is current.
 */
export async function loadFirms(context: LoaderContext, mapKey: string | undefined): Promise<SourceSnapshot> {
  const sourceId = "nasa-firms";
  const retrievedAtDate = context.now();
  const retrievedAt = retrievedAtDate.toISOString();
  const key = mapKey?.trim() || undefined;
  const mode = key ? "area-api" : "open-files";
  const windowStartMs = key ? retrievedAtDate.getTime() - FIRMS_API_WINDOW_HOURS * 3_600_000 : -Infinity;

  const plan = key
    ? FIRMS_API_PRODUCTS.map((p) => ({ label: p.label, url: firmsAreaUrl(key, p.product) }))
    : FIRMS_OPEN_FILES.map((f) => ({ label: f.label, url: f.url }));

  const fetchOne = async (
    label: string,
    url: string,
    timeoutMs: number,
  ): Promise<{ request: SourceRequest; normalised: FirmsNormalised | null }> => {
    const response = await fetchText(url, {
      timeoutMs,
      maxBytes: FIRMS_MAX_BYTES,
      headers: { accept: "text/csv" },
      fetchImpl: context.fetchImpl,
    });
    const request: SourceRequest = {
      method: "GET",
      url: redactSecret(url, key),
      label,
      httpStatus: response.ok ? response.status : (response.status ?? null),
      serverDate: response.serverDate ?? null,
      lastModified: response.ok ? response.lastModified : null,
      failure: null,
    };
    if (!response.ok) {
      request.failure = firmsFailure(response.status, response.text, response.failure);
      return { request, normalised: null };
    }
    const parsed = normaliseFirmsCsv(response.text, {
      sourceId,
      requestLabel: `${label} (${redactSecret(url, key)})`,
      instrument: "VIIRS",
      box: STUDY_AREA,
      retrievedAt,
    });
    if (!parsed.ok) {
      request.failure = firmsFailure(response.status, response.text, { kind: parsed.kind, message: parsed.message });
      return { request, normalised: null };
    }
    return { request, normalised: parsed.value };
  };

  // One request at a time, a second apart, as FIRMS's robots.txt asks, within one overall budget.
  const deadline = Date.now() + FIRMS_TOTAL_BUDGET_MS;
  const results: { request: SourceRequest; normalised: FirmsNormalised | null }[] = [];
  for (const [index, { label, url }] of plan.entries()) {
    if (index > 0 && !context.skipPauses) await pause(FIRMS_REQUEST_GAP_MS);
    const timeoutMs = Math.max(1_000, Math.min(FIRMS_TIMEOUT_MS, deadline - Date.now()));
    results.push(await fetchOne(label, url, timeoutMs));
  }

  const requests = results.map((r) => r.request);
  const meta: SourceSnapshot["meta"] = { mode };

  if (results.every((r) => r.normalised === null)) {
    const failures = requests.map((r) => r.failure).filter((f): f is SourceFailure => f !== null);
    const first = failures[0] ?? { kind: "network" as const, message: "No FIRMS request succeeded." };
    const sameKind = failures.every((f) => f.kind === first.kind && f.message === first.message);
    // When the requests failed differently, say so for each one: the page shows no request list.
    const failure: SourceFailure = sameKind
      ? first
      : {
          kind: first.kind,
          message: requests
            .map((r) => `${r.label}: ${r.failure?.message ?? "Failed."}${r.failure?.httpStatus ? ` (HTTP ${r.failure.httpStatus})` : ""}`)
            .join(" "),
        };
    return unavailable(sourceId, retrievedAt, requests, failure, [], meta);
  }

  const issues: string[] = [];
  const observations: Observation[] = [];
  let received = 0;
  let rejected = 0;
  let outsideArea = 0;
  let outsideWindow = 0;
  let latestInResponse: string | null = null;
  for (const { request, normalised } of results) {
    if (!normalised) {
      issues.push(`${request.label}: ${request.failure?.message ?? "Failed."} Detections from this satellite are missing.`);
      continue;
    }
    received += normalised.received;
    rejected += normalised.rejected;
    outsideArea += normalised.outsideArea;
    if (normalised.latestAcquisition && (latestInResponse === null || normalised.latestAcquisition > latestInResponse)) {
      latestInResponse = normalised.latestAcquisition;
    }
    issues.push(...normalised.issues.map((issue) => `${request.label}: ${issue}`));
    const staleCopy = serverDateIssue(request.label, request.serverDate, retrievedAt);
    if (staleCopy) issues.push(staleCopy);
    for (const observation of normalised.observations) {
      if (Date.parse(observation.observedAt) < windowStartMs) {
        outsideWindow += 1;
        continue;
      }
      observations.push(observation);
    }
  }
  observations.sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  meta.outsideArea = outsideArea;
  if (key) meta.outsideWindow = outsideWindow;

  return {
    sourceId,
    outcome: results.every((r) => r.normalised !== null) ? "ok" : "partial",
    retrievedAt,
    requests,
    observations,
    latestObservedAt: latestInResponse,
    counts: { received, accepted: observations.length, rejected },
    issues,
    failure: null,
    meta,
  };
}

/* ──────────────────────── data.gov.my: MET Malaysia forecast ──────────────────────── */

/** data.gov.my Weather API, forecast endpoint (the documented URL ends with a slash). */
export const DATAGOVMY_FORECAST_ENDPOINT = "https://api.data.gov.my/weather/forecast/";

/**
 * The forecast request for state-level locations ("St" ids) on one date,
 * using the filters documented at developer.data.gov.my.
 */
export function malaysiaStateForecastUrl(date: string): string {
  return `${DATAGOVMY_FORECAST_ENDPOINT}?contains=St@location__location_id&date_start=${date}@date&date_end=${date}@date`;
}

/**
 * MET Malaysia's general forecast for today (Malaysia time), for each state
 * and federal territory, from data.gov.my. One request per retrieval: the
 * Weather API allows 4 requests a minute.
 */
export async function loadMalaysiaStateForecast(context: LoaderContext): Promise<ForecastSnapshot> {
  const sourceId = "datagovmy-weather-forecast";
  const now = context.now();
  const retrievedAt = now.toISOString();
  const validDate = malaysiaDate(now);
  const url = malaysiaStateForecastUrl(validDate);
  const response = await fetchText(url, {
    timeoutMs: DATAGOVSG_TIMEOUT_MS,
    maxBytes: DATAGOVSG_MAX_BYTES,
    headers: { accept: "application/json" },
    fetchImpl: context.fetchImpl,
  });
  const request: SourceRequest = {
    method: "GET",
    url,
    label: `State forecasts for ${validDate}`,
    httpStatus: response.ok ? response.status : (response.status ?? null),
    serverDate: response.serverDate ?? null,
    failure: null,
  };
  const base = { sourceId, retrievedAt, requests: [request], meta: {} };

  const failed = (failure: SourceFailure): ForecastSnapshot => {
    request.failure = failure;
    return {
      ...base,
      outcome: "unavailable",
      forecasts: [],
      validDate: null,
      counts: { received: 0, accepted: 0, rejected: 0 },
      issues: [],
      failure,
    };
  };

  if (!response.ok) return failed(response.failure);
  const parsed = normaliseForecasts(response.text, { sourceId, validDate, endpoint: DATAGOVMY_FORECAST_ENDPOINT });
  if (!parsed.ok) return failed({ kind: parsed.kind, message: parsed.message });

  const { forecasts, received, rejected } = parsed.value;
  const staleCopy = serverDateIssue(request.label, request.serverDate, retrievedAt);
  const issues = staleCopy ? [...parsed.value.issues, staleCopy] : parsed.value.issues;
  return {
    ...base,
    outcome: "ok",
    forecasts,
    validDate,
    counts: { received, accepted: forecasts.length, rejected },
    issues,
    failure: null,
  };
}
