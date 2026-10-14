/**
 * Copy for the live evidence page (/live), Experiment 003.
 *
 * Facts about each source (what it measures, its licence, its limits) live
 * in data/live-sources.json. This module holds the page's own framing: the
 * evidence model and what the data can and cannot support. It makes no
 * factual claim about any event, organisation or government. Statements
 * about the world that the page makes are registered in claims.ts.
 */

/** The founder's non-negotiable rule (Experiment 003 brief, section 04). */
export const attributionChain = [
  "Hotspot",
  "Fire cause",
  "Land owner",
  "Company",
  "Polluter",
  "Legal responsibility",
] as const;

/** The brief's second example of a step that must never be skipped. */
export const windFallacy = {
  premises: ["Wind toward Malaysia", "Fires in the region"],
  conclusion: "“Those fires caused Malaysia’s haze”",
} as const;

export interface LadderStep {
  level: "observation" | "interpretation" | "attribution" | "legal-responsibility";
  examples: string[];
  onThisPage: string;
}

/** The four evidence levels, as they apply to this page (Experiment 003 brief, section 03). */
export const ladderOnThisPage: readonly LadderStep[] = [
  {
    level: "observation",
    examples: [
      "A satellite detects a thermal anomaly.",
      "An agency publishes an air-quality reading.",
      "A weather station reports the wind direction.",
    ],
    onThisPage: "Everything shown as data on this page is at this level, copied from official sources by deterministic code.",
  },
  {
    level: "interpretation",
    examples: [
      "Fire activity increased in an area.",
      "Air quality deteriorated over a period.",
      "Weather conditions could carry smoke from one place to another.",
    ],
    onThisPage:
      "Not produced here. The page points to agencies that publish their own interpretations, and labels them as theirs.",
  },
  {
    level: "attribution",
    examples: ["Particular fires materially contributed to haze experienced somewhere else."],
    onThisPage: "Not attempted. It needs substantially more evidence than any data on this page.",
  },
  {
    level: "legal-responsibility",
    examples: ["A court or authorised body decides that a party is legally responsible."],
    onThisPage: "Never decided here. Only a legal process can establish it.",
  },
];

export interface MeaningItem {
  question: string;
  answer: string;
}

/** Questions the data on this page can help with, at the observation level. */
export const canAnswer: readonly MeaningItem[] = [
  {
    question: "Where did satellites detect thermal anomalies, and when?",
    answer: "NASA FIRMS detections, counted and mapped, with the satellite overpass times they come from.",
  },
  {
    question: "What is Singapore reporting about its air?",
    answer: "NEA’s 24-hour PSI and 1-hour PM2.5 by region, with NEA’s own descriptor bands and the reading time.",
  },
  {
    question: "What are Singapore’s weather stations measuring?",
    answer: "Wind direction, wind speed and rainfall at named stations, at a stated time.",
  },
  {
    question: "How old is each piece of data, and where did it come from?",
    answer: "Every dataset shows its source, the time it describes, when this site retrieved it, and its status.",
  },
];

/** Interpretive questions the page does not answer automatically, and what answering them would need. */
export const cannotAnswerYet: readonly MeaningItem[] = [
  {
    question: "Is the air getting better or worse?",
    answer: "Needs readings over days, compared with a stated baseline. The page shows the latest readings only.",
  },
  {
    question: "Did smoke from these fires reach Malaysia or Singapore?",
    answer:
      "Needs emissions estimates and atmospheric transport modelling over hours to days, with uncertainty. Wind at a station is one local measurement at one moment.",
  },
  {
    question: "Why are fires burning?",
    answer: "Needs investigation on the ground. A satellite detection carries no information about cause.",
  },
  {
    question: "Is Malaysia’s air worse than Singapore’s?",
    answer:
      "Malaysia’s Air Pollutant Index and Singapore’s PSI are different indices, calculated by different agencies with different methods. The same number need not mean the same air, so they cannot be compared directly.",
  },
];

export interface ReasonItem {
  title: string;
  body: string;
}

/** Why this system cannot identify a responsible company or establish legal responsibility. */
export const whyNoAttribution: readonly ReasonItem[] = [
  {
    title: "A detection is a heat signal, not a cause",
    body:
      "A FIRMS detection says that a satellite instrument flagged unusual heat in a pixel at the moment of an overpass. It does not say what was burning, how the fire started or who started it.",
  },
  {
    title: "The data contains no owner",
    body:
      "FIRMS records have fields for position, time, brightness, radiative power, confidence and the satellite. None says who owns, manages or uses the land. Land and concession records are separate datasets with their own sources and limits, and this page uses none of them.",
  },
  {
    title: "Location is approximate",
    body:
      "Each detection marks the centre of a satellite pixel hundreds of metres across, and the fire may be anywhere inside it. Near the edge of any parcel of land, a detection cannot settle which side the fire was on.",
  },
  {
    title: "Fire on land does not show who lit it",
    body:
      "A fire on a piece of land may have spread from elsewhere or been started by someone with no connection to whoever manages that land. Answering that question takes investigation, not observation from orbit.",
  },
  {
    title: "Linking smoke to fires needs modelling",
    body:
      "Saying that particular fires caused haze in a particular place needs emissions estimates and transport modelling, tested against observations, with the uncertainty stated. Fires in the region plus wind in a given direction is not that analysis.",
  },
  {
    title: "Responsibility is decided by law",
    body:
      "Legal responsibility depends on the applicable law, evidence and due process, and is decided by courts or authorised bodies. JEREBU.EXE can report such decisions, with citations. It does not make them.",
  },
];

/** What this page deliberately does not do (Experiment 003 brief, sections 04, 11 and 15). */
export const deliberatelyExcluded: readonly string[] = [
  "No company, concession or land-ownership overlays.",
  "No names of companies, people or governments in connection with any fire or haze.",
  "No automatic attribution, scoring or ranking of countries, areas or organisations.",
  "No AI-written summary or interpretation of the data.",
  "No request for your location, and no tracking.",
];
