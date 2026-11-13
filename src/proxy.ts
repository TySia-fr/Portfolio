import { type NextRequest, NextResponse } from "next/server";

import { projectSources } from "@/content/projects";
import { LOCALE_COOKIE } from "@/i18n/config";

/**
 * Two jobs, both before any rendering starts.
 *
 * 1. Real 404 status for unknown project URLs, in both languages.
 *    /projets/[slug] and /en/projects/[slug] are partially prerendered (Cache
 *    Components): for a slug that was not generated at build time, Next.js
 *    streams the static shell, and with it a 200 status, before the page can
 *    call notFound(). The status cannot change once streaming has started.
 *    The slugs come from the same registry the pages are built from.
 *
 * 2. "/" sends English-speaking browsers to /en (ADR-0008). Deliberately narrow:
 *    only the home page, only when the browser asks for English before any
 *    French, never for crawlers or link previews (they must see each URL as
 *    it is), and never against a choice made with the language switcher.
 *    307: temporary, so no browser or search engine caches it as the page.
 */
const knownSlugs = new Set<string>(projectSources.map((project) => project.slug));

const BOTS =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|google-inspectiontool|whatsapp|telegram|skype|discord|slack/i;

/** Accept-Language prefers English over French (q-values respected). */
export function prefersEnglish(header: string | null): boolean {
  if (!header) return false;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((param) => param.trim().startsWith("q="));
      return { lang: tag.split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.lang === "en" || entry.lang === "fr")
    .sort((a, b) => b.q - a.q);
  return ranked[0]?.lang === "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const choice = request.cookies.get(LOCALE_COOKIE)?.value;
    const userAgent = request.headers.get("user-agent") ?? "";
    const toEnglish =
      choice === "en" ||
      (choice !== "fr" &&
        !BOTS.test(userAgent) &&
        prefersEnglish(request.headers.get("accept-language")));
    const response = toEnglish
      ? NextResponse.redirect(new URL("/en", request.url), 307)
      : NextResponse.next();
    // The answer depends on these headers: no cache may reuse it for everyone.
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
  }

  const slug = pathname.split("/").at(-1);
  if (slug === undefined || knownSlugs.has(slug)) return NextResponse.next();

  // Rewriting to a path that matches no route renders app/global-not-found.tsx
  // with a genuine 404, for full page loads and client-side navigations alike.
  return NextResponse.rewrite(new URL("/_introuvable", request.url));
}

export const config = {
  // The home page, and exactly one segment under each projects list.
  matcher: ["/", "/projets/:slug", "/en/projects/:slug"],
};
