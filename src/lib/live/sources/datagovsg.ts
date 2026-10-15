/**
 * data.gov.sg real-time APIs (v2): validation and normalisation.
 *
 * Two response shapes are used, both wrapped in `{ code, data, errorMsg }`:
 *
 * - Regional air quality (PSI, PM2.5): `data.regionMetadata` lists the five
 *   reporting regions with label locations; `data.items[].readings` maps each
 *   metric to `{ region: value }`.
 * - Station weather (wind, rainfall): `data.stations` lists stations with
 *   locations; `data.readings[].data` lists `{ stationId, value }`.
 *
 * This module is pure: it turns response text into observations, or explains
 * why it cannot. A region or station that the response lists but gives no
 * value for becomes an observation with `value: null`. It is never dropped
 * silently and never filled with zero.
 */

import type { Observation, QualityFlag } from "../types";
import { isFiniteNumber, isRecord, type Normalised, type ParseResult } from "./common";

export interface Envelope {
  code: number;
  data: Record<string, unknown>;
  errorMsg: string;
}

/** ISO 8601 date-time with an explicit offset or Z, as data.gov.sg publishes. */
export function isOffsetTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

/** Read the `{ code, data, errorMsg }` wrapper. A non-zero code is a failure the source reported. */
export function parseEnvelope(text: string): ParseResult<Envelope> {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, kind: "parse", message: "The response was not valid JSON." };
  }
  if (!isRecord(json) || typeof json.code !== "number") {
    return { ok: false, kind: "validation", message: "The response did not have the documented { code, data } structure." };
  }
  if (json.code !== 0) {
    const reason = typeof json.errorMsg === "string" && json.errorMsg ? `: ${json.errorMsg.slice(0, 200)}` : "";
    return { ok: false, kind: "validation", message: `The source reported an error (code ${json.code})${reason}.` };
  }
  if (!isRecord(json.data)) {
    return { ok: false, kind: "validation", message: "The response had no data object." };
  }
  return {
    ok: true,
    value: { code: json.code, data: json.data, errorMsg: typeof json.errorMsg === "string" ? json.errorMsg : "" },
  };
}

/* ───────────────────────────── Regional air quality ───────────────────────────── */

export interface RegionalMetricSpec {
  /** Key under `readings`, e.g. "psi_twenty_four_hourly". */
  key: string;
  /** Normalised metric name, e.g. "psi_24h". */
  metric: string;
  unit: string;
  averaging?: string;
  /** Plausible range. Values outside it are rejected as invalid, not shown. */
  min: number;
  max: number;
  /**
   * The headline metric of the response (the PSI itself, or 1-hour PM2.5).
   * Without at least one usable value for it, the response fails validation
   * instead of being shown as a reading without its main value.
   */
  required?: boolean;
}

export interface RegionalNormaliseOptions {
  sourceId: string;
  /** Endpoint path for raw references, e.g. "/v2/real-time/api/psi". */
  endpoint: string;
  metrics: readonly RegionalMetricSpec[];
  /** Flags that apply to every value from this source (e.g. "real-time"). */
  flags: readonly QualityFlag[];
  retrievedAt: string;
}

interface RegionMeta {
  name: string;
  lat: number | null;
  lon: number | null;
}

function readRegions(data: Record<string, unknown>): RegionMeta[] | null {
  if (!Array.isArray(data.regionMetadata)) return null;
  const regions: RegionMeta[] = [];
  for (const entry of data.regionMetadata) {
    if (!isRecord(entry) || typeof entry.name !== "string" || entry.name === "") return null;
    const label = isRecord(entry.labelLocation) ? entry.labelLocation : {};
    let lat = isFiniteNumber(label.latitude) ? label.latitude : null;
    let lon = isFiniteNumber(label.longitude) ? label.longitude : null;
    // Older responses list a "national" region with a label at 0,0: no place, not a place at 0,0.
    if (lat === 0 && lon === 0) {
      lat = null;
      lon = null;
    }
    regions.push({ name: entry.name, lat, lon });
  }
  return regions;
}

/** "north" → "North". Region names come from the response, so they are not translated. */
export function regionLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Readings dated more than this after the retrieval time are treated as future-dated. */
const FUTURE_TOLERANCE_MS = 5 * 60_000;

/**
 * Pick the item with the latest valid `timestamp`, preferring items that are
 * not dated after the retrieval time: a future-dated item is used only if
 * there is nothing else.
 */
