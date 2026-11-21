import type { Widen } from "@/i18n/types";

import type { cv as fr } from "../cv";
import { openToRoles } from "./open-to-roles";

/**
 * Résumé in English: the same verified facts as the French CV. The PDF is
 * printed from /en/cv by scripts/build-cv-pdf.mjs: regenerate it in the same
 * commit as any change here.
 */
export const cv = {
  title: "Résumé",
  headline: openToRoles.short,
  description:
    "Résumé of Siavash Izadi, full-stack JavaScript developer: projects in production, skills, education. Open to full-time, freelance and remote roles.",
  pdf: {
    href: "/cv/Siavash-Izadi-CV-en.pdf",
    label: "Download the résumé (PDF)",
  },
  location: "France",
  /** Printed résumé (PDF) only, as on the French CV. */
  phone: { display: "+33 6 66 71 24 78", href: "tel:+33666712478" },

  profileTitle: "Profile",
  profile:
    "Full-stack JavaScript / TypeScript developer. I design, test and deploy complete web applications: interface, server logic, database, containers and continuous integration. Strong interest in infrastructure and application security.",

  projectsTitle: "Projects in production",
  projects: [
    {
      slug: "nexora",
      name: "NEXORA — complete e-commerce store",
      url: "nexora.siavashizadi.com",
      stack: "Next.js 16, TypeScript, PostgreSQL, Prisma, Stripe, better-auth, Docker",
      bullets: [
        "Catalog, cart, Stripe payments (test mode), customer accounts and a back office with an audit log.",
        "Stock reserved by one atomic SQL query: tested with 8 simultaneous purchases of 3 units, no overselling.",
        "79 unit and integration tests, 20 end-to-end tests (Playwright, axe accessibility checks), full CI.",
      ],
    },
    {
      slug: "prix-au-metre",
      name: "Prix au mètre — property price map",
      url: "prixaumeter.siavashizadi.com",
      stack:
        "Next.js 16, TypeScript, PostgreSQL, Prisma, MapLibre GL, better-auth, Docker",
      bullets: [
        "Median price per m², street by street, from the public DVF data: 104,883 real sales cleaned, no figure under 10 sales.",
        "Key queries under 50 ms with 5 million sales, measured (search: from 380 ms to 3 ms).",
      ],
    },
    {
      slug: "portfolio",
      name: "siavashizadi.com — self-hosted portfolio",
      url: "siavashizadi.com",
      stack: "Next.js 16, TypeScript, Tailwind CSS, Docker, Nginx, GitHub Actions",
      bullets: [
        "Automatic deployment on every push: tests, Docker image, release on my server, rollback on failure.",
        "Unprivileged, read-only container; CSP and security headers checked by the tests.",
      ],
    },
    {
      slug: "applyflow",
      name: "ApplyFlow — job-search tracker",
      url: "applyflow.siavashizadi.com",
      stack:
        "Next.js 16, TypeScript, PostgreSQL, Drizzle, better-auth, Telegram Bot API, Docker",
      bullets: [
        "Applications, interviews and follow-ups; new job offers found every day (La Bonne Alternance API); a Telegram bot to save an offer from your phone.",
        "Isolation between users enforced by the database (composite foreign keys); 68 unit and integration tests, 12 end-to-end.",
      ],
    },
  ],

  skillsTitle: "Skills",
  skills: [
    { label: "Languages", value: "TypeScript, JavaScript, SQL, HTML, CSS" },
    {
      label: "Front end",
      value: "React, Next.js (App Router), Tailwind CSS, accessibility",
    },
    {
      label: "Back end",
      value: "Node.js, Next.js (Server Actions, Route Handlers), REST APIs, Zod",
    },
    {
      label: "Data",
      value: "PostgreSQL (query optimization, materialized views), Prisma, Drizzle",
    },
    { label: "Testing", value: "Vitest, Playwright, axe" },
    {
      label: "DevOps",
      value: "Docker, Nginx, Linux, GitHub Actions, HTTPS (Let’s Encrypt)",
    },
    {
      label: "Security",
      value: "CSP, server-side validation, access control, least privilege",
    },
  ],

  educationTitle: "Education",
  education: [
    {
      period: "Today",
      title: "Computer science studies",
      place: "University of Montpellier",
      detail: null,
    },
    {
      period: "2024",
      title: "Bachelor’s in computer engineering (software)",
      place: "Islamic Azad University, Tehran",
      detail:
        "EQF level 6 (bachelor’s level) according to the ENIC-NARIC France statement of comparability.",
    },
  ],

  languagesTitle: "Languages",
  languages: "French, English, Persian",
} as const satisfies Widen<typeof fr>;
