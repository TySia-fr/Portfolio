"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/content/site";

type Props = {
  items: readonly NavItem[];
  className?: string;
  linkClassName?: string;
  /** Called when a link starts a navigation (used to close the mobile menu). */
  onNavigate?: () => void;
};

/**
 * Client Component only because it reads the current URL to mark the active
 * link with aria-current, which screen readers announce as "current page".
 */
export function NavLinks({ items, className, linkClassName = "", onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {items.map((item) => {
        const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              onNavigate={onNavigate}
              className={`transition-colors hover:text-text aria-[current=page]:text-signal ${linkClassName}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
