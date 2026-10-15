/**
 * Claims register: the factual statements this website itself makes, and how
 * well each one is currently supported.
 *
 * The project applies its own evidence rules to its own copy. A claim is only
 * "Cited" once a reliable source is linked, and only "Human verified" once a
 * named human reviewer has checked that source.
 *
 * A claim's support can be direct citations (since Experiment 003), a set of
 * claims in the haze history dataset (data/haze-events.json, since Experiment
 * 002), each of which carries its sources and the exact passages relied on,
 * or both. The checks at the bottom of this file run when the site is built.
 */

import { allClaims, isRealDate, NOT_A_PERSON } from "./haze-history";

export type ClaimStatus = "unverified" | "cited" | "human-verified";

export const claimStatusLabel: Record<ClaimStatus, string> = {
  unverified: "Unverified",
  cited: "Cited",
  "human-verified": "Human verified",
};

/**
 * A source for a claim, following the citation standard in
 * docs/METHODOLOGY.md (section 6). "Read by" says who opened it: until a
 * named human has checked it, a claim stays "Cited", never "Human verified".
 */
export interface Citation {
  title: string;
  publisher: string;
  url: string;
  /** Date published or last updated, as the source states it; "undated" if none. */
  published: string;
  accessed: string;
  /** The exact words relied on. */
  quote?: string;
  readBy: string;
  /**
   * A copy in a public web archive. Where the live page refused automated
   * requests, this is the copy that was actually read.
   */
  archivedCopy?: string;
  /**
   * False when the publisher's terms of use restrict linking to the page
   * without permission. The address is then shown as text, not as a link.
   */
  linkable: boolean;
}

/** Who checked a claim, when, and what they checked. Recorded on a human's own word, never by an AI on its own. */
export interface HumanVerification {
  by: string;
  /** YYYY-MM-DD */
  on: string;
  notes: string;
}

export interface SiteClaim {
  claim: string;
  status: ClaimStatus;
  note: string;
  /** A word in another language inside the claim, marked up with its language code. */
  term?: { text: string; lang: string };
  /**
   * Sources cited directly (Experiment 003 onwards). A "cited" or
   * "human-verified" claim needs these, `evidence`, or both.
   */
  citations?: readonly Citation[];
  /**
   * Ids of claims in data/haze-events.json that support this statement as
   * worded, each with its own sources (Experiment 002).
   */
  evidence?: readonly string[];
  /** Required for "human-verified" claims. Only a human may add this. */
  humanVerification?: HumanVerification;
}

/** Who read the sources cited in Experiment 003. */
const EXP003_READER =
  "AI agents (Claude Code), Experiment 003; then reviewed by the project’s maintainer (Kingway87) on 15 October 2026";

/**
 * The maintainer's review of the evidence on /live and /evidence, which
 * covers every claim cited in Experiment 003 (see src/content/review.ts).
 */
const EXP003_REVIEW: HumanVerification = {
  by: "Kingway87 (project maintainer)",
  on: "2026-10-15",
  notes:
    "Part of the maintainer’s review of the evidence presented on /live and /evidence against JEREBU.EXE’s evidence rules (branch experiment/003-live-evidence, commit 56d74b1), as stated by the maintainer on 15 October 2026. The individual checks were not itemised.",
};

