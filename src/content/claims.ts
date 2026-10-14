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

export interface SiteClaim {
  claim: string;
  status: ClaimStatus;
  note: string;
  /** A word in another language inside the claim, marked up with its language code. */
  term?: { text: string; lang: string };
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
