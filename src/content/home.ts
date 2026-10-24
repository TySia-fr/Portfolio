/** Home page copy (ADR-0003). Every statement here must stay verifiable. */
export const home = {
  eyebrow: "Développeur full-stack JavaScript · France",
  title:
    "Je construis des applications web, de la base de données à la mise en production.",
  lead: "Next.js, Node.js et TypeScript. Chaque projet est vérifié en intégration continue et documenté : le code est public, les décisions aussi.",
  focus: {
    title: "Ce qui m’occupe",
    items: [
      { label: "Applications full-stack", detail: "Next.js, Node.js, TypeScript" },
      { label: "Infrastructure", detail: "Docker, Nginx, Linux, CI/CD" },
      {
        label: "Sécurité applicative",
        detail: "En-têtes, validation, moindre privilège",
      },
    ],
  },
  primaryCta: { href: "/projets", label: "Voir les projets" },
  secondaryCta: { href: "/contact", label: "Me contacter" },

  about: {
    title: "En bref",
    text: "Titulaire d’un Bachelor en génie informatique, j’étudie l’informatique à l’Université de Montpellier. Après plus de deux ans à créer et gérer des sites WordPress, je me consacre au développement full-stack JavaScript, avec un intérêt fort pour l’infrastructure et la sécurité.",
    link: "En savoir plus",
  },

  pipeline: {
    eyebrow: "Sous le capot",
  },

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
