import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";
type Surface = "light" | "dark";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  surface?: Surface;
  external?: boolean;
}

const base =
  "inline-flex min-h-12 items-center justify-center gap-3 border-2 px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.08em] transition-colors";

const styles: Record<Surface, Record<Variant, string>> = {
  light: {
    primary: "border-ink bg-ink text-paper hover:bg-charcoal",
    secondary: "border-ink bg-paper text-ink hover:bg-paper-2",
  },
  dark: {
    primary: "border-signal bg-signal text-ink hover:bg-paper hover:border-paper",
    secondary: "border-paper bg-transparent text-paper hover:bg-paper hover:text-ink",
  },
};

/** Call-to-action link styled as a button. Navigation only, never a form action. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  surface = "light",
  external = false,
}: ButtonLinkProps) {
  const className = `${base} ${styles[surface][variant]}`;

  if (external) {
    return (
      <a href={href} className={className} rel="noopener noreferrer">
        {children}
        <span aria-hidden="true">↗</span>
        <span className="sr-only"> (external site)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
