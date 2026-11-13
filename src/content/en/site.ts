import type { Widen } from "@/i18n/types";

import type { site as fr } from "../site";
import { site as base } from "../site";

/** Site-wide copy in English. Identity and links come from the French module. */
export const site = {
  ...base,
  portrait: { ...base.portrait, alt: "Portrait of Siavash Izadi" },
  role: "Full-stack JavaScript developer",

  nav: [
    { href: "/en/projects", label: "Projects" },
    { href: "/en/open-to-roles", label: "Open to roles" },
    { href: "/en/about", label: "About" },
    { href: "/en/contact", label: "Contact" },
  ],

  ui: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNavigation: "Main navigation",
    home: "Home",
    tagline: "full-stack",
    language: "Language",
  },

  notFound: {
    eyebrow: "Error 404",
    title: "This page does not exist.",
    body: "The address may be mistyped, or the page has moved.",
    back: "Back to home",
  },

  meta: {
    description:
      "Siavash Izadi (سیاوش ایزدی), full-stack JavaScript developer based in France: projects, method and contact.",
  },

  footer: {
    cvHref: "/en/cv",
    legalHref: "/en/legal",
    sourceCode: "Source code",
    legal: "Legal notice",
    cv: "Résumé",
    builtFrom: "Version",
  },
} as const satisfies Widen<typeof fr>;
