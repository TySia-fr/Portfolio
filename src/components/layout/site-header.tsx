import Link from "next/link";

import { AnimatedLogo } from "@/components/brand/animated-logo";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";

/**
 * Floating header: a frosted pill that stays at the top of the viewport.
 * The outer <header> is sticky and transparent (clicks pass through its
 * margins); only the pill takes pointer events. Full navigation from lg
 * (1024px) up; below that, a menu button opens a panel under the pill, so
 * nothing wraps on tablets.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const { site } = getContent(locale);
  return (
    <header className="site-header pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="header-pill pointer-events-auto relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-4 sm:pl-5">
        {/* No aria-label: the accessible name must contain the visible text
            (WCAG 2.5.3). The hidden suffix tells screen readers where it goes. */}
        <Link
          href={href(locale, "home")}
          className="group flex min-w-0 shrink items-center gap-2.5 py-2 font-mono text-sm font-medium tracking-tight whitespace-nowrap [font-stretch:87.5%]"
        >
          <AnimatedLogo className="size-6 shrink-0 text-text transition-colors group-hover:text-signal" />
          <span className="max-[359px]:sr-only">siavash izadi</span>
          <span className="hidden text-muted xl:inline"> / {site.ui.tagline}</span>
          <span className="sr-only"> ({site.ui.home})</span>
        </Link>

        <nav aria-label={site.ui.mainNavigation} className="hidden lg:block">
          <NavLinks
            items={site.nav}
            indicator
            className="flex items-center gap-1 font-mono text-[0.8125rem] whitespace-nowrap"
            linkClassName="block rounded-full px-3.5 py-2 text-muted hover:bg-line/50 aria-[current=page]:hover:bg-transparent"
          />
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitch locale={locale} label={site.ui.language} />
          <MobileNav
            items={site.nav}
            labels={{
              open: site.ui.openMenu,
              close: site.ui.closeMenu,
              nav: site.ui.mainNavigation,
            }}
          />
        </div>
      </div>
    </header>
  );
}
