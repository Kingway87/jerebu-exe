import type { ReactNode } from "react";

interface NotYetBuiltProps {
  title: string;
  /** Which experiment is expected to build this, e.g. "Experiment 003". */
  plannedFor?: string;
  children: ReactNode;
}

/**
 * Placeholder for a component that does not exist yet. It must say clearly
 * that nothing is shown, so an empty panel can never be mistaken for data.
 */
export function NotYetBuilt({ title, plannedFor, children }: NotYetBuiltProps) {
  return (
    <section
      aria-label={`${title} (not yet built)`}
      className="border-2 border-dashed border-subtle bg-paper-2 p-6 sm:p-8"
    >
      <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
        <span className="bg-ink px-2 py-0.5 text-paper">Not yet built</span>
        {plannedFor ? <span>Planned: {plannedFor}</span> : null}
      </p>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-3 max-w-2xl leading-relaxed text-muted">{children}</div>
    </section>
  );
}