function latestItem(items: unknown[], retrievedAt: string): Record<string, unknown> | null {
  const futureLimitMs = Date.parse(retrievedAt) + FUTURE_TOLERANCE_MS;
  let best: Record<string, unknown> | null = null;
  let bestMs = -Infinity;
  let bestFuture: Record<string, unknown> | null = null;
  let bestFutureMs = -Infinity;
  for (const item of items) {
    if (!isRecord(item) || !isOffsetTimestamp(item.timestamp)) continue;
    const ms = Date.parse(item.timestamp);
    if (ms > futureLimitMs) {
      if (ms > bestFutureMs) {
        bestFuture = item;
        bestFutureMs = ms;
      }
    } else if (ms > bestMs) {
      best = item;
      bestMs = ms;
    }
  }
  return best ?? bestFuture;
}

function futureNote(observedAt: string, retrievedAt: string): string | null {
  return Date.parse(observedAt) > Date.parse(retrievedAt) + FUTURE_TOLERANCE_MS
    ? `The newest reading is dated ${observedAt}, after the retrieval time. It is shown, but not used to judge how current the source is.`
    : null;
}

/**
 * Normalise a PSI or PM2.5 response. Fails if the structure is not as
 * documented, or if there is no reading at all: an empty response from these
 * hourly series means something is wrong, not that the air is clean.
 */
export function normaliseRegionalAir(
  envelope: Envelope,
  options: RegionalNormaliseOptions,
): ParseResult<Normalised & { sourceUpdatedAt: string | null }> {
  const regions = readRegions(envelope.data);
  if (!regions || regions.length === 0) {
    return { ok: false, kind: "validation", message: "The response did not list its reporting regions." };
  }
  if (!Array.isArray(envelope.data.items) || envelope.data.items.length === 0) {
    return { ok: false, kind: "validation", message: "The response contained no readings." };
  }
  const item = latestItem(envelope.data.items, options.retrievedAt);
  if (!item || !isRecord(item.readings)) {
    return { ok: false, kind: "validation", message: "No reading had a valid timestamp." };
  }

  const observedAt = item.timestamp as string;
  const future = futureNote(observedAt, options.retrievedAt);
  const futureFlag: QualityFlag[] = future ? ["future-timestamp"] : [];

  const observations: Observation[] = [];
  const issues: string[] = future ? [future] : [];
  let received = 0;
  let rejected = 0;

  for (const spec of options.metrics) {
    const values = item.readings[spec.key];
    if (!isRecord(values)) {
      issues.push(`The response had no "${spec.key}" readings.`);
      continue;
    }
    for (const region of regions) {
      const raw = values[region.name];
      const base = {
        sourceId: options.sourceId,
        level: "observation" as const,
        metric: spec.metric,
        unit: spec.unit,
        observedAt,
        ...(spec.averaging ? { averaging: spec.averaging } : {}),
        location: { kind: "region" as const, id: region.name, name: regionLabel(region.name), lat: region.lat, lon: region.lon },
        qualityFlags: [...options.flags, ...futureFlag],
        rawReference: `${options.endpoint} → data.items[timestamp=${observedAt}].readings.${spec.key}.${region.name}`,
      };
      if (raw === undefined || raw === null) {
        // Listed region, no value: keep the gap visible.
        observations.push({ ...base, value: null });
        continue;
      }
      received += 1;
      if (!isFiniteNumber(raw) || raw < spec.min || raw > spec.max) {
        rejected += 1;
        issues.push(
          `Rejected ${spec.key} for ${region.name}: ${JSON.stringify(raw)} is outside the plausible range ${spec.min}–${spec.max}.`,
        );
        continue;
      }
      observations.push({ ...base, value: raw });
    }
  }

  if (observations.every((o) => o.value === null)) {
    return { ok: false, kind: "validation", message: "The response contained no usable values." };
  }
  for (const spec of options.metrics) {
    if (spec.required && !observations.some((o) => o.metric === spec.metric && o.value !== null)) {
      return { ok: false, kind: "validation", message: `The response had no usable "${spec.key}" readings.` };
    }
  }
  // When the source last updated this reading (data.gov.sg's updatedTimestamp).
  const sourceUpdatedAt = isOffsetTimestamp(item.updatedTimestamp) ? item.updatedTimestamp : null;
  return { ok: true, value: { observations, received, rejected, issues, sourceUpdatedAt } };
}

