import Link from "next/link";

import { Container } from "@/components/layout/container";
import { LostSignal } from "@/components/not-found/lost-signal";
import { RequestTrace, Suggestion } from "@/components/not-found/request-trace";
import { ButtonLink } from "@/components/ui/button-link";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { type RouteKey, href, projectHref, routes } from "@/i18n/routes";
import { getAllProjects } from "@/lib/projects";

/** Every page of one language, with the name a visitor knows it by. */
function pagesOf(locale: Locale) {
  const { site } = getContent(locale);
  const navLabel = (key: RouteKey) =>
    site.nav.find((item) => item.href === href(locale, key))?.label ?? key;
  const labels: Record<RouteKey, string> = {
    home: site.ui.home,
    projects: navLabel("projects"),
    opportunities: navLabel("opportunities"),
    cv: site.footer.cv,
    about: navLabel("about"),
    contact: navLabel("contact"),
    legal: site.footer.legal,
  };
  return [
    ...(Object.keys(routes) as RouteKey[]).map((key) => ({
      href: href(locale, key),
      label: labels[key],
    })),
    ...getAllProjects(locale).map((project) => ({
      href: projectHref(locale, project.slug),
      label: project.title,
    })),
  ];
}

function Copy({ locale, headingLevel }: { locale: Locale; headingLevel: 1 }) {
  const { site } = getContent(locale);
  const t = site.notFound;
  const Heading = `h${headingLevel}` as const;
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-16">
      <div>
        <p className="font-mono text-xs tracking-wider text-muted uppercase">
          {t.eyebrow}
        </p>
        <Heading className="mt-4 font-mono text-3xl font-medium tracking-tight text-balance [font-stretch:80%] sm:text-5xl">
          {t.title}
        </Heading>
        <p className="mt-5 max-w-xl text-lg text-pretty text-muted">{t.body}</p>
        <div className="mt-6 min-h-6">
          <Suggestion label={t.suggestion} pages={pagesOf(locale)} />
        </div>
        <div className="mt-8">
          <ButtonLink href={href(locale, "home")}>{t.back}</ButtonLink>
        </div>
        <nav aria-label={t.elsewhere} className="mt-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.8125rem]">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-signal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={site.footer.cvHref}
                className="text-muted transition-colors hover:text-signal"
              >
                {site.footer.cv}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <RequestTrace label={t.trace.label} hops={t.trace.hops} missing={t.trace.missing} />
    </div>
  );
}

/**
 * The 404 page. `locales` has one entry inside a language's layout, and both
 * for the global 404, where the language is only known in the browser: an
 * inline script in app/global-not-found.tsx sets <html lang> from the URL
 * before paint, and CSS shows the matching block (no flash, no JS needed after).
 */
export function NotFoundView({ locales }: { locales: readonly Locale[] }) {
  const single = locales.length === 1;
  return (
    <section className="pb-24 sm:pb-32">
      <LostSignal className="nf-canvas mx-auto aspect-[17/8] max-h-[26rem] min-h-36 w-full max-w-6xl" />
      <Container>
        {locales.map((locale) =>
          single ? (
            <Copy key={locale} locale={locale} headingLevel={1} />
          ) : (
            <div key={locale} data-lang={locale} lang={locale}>
              <Copy locale={locale} headingLevel={1} />
            </div>
          ),
        )}
      </Container>
    </section>
  );
}
