/** Copy for the projects list, cards and case-study pages (ADR-0003). */
export const projectsPage = {
  title: "Projets",
  description:
    "Projets de Siavash Izadi, développeur full-stack JavaScript : problème, architecture, choix techniques et code source.",
  intro:
    "Chaque projet est documenté comme un cas d’étude : le problème, l’architecture, les décisions et ce qui reste à faire. Le code est public.",
  empty: "Aucun projet publié pour le moment. Le premier est en cours de construction.",

  status: {
    live: "En ligne",
    "in-progress": "En cours",
  },

  card: {
    readCaseStudy: "Lire l’étude de cas",
  },

  detail: {
    back: "Tous les projets",
    facts: {
      status: "Statut",
      year: "Année",
      role: "Rôle",
      stack: "Technologies",
    },
    links: {
      live: "Voir le site",
      repository: "Code source",
    },
    toc: "Sur cette page",
    sections: {
      context: "Contexte",
      problem: "Le problème",
      audience: "Pour qui",
      architecture: "Architecture",
      delivery: "Livraison continue",
      code: "Dans le code",
      decisions: "Décisions et compromis",
      challenges: "Difficultés rencontrées",
      challengeProblem: "Problème",
      challengeSolution: "Solution",
      status: "État du projet",
      implemented: "En place",
      nextSteps: "Prévu, pas encore fait",
      limitations: "Limites connues",
      gallery: "Captures d’écran",
    },
    excerptSource: "Source",
  },
} as const;
