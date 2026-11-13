/**
 * The English counterpart of the French alternance page, for employers and
 * clients anywhere. Siavash's brief (2026-11-12): keep his options as open as
 * possible, start his career fast, work in his field; open to full-time,
 * freelance and remote work. Deliberately no list of countries (a list
 * excludes everyone not on it), no relocation promise and no statement about
 * visas or work permits. Every skill claim links to a project that proves it;
 * the test counts come from the case studies.
 */
import type { alternance } from "@/content/alternance";
import type { Widen } from "@/i18n/types";

export const openToRoles = {
  title: "Open to roles",
  metaTitle: "Open to software development roles",
  description:
    "Siavash Izadi, full-stack JavaScript developer based in France, is open to full-time, freelance and remote roles in software development.",
  eyebrow: "Available now",
  heading: "Open to full-time, freelance and remote roles in software development.",
  intro:
    "On-site, hybrid or remote. I build web applications, test them and deploy them on a Linux server I run myself. Everything on this page links to code you can read.",

  /** Short forms, reused by the home banner and the résumé. */
  banner: "Open to full-time, freelance and remote roles",
  short: "Open to full-time, freelance and remote roles in software development.",

  facts: {
    title: "At a glance",
    items: [
      { label: "Roles", value: "Software development: web, full-stack, back-end" },
      { label: "Work", value: "Full-time, freelance or contract" },
      { label: "Setting", value: "On-site, hybrid or remote" },
      { label: "Based in", value: "France" },
      { label: "Start", value: "As soon as possible" },
      {
        label: "Degree",
        value: "Bachelor’s in computer engineering, EQF level 6 (ENIC-NARIC France)",
      },
    ],
  },

  domains: {
    title: "What I can do for your team",
    proofLabel: "Proof",
    intro:
      "Three areas where I have already shipped something you can check. Every proof is a public project.",
    items: [
      {
        title: "Web development",
        body: "Complete applications in TypeScript: React / Next.js front end, server logic, PostgreSQL, accounts and access control.",
        proofs: [
          {
            href: "/en/projects/nexora",
            label:
              "NEXORA, live e-commerce store: 79 unit and integration tests, 20 end-to-end",
          },
          {
            href: "/en/projects/applyflow",
            label:
              "ApplyFlow, live job-search tracker with a Telegram bot: 68 tests, 12 end-to-end",
          },
        ],
      },
      {
        title: "Systems and deployment",
        body: "A Linux server I run alone: Docker, Nginx, HTTPS, unprivileged containers, automatic deployment that rolls back when the health check fails.",
        proofs: [
          {
            href: "/en/projects/portfolio",
            label: "This site, deployed by GitHub Actions on every change",
          },
        ],
      },
      {
        title: "Application security",
        body: "Permissions checked on the server for every request, validation of every input, a content security policy, rate limits.",
        proofs: [
          {
            href: "/en/projects/nexora",
            label: "IDOR and open-redirect tests in NEXORA",
          },
        ],
      },
    ],
  },

  learn: {
    title: "What I am looking for",
    body: "I built my projects alone. What I want next is what only a team gives you:",
    items: [
      "working with others, with code reviews and shared decisions;",
      "a product with real users, a history and real constraints;",
      "experienced engineers to learn from, so I grow faster than I would alone.",
    ],
  },

  practical: {
    title: "Working together",
    items: [
      {
        title: "Any format",
        body: "A permanent position, a fixed-term contract or a freelance project: tell me what you need.",
      },
      {
        title: "Any setting",
        body: "In your office, hybrid or fully remote.",
      },
      {
        title: "The interview",
        body: "I can walk you through my code live and answer technical questions on every choice.",
      },
    ],
  },

  cta: {
    title: "A role, a project, a question?",
    body: "Send me the job description or a short message: I reply quickly.",
    contact: { href: "/en/contact", label: "Get in touch" },
    cv: { href: "/en/cv", label: "See my résumé" },
  },
} as const satisfies Widen<typeof alternance>;
