import type { Project } from "./schema";

/**
 * ApplyFlow case study. Every claim comes from the ApplyFlow repository
 * (README, docs/ARCHITECTURE, docs/SECURITY, docs/TESTING) at commit 437a3f5.
 * Screenshots are the repository's own captures, with its sample data.
 */
const shots = "/images/projects/applyflow";

export const applyflow = {
  slug: "applyflow",
  title: "ApplyFlow",
  summary:
    "Suivi de recherche d’emploi : candidatures, entretiens, relances et CV au même endroit, avec des taux calculés à partir de l’historique réel.",
  status: "in-progress",
  year: 2026,
  featured: false,
  stack: [
    "Next.js 16",
    "TypeScript",
    "PostgreSQL",
    "Drizzle",
    "better-auth",
    "dnd-kit",
    "Vitest",
    "Playwright",
    "Docker",
  ],

  links: {
    repository: "https://github.com/TySia-fr/ApplyFlow",
  },

  media: {
    desktop: {
      base: `${shots}/dashboard-light`,
      widths: [960, 1440],
      width: 1440,
      height: 720,
      alt: "Tableau de bord ApplyFlow : nombre de candidatures, taux de réponse, d’entretien et d’offre, et candidatures par semaine.",
    },
    gallery: [
      {
        base: `${shots}/dashboard-dark`,
        widths: [960, 1440],
        width: 1440,
        height: 720,
        alt: "Le même tableau de bord ApplyFlow en mode sombre.",
        caption:
          "Mode clair et mode sombre, interface en anglais et en français. Données d’exemple.",
      },
    ],
  },

  caseStudy: {
    problem:
      "Pendant une recherche d’emploi, les candidatures se perdent entre un tableur, des e-mails et des notes : on ne sait plus qui relancer, ni ce qui fonctionne. Je voulais un outil qui garde tout l’historique et calcule des taux honnêtes, sans tirer de tendance d’un échantillon trop petit.",
    audience:
      "Toute personne qui postule sérieusement ; et, pour ce portfolio, les responsables techniques qui veulent voir une application multi-utilisateur correctement isolée.",
    role: "Conception, développement, tests et documentation. Projet réalisé seul.",

    architecture: [
      "Monolithe modulaire à dépendances en sens unique : interface → Server Actions (authentification et validation) → services métier → base de données.",
      "PostgreSQL 16 avec Drizzle ORM ; chaque changement de statut est un événement ajouté, jamais une valeur écrasée.",
      "Peu de JavaScript côté client : Server Components et Server Actions, graphiques rendus côté serveur ; seul le tableau Kanban (dnd-kit) est un composant client lourd.",
      "Documents (CV, lettres) en stockage privé, type vérifié d’après le contenu du fichier, téléchargeables seulement par leur propriétaire.",
      "Images Docker construites par GitHub Actions et publiées sur GHCR ; le serveur ne fait que les télécharger, avec retour arrière automatique.",
    ],

    decisions: [
      {
        title: "L’isolation entre utilisateurs en trois couches",
        body: "Chaque requête est filtrée par l’utilisateur de la session ; les tables se référencent par des clés étrangères composées (utilisateur, id), si bien que la base refuse elle-même un lien entre deux comptes ; et les tests essaient chaque opération avec le mauvais utilisateur.",
      },
      {
        title: "Des taux calculés depuis l’historique",
        body: "Une candidature refusée après un entretien compte quand même comme un entretien. Les petits échantillons sont signalés comme tels au lieu d’être présentés comme une tendance.",
      },
      {
        title: "Server Actions plutôt qu’une API REST",
        body: "L’application n’a qu’un client, son interface : des actions serveur typées évitent une couche API à maintenir. Le choix et ses limites sont documentés dans un ADR.",
      },
    ],

    challenges: [
      {
        problem:
          "Deux changements de statut simultanés pouvaient produire un historique dans le mauvais ordre.",
        solution:
          "Le changement de statut verrouille la ligne, et l’horodatage des événements utilise clock_timestamp() : l’ordre affiché suit l’ordre réel des écritures.",
      },
    ],

    implemented: [
      "Pipeline en douze étapes : tableau filtrable et Kanban avec glisser-déposer enregistré.",
      "Entretiens avec fuseau horaire, relances, calendrier, versions de documents.",
      "Mode démo sans compte : un espace privé avec des données d’exemple, supprimé après 24 heures.",
      "37 tests unitaires et d’intégration, 9 tests de bout en bout avec contrôles d’accessibilité axe, CI complète.",
    ],

    nextSteps: [
      "Mise en ligne sur applyflow.siavashizadi.com (images prêtes, déploiement en attente).",
      "Envoi d’e-mails (vérification d’adresse, réinitialisation du mot de passe) et double authentification.",
    ],

    limitations: [
      "Pas encore en ligne : le code et les tests sont publics, l’application n’est pas déployée.",
      "La CSP autorise les scripts inline, pour la même raison que sur ce site (ADR-0006).",
      "Les fichiers déposés ne sont pas analysés par un antivirus ; ils ne sont jamais exécutés ni affichés en ligne.",
    ],

    excerpts: [],
    diagrams: [],
  },
} satisfies Project;
