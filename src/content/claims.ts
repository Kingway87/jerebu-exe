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
}

export const siteClaims: readonly SiteClaim[] = [
  {
    claim: "“Jerebu” is the Malay word for haze.",
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
    claim: "People in Indonesia are also affected by fires and haze.",
    status: "unverified",
    note: "Framing from the project brief. To be sourced in Experiment 002.",
  },
  {
    claim:
      "Malaysia and Singapore have different legal and regulatory environments.",
    status: "unverified",
    note: "They are separate sovereign states. No specific legal claim is made; detail belongs to Experiment 004.",
  },
];
