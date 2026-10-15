/**
 * Candidate public sources for future experiments.
 *
 * HOW THIS LIST WAS MADE (Experiment 001): AI agents located these through
 * web search on 2026-10-14. The agents could not open the pages themselves
 * (outbound page fetching was unavailable), so each URL is one that appeared
 * in search results on an official domain, then spot-checked by a second,
 * sceptical agent. No source has been evaluated for reliability, licensing or
 * fitness for purpose. A human must open and check each link before relying
 * on it. See docs/DATA_SOURCES.md for caveats.
 *
 * Experiment 003 (live evidence) opened some of these sources and integrated
 * two of them: their data is shown on /live. They were first marked
 * "integrated-pending-evaluation", and became "integrated" after the project's
 * maintainer reviewed the evidence on /live on 15 October 2026 (see
 * src/content/review.ts). The full register for /live is data/live-sources.json.
 *
 * The /timeline page (Experiment 002) is not a data feed: it quotes figures
 * from published documents, each with its source, from the static file
 * data/haze-events.json. Experiment 002 did not evaluate or integrate any of
 * these candidates for it.
 *
 * Inclusion is not an endorsement.
 */

export type Jurisdiction = "regional" | "global" | "malaysia" | "singapore" | "indonesia";

export const jurisdictionLabel: Record<Jurisdiction, string> = {
  regional: "Regional (ASEAN)",
  global: "Global",
  malaysia: "Malaysia",
  singapore: "Singapore",
  indonesia: "Indonesia",
};

export type SourceKind =
  | "Satellite fire observations"
  | "Air quality"
  | "Meteorology"
  | "Modelling"
  | "Legislation"
  | "Court records"
  | "Government publications"
  | "Research discovery";

/**
 * "integrated-pending-evaluation" is an interim state added in Experiment 003
 * for a source integrated on an experiment branch and evaluated by AI agents
 * only. The project's rules (docs/DATA_SOURCES.md) say a source must be
 * Evaluated by a named human before it is integrated, so a source in this
 * state must be evaluated by a human, or removed, before its branch is
 * merged. No source is in this state now: Experiment 003's two moved to
 * "integrated" after the maintainer's review on 15 October 2026.
 */
export type SourceStatus = "candidate" | "evaluated" | "integrated" | "integrated-pending-evaluation";

export interface CandidateSource {
  name: string;
  operator: string;
  jurisdiction: Jurisdiction;
  kind: SourceKind;
  url: string;
  /**
   * False when the publisher's terms of use set conditions on linking to it
   * (notice or permission) that a person has yet to review (found in
   * Experiment 003). Shown without a hyperlink.
   */
  linkable?: boolean;
  /** Short, neutral note. No statistics or findings. */
  note?: string;
  status: SourceStatus;
}

/** Date the list was compiled by search. */
export const sourcesCheckedOn = "2026-10-14";

