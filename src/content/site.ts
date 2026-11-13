/**
 * Site-wide copy and links. Components import from here and never hard-code
 * sentences, so an English version is a second dictionary, not a rewrite (ADR-0003).
 */

export type NavItem = {
  href: string;
  label: string;
};

export const site = {
  name: "Siavash Izadi",
  /** The same name in Persian script, so the site can be found by it (SEO). */
  nameFa: "سیاوش ایزدی",
  givenName: "Siavash",
  /** Square portrait in public/images/profile, exported at these widths. */
  portrait: {
    base: "/images/profile/siavash-izadi",
    widths: [200, 400],
    size: 400,
    alt: "Portrait de Siavash Izadi",
  },
  familyName: "Izadi",
  role: "Développeur full-stack JavaScript",
  location: "France",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Forwarded to a private inbox by Cloudflare Email Routing (see deploy runbook). */
  email: "contact@siavashizadi.com",
  githubUrl: "https://github.com/TySia-fr",
  linkedinUrl: "https://www.linkedin.com/in/siavash-izadi/",
  repositoryUrl: "https://github.com/TySia-fr/Portfolio",

  nav: [
    { href: "/projets", label: "Projets" },
    { href: "/alternance", label: "Alternance" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ],

  ui: {
    skipToContent: "Aller au contenu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    mainNavigation: "Navigation principale",
    home: "Accueil",
    /** Header tag next to the name. */
    tagline: "full-stack",
    language: "Langue",
  },

  notFound: {
    eyebrow: "Erreur 404",
    title: "Cette page n’existe pas.",
    body: "L’adresse est peut-être mal saisie, ou la page a été déplacée.",
    back: "Retour à l’accueil",
  },

  /** Home page <title> and description (the layout's defaults). */
  meta: {
    description:
      "Siavash Izadi (سیاوش ایزدی), développeur full-stack JavaScript basé en France : projets, méthode et contact.",
  },

  footer: {
    cvHref: "/cv",
    legalHref: "/mentions-legales",
    sourceCode: "Code source",
    legal: "Mentions légales",
    cv: "CV",
    builtFrom: "Version",
  },
} as const satisfies {
  nav: readonly NavItem[];
  [key: string]: unknown;
};
