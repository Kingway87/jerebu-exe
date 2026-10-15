/**
 * Time formatting for the live evidence page.
 *
 * Malaysia and Singapore both keep UTC+8 all year, with no daylight saving,
 * so the page shows local times in UTC+8 and says so. The formatting is done
 * on the server with a fixed time zone, so every reader sees the same text.
 * Machine-readable timestamps stay in ISO 8601 (for `<time dateTime>`).
 */

const TIME_ZONE = "Asia/Singapore";

/** Label shown next to local times. */
export const LOCAL_ZONE_LABEL = "UTC+8";

const localDateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const utcDateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const localDateLong = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

const localDateShort = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const localTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function parse(iso: string): Date | null {
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : new Date(ms);
}

/** "15 Oct 2026, 14:00" in UTC+8, or null if the timestamp cannot be read. */
export function formatLocalDateTime(iso: string): string | null {
  const date = parse(iso);
  return date ? localDateTime.format(date) : null;
}

/** "15 Oct 2026, 06:00" in UTC, or null if the timestamp cannot be read. */
export function formatUtcDateTime(iso: string): string | null {
  const date = parse(iso);
  return date ? utcDateTime.format(date) : null;
}

/** "15 October 2026" (or "15 Oct 2026" when short) in UTC+8, or null if the timestamp cannot be read. */
export function formatLocalDate(iso: string, style: "long" | "short" = "long"): string | null {
  const date = parse(iso);
  if (!date) return null;
  return style === "long" ? localDateLong.format(date) : localDateShort.format(date);
}

/** "14:00" in UTC+8, or null if the timestamp cannot be read. */
export function formatLocalTime(iso: string): string | null {
  const date = parse(iso);
  return date ? localTime.format(date) : null;
}

/** Normalise any parseable timestamp to ISO 8601 UTC ("…Z"), or null. */
export function toUtcIso(iso: string): string | null {
  const date = parse(iso);
  return date ? date.toISOString() : null;
}

/**
 * The moment a local (UTC+8) calendar day ends, as ISO 8601 UTC, for a date
 * given as YYYY-MM-DD. Used to tell when a forecast for that day stops being
 * a forecast for "today". Null if the date cannot be read.
 */
export function endOfLocalDay(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const start = Date.parse(`${date}T00:00:00+08:00`);
  return Number.isNaN(start) ? null : new Date(start + 24 * 60 * 60_000).toISOString();
}
