import Link from "next/link";
import { mainNav, site } from "@/content/site";
import { Container } from "./container";
import { NavLinks } from "./nav-links";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  return (
    <header className="surface-dark border-b border-ink-line">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-3">
        <Link href="/" className="inline-flex min-h-11 items-center text-lg" aria-label={`${site.name} home`}>
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="w-full sm:w-auto">
          <ul className="label-mono -mx-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-7">
            <NavLinks items={mainNav} />
            <li>
              <a
                href={site.repoUrl}
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center border-b-2 border-transparent px-0.5 text-ink-muted transition-colors hover:text-paper"
              >
                Source<span aria-hidden="true">&nbsp;↗</span>
                <span className="sr-only"> code on GitHub (external site)</span>
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
