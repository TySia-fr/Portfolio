/**
 * CV content (French). Built from verified facts only; mirrors the rest of the
 * site. The PDF is generated from the /cv page (scripts/build-cv-pdf.mjs):
 * regenerate it in the same commit as any change here.
 */
import { alternance } from "./alternance";

export const cv = {
  title: "CV",
  /** The accent line under the name: what Siavash is looking for. */
  headline: alternance.short,
  description:
    "CV de Siavash Izadi, développeur full-stack JavaScript : projets en production, compétences, formation. Recherche une alternance en informatique.",
  pdf: {
    href: "/cv/Siavash-Izadi-CV.pdf",
    label: "Télécharger le CV (PDF)",
  },
  location: "France",
  /**
   * Printed CV (PDF) only: hidden on the web page to keep it out of casual
   * view. It is still in the HTML and in the public PDF, so not a secret.
   */
  phone: { display: "+33 6 66 71 24 78", href: "tel:+33666712478" },

  profileTitle: "Profil",
  profile:
    "Développeur full-stack JavaScript / TypeScript. Je conçois, teste et déploie des applications web complètes : interface, logique serveur, base de données, conteneurs et intégration continue. Intérêt marqué pour l’infrastructure et la sécurité des applications.",

  projectsTitle: "Projets en production",
  projects: [
    {
      slug: "nexora",
      name: "NEXORA — boutique e-commerce complète",
      url: "nexora.siavashizadi.com",
      stack: "Next.js 16, TypeScript, PostgreSQL, Prisma, Stripe, better-auth, Docker",
      bullets: [
        "Catalogue, panier, paiement Stripe (mode test), comptes clients et back-office avec journal d’audit.",
        "Stock réservé par une requête SQL atomique : testé avec 8 achats simultanés sur 3 unités, aucune survente.",
        "79 tests unitaires et d’intégration, 20 tests de bout en bout (Playwright, accessibilité axe), CI complète.",
      ],
    },
    {
      slug: "portfolio",
      name: "siavashizadi.com — portfolio auto-hébergé",
      url: "siavashizadi.com",
      stack: "Next.js 16, TypeScript, Tailwind CSS, Docker, Nginx, GitHub Actions",
      bullets: [
        "Déploiement automatique à chaque push : tests, image Docker, mise en ligne sur mon serveur, retour arrière si échec.",
        "Conteneur sans privilèges root, en lecture seule ; CSP et en-têtes de sécurité vérifiés par les tests.",
        "Formulaire de contact validé côté serveur, avec limite de débit et protection anti-spam.",
      ],
    },
    {
      slug: "applyflow",
      name: "ApplyFlow — suivi de recherche d’emploi",
      url: "applyflow.siavashizadi.com",
      stack:
        "Next.js 16, TypeScript, PostgreSQL, Drizzle, better-auth, Telegram Bot API, Docker",
      bullets: [
        "Candidatures, entretiens et relances ; offres d’alternance découvertes chaque jour (API La Bonne Alternance) ; bot Telegram pour ajouter une offre depuis son téléphone.",
        "Isolation entre utilisateurs garantie par la base (clés étrangères composées) ; 68 tests unitaires et d’intégration, 12 de bout en bout.",
      ],
    },
  ],

  skillsTitle: "Compétences",
  skills: [
    { label: "Langages", value: "TypeScript, JavaScript, SQL, HTML, CSS" },
    {
      label: "Front-end",
      value: "React, Next.js (App Router), Tailwind CSS, accessibilité",
    },
    {
      label: "Back-end",
      value: "Node.js, Next.js (Server Actions, Route Handlers), API REST, Zod",
    },
    { label: "Données", value: "PostgreSQL, Prisma, Drizzle" },
    { label: "Tests", value: "Vitest, Playwright, axe" },
    {
      label: "DevOps",
      value: "Docker, Nginx, Linux, GitHub Actions, HTTPS (Let’s Encrypt)",
    },
    {
      label: "Sécurité",
      value: "CSP, validation serveur, contrôle d’accès, moindre privilège",
    },
  ],

  educationTitle: "Formation",
  education: [
    {
      period: "Aujourd’hui",
      title: "Études d’informatique",
      place: "Université de Montpellier",
      detail: null,
    },
    {
      period: "2024",
      title: "Licence en génie informatique (logiciels)",
      place: "Université Azad Islamique, Téhéran",
      detail:
        "Niveau 6 (équivalent licence) selon l’attestation de comparabilité ENIC-NARIC France.",
    },
  ],

  languagesTitle: "Langues",
  languages: "Français, anglais, persan",
} as const;
