import type { Widen } from "@/i18n/types";

import type { home as fr } from "../home";
import { openToRoles } from "./open-to-roles";

/** Home page copy in English. Same facts as the French page. */
export const home = {
  banner: { href: "/en/open-to-roles", label: openToRoles.banner },
  eyebrow: "Full-stack JavaScript developer · France",
  title: "I build web applications, from the database to production.",
  lead: "Next.js, Node.js and TypeScript. Every project is checked by continuous integration and documented: the code is public, and so are the decisions.",
  focus: {
    title: "What I work on",
    items: [
      { label: "Full-stack applications", detail: "Next.js, Node.js, TypeScript" },
      { label: "Infrastructure", detail: "Docker, Nginx, Linux, CI/CD" },
      { label: "Application security", detail: "Headers, validation, least privilege" },
    ],
  },
  primaryCta: { href: "/en/projects", label: "See the projects" },
  secondaryCta: { href: "/en/contact", label: "Get in touch" },

  about: {
    href: "/en/about",
    title: "In short",
    text: "I hold a bachelor’s degree in computer engineering (EQF level 6, recognized by ENIC-NARIC France) and study computer science at the University of Montpellier. I build and deploy complete web applications, with a strong interest in infrastructure and security.",
    link: "More about me",
  },

  pipeline: {
    eyebrow: "Under the hood",
  },

  selectedProjects: {
    href: "/en/projects",
    title: "Selected projects",
    all: "All projects",
  },

  specSheet: {
    title: "Spec sheet",
    subtitle: "This site is a project too. Here is how it is built.",
    rows: {
      framework: "Framework",
      language: "Language",
      language_value: "TypeScript, strict mode",
      rendering: "Rendering",
      rendering_value: "Static pages generated at build time",
      delivery: "Delivery",
      delivery_value: "GitHub Actions → Docker → Nginx",
      source: "Source code",
      source_value: "Public on GitHub",
      commit: "Commit",
      commit_local: "local build",
      builtAt: "Built on",
    },
  },
} as const satisfies Widen<typeof fr>;