/* ───────────────────────────── Station weather ───────────────────────────── */

export interface StationNormaliseOptions {
  sourceId: string;
  endpoint: string;
  metric: string;
  /** Unit expected from the documentation. The response's own `readingUnit` must match. */
  unit: string;
  /** Accepted spellings of the unit in the response's `readingUnit` field. */
  acceptedUnits: readonly string[];
  averaging?: string;
  min: number;
  max: number;
  flags: readonly QualityFlag[];
  retrievedAt: string;
}

interface StationMeta {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

function readStations(data: Record<string, unknown>): StationMeta[] | null {
  if (!Array.isArray(data.stations)) return null;
  const stations: StationMeta[] = [];
  for (const entry of data.stations) {
    if (!isRecord(entry) || typeof entry.id !== "string" || typeof entry.name !== "string") return null;
    // The live API returns `location`; the published OpenAPI spec calls it `labelLocation`.
    const loc = isRecord(entry.location) ? entry.location : isRecord(entry.labelLocation) ? entry.labelLocation : {};
    if (!isFiniteNumber(loc.latitude) || !isFiniteNumber(loc.longitude)) return null;
    stations.push({ id: entry.id, name: entry.name, lat: loc.latitude, lon: loc.longitude });
  }
  return stations;
}

/**
 * Normalise a station weather response (wind direction, wind speed, rainfall).
 * Uses the latest reading set. Stations listed without a value in that set
 * become `null` observations.
 */
export function normaliseStationReadings(envelope: Envelope, options: StationNormaliseOptions): ParseResult<Normalised> {
  const stations = readStations(envelope.data);
  if (!stations || stations.length === 0) {
    return { ok: false, kind: "validation", message: "The response did not list its stations." };
  }
  const unit = envelope.data.readingUnit;
  if (typeof unit !== "string" || !options.acceptedUnits.includes(unit)) {
    return {
      ok: false,
      kind: "validation",
      message: `The response reported its unit as ${JSON.stringify(unit)}, not the documented ${options.unit}.`,
    };
  }
  if (!Array.isArray(envelope.data.readings) || envelope.data.readings.length === 0) {
    return { ok: false, kind: "validation", message: "The response contained no readings." };
  }
  const reading = latestItem(envelope.data.readings, options.retrievedAt);
  if (!reading || !Array.isArray(reading.data)) {
    return { ok: false, kind: "validation", message: "No reading had a valid timestamp." };
  }
  const observedAt = reading.timestamp as string;
  const future = futureNote(observedAt, options.retrievedAt);
  const futureFlag: QualityFlag[] = future ? ["future-timestamp"] : [];

  const valuesById = new Map<string, unknown>();
  const issues: string[] = future ? [future] : [];
  for (const entry of reading.data) {
    if (isRecord(entry) && typeof entry.stationId === "string") {
      valuesById.set(entry.stationId, entry.value);
    }
  }
  for (const id of valuesById.keys()) {
    if (!stations.some((s) => s.id === id)) {
      issues.push(`A reading for station ${id} was ignored: the station is not in the station list.`);
    }
  }

  const observations: Observation[] = [];
  let received = 0;
  let rejected = 0;
  for (const station of stations) {
    const raw = valuesById.get(station.id);
    const base = {
      sourceId: options.sourceId,
      level: "observation" as const,
      metric: options.metric,
      unit: options.unit,
      observedAt,
      ...(options.averaging ? { averaging: options.averaging } : {}),
      location: { kind: "station" as const, id: station.id, name: station.name, lat: station.lat, lon: station.lon },
      qualityFlags: [...options.flags, ...futureFlag],
      rawReference: `${options.endpoint} → data.readings[timestamp=${observedAt}].data[stationId=${station.id}].value`,
    };
    if (raw === undefined || raw === null) {
      observations.push({ ...base, value: null });
      continue;
    }
    received += 1;
    if (!isFiniteNumber(raw) || raw < options.min || raw > options.max) {
      rejected += 1;
      issues.push(
        `Rejected ${options.metric} for station ${station.id}: ${JSON.stringify(raw)} is outside the plausible range ${options.min}–${options.max}.`,
      );
      continue;
    }
    observations.push({ ...base, value: raw });
  }

  if (observations.every((o) => o.value === null)) {
    return { ok: false, kind: "validation", message: "The response contained no usable values." };
  }
  return { ok: true, value: { observations, received, rejected, issues } };
}
