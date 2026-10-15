/**
 * Claims register: the factual statements this website itself makes, and how
 * well each one is currently supported.
 *
 * The project applies its own evidence rules to its own copy. A claim is only
 * "Cited" once a reliable source is linked, and only "Human verified" once a
 * named human reviewer has checked that source.
 *
 * Since Experiment 002, a claim's evidence can be a set of claims in the haze
 * history dataset (data/haze-events.json), each of which carries its sources
 * and the exact passages relied on. The checks at the bottom of this file run
 * when the site is built.
 */

import { allClaims, isRealDate, NOT_A_PERSON } from "./haze-history";

export type ClaimStatus = "unverified" | "cited" | "human-verified";

export const claimStatusLabel: Record<ClaimStatus, string> = {
  unverified: "Unverified",
  cited: "Cited",
  "human-verified": "Human verified",
};

export interface SiteClaim {
  claim: string;
  status: ClaimStatus;
  note: string;
  /** A word in another language inside the claim, marked up with its language code. */
  term?: { text: string; lang: string };
  /**
   * Ids of claims in data/haze-events.json that support this statement as
   * worded. Required for "cited" and "human-verified".
   */
  evidence?: readonly string[];
  /** Who verified the claim against its sources, and when. Only a human may add this. */
  verifiedBy?: { name: string; date: string };
}

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
    status: "unverified",
    note: "Consistent with search-result snippets attributed to ASMC and, through news reports, to Indonesia’s forestry ministry; no page was opened. To be sourced in Experiment 003.",
  },
  {
    claim:
      "Malaysia and Singapore have different legal and regulatory environments.",
    status: "unverified",
    note: "They are separate sovereign states. No specific legal claim is made; detail belongs to Experiment 004.",
  },
];

// ── Build-time checks ───────────────────────────────────────────────────

const datasetClaimIds = new Set(allClaims().map((c) => c.id));

for (const entry of siteClaims) {
  const where = `Claims register entry "${entry.claim}"`;
  if (entry.status !== "unverified" && !entry.evidence?.length) {
    throw new Error(`${where} is "${entry.status}" but lists no evidence.`);
  }
  for (const id of entry.evidence ?? []) {
    if (!datasetClaimIds.has(id)) throw new Error(`${where} cites unknown dataset claim "${id}".`);
  }
  if (entry.status === "human-verified" && !entry.verifiedBy) {
    throw new Error(`${where} is "human-verified" but does not say who verified it, or when.`);
  }
  if (entry.verifiedBy) {
    const { name, date } = entry.verifiedBy;
    if (entry.status !== "human-verified") {
      throw new Error(`${where} records a verifier but is not "human-verified".`);
    }
    if (!name.trim() || NOT_A_PERSON.test(name)) {
      throw new Error(`${where}: only a named human can verify a claim.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isRealDate(date)) {
      throw new Error(`${where}: the verification date must be a real YYYY-MM-DD date.`);
    }
  }
}
