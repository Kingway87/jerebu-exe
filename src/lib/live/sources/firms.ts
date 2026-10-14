/**
 * NASA FIRMS active fire detections: parsing and normalisation.
 *
 * FIRMS publishes detections as CSV, one row per detection, with a header
 * row. The keyless regional files and the keyed area API use the same
 * column names (the API adds an `instrument` column), so one header-driven
 * parser reads both.
 *
 * What a row is: the centre of a satellite pixel in which the detection
 * algorithm flagged one or more thermal anomalies at the time of an
 * overpass. It is not a confirmed fire, it is not a fire's extent, and it
 * says nothing about cause, land ownership or responsibility. Fires that are
 * small, short-lived, or hidden by cloud or thick smoke can go undetected.
 *
 * This module is pure: text in, observations out, with every rejected row
 * counted and explained.
 */

import type { Observation, QualityFlag } from "../types";
import { isInside, type BoundingBox } from "../study-area";
import type { Normalised, ParseResult } from "./common";

/** Columns every FIRMS VIIRS CSV must have for a row to be usable. */
export const REQUIRED_COLUMNS = [
  "latitude",
  "longitude",
  "acq_date",
  "acq_time",
  "satellite",
  "confidence",
  "version",
  "frp",
  "daynight",
] as const;

/** Columns kept as attributes when present. */
const OPTIONAL_COLUMNS = ["instrument", "bright_ti4", "bright_ti5", "scan", "track"] as const;

export interface FirmsNormaliseOptions {
  sourceId: string;
  /** Describes where the CSV came from, for raw references. Must not contain a key. */
  requestLabel: string;
  /** Instrument name to record when the CSV has no `instrument` column. */
  instrument: string;
  box: BoundingBox;
  retrievedAt: string;
}

export interface FirmsNormalised extends Normalised {
  /** Valid detections outside the map window. Counted, not shown. */
  outsideArea: number;
  /** Newest acquisition time among all valid rows, inside or outside the map window. */
  latestAcquisition: string | null;
}

/** Split one CSV line. FIRMS fields are unquoted, but quoted fields are handled defensively. */
export function splitCsvLine(line: string): string[] {
  if (!line.includes('"')) return line.split(",");
  const fields: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      fields.push(field);
      field = "";
    } else {
      field += char;
    }
  }
  fields.push(field);
  return fields;
}

const CONFIDENCE_FLAGS: Record<string, QualityFlag> = {
  l: "confidence-low",
  low: "confidence-low",
  n: "confidence-nominal",
  nominal: "confidence-nominal",
  h: "confidence-high",
  high: "confidence-high",
};

/** FIRMS gives acquisition date (YYYY-MM-DD) and time (HHMM, UTC) separately. */
export function firmsTimestamp(acqDate: string, acqTime: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(acqDate) || !/^\d{1,4}$/.test(acqTime)) return null;
  const hhmm = acqTime.padStart(4, "0");
  const hours = Number(hhmm.slice(0, 2));
  const minutes = Number(hhmm.slice(2));
  if (hours > 23 || minutes > 59) return null;
  const iso = `${acqDate}T${hhmm.slice(0, 2)}:${hhmm.slice(2)}:00Z`;
  const ms = Date.parse(iso);
  // Date.parse accepts impossible dates such as 2026-02-31 in some engines; check the round trip.
  if (Number.isNaN(ms) || new Date(ms).toISOString().slice(0, 10) !== acqDate) return null;
  return iso;
}

