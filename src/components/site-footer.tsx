import Link from "next/link";
import { mainNav, repoFile, site } from "@/content/site";
import { Container } from "./container";
import { Wordmark } from "./wordmark";

const projectLinks = [
  { href: site.repoUrl, label: "Source code" },
  { href: repoFile("docs/METHODOLOGY.md"), label: "Methodology" },
  { href: repoFile("docs/AI_TRANSPARENCY.md"), label: "AI transparency" },
  { href: repoFile("CONTRIBUTING.md"), label: "Contributing" },
  { href: repoFile("LICENSE"), label: "MIT License" },
];

export function SiteFooter() {
  return (
    <footer className="surface-dark mt-auto border-t border-ink-line">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="md:col-span-2 lg:col-span-4">
          <Link href="/" className="inline-flex text-xl" aria-label={`${site.name} home`}>
            <Wordmark />
          </Link>
          <p className="mt-6 max-w-md leading-relaxed text-ink-muted">
            An independent, educational, open-source civic-tech experiment. It is not an
            official Malaysian or Singaporean initiative, and it does not provide legal,
            medical or scientific advice.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
            This version was built mainly by AI agents (Claude Code), from briefs written by the project’s founder. Use of Claude Code does not imply endorsement by
            Anthropic. AI-generated research must be independently verified before being treated
            as evidence.
          </p>
        </div>

        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
          <div>
            <h2 className="label-mono text-ink-muted">Site</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="hover:text-signal">
                  Home
                </Link>
              </li>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-signal">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label-mono text-ink-muted">Project</h2>
            <ul className="mt-4 space-y-2">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} rel="noopener noreferrer" className="hover:text-signal">
                    {link.label}
                    <span aria-hidden="true">&nbsp;↗</span>
                    <span className="sr-only"> (GitHub, external site)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="label-mono text-ink-muted">Contact</h2>
          <p className="mt-4">
            <a href={`mailto:${site.contactEmail}`} className="[overflow-wrap:anywhere] underline underline-offset-4 hover:text-signal">
              {site.contactEmail}
            </a>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Please do not send personal health information or confidential documents.
          </p>
        </div>
      </Container>
      <div className="border-t border-ink-line">
        <Container className="label-mono flex flex-wrap justify-between gap-x-8 gap-y-2 py-6 text-ink-muted">
          <p>{site.tagline}</p>
          <p>Open source · MIT License · Built in public</p>
        </Container>
      </div>
    </footer>
  );
}
