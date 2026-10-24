import Link from "next/link";

import { Container } from "@/components/layout/container";
import { LogoMark } from "@/components/brand/logo-mark";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-sm">
      <Container className="relative flex h-16 items-center justify-between">
        {/* No aria-label: the accessible name must contain the visible text
            (WCAG 2.5.3). The hidden suffix tells screen readers where it goes. */}
        <Link
          href="/"
          className="group -ml-1 flex items-center gap-2.5 py-2 pl-1 font-mono text-sm font-medium tracking-tight [font-stretch:87.5%]"
        >
          <LogoMark className="size-6 text-text transition-colors group-hover:text-signal" />
          siavash izadi
          <span className="hidden text-muted sm:inline"> / full-stack</span>
          <span className="sr-only"> ({site.ui.home})</span>
        </Link>

        <nav aria-label={site.ui.mainNavigation} className="hidden md:block">
          <NavLinks
            items={site.nav}
            className="flex items-center gap-8 font-mono text-[0.8125rem]"
            linkClassName="nav-link py-2 text-muted"
          />
        </nav>

        <MobileNav
          items={site.nav}
          labels={{
            open: site.ui.openMenu,
            close: site.ui.closeMenu,
            nav: site.ui.mainNavigation,
          }}
        />
      </Container>
    </header>
  );
}
