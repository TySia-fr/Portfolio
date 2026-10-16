/** Home page copy (ADR-0003). Every statement here must stay verifiable. */
export const home = {
  eyebrow: "Développeur full-stack JavaScript · France",
  title:
    "Je construis des applications web, de la base de données à la mise en production.",
  lead: "Next.js, Node.js et TypeScript. Chaque projet est vérifié en intégration continue et documenté : le code est public, les décisions aussi.",
  primaryCta: { href: "/projets", label: "Voir les projets" },
  secondaryCta: { href: "/contact", label: "Me contacter" },

  selectedProjects: {
    title: "Projets sélectionnés",
    all: "Tous les projets",
  },

  specSheet: {
    title: "Fiche technique",
    subtitle: "Ce site est lui-même un projet. Voici comment il est construit.",
    rows: {
      framework: "Framework",
      language: "Langage",
      language_value: "TypeScript, mode strict",
      rendering: "Rendu",
      rendering_value: "Pages statiques générées au build",
      delivery: "Livraison",
      delivery_value: "GitHub Actions → Docker → Nginx",
      source: "Code source",
      source_value: "Public sur GitHub",
      commit: "Commit",
      commit_local: "build local",
      builtAt: "Généré le",
    },
  },
} as const;