export const candidateSources: readonly CandidateSource[] = [
  // Regional (ASEAN)
  {
    name: "ASEAN Specialised Meteorological Centre (ASMC)",
    operator: "ASMC, hosted by the Meteorological Service Singapore",
    jurisdiction: "regional",
    kind: "Satellite fire observations",
    url: "https://asmc.asean.org/home/",
    note: "Regional haze situation, hotspot information and alerts. A portal snippet in search results describes a hotspot as a possible fire, not a confirmed one.",
    linkable: false,
    status: "candidate",
  },
  {
    name: "ASEAN Haze Portal",
    operator: "ASEAN Secretariat",
    jurisdiction: "regional",
    kind: "Government publications",
    url: "https://hazeportal.asean.org/",
    note: "Knowledge platform on peatland and haze management. Publications, not live monitoring.",
    status: "candidate",
  },
  {
    name: "ASEAN Agreement on Transboundary Haze Pollution (text, PDF)",
    operator: "ASEAN Secretariat",
    jurisdiction: "regional",
    kind: "Legislation",
    url: "https://agreement.asean.org/media/download/20220330063051.pdf",
    note: "A PDF that search results identify as the agreement text. Experiment 002 quoted passages from it for milestones on the timeline; it has not been analysed — a lead for Experiment 004.",
    status: "candidate",
  },

  // Global
  {
    name: "Fire Information for Resource Management System (FIRMS)",
    operator: "NASA",
    jurisdiction: "global",
    kind: "Satellite fire observations",
    url: "https://firms.modaps.eosdis.nasa.gov/",
    note: "Near-real-time active fire detections from satellite instruments. Shown on /live (Experiment 003) from NASA’s openly downloadable regional files; the API needs a free key, which is optional and never stored in the repository.",
    status: "integrated",
  },
  {
    name: "NASA Worldview",
    operator: "NASA Earthdata",
    jurisdiction: "global",
    kind: "Satellite fire observations",
    url: "https://worldview.earthdata.nasa.gov/",
    note: "Browser for satellite imagery layers.",
    status: "candidate",
  },
  {
    name: "Copernicus Atmosphere Monitoring Service (CAMS)",
    operator: "ECMWF, on behalf of the European Union",
    jurisdiction: "global",
    kind: "Modelling",
    url: "https://atmosphere.copernicus.eu/",
    note: "Atmospheric composition monitoring and forecasts, including fire emissions and smoke.",
    status: "candidate",
  },
  {
    name: "OpenAQ",
    operator: "OpenAQ (non-profit)",
    jurisdiction: "global",
    kind: "Air quality",
    url: "https://openaq.org/platform/",
    note: "Aggregates measurements from other providers. Provenance and licence must be checked per provider.",
    status: "candidate",
  },

  // Malaysia
  {
    name: "Department of Environment Malaysia (JAS / DOE)",
    operator: "Government of Malaysia",
    jurisdiction: "malaysia",
    kind: "Government publications",
    url: "https://www.doe.gov.my/en/headquarter/",
    status: "candidate",
  },
  {
    name: "Air Pollutant Index Management System (APIMS)",
    operator: "Department of Environment Malaysia",
    jurisdiction: "malaysia",
    kind: "Air quality",
    url: "https://eqms.doe.gov.my/APIMS/main",
    note: "Official Air Pollutant Index portal. Naming and hosting appear to have changed; to be confirmed.",
    status: "candidate",
  },
  {
    name: "Malaysian Meteorological Department (MetMalaysia)",
    operator: "Government of Malaysia",
    jurisdiction: "malaysia",
    kind: "Meteorology",
    url: "https://www.met.gov.my/",
    note: "Its general forecast by state is shown on /live (Experiment 003) through the data.gov.my Weather API; this website itself is not used.",
    status: "candidate",
  },
  {
    name: "data.gov.my — Monthly Air Pollution",
    operator: "Government of Malaysia open data portal",
    jurisdiction: "malaysia",
    kind: "Air quality",
    url: "https://data.gov.my/data-catalogue/air_pollution",
    note: "Monthly aggregated dataset. How current it is could not be confirmed. Not integrated; the timeline cites some of its monthly values as sources.",
    status: "candidate",
  },
  {
    name: "Laws of Malaysia",
    operator: "Attorney General's Chambers of Malaysia",
    jurisdiction: "malaysia",
    kind: "Legislation",
    url: "https://lom.agc.gov.my/",
    status: "candidate",
  },
  {
    name: "eJudgment",
    operator: "Malaysian Judiciary",
    jurisdiction: "malaysia",
    kind: "Court records",
    url: "https://ejudgment.kehakiman.gov.my/ejudgmentweb/searchpage.aspx?JurisdictionType=ALL",
    note: "Two judgment-search addresses were found; which is canonical is unconfirmed.",
    status: "candidate",
  },

  // Singapore
  {
    name: "National Environment Agency — Managing haze",
    operator: "National Environment Agency (NEA), Singapore",
    jurisdiction: "singapore",
    kind: "Air quality",
    url: "https://www.nea.gov.sg/our-services/pollution-control/air-pollution/managing-haze",
    linkable: false,
    status: "candidate",
  },
  {
    name: "haze.gov.sg",
    operator: "National Environment Agency (NEA), Singapore",
    jurisdiction: "singapore",
    kind: "Air quality",
    url: "https://www.haze.gov.sg/",
    note: "Official PSI and PM2.5 readings. Search results say real-time readings may later be verified and corrected.",
    linkable: false,
    status: "candidate",
  },
  {
    name: "data.gov.sg — Pollutant Standards Index (PSI)",
    operator: "Government of Singapore open data portal (data from NEA)",
    jurisdiction: "singapore",
    kind: "Air quality",
    url: "https://data.gov.sg/datasets/d_fe37906a0182569d891506e815e819b7/view",
    note: "Real-time API. Shown on /live (Experiment 003) without a key; data.gov.sg recommends a key for production use. Separately, the timeline (Experiment 002) cites individual responses from api.data.gov.sg/v1/environment/psi as sources.",
    status: "integrated",
  },
  {
    name: "Meteorological Service Singapore",
    operator: "National Environment Agency (NEA), Singapore",
    jurisdiction: "singapore",
    kind: "Meteorology",
    url: "https://www.weather.gov.sg/about-our-organisation/",
    note: "Its wind and rainfall station readings are shown on /live (Experiment 003) through data.gov.sg; this website itself was not opened and is not used.",
    status: "candidate",
  },
  {
    name: "Singapore Statutes Online",
    operator: "Attorney-General's Chambers, Singapore",
    jurisdiction: "singapore",
    kind: "Legislation",
    url: "https://sso.agc.gov.sg/Index",
    status: "candidate",
  },
  {
    name: "Judgments and case summaries",
    operator: "Singapore Courts",
    jurisdiction: "singapore",
    kind: "Court records",
    url: "https://judiciary.gov.sg/judgments/judgments-case-summaries",
    status: "candidate",
  },

  // Indonesia
  {
    name: "Ministry of Environment / Environmental Control Agency (KLH/BPLH)",
    operator: "Government of Indonesia",
    jurisdiction: "indonesia",
    kind: "Government publications",
    url: "https://kemenlh.go.id/news/",
    note: "Indonesia's former environment and forestry ministry was reportedly split in 2024; responsibilities should be confirmed.",
    status: "candidate",
  },
  {
    name: "Ministry of Forestry (Kemenhut)",
    operator: "Government of Indonesia",
    jurisdiction: "indonesia",
    kind: "Government publications",
    url: "https://www.kehutanan.go.id/pers",
    status: "candidate",
  },
  {
    name: "SiPongi+ forest and land fire monitoring",
    operator: "Ministry of Forestry, Indonesia",
    jurisdiction: "indonesia",
    kind: "Satellite fire observations",
    url: "https://sipongi.gakkum.kehutanan.go.id/",
    note: "Hotspot maps. News results quote the ministry as saying a hotspot is a temperature anomaly, not proof of fire.",
    status: "candidate",
  },
  {
    name: "Indonesian Agency for Meteorology, Climatology and Geophysics (BMKG)",
    operator: "Government of Indonesia",
    jurisdiction: "indonesia",
    kind: "Meteorology",
    url: "https://www.bmkg.go.id/",
    status: "candidate",
  },
  {
    name: "Directory of Supreme Court decisions",
    operator: "Supreme Court of Indonesia (Mahkamah Agung)",
    jurisdiction: "indonesia",
    kind: "Court records",
    url: "https://putusan3.mahkamahagung.go.id/direktori/index/kategori/kehutanan-1.html",
    note: "Link opens the forestry (Kehutanan) category; the directory root was not seen in search results.",
    status: "candidate",
  },
  {
    name: "Database of laws and regulations (peraturan.go.id)",
    operator: "Government of Indonesia",
    jurisdiction: "indonesia",
    kind: "Legislation",
    url: "https://peraturan.go.id/",
    status: "candidate",
  },

  // Research discovery
  {
    name: "OpenAlex",
    operator: "OpenAlex",
    jurisdiction: "global",
    kind: "Research discovery",
    url: "https://developers.openalex.org/",
    note: "Open index of scholarly works, for finding peer-reviewed research.",
    status: "candidate",
  },
  {
    name: "Crossref",
    operator: "Crossref",
    jurisdiction: "global",
    kind: "Research discovery",
    url: "https://www.crossref.org/documentation/retrieve-metadata/",
    note: "DOI metadata, useful for checking that a citation is real.",
    status: "candidate",
  },
];

/** Sources grouped by jurisdiction, in display order. */
export function sourcesByJurisdiction(): { jurisdiction: Jurisdiction; sources: CandidateSource[] }[] {
  const order: Jurisdiction[] = ["regional", "malaysia", "singapore", "indonesia", "global"];
  return order.map((jurisdiction) => ({
    jurisdiction,
    sources: candidateSources.filter((source) => source.jurisdiction === jurisdiction),
  }));
}