function number(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Does the text look like a FIRMS CSV at all? Used to tell an error message from data. */
export function looksLikeFirmsCsv(text: string): boolean {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const header = splitCsvLine(firstLine).map((h) => h.trim().toLowerCase());
  return REQUIRED_COLUMNS.every((column) => header.includes(column));
}

/**
 * Normalise FIRMS CSV text into one observation per detection inside `box`.
 *
 * Each observation's value is the detection's fire radiative power (FRP, in
 * megawatts), the one quantity FIRMS measures per detection. FRP describes
 * radiant heat at the time of the overpass. It is not a measure of a fire's
 * size, cause or smoke.
 *
 * A file with a header and no rows is valid: the source reported no
 * detections. That is recorded as zero detections, which is still not
 * evidence of zero fires.
 */
export function normaliseFirmsCsv(text: string, options: FirmsNormaliseOptions): ParseResult<FirmsNormalised> {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) {
    return { ok: false, kind: "parse", message: "The response was empty: not even a header row." };
  }
  if (!looksLikeFirmsCsv(text)) {
    return { ok: false, kind: "parse", message: "The response was not a FIRMS CSV file (the header row was missing or different)." };
  }

  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);

  const observations: Observation[] = [];
  const rejectedReasons = new Map<string, number>();
  const reject = (reason: string) => rejectedReasons.set(reason, (rejectedReasons.get(reason) ?? 0) + 1);
  let outsideArea = 0;
  let latestAcquisition: string | null = null;
  const unknownConfidence = new Set<string>();

  for (let i = 1; i < lines.length; i += 1) {
    const fields = splitCsvLine(lines[i]);
    if (fields.length !== header.length) {
      reject("wrong number of columns");
      continue;
    }
    const get = (name: string) => {
      const index = col(name);
      return index === -1 ? undefined : fields[index].trim();
    };

    const lat = number(get("latitude"));
    const lon = number(get("longitude"));
    if (lat === null || lon === null || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      reject("invalid coordinates");
      continue;
    }
    const observedAt = firmsTimestamp(get("acq_date") ?? "", get("acq_time") ?? "");
    if (!observedAt) {
      reject("invalid acquisition date or time");
      continue;
    }
    const frp = number(get("frp"));
    if (frp === null || frp < 0 || frp > 100_000) {
      reject("invalid fire radiative power");
      continue;
    }
    if (latestAcquisition === null || observedAt > latestAcquisition) latestAcquisition = observedAt;
    if (!isInside(lat, lon, options.box)) {
      outsideArea += 1;
      continue;
    }

    const confidence = get("confidence") ?? "";
    const confidenceFlag = CONFIDENCE_FLAGS[confidence.toLowerCase()];
    if (!confidenceFlag) unknownConfidence.add(confidence);

    const flags: QualityFlag[] = confidenceFlag ? [confidenceFlag] : [];
    if (Date.parse(observedAt) > Date.parse(options.retrievedAt) + 5 * 60_000) flags.push("future-timestamp");

    const attributes: Record<string, string | number | null> = {
      satellite: get("satellite") ?? null,
      instrument: get("instrument") ?? options.instrument,
      confidence: confidence || null,
      daynight: get("daynight") ?? null,
      version: get("version") ?? null,
    };
    for (const column of OPTIONAL_COLUMNS) {
      if (column === "instrument") continue;
      const value = get(column);
      if (value !== undefined) attributes[column] = number(value);
    }

    observations.push({
      sourceId: options.sourceId,
      level: "observation",
      metric: "fire_radiative_power",
      value: frp,
      unit: "MW",
      observedAt,
      location: { kind: "pixel", lat, lon },
      qualityFlags: flags,
      rawReference: `${options.requestLabel} → line ${i + 1}`,
      attributes,
    });
  }

  const received = lines.length - 1;
  const rejected = [...rejectedReasons.values()].reduce((a, b) => a + b, 0);
  const issues = [...rejectedReasons.entries()].map(
    ([reason, count]) => `${count} ${count === 1 ? "row was" : "rows were"} rejected: ${reason}.`,
  );
  if (unknownConfidence.size > 0) {
    issues.push(`Unrecognised confidence values kept without a confidence flag: ${[...unknownConfidence].join(", ")}.`);
  }

  return { ok: true, value: { observations, received, rejected, issues, outsideArea, latestAcquisition } };
}

/* ─────────────────────────────── Display summary ─────────────────────────────── */

/** Size of the grid cells used to map detection density, in degrees (about 11 km). */
export const CELL_SIZE_DEGREES = 0.1;

export interface FireSummary {
  /** Detections inside the map window. Detections are not fires: one fire can produce many. */
  total: number;
  /** Detections by satellite, as FIRMS names them (e.g. "N20"). */
  bySatellite: Record<string, number>;
  byConfidence: { low: number; nominal: number; high: number; unknown: number };
  byDayNight: { day: number; night: number; unknown: number };
  /** Earliest and latest acquisition times among the detections inside the window. */
  earliest: string | null;
  latest: string | null;
  /** Largest fire radiative power among the detections, in MW. */
  maxFrp: number | null;
  cellSizeDegrees: number;
  /** Occupied grid cells: south-west corner and number of detections. */
  cells: { lon: number; lat: number; count: number }[];
}

/**
 * Summarise detections for display: counts and a density grid. Pure and
 * deterministic: the same detections always give the same summary.
 */
export function summariseDetections(
  observations: readonly Observation[],
  cellSizeDegrees: number = CELL_SIZE_DEGREES,
): FireSummary {
  const bySatellite: Record<string, number> = {};
  const byConfidence = { low: 0, nominal: 0, high: 0, unknown: 0 };
  const byDayNight = { day: 0, night: 0, unknown: 0 };
  const cells = new Map<string, { lon: number; lat: number; count: number }>();
  let earliest: string | null = null;
  let latest: string | null = null;
  let maxFrp: number | null = null;
  const scale = Math.round(1 / cellSizeDegrees);

  for (const observation of observations) {
    if (observation.location.kind !== "pixel") continue;
    const satellite = String(observation.attributes?.satellite ?? "unknown");
    bySatellite[satellite] = (bySatellite[satellite] ?? 0) + 1;

    if (observation.qualityFlags.includes("confidence-low")) byConfidence.low += 1;
    else if (observation.qualityFlags.includes("confidence-nominal")) byConfidence.nominal += 1;
    else if (observation.qualityFlags.includes("confidence-high")) byConfidence.high += 1;
    else byConfidence.unknown += 1;

    const dayNight = observation.attributes?.daynight;
    if (dayNight === "D") byDayNight.day += 1;
    else if (dayNight === "N") byDayNight.night += 1;
    else byDayNight.unknown += 1;

    if (earliest === null || observation.observedAt < earliest) earliest = observation.observedAt;
    if (latest === null || observation.observedAt > latest) latest = observation.observedAt;
    if (observation.value !== null && (maxFrp === null || observation.value > maxFrp)) maxFrp = observation.value;

    // Integer cell indices avoid floating-point drift at cell edges.
    const x = Math.floor(observation.location.lon * scale);
    const y = Math.floor(observation.location.lat * scale);
    const key = `${x}:${y}`;
    const cell = cells.get(key);
    if (cell) cell.count += 1;
    else cells.set(key, { lon: x / scale, lat: y / scale, count: 1 });
  }

  const total = observations.filter((o) => o.location.kind === "pixel").length;
  const sortedCells = [...cells.values()].sort((a, b) => a.lat - b.lat || a.lon - b.lon);
  return { total, bySatellite, byConfidence, byDayNight, earliest, latest, maxFrp, cellSizeDegrees, cells: sortedCells };
}
