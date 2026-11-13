"use client";

import { useEffect, useId, useRef, useState } from "react";

import { NavLinks } from "@/components/layout/nav-links";
import type { NavItem } from "@/content/site";

type Props = {
  items: readonly NavItem[];
  labels: { open: string; close: string; nav: string };
};

export function MobileNav({ items, labels }: Props) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and returns focus to the button that opened it,
  // so keyboard users are never left "nowhere".
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-line/50 hover:text-text aria-expanded:bg-line/50 aria-expanded:text-text"
      >
        <span className="sr-only">{open ? labels.close : labels.open}</span>
        <MenuIcon open={open} />
      </button>

      {/* The header lives in the root layout and is never unmounted, so the
          menu must close itself when a link starts a navigation. */}
      <nav
        id={menuId}
        aria-label={labels.nav}
        hidden={!open}
        className="menu-panel header-pill absolute inset-x-0 top-full mt-2 rounded-2xl p-2"
      >
        <NavLinks
          items={items}
          onNavigate={() => setOpen(false)}
          numbered
          className="flex flex-col font-mono text-lg font-medium [font-stretch:87.5%] sm:text-xl"
          linkClassName="flex items-baseline rounded-xl px-4 py-3.5 text-text hover:bg-line/50"
        />
      </nav>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
      {open ? (
        <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M2 6h16M2 14h16" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}
