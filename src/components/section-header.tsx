import type { ReactNode } from "react";

interface SectionHeaderProps {
  /** Short index label, e.g. "01". */
  index: string;
  eyebrow: string;
  title: ReactNode;
  id: string;
  children?: ReactNode;
  surface?: "light" | "dark";
}

/**
 * Editorial section heading: an indexed mono eyebrow, a large h2 and an
 * optional intro. The h2 carries the `id` so sections can be linked to and
 * used as `aria-labelledby` targets.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  id,
  children,
  surface = "light",
}: SectionHeaderProps) {
  const muted = surface === "dark" ? "text-ink-muted" : "text-muted";
  const rule = surface === "dark" ? "border-ink-line" : "border-ink";

  return (
    <header className="mb-10 sm:mb-14">
      <p className={`label-mono flex items-center gap-3 border-t-2 pt-4 ${rule} ${muted}`}>
        <span aria-hidden="true">§{index}</span>
        <span>{eyebrow}</span>
      </p>
      <h2
        id={id}
        className="mt-6 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      {children ? (
        <div className={`mt-6 max-w-2xl text-lg leading-relaxed ${muted}`}>{children}</div>
      ) : null}
    </header>
  );
}
