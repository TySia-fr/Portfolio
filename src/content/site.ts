/**
 * Site-wide copy and links. Components import from here and never hard-code
 * sentences, so an English version is a second dictionary, not a rewrite (ADR-0003).
 */

export type NavItem = {
  href: `/${string}`;
  label: string;
};

export const site = {
  name: "Siavash Izadi",
  role: "Développeur full-stack JavaScript",
  location: "France",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Forwarded to a private inbox by Cloudflare Email Routing (see deploy runbook). */
  email: "contact@siavashizadi.com",
  githubUrl: "https://github.com/TySia-fr",
  linkedinUrl: "https://www.linkedin.com/in/siavash-izadi-00a16b439/",
  repositoryUrl: "https://github.com/TySia-fr/Portfolio",

  nav: [
    { href: "/projets", label: "Projets" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ],

  ui: {
    skipToContent: "Aller au contenu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    mainNavigation: "Navigation principale",
    home: "Accueil",
  },

  footer: {
    sourceCode: "Code source",
    legal: "Mentions légales",
    builtFrom: "Version",
  },
} as const satisfies {
  nav: readonly NavItem[];
  [key: string]: unknown;
};