export const siteClaims: readonly SiteClaim[] = [
  {
    claim: "“Jerebu” is the Malay word for haze.",
    term: { text: "Jerebu", lang: "ms" },
    status: "unverified",
    note: "Common usage. A dictionary citation should be added.",
  },
  {
    claim: "Haze episodes have recurred in Southeast Asia over decades.",
    status: "cited",
    note: "Framing from the project brief. Sourced in Experiment 002 through the haze history dataset: in 2014 Singapore's environment ministry said Singapore had been affected by recurrent haze since 1991, and in 2021 NEA listed five haze-affected years from 2013 to 2019. The timeline records episodes from 1997 to 2026. Sources attached by an AI agent; not yet checked by a human.",
    evidence: ["1997-sum-3", "2006-sum-3", "2016-after-1"],
  },
  {
    claim: "Haze can cross national borders, affecting Malaysia and Singapore.",
    status: "cited",
    note: "Framing from the project brief. Sourced in Experiment 002 through the haze history dataset: Singapore's and Malaysia's environment agencies each described episodes in which smoke from fires in Indonesia affected their countries. These are the agencies' assessments, recorded as analysis. Sources attached by an AI agent; not yet checked by a human. Experiment 003 may add satellite evidence.",
    evidence: ["2013-sum-1", "2013-sum-2", "2015-sum-1", "2015-sum-2"],
  },
  {
    claim:
      "The information needed to understand haze is scattered across agencies, satellites, courts and archives.",
    status: "unverified",
    note: "Framing added by the AI that built V0; it is not in the founder’s brief. To be tested by later experiments.",
  },
  {
    claim: "People in Indonesia are also affected by fires and haze.",
    status: "cited",
    note: "Framing from the project brief. Sourced in Experiment 002 through the haze history dataset, for example school closures in Palangka Raya in 2015 and an air pollution emergency declared in Riau in 2019. Sources attached by an AI agent; not yet checked by a human.",
    evidence: ["2015-region-12", "2019-region-9", "2010-diplomatic-2"],
  },
  {
    claim: "Fires have many possible causes, and where smoke travels depends on weather.",
    status: "unverified",
    note: "General framing. The haze history (Experiment 002) quotes agencies saying that prevailing winds carried smoke to Malaysia and Singapore, which supports the second half; no source was attached for the first half, so the claim stays unverified. To be sourced in Experiment 003.",
  },
  {
    claim:
      "A satellite hotspot is a detection of unusual heat at a place and time; it may or may not be a fire.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "Cited in Experiment 003 to NASA’s own description of FIRMS detections. NASA’s FAQ was read from an Internet Archive copy because earthdata.nasa.gov refused automated requests.",
    citations: [
      {
        title: "FIRMS FAQ",
        publisher: "NASA Earthdata",
        url: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
        published: "undated",
        archivedCopy: "https://web.archive.org/web/20261007083740/https://www.earthdata.nasa.gov/data/tools/firms/faq",
        accessed: "2026-10-15",
        quote:
          "Each hotspot/active fire detection represents the center of a pixel flagged as containing one or more fires or other thermal anomalies (such as volcanoes).",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim:
      "Malaysia and Singapore have different legal and regulatory environments.",
    status: "unverified",
    note: "They are separate sovereign states. No specific legal claim is made; detail belongs to Experiment 004.",
  },

  // Added in Experiment 003 (live evidence), for statements made on /live.
  {
    claim:
      "Singapore’s 24-hour PSI is computed from six pollutants: each gets a sub-index, and the highest sub-index is the PSI.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "Stated on /live, which also names the pollutant whose published sub-index equals the PSI. For Singapore’s five regions, the published PSI equalled the highest of the five published sub-indices in every region-hour two AI agents checked (125 from 14 October 2026 to 01:00 on 15 October; 455 across six dates from 2021 to 2026). A separate “national” series, which the API returns for some older dates, did not always match: on 1 January 2021 its PSI equalled the west region’s PSI, not its own highest sub-index, in all 8 hours returned. One agent noted that the ozone and carbon monoxide sub-indices behave like 8-hour averages, so NEA’s “24-hour average” wording may be a simplification. NEA’s page was read once by an AI agent and not re-opened, because NEA’s terms forbid automated copying.",
    citations: [
      {
        title: "FAQs",
        publisher: "National Environment Agency, Singapore",
        url: "https://www.nea.gov.sg/our-services/pollution-control/air-pollution/faqs",
        published: "last updated 29 September 2026",
        accessed: "2026-10-15",
        quote:
          "The PSI is computed based on the 24-hour average of concentration levels of 6 pollutants namely, particulate matter (PM10), fine particulate matter (PM2.5), sulphur dioxide (SO2), nitrogen dioxide (NO2), ozone (O3), and carbon monoxide (CO). A sub-index value is computed for each pollutant based on the pollutant’s ambient air concentration. The highest sub-index value is then taken as the PSI value.",
        readBy: EXP003_READER,
        linkable: false,
      },
    ],
  },
  {
    claim:
      "NEA describes the 24-hour PSI as 0–50 Good, 51–100 Moderate, 101–200 Unhealthy, 201–300 Very unhealthy and above 300 Hazardous.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "Used to label each PSI reading on /live with NEA’s own descriptor.",
    citations: [
      {
        title: "FAQs",
        publisher: "National Environment Agency, Singapore",
        url: "https://www.nea.gov.sg/our-services/pollution-control/air-pollution/faqs",
        published: "last updated 29 September 2026",
        accessed: "2026-10-15",
        quote: "24-hour PSI | Descriptor | 0-50 | Good | 51-100 | Moderate | 101-200 | Unhealthy | 201-300 | Very Unhealthy | >300 | Hazardous",
        readBy: EXP003_READER,
        linkable: false,
      },
    ],
  },
  {
    claim:
      "NEA’s bands for 1-hour PM2.5 are Band I (Normal) 0–55, Band II (Elevated) 56–150, Band III (High) 151–250 and Band IV (Very high) 251 µg/m³ and above.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "From NEA’s infographic dated June 2026. NEA’s FAQ describes the Elevated band as “55 µg/m3 to 150 µg/m3”, so the two NEA sources differ by one at that edge; /live follows the infographic.",
    citations: [
      {
        title: "How to plan your outdoor activities during haze (infographic)",
        publisher: "National Environment Agency, Singapore",
        url: "https://www.nea.gov.sg/images/default-source/about-us/how-to-plan-your-outdoor-activities-during-haze.png",
        published: "June 2026",
        accessed: "2026-10-15",
        quote:
          "BAND 1 (NORMAL) (0 - 55 µg/m³) … BAND 2 (ELEVATED) (56 - 150 µg/m³) … BAND 3 (HIGH) (151 - 250 µg/m³) … BAND 4 (VERY HIGH) (≥251 µg/m³)",
        readBy: EXP003_READER,
        linkable: false,
      },
    ],
  },
  {
    claim:
      "Malaysia’s Air Pollutant Index is the highest of its pollutant sub-indices, with bands 0–50 Good, 51–100 Moderate, 101–200 Unhealthy, 201–300 Very unhealthy and above 300 Hazardous.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "From the Department of Environment’s method document, which also gives each pollutant’s averaging period. Its health table calls 101–200 “Unhealthy (for sensitive group)” and adds “Emergency” above 500.",
    citations: [
      {
        title: "Pengiraan Indeks Pencemar Udara (IPU) / Air Pollutant Index (API) Calculation",
        publisher: "Department of Environment Malaysia",
        url: "https://eqms.doe.gov.my/Documents/APIMS/API_Calculation.pdf",
        published: "listed on the APIMS page as 19 February 2024",
        accessed: "2026-10-15",
        quote:
          "API = MAX (SI SO2 , SI PM10, SI PM2.5, SI O3 (8h), SI O3 (1h), SI NO2, SI CO) … IFS(API<51, “Baik/Good”, API<101, “Sederhana/Moderate”, API<201, “Tidak Sihat/Unhealthy”, API<301, “Sangat Tidak/Very Unhealty”, API<501, “Merbahaya/Hazardous”)",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim:
      "Malaysia’s Air Pollutant Index and Singapore’s PSI are calculated differently: for example, DOE averages sulphur dioxide over one hour, while NEA publishes a 24-hour sulphur dioxide value and describes the PSI as based on 24-hour averages.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "The reason /live tells readers not to compare the two indices directly. NEA also says that readings or indices from other websites, such as aqicn.org, are not comparable with its 24-hour PSI. NEA’s own PSI response publishes nitrogen dioxide as a 1-hour maximum and ozone and carbon monoxide as 8-hour maxima, so its “24-hour average” wording does not apply to every pollutant.",
    citations: [
      {
        title: "Pengiraan Indeks Pencemar Udara (IPU) / Air Pollutant Index (API) Calculation, page 4",
        publisher: "Department of Environment Malaysia",
        url: "https://eqms.doe.gov.my/Documents/APIMS/API_Calculation.pdf",
        published: "listed on the APIMS page as 19 February 2024",
        accessed: "2026-10-15",
        readBy: EXP003_READER,
        linkable: true,
      },
      {
        title: "FAQs",
        publisher: "National Environment Agency, Singapore",
        url: "https://www.nea.gov.sg/our-services/pollution-control/air-pollution/faqs",
        published: "last updated 29 September 2026",
        accessed: "2026-10-15",
        quote:
          "The PSI is computed based on the 24-hour average of concentration levels of 6 pollutants … Air quality readings or indices provided by other websites, such as aqicn.org, adopt other methods of computing the index and are not comparable with the 24-hr PSI.",
        readBy: EXP003_READER,
        linkable: false,
      },
      {
        title: "Pollutant Standards Index (PSI) real-time API: names of the published readings",
        publisher: "National Environment Agency, published on data.gov.sg",
        url: "https://api-open.data.gov.sg/v2/real-time/api/psi",
        published: "live data, read 15 October 2026",
        accessed: "2026-10-15",
        quote: "so2_twenty_four_hourly … no2_one_hour_max … o3_eight_hour_max … co_eight_hour_max",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim:
      "The wind readings that data.gov.sg publishes for Singapore’s weather stations are 10-minute means, and the weather data is subject to later correction.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "Stated next to the wind and rainfall readings on /live.",
    citations: [
      {
        title: "Wind Direction across Singapore (dataset description)",
        publisher: "National Environment Agency, published on data.gov.sg",
        url: "https://data.gov.sg/datasets/d_534cf203023b51f51f879145ccc56ff9/view",
        published: "undated",
        accessed: "2026-10-15",
        quote:
          "The data is subject to correction subsequently if necessary. … The wind observations on this page refers to the mean wind over a period of 10 minutes.",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim:
      "A FIRMS detection does not give a fire’s exact location or size: it marks the centre of a satellite pixel about 375 metres across for VIIRS, in which at least one fire or other thermal anomaly was detected.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "Stated on /live, next to the satellite detections. Read from an Internet Archive copy of NASA’s FAQ (see above).",
    citations: [
      {
        title: "FIRMS FAQ",
        publisher: "NASA Earthdata",
        url: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
        published: "undated",
        archivedCopy: "https://web.archive.org/web/20261007083740/https://www.earthdata.nasa.gov/data/tools/firms/faq",
        accessed: "2026-10-15",
        quote:
          "For MODIS the pixel is approximately 1 km and for VIIRS the pixel is approximately 375 m. … We are not able to determine the exact location or size of the fire; what we do know is that at least one fire is located within the flagged pixel.",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim:
      "Satellites miss some fires: fires that start and end between overpasses, fires hidden by cloud, heavy smoke or tree canopy, and fires too small or too cool to detect. Zero detections is not zero fires.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "The basis for the page’s rule that no detections never means no fires.",
    citations: [
      {
        title: "FIRMS FAQ",
        publisher: "NASA Earthdata",
        url: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
        published: "undated",
        archivedCopy: "https://web.archive.org/web/20261007083740/https://www.earthdata.nasa.gov/data/tools/firms/faq",
        accessed: "2026-10-15",
        quote:
          "The fire may have started and ended between satellite observations; cloud cover, heavy smoke, or tree canopy may completely obscure a fire; occasionally the instruments are inoperable and can observe nothing during these times … the fire may have been too small or too cool to be detected.",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim: "Delivery of Suomi NPP satellite data ends on 2 November 2026 at 13:00 UTC, so /live uses VIIRS on NOAA-20 and NOAA-21 only.",
    status: "human-verified",
    humanVerification: EXP003_REVIEW,
    note: "NASA says the date is subject to change; an older FIRMS notice gave 1 November 2026.",
    citations: [
      {
        title: "Cessation of Suomi National Polar-orbiting Partnership (S-NPP) data to users on/after November 2, 2026",
        publisher: "NOAA National Environmental Satellite, Data, and Information Service (NESDIS)",
        url: "https://www.nesdis.noaa.gov/news/cessation-of-suomi-national-polar-orbiting-partnership-s-npp-data-users-onafter-november-2-2026",
        published: "issued 3 August 2026",
        accessed: "2026-10-15",
        quote: "VIIRS - data will no longer be available after November 2, 2026, at 13:00 UTC (8:00 AM EST)",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim:
      "No documented public data feed or downloadable dataset of Malaysia’s current Air Pollutant Index readings was found.",
    status: "unverified",
    note: "A negative finding by AI agents in Experiment 003, after checking DOE’s APIMS page and scripts, DOE’s open-data pages, DOE’s only documented API (for industrial emissions submissions) and the data.gov.my catalogue. DOE’s open-data page does list the index as an open dataset, linking to the APIMS page. Absence is hard to prove: a human should confirm it, ideally with DOE.",
  },
];

// ── Build-time checks ───────────────────────────────────────────────────

const datasetClaimIds = new Set(allClaims().map((c) => c.id));

for (const entry of siteClaims) {
  const where = `Claims register entry "${entry.claim}"`;
  if (entry.status !== "unverified" && !entry.citations?.length && !entry.evidence?.length) {
    throw new Error(`${where} is "${entry.status}" but lists no citations or evidence.`);
  }
  for (const id of entry.evidence ?? []) {
    if (!datasetClaimIds.has(id)) throw new Error(`${where} cites unknown dataset claim "${id}".`);
  }
  if (entry.status === "human-verified" && !entry.humanVerification) {
    throw new Error(`${where} is "human-verified" but does not say who verified it, or when.`);
  }
  if (entry.humanVerification) {
    const { by, on } = entry.humanVerification;
    if (entry.status !== "human-verified") {
      throw new Error(`${where} records a verifier but is not "human-verified".`);
    }
    if (!by.trim() || NOT_A_PERSON.test(by)) {
      throw new Error(`${where}: only a named human can verify a claim.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(on) || !isRealDate(on)) {
      throw new Error(`${where}: the verification date must be a real YYYY-MM-DD date.`);
    }
  }
}
