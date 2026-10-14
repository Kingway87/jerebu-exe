import type { ReactNode } from "react";

/**
 * One of the project's AI-involvement labels (HUMAN DECISION, AI ASSISTED,
 * AI GENERATED, HUMAN VERIFIED, UNVERIFIED). The text carries the meaning;
 * the square is decorative. For light surfaces only.
 */
export function TransparencyLabel({ children }: { children: ReactNode }) {
  return (
    <span className="label-mono inline-flex items-center gap-2 border border-ink bg-paper px-2.5 py-1 whitespace-nowrap text-ink">
      <span aria-hidden="true" className="inline-block size-2 bg-ink" />
      {children}
    </span>
  );
}
