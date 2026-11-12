import type { Project } from "./schema";

/**
 * ApplyFlow case study. Every claim comes from the ApplyFlow repository
 * (README, docs/ARCHITECTURE, docs/SECURITY, docs/TESTING) at commit 6066019 (ADR-0004 for the bot and discovery).
 * Screenshots are the repository's own captures, with its sample data.
 */
const shots = "/images/projects/applyflow";

export const applyflow = {
  slug: "applyflow",
  title: "ApplyFlow",
  summary:
    "Suivi de recherche d’emploi : candidatures, entretiens et relances au même endroit, offres d’alternance découvertes chaque jour et bot Telegram pour tout gérer depuis un téléphone.",
  status: "live",
  year: 2026,
  featured: false,
  stack: [
    "Next.js 16",
    "TypeScript",
    "PostgreSQL",
    "Drizzle",
    "better-auth",
    "dnd-kit",
    "Telegram Bot API",
    "Vitest",
    "Playwright",
    "Docker",
  ],

  links: {
    live: "https://applyflow.siavashizadi.com",
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
    role: "Conception, développement, tests, déploiement et documentation. Projet réalisé seul.",

    architecture: [
      "Monolithe modulaire à dépendances en sens unique : interface → Server Actions (authentification et validation) → services métier → base de données.",
      "PostgreSQL 16 avec Drizzle ORM ; chaque changement de statut est un événement ajouté, jamais une valeur écrasée.",
      "Peu de JavaScript côté client : Server Components et Server Actions, graphiques rendus côté serveur ; seul le tableau Kanban (dnd-kit) est un composant client lourd.",
      "Documents (CV, lettres) en stockage privé, type vérifié d’après le contenu du fichier, téléchargeables seulement par leur propriétaire.",
      "Bot Telegram par webhook authentifié ; tâches planifiées (offres du jour, rappels) appelées par le cron du serveur sur des routes protégées, sans conteneur de file d’attente.",
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
        title: "Trouver et enregistrer, jamais postuler à la place de l’utilisateur",
        body: "Le bot et la découverte d’offres ajoutent des opportunités au suivi ; ils n’envoient jamais de candidature. Postuler automatiquement enfreint les conditions des sites d’emploi et ne se rattrape pas en cas d’erreur.",
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
      {
        problem:
          "Le bot télécharge les liens d’offres envoyés par l’utilisateur : un lien vers une adresse interne du serveur aurait permis une attaque SSRF.",
        solution:
          "L’adresse IP est vérifiée au moment même de la résolution DNS (pas de fenêtre de rebinding), chaque redirection est revalidée, avec des limites de taille et de durée. Les données viennent du balisage schema.org JobPosting ; sinon le bot demande « Poste @ Entreprise » au lieu de deviner.",
      },
    ],

    implemented: [
      "Pipeline en douze étapes : tableau filtrable et Kanban avec glisser-déposer enregistré.",
      "Entretiens avec fuseau horaire, relances, calendrier, versions de documents.",
      "Découverte : recherches enregistrées sur La Bonne Alternance (API publique), nouvelles offres chaque jour, ajout au suivi en un clic, sans doublon.",
      "Bot Telegram : liaison du compte par lien à usage unique, ajout d’une offre en partageant son lien, offres du jour avec boutons, rappels avant les entretiens et les relances, chacun envoyé une seule fois.",
      "Mode démo sans compte : un espace privé avec des données d’exemple, supprimé après 24 heures.",
      "68 tests unitaires et d’intégration, 12 tests de bout en bout avec contrôles d’accessibilité axe, dont la liaison Telegram par la vraie route webhook ; CI complète.",
    ],

    nextSteps: [
      "Envoi d’e-mails (vérification d’adresse, réinitialisation du mot de passe) et double authentification.",
    ],

    limitations: [
      "La CSP autorise les scripts inline, pour la même raison que sur ce site (ADR-0006).",
      "Les liens de sites qui bloquent les robots (LinkedIn) ne peuvent pas être lus : le bot demande alors le poste et l’entreprise.",
      "L’API La Bonne Alternance est réservée à un usage non commercial : adapté à ce projet, bloquant pour un produit payant.",
      "Les fichiers déposés ne sont pas analysés par un antivirus ; ils ne sont jamais exécutés ni affichés en ligne.",
    ],

    excerpts: [],
    diagrams: [],
  },
} satisfies Project;
