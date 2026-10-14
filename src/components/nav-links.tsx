"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/site";

/**
 * Primary navigation links. A Client Component only so the current page can
 * be marked with `aria-current`; everything else in the header is static.
 */
export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={`inline-flex min-h-11 items-center border-b-2 px-0.5 transition-colors hover:text-paper ${
                current ? "border-signal text-paper" : "border-transparent text-ink-muted"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </>
  );
}
