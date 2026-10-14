/**
 * data.gov.my Weather API: MET Malaysia's general forecast, by state.
 *
 * The response is a JSON array. Each element is one location's forecast for
 * one day: location id and name, date, a forecast for the morning, afternoon
 * and night, a summary, and when the summary applies. Values are published
 * in Malay only.
 *
 * Forecasts are predictions, not observations. This module turns them into
 * `ForecastRecord`s, which are kept apart from observations everywhere.
 */

import type { ForecastRecord } from "../types";
import { isRecord, type ParseResult } from "./common";

/**
 * English descriptions of forecast values, exactly as listed in the
 * data.gov.my Weather API documentation (developer.data.gov.my, "Possible
 * Values for *_forecast Fields", read 15 October 2026). Matching ignores
 * case. Values the documentation does not list get no translation here.
 */
export const DOCUMENTED_FORECAST_VALUES: Readonly<Record<string, string>> = {
  berjerebu: "Hazy.",
  "tiada hujan": "No rain.",
  hujan: "Rain.",
  "hujan di beberapa tempat": "Scattered rain.",
  "hujan di satu dua tempat": "Isolated Rain.",
  "hujan di satu dua tempat di kawasan pantai": "Isolated rain over coastal areas.",
  "hujan di satu dua tempat di kawasan pedalaman": "Isolated rain over inland areas.",
  "ribut petir": "Thunderstorms.",
  "ribut petir di beberapa tempat": "Scattered thunderstorms.",
  "ribut petir di beberapa tempat di kawasan pedalaman": "Scattered thunderstorms over inland areas.",
  "ribut petir di satu dua tempat": "Isolated thunderstorms.",
  "ribut petir di satu dua tempat di kawasan pantai": "Isolated thunderstorms over coastal areas.",
  "ribut petir di satu dua tempat di kawasan pedalaman": "Isolated thunderstorms over inland areas.",
};

/** The documented English description of a forecast value, or null if the documentation does not list it. */
export function documentedMeaning(value: string): string | null {
  return DOCUMENTED_FORECAST_VALUES[value.trim().toLowerCase()] ?? null;
}

/**
 * True if a forecast value is the haze term: the documented "Berjerebu"
 * (Hazy), or "Jerebu", which the live API was seen to use on 15 October
 * 2026 although the documentation does not list it.
 */
export function isHazeTerm(value: string | null): boolean {
  if (!value) return false;
  const normalised = value.trim().toLowerCase();
  return normalised === "berjerebu" || normalised === "jerebu";
}

const text = (value: unknown): string | null => (typeof value === "string" && value.trim() !== "" ? value.trim() : null);

/**
 * Read a forecast response for one day. Rows for other days, or without a
 * location, are rejected and counted. An empty result for the requested day
 * is a failure: MET Malaysia publishes a forecast every day, so no rows means
 * something went wrong, not that there is no weather.
 */
export function normaliseForecasts(
  responseText: string,
  options: { sourceId: string; validDate: string; endpoint: string },
): ParseResult<{ forecasts: ForecastRecord[]; received: number; rejected: number; issues: string[] }> {
  let json: unknown;
  try {
    json = JSON.parse(responseText);
  } catch {
    return { ok: false, kind: "parse", message: "The response was not valid JSON." };
  }
  if (!Array.isArray(json)) {
    return { ok: false, kind: "validation", message: "The response was not the documented list of forecasts." };
  }

  const forecasts: ForecastRecord[] = [];
  const issues: string[] = [];
  let rejected = 0;
  for (const [index, row] of json.entries()) {
    const location = isRecord(row) && isRecord(row.location) ? row.location : null;
    const id = location ? text(location.location_id) : null;
    const name = location ? text(location.location_name) : null;
    if (!isRecord(row) || !id || !name) {
      rejected += 1;
      continue;
    }
    if (row.date !== options.validDate) {
      rejected += 1;
      issues.push(`A forecast for ${String(row.date)} was ignored: this page asked for ${options.validDate}.`);
      continue;
    }
    forecasts.push({
      sourceId: options.sourceId,
      level: "forecast",
      validDate: options.validDate,
      location: { kind: "region", id, name },
      periods: {
        morning: text(row.morning_forecast),
        afternoon: text(row.afternoon_forecast),
        night: text(row.night_forecast),
      },
      summary: text(row.summary_forecast),
      summaryWhen: text(row.summary_when),
      rawReference: `${options.endpoint} → [${index}] (${id})`,
    });
  }

  if (forecasts.length === 0) {
    return {
      ok: false,
      kind: "validation",
      message: `The response contained no forecast for ${options.validDate}.`,
    };
  }
  forecasts.sort((a, b) => a.location.id.localeCompare(b.location.id));

  const undocumented = new Set<string>();
  for (const forecast of forecasts) {
    for (const value of [forecast.periods.morning, forecast.periods.afternoon, forecast.periods.night, forecast.summary]) {
      if (value && !documentedMeaning(value)) undocumented.add(value);
    }
  }
  if (undocumented.size > 0) {
    issues.push(
      `Values not listed in the API documentation, shown in Malay without a translation: ${[...undocumented].sort().join("; ")}.`,
    );
  }

  return { ok: true, value: { forecasts, received: json.length, rejected, issues } };
}

/** "2026-10-15": the calendar date in Malaysia (UTC+8, no daylight saving) at a given moment. */
export function malaysiaDate(moment: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(moment);
}
