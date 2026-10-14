/**
 * Site-wide constants. Anything that appears in more than one place
 * (names, URLs, contact details) lives here so it only changes once.
 */
export const site = {
  name: "JEREBU.EXE",
  tagline: "CLEAN AIR NOT FOUND.",
  description:
    "An open-source experiment using AI agents and public data to investigate recurring transboundary haze in Southeast Asia.",
  repoUrl: "https://github.com/Kingway87/jerebu-exe",
  contactEmail: "JEREBU.EXE@proton.me",
} as const;

/** Link to a file in the repository's default branch on GitHub. */
export function repoFile(path: string): string {
  return `${site.repoUrl}/blob/main/${path}`;
}

export interface NavItem {
  href: string;
  label: string;
}

export const mainNav: readonly NavItem[] = [
  { href: "/live", label: "Live" },
  { href: "/evidence", label: "Evidence" },
  { href: "/experiments", label: "Experiments" },
  { href: "/about", label: "About" },
];
