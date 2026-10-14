/**
 * Claims register: the factual statements this website itself makes, and how
 * well each one is currently supported.
 *
 * The project applies its own evidence rules to its own copy. A claim is only
 * "Cited" once a reliable source is linked, and only "Human verified" once a
 * named human reviewer has checked that source.
 */

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
   * False when the publisher's terms of use restrict linking to the page
   * without permission. The address is then shown as text, not as a link.
   */
  linkable: boolean;
}

export interface SiteClaim {
  claim: string;
  status: ClaimStatus;
  note: string;
  /** A word in another language inside the claim, marked up with its language code. */
  term?: { text: string; lang: string };
  /** Required for "cited" and "human-verified" claims. */
  citations?: readonly Citation[];
}

/** Who read the sources cited in Experiment 003. */
const EXP003_READER = "AI agents (Claude Code), Experiment 003; not yet checked by a human";

export const siteClaims: readonly SiteClaim[] = [
  {
    claim: "“Jerebu” is the Malay word for haze.",
    term: { text: "Jerebu", lang: "ms" },
    status: "unverified",
    note: "Common usage. A dictionary citation should be added.",
  },
  {
    claim: "Haze episodes have recurred in Southeast Asia over decades.",
    status: "unverified",
    note: "Framing from the project brief. To be sourced in Experiment 002 (Haze history).",
  },
  {
    claim: "Haze can cross national borders, affecting Malaysia and Singapore.",
    status: "unverified",
    note: "Framing from the project brief. To be sourced in Experiments 002 and 003.",
  },
  {
    claim:
      "The information needed to understand haze is scattered across agencies, satellites, courts and archives.",
    status: "unverified",
    note: "Framing added by the AI that built V0; it is not in the founder’s brief. To be tested by later experiments.",
  },
  {
    claim: "People in Indonesia are also affected by fires and haze.",
    status: "unverified",
    note: "Framing from the project brief. To be sourced in Experiment 002.",
  },
  {
    claim: "Fires have many possible causes, and where smoke travels depends on weather.",
    status: "unverified",
    note: "General framing. To be sourced in Experiments 002 and 003.",
  },
  {
    claim:
      "A satellite hotspot is a detection of unusual heat at a place and time; it may or may not be a fire.",
    status: "cited",
    note: "Cited in Experiment 003 to NASA’s own description of FIRMS detections. NASA’s FAQ was read from an Internet Archive copy because earthdata.nasa.gov refused automated requests; a human should check the live page.",
    citations: [
      {
        title: "FIRMS Frequently Asked Questions",
        publisher: "NASA Earthdata",
        url: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
        published: "undated (Internet Archive copy of 7 October 2026)",
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
    status: "cited",
    note: "Stated on /live, which also shows the published sub-indices. The published PSI equalled the highest of the five published sub-indices in every region-hour two AI agents checked (125 on 14 October 2026; 455 across six dates from 2021 to 2026). One agent noted that the ozone and carbon monoxide sub-indices behave like 8-hour averages, so NEA’s “24-hour average” wording may be a simplification. NEA’s page was read once by an AI agent and not re-opened, because NEA’s terms forbid automated copying; a human should check it.",
    citations: [
      {
        title: "Air pollution FAQs",
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
    status: "cited",
    note: "Used to label each PSI reading on /live with NEA’s own descriptor.",
    citations: [
      {
        title: "Air pollution FAQs",
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
    status: "cited",
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
    status: "cited",
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
      "Malaysia’s Air Pollutant Index and Singapore’s PSI are calculated differently: for example, DOE averages sulphur dioxide and nitrogen dioxide over one hour, while NEA describes the PSI as based on 24-hour averages.",
    status: "cited",
    note: "The reason /live tells readers not to compare the two indices directly. NEA also says its PSI is not comparable with indices computed by other methods.",
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
        title: "Air pollution FAQs",
        publisher: "National Environment Agency, Singapore",
        url: "https://www.nea.gov.sg/our-services/pollution-control/air-pollution/faqs",
        published: "last updated 29 September 2026",
        accessed: "2026-10-15",
        quote:
          "Air quality readings or indices provided by other websites, such as aqicn.org, adopt other methods of computing the index and are not comparable with the 24-hr PSI.",
        readBy: EXP003_READER,
        linkable: false,
      },
    ],
  },
  {
    claim:
      "The wind readings that data.gov.sg publishes for Singapore’s weather stations are 10-minute means, and the weather data is subject to later correction.",
    status: "cited",
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
    status: "cited",
    note: "Stated on /live, next to the satellite detections. Read from an Internet Archive copy of NASA’s FAQ (see above).",
    citations: [
      {
        title: "FIRMS Frequently Asked Questions",
        publisher: "NASA Earthdata",
        url: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
        published: "undated (Internet Archive copy of 7 October 2026)",
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
    status: "cited",
    note: "The basis for the page’s rule that no detections never means no fires.",
    citations: [
      {
        title: "FIRMS Frequently Asked Questions",
        publisher: "NASA Earthdata",
        url: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
        published: "undated (Internet Archive copy of 7 October 2026)",
        accessed: "2026-10-15",
        quote:
          "The fire may have started and ended between satellite observations; cloud cover, heavy smoke, or tree canopy may completely obscure a fire; occasionally the instruments are inoperable and can observe nothing during these times",
        readBy: EXP003_READER,
        linkable: true,
      },
    ],
  },
  {
    claim: "Delivery of Suomi NPP satellite data ends on 2 November 2026 at 13:00 UTC, so /live uses VIIRS on NOAA-20 and NOAA-21 only.",
    status: "cited",
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
