import type { ReactNode } from "react";

interface DisclosureProps {
  title: string;
  /** A short hint beside the title, such as "4 claims". */
  meta?: string;
  children: ReactNode;
}

/**
 * A section that starts closed, so a long record stays short on a phone.
 * Native <details>: it needs no JavaScript and works with a keyboard and
 * screen readers. The named group keeps its "+" separate from any
 * disclosures nested inside it.
 */
export function Disclosure({ title, meta, children }: DisclosureProps) {
  return (
    <details className="group/section border-b border-line">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 hover:text-signal-ink [&::-webkit-details-marker]:hidden">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="text-lg font-semibold tracking-tight">{title}</span>
          {meta ? <span className="label-mono text-muted">{meta}</span> : null}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-xl leading-none text-muted group-open/section:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pt-1 pb-8">
        {/* The visible title sits in <summary>, which cannot be a heading; this one is for heading navigation. */}
        <h3 className="sr-only">{title}</h3>
        {children}
      </div>
    </details>
  );
}

interface SubSectionProps {
  title: string;
  /**
   * Read before the title by screen readers only, e.g. "Malaysia", so that
   * heading navigation does not list several bare "Air quality" headings.
   */
  context?: string;
  children: ReactNode;
}

/**
 * A labelled group of claims inside a disclosure, e.g. "Air quality". An h4,
 * under the disclosure's own (visually hidden) h3.
 */
export function SubSection({ title, context, children }: SubSectionProps) {
  return (
    <section className="mt-6 first:mt-2 [.sr-only+&]:mt-2">
      <h4 className="label-mono text-muted">
        {context ? <span className="sr-only">{context}: </span> : null}
        {title}
      </h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}
