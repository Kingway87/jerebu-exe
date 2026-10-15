import type { Milestone, MilestoneGroup } from "@/content/haze-history";

/**
 * Addresses inside the timeline, in one place so that pages and components
 * agree on them.
 */

/** An episode's own page, e.g. /timeline/2015. */
export function episodeHref(id: string) {
  return `/timeline/${id}`;
}

/** A group's milestones page, e.g. /timeline/milestones/regional. */
export function milestoneGroupHref(group: MilestoneGroup) {
  return `/timeline/milestones/${group}`;
}

/** The id of a milestone's entry on its group's page. */
export function milestoneAnchor(id: string) {
  return `milestone-${id}`;
}

/** A milestone on its group's page. */
export function milestoneHref(milestone: Pick<Milestone, "id" | "group">) {
  return `${milestoneGroupHref(milestone.group)}#${milestoneAnchor(milestone.id)}`;
}

/** The page of periods considered and not included. */
export const notIncludedHref = "/timeline/not-included";

/** A period's entry on that page. */
export function excludedAnchor(id: string) {
  return id;
}
