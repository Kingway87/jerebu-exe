import type { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * Link to another website. Opens in the same tab (predictable for keyboard
 * and screen-reader users) and announces that it leaves the site.
 */
export function ExternalLink({ href, children, className = "" }: ExternalLinkProps) {
  return (
    <a href={href} className={className} rel="noopener noreferrer">
      {children}
      <span aria-hidden="true">&nbsp;↗</span>
      <span className="sr-only"> (external site)</span>
    </a>
  );
}
