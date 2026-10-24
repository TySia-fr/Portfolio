import type { Project } from "./schema";

/**
 * Case study of this website. Every claim below can be checked in the
 * repository: files, commits, ADRs and CI runs.
 */
export const portfolio = {
  slug: "portfolio",
  title: "Ce portfolio",
  summary:
    "Un site personnel traité comme un produit : typé, vérifié en intégration continue et conteneurisé pour être hébergé sur mon propre serveur.",
  status: "in-progress",
  year: 2026,
  featured: true,
  stack: [
    "Next.js 16",
    "TypeScript",
    "Tailwind CSS 4",
    "Docker",
    "Nginx",
    "GitHub Actions",
  ],

  links: {
    repository: "https://github.com/TySia-fr/Portfolio",
  },

  caseStudy: {
    problem:
      "Un portfolio de développeur montre souvent des captures d’écran et des listes de technologies, sans preuve que le code fonctionne en production. Je voulais un site dont la construction elle-même serve de démonstration.",
    audience:
      "Recruteurs et responsables techniques qui évaluent un profil full-stack, et futurs clients qui veulent savoir comment je travaille.",
    role: "Conception, développement, infrastructure et documentation. Projet réalisé seul.",

    architecture: [
      "Pages générées statiquement au build avec le App Router de Next.js ; JavaScript côté client limité au menu mobile.",
      "Contenu typé dans le dépôt et validé avec Zod au build, sans base de données.",
      "Image Docker multi-étapes, exécutée sans privilèges root et en lecture seule.",
      "Configuration Nginx (reverse proxy, HTTPS via Let’s Encrypt) prête pour un serveur Hetzner que j’administre ; mise en ligne en cours.",
      "Chaque push déclenche lint, vérification des types, build, puis des tests de bout en bout (Playwright, ordinateur et mobile, accessibilité avec axe) exécutés contre l’image Docker qui sera déployée.",
    ],

    decisions: [
      {
        title: "Pas de base de données",
        body: "Le contenu change rarement et une seule personne le modifie : Git suffit comme système de gestion de contenu. Moins de surface d’attaque, rien à sauvegarder, et des pages servies en HTML statique.",
      },
      {
        title: "Auto-hébergement plutôt que Vercel",
        body: "Vercel aurait été plus simple, mais aurait masqué ce que je voulais apprendre et montrer : conteneurs, reverse proxy, TLS et déploiement continu. En contrepartie, la disponibilité et les mises à jour du serveur sont de ma responsabilité.",
      },
      {
        title: "Une clé de déploiement qui ne sait faire qu’une chose",
        body: "La clé SSH utilisée par GitHub Actions est restreinte par une commande forcée : elle ne peut lancer que le script de déploiement, qui n’accepte qu’un identifiant de commit valide. Une clé volée ne donnerait pas accès au serveur.",
      },
    ],

    challenges: [
      {
        problem:
          "Le premier build a échoué : Next.js téléchargeait les polices depuis Google Fonts, ce qui rend le build dépendant d’un service externe.",
        solution:
          "Les polices sont intégrées au dépôt. Le build ne dépend plus que des paquets verrouillés dans le lockfile.",
      },
      {
        problem:
          "Avec Next.js 16, la mise en page n’est plus démontée entre deux pages : le menu mobile restait ouvert après un clic sur un lien.",
        solution:
          "Le menu se ferme explicitement au début de chaque navigation, via le callback onNavigate du composant Link.",
      },
    ],

    nextSteps: [
      "Formulaire de contact avec validation côté serveur et protection anti-spam.",
      "Mise en ligne sur siavashizadi.com avec déploiement automatique.",
      "Politique de sécurité du contenu (CSP) avec nonces.",
    ],
  },
} satisfies Project;
