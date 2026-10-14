/**
 * One small, polite HTTP client for every live source.
 *
 * - Identifies the project in the User-Agent header.
 * - Gives up after a timeout instead of hanging a build or a revalidation.
 * - Refuses oversized responses.
 * - Turns every failure into a typed, plain-language `SourceFailure`.
 *
 * Credentials: callers pass the real URL for the request and a separate,
 * redacted URL for anything that is stored or shown. Error messages here never
 * include either URL.
 */

import type { FailureKind, SourceFailure } from "./types";

export const USER_AGENT = "JEREBU.EXE/0.1 (+https://github.com/Kingway87/jerebu-exe)";

export interface FetchTextOptions {
  timeoutMs: number;
  /** Responses larger than this are rejected. */
  maxBytes: number;
  headers?: Record<string, string>;
  /** Injected in tests. Defaults to the global `fetch`. */
  fetchImpl?: typeof fetch;
}

export type FetchTextResult =
  | { ok: true; status: number; contentType: string | null; text: string; serverDate: string | null; lastModified: string | null }
  | { ok: false; failure: SourceFailure; status?: number; text?: string; serverDate?: string | null };

function formatBytes(bytes: number): string {
  return bytes >= 1_000_000 ? `${Math.round(bytes / 100_000) / 10} MB` : `${Math.round(bytes / 1000)} KB`;
}

function failure(kind: FailureKind, message: string, httpStatus?: number): SourceFailure {
  return httpStatus === undefined ? { kind, message } : { kind, message, httpStatus };
}

/** Map an HTTP error status to a failure kind. */
export function failureForStatus(status: number): SourceFailure {
  if (status === 401 || status === 403) {
    return failure("auth", `The source refused the request (HTTP ${status}).`, status);
  }
  if (status === 429) {
    return failure("rate-limited", "The source reported too many requests (HTTP 429).", status);
  }
  return failure("http", `The source answered with an error (HTTP ${status}).`, status);
}

async function readCapped(response: Response, maxBytes: number): Promise<string | null> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8").decode(bytes);
}

/**
 * GET a URL and return its body as text, or a typed failure. Never throws.
 * Error bodies are returned too, because some sources explain errors in them.
 */
export async function fetchText(url: string, options: FetchTextOptions): Promise<FetchTextResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      headers: { "user-agent": USER_AGENT, ...options.headers },
      signal: AbortSignal.timeout(options.timeoutMs),
      redirect: "follow",
      // Never let Next.js answer from its own fetch cache: a cached response
      // would be shown with a retrieval time it was not retrieved at. Caching
      // happens once, around the whole snapshot (see snapshots.ts).
      cache: "no-store",
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      return {
        ok: false,
        failure: failure("timeout", `No response within ${Math.round(options.timeoutMs / 1000)} seconds.`),
      };
    }
    return { ok: false, failure: failure("network", "The source could not be reached.") };
  }

  const serverDate = headerDate(response, "date");
  let text: string | null;
  try {
    text = await readCapped(response, options.maxBytes);
  } catch {
    return {
      ok: false,
      status: response.status,
      failure: failure("network", "The connection failed while the response was being read."),
    };
  }

  if (text === null) {
    return {
      ok: false,
      status: response.status,
      failure: failure("parse", `The response was larger than the ${formatBytes(options.maxBytes)} limit.`),
    };
  }

  if (!response.ok) {
    return { ok: false, status: response.status, text, serverDate, failure: failureForStatus(response.status) };
  }

  return {
    ok: true,
    status: response.status,
    contentType: response.headers.get("content-type"),
    text,
    serverDate,
    lastModified: headerDate(response, "last-modified"),
  };
}

/** A date header (`Date`, `Last-Modified`) as ISO 8601, or null if absent or unreadable. */
function headerDate(response: Response, name: string): string | null {
  const header = response.headers.get(name);
  if (!header) return null;
  const ms = Date.parse(header);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

/** Responses dated further than this from the retrieval time are flagged as possibly stale copies. */
export const SERVER_DATE_TOLERANCE_MINUTES = 10;

/**
 * A plain-language issue if a response's own date is far from when this site
 * says it retrieved it, which would mean a cached copy was served somewhere
 * on the way. Null if the dates agree or the server sent none.
 */
export function serverDateIssue(label: string, serverDate: string | null | undefined, retrievedAt: string): string | null {
  if (!serverDate) return null;
  const gapMinutes = Math.abs(Date.parse(retrievedAt) - Date.parse(serverDate)) / 60_000;
  if (!Number.isFinite(gapMinutes) || gapMinutes <= SERVER_DATE_TOLERANCE_MINUTES) return null;
  return `${label}: the response was dated ${serverDate}, ${Math.round(gapMinutes)} minutes from the retrieval time, so it may be a cached copy.`;
}
