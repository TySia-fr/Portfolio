import { type NextRequest, NextResponse } from "next/server";

import { projectSources } from "@/content/projects";

/**
 * Real 404 status for unknown project URLs.
 *
 * /projets/[slug] is partially prerendered (Cache Components): for a slug that
 * was not generated at build time, Next.js streams the static shell, and with it
 * a 200 status, before the page can call notFound(). The status cannot change
 * once streaming has started, so the check has to happen before rendering.
 *
 * The slugs come from the same registry the pages are built from, so adding a
 * project needs no change here.
 */
const knownSlugs = new Set<string>(projectSources.map((project) => project.slug));

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug === undefined || knownSlugs.has(slug)) return NextResponse.next();

  // Rewriting to a path that matches no route renders app/not-found.tsx with a
  // genuine 404, for full page loads and client-side navigations alike.
  return NextResponse.rewrite(new URL("/_introuvable", request.url));
}

export const config = {
  // Exactly one segment under /projets. The list page itself is not matched.
  matcher: "/projets/:slug",
};
