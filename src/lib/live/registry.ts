/**
 * The live evidence source registry, loaded from `data/live-sources.json`.
 *
 * The JSON file is the single source of truth for what each source is, how it
 * can be accessed, its licence and attribution, its freshness thresholds and
 * how its facts were checked. `data/live-sources.schema.json` documents the
 * format, and the tests validate the file against it. This module repeats the
 * checks that matter at build time, so a broken registry fails `next build`
 * instead of reaching the page.
 */

import registryJson from "../../../data/live-sources.json";
import { isValidPolicy, type FreshnessPolicy } from "./freshness";

export type Jurisdiction = "global" | "regional" | "malaysia" | "singapore" | "indonesia";
export type SourceCategory =
  | "satellite-fire-observations"
  | "air-quality"
  | "meteorology"
  | "regional-haze"
  | "basemap";
export type RecordType = "observation" | "forecast" | "assessment" | "reference";
export type AccessMethod = "rest-api" | "file-download" | "web-page" | "mobile-app" | "none-found";
export type AccessStatus =
  | "AVAILABLE"
  | "PARTIALLY AVAILABLE"
  | "MANUAL SOURCE"
  | "REQUIRES ACCESS"
  | "NOT YET VERIFIED";
export type Integration = "integrated" | "integrated-needs-credential" | "bundled" | "link-only" | "reference-only";

export interface LiveSource {
  id: string;
  name: string;
  institution: string;
  publisher?: string;
  jurisdiction: Jurisdiction;
  category: SourceCategory;
  recordType: RecordType;
  officialUrl: string;
  /**
   * False when the publisher's terms of use set conditions on linking to it
   * (notice or permission) that a person has yet to review: the site then
   * names it without a hyperlink.
   */
  linkable?: boolean;
  documentationUrls: string[];
  accessMethod: AccessMethod;
  dataFormat?: string;
  endpoints?: { url: string; description: string }[];
  authenticationRequired: boolean;
  authentication: {
    type: "none" | "api-key-optional" | "api-key-required" | "account-required" | "unknown";
    envVar?: string;
    howToObtain?: string;
    notes: string;
  };
  rateLimits?: string;
  updateFrequency: string;
  latency?: string;
  historicalAvailability?: string;
  status: AccessStatus;
  integration: Integration;
  licence: { name: string; url?: string };
  attribution: string;
  freshness: (FreshnessPolicy & { rationale: string }) | null;
  fields?: { name: string; meaning: string; unit?: string }[];
  canShow: string[];
  cannotShow: string[];
  limitations: string[];
  verification: {
    checkedOn: string;
    checkedBy: string;
    method: string;
    humanVerified: boolean;
    /** Required when humanVerified is true: who checked the entry, when, and what they checked. */
    humanVerification?: { by: string; on: string; notes: string };
    evidence: { claim: string; url: string; quote: string }[];
    unverified?: string[];
  };
}

export interface LiveSourceRegistry {
  schemaVersion: 1;
  registryUpdated: string;
  about: string;
  sources: LiveSource[];
}

/**
 * Checks that must hold for the page to be honest. Returns a list of
 * problems; an empty list means the registry is usable.
 */
export function registryProblems(registry: LiveSourceRegistry): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();

  for (const source of registry.sources) {
    const at = `Source "${source.id}"`;
    if (ids.has(source.id)) problems.push(`${at} is listed twice.`);
    ids.add(source.id);

    for (const url of [source.officialUrl, ...source.documentationUrls, ...(source.endpoints ?? []).map((e) => e.url)]) {
      if (!url.startsWith("https://")) problems.push(`${at} has a non-HTTPS URL: ${url}`);
    }

    const fetched = source.integration === "integrated" || source.integration === "integrated-needs-credential";
    if (fetched) {
      if (!source.freshness || !isValidPolicy(source.freshness)) {
        problems.push(`${at} is integrated but has no valid freshness policy.`);
      }
      if (!source.endpoints || source.endpoints.length === 0) {
        problems.push(`${at} is integrated but lists no endpoint.`);
      }
    } else if (source.freshness !== null) {
      problems.push(`${at} is not fetched, so its freshness policy must be null.`);
    }

    if (source.integration === "integrated-needs-credential" && !source.authentication.envVar) {
      problems.push(`${at} needs a credential but names no environment variable.`);
    }
    if (source.authentication.envVar?.startsWith("NEXT_PUBLIC_")) {
      problems.push(`${at} would expose its credential to browsers (NEXT_PUBLIC_ prefix).`);
    }
    if (source.authenticationRequired !== (source.authentication.type === "api-key-required" || source.authentication.type === "account-required")) {
      problems.push(`${at} has authenticationRequired inconsistent with authentication.type.`);
    }
    if (source.verification.humanVerified && !source.verification.humanVerification) {
      // Only a named human may verify an entry, and the record must say who and when.
      problems.push(`${at} claims human verification without saying who verified it and when.`);
    }
    for (const endpoint of source.endpoints ?? []) {
      if (/[?&](api[_-]?key|map_key|token)=(?!\{)/i.test(endpoint.url)) {
        problems.push(`${at} has what looks like a real credential in an endpoint URL.`);
      }
    }
    if (source.linkable === false && /https?:\/\//.test(source.attribution)) {
      // The page turns addresses in attributions into links.
      problems.push(`${at} may not be linked, but its attribution contains a web address.`);
    }
  }

  return problems;
}

const registry = registryJson as LiveSourceRegistry;
const problems = registryProblems(registry);
if (problems.length > 0) {
  throw new Error(`data/live-sources.json is not usable:\n- ${problems.join("\n- ")}`);
}

export const liveSourceRegistry: LiveSourceRegistry = registry;
export const liveSources: readonly LiveSource[] = registry.sources;

/** A registry entry by id. Throws if it is missing, so a typo fails the build. */
export function getLiveSource(id: string): LiveSource {
  const source = liveSources.find((s) => s.id === id);
  if (!source) {
    throw new Error(`Source "${id}" is not in data/live-sources.json.`);
  }
  return source;
}
