"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import type { NavItem } from "@/content/site";

type Props = {
  items: readonly NavItem[];
  className?: string;
  linkClassName?: string;
  /** Called when a link starts a navigation (used to close the mobile menu). */
  onNavigate?: () => void;
  /** Number the links (01, 02…), for the large mobile menu. */
  numbered?: boolean;
  /** A capsule behind the current link that slides when the page changes. */
  indicator?: boolean;
};

type Box = { left: number; width: number } | null;

/**
 * Client Component because it reads the current URL: the active link gets
 * aria-current="page" (announced as "current page" by screen readers) and,
 * on desktop, a capsule measured from that link. The header is never
 * unmounted, so the capsule moves from the old link to the new one.
 */
export function NavLinks({
  items,
  className = "",
  linkClassName = "",
  onNavigate,
  numbered = false,
  indicator = false,
}: Props) {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<Box>(null);

  useLayoutEffect(() => {
    if (!indicator) return;
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const current = list.querySelector<HTMLElement>('[aria-current="page"]');
      if (!current) return setBox(null);
      const listRect = list.getBoundingClientRect();
      const rect = current.getBoundingClientRect();
      setBox({ left: rect.left - listRect.left, width: rect.width });
    };
    measure();
    // Fonts loading or the window resizing change the links' widths.
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [indicator, pathname]);

  return (
    <ul ref={listRef} className={`${indicator ? "relative" : ""} ${className}`}>
      {indicator && (
        <span
          aria-hidden="true"
          className="nav-indicator"
          data-visible={box ? "" : undefined}
          style={
            box ? { transform: `translateX(${box.left}px)`, width: box.width } : undefined
          }
        />
      )}
      {items.map((item, index) => {
        const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              onNavigate={onNavigate}
              className={`${indicator ? "relative" : ""} transition-colors hover:text-text aria-[current=page]:text-signal ${linkClassName}`}
            >
              {numbered && (
                <span aria-hidden="true" className="mr-4 font-mono text-xs text-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
