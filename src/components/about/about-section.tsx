import type { ReactNode } from "react";
import { Container } from "@/components/container";

type Surface = "light" | "muted" | "dark";

interface AboutSectionProps {
  /** Short index label, e.g. "01". */
  index: string;
  eyebrow: string;
  /** Used as the h2 id and as the section's aria-labelledby target. */
  id: string;
  title: ReactNode;
  children: ReactNode;
  /** Optional element under the heading, e.g. an AI-transparency label. */
  meta?: ReactNode;
  surface?: Surface;
}

const surfaces: Record<Surface, { section: string; rule: string; eyebrow: string }> = {
  light: { section: "bg-paper", rule: "border-ink", eyebrow: "text-muted" },
  muted: { section: "bg-paper-2", rule: "border-ink", eyebrow: "text-muted" },
  dark: { section: "surface-dark", rule: "border-ink-line", eyebrow: "text-ink-muted" },
};

/**
 * Long-form editorial section for /about: the indexed eyebrow and h2 sit in a
 * narrow left column on large screens, and the text runs in a readable
 * measure beside it. Stacks to a single column on small screens.
 */
export function AboutSection({
  index,
  eyebrow,
  id,
  title,
  children,
  meta,
  surface = "light",
}: AboutSectionProps) {
  const s = surfaces[surface];

  return (
    <section aria-labelledby={id} className={`py-16 sm:py-20 ${s.section}`}>
      <Container>
        <div className={`grid gap-x-12 gap-y-8 border-t-2 pt-4 lg:grid-cols-12 ${s.rule}`}>
          <header className="lg:col-span-4">
            <p className={`label-mono flex items-center gap-3 ${s.eyebrow}`}>
              <span aria-hidden="true">§{index}</span>
              <span>{eyebrow}</span>
            </p>
            <h2
              id={id}
              className="mt-6 text-3xl leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-4xl"
            >
              {title}
            </h2>
            {meta ? <div className="mt-6">{meta}</div> : null}
          </header>
          <div className="min-w-0 lg:col-span-8 lg:pt-11">{children}</div>
        </div>
      </Container>
    </section>
  );
}

/** Opening statement of a section, set in the editorial serif. */
export function Lede({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[38ch] font-serif text-2xl leading-snug sm:text-[1.75rem] ${className}`}>
      {children}
    </p>
  );
}

/**
 * Body text at a readable measure (about 65 characters per line).
 * `className` replaces the default top margin, so pass e.g. "mt-8" to change it.
 */
export function Prose({ children, className = "mt-6" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[65ch] space-y-5 text-lg leading-relaxed text-graphite ${className}`}>
      {children}
    </div>
  );
}
