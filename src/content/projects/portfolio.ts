import type { Project } from "./schema";

/**
 * Case study of this website. Every claim below can be checked in the
 * repository: files, commits, ADRs and CI runs.
 */
export const portfolio = {
  slug: "portfolio",
  title: "Ce portfolio",
  summary:
    "Un site personnel traité comme un produit : typé, testé à chaque modification et déployé automatiquement sur mon propre serveur.",
  status: "live",
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
    live: "https://siavashizadi.com",
    repository: "https://github.com/TySia-fr/Portfolio",
  },

  // Real screenshots of the production build (pnpm screenshots).
  media: {
    desktop: {
      base: "/images/projects/portfolio/home-desktop",
      widths: [960, 1600],
      width: 1600,
      height: 1000,
      alt: "Page d’accueil de siavashizadi.com sur ordinateur : titre, fiche technique du build et domaines de travail.",
    },
    mobile: {
      base: "/images/projects/portfolio/home-mobile",
      widths: [390, 780],
      width: 780,
      height: 1688,
      alt: "Page d’accueil de siavashizadi.com sur mobile.",
    },
    gallery: [
      {
        base: "/images/projects/portfolio/projects-desktop",
        widths: [960, 1600],
        width: 1600,
        height: 1000,
        alt: "Page Projets : le projet mis en avant, avec ses captures, son statut et ses technologies.",
        caption: "La page Projets présente chaque projet comme une étude de cas.",
      },
      {
        base: "/images/projects/portfolio/contact-desktop",
        widths: [960, 1600],
        width: 1600,
        height: 1000,
        alt: "Page Contact : formulaire avec nom, e-mail et message, et liens directs.",
        caption:
          "Le formulaire de contact est validé côté serveur ; les liens directs restent disponibles.",
      },
    ],
  },

  caseStudy: {
    problem:
      "Un portfolio de développeur montre souvent des captures d’écran et des listes de technologies, sans preuve que le code fonctionne en production. Je voulais un site dont la construction elle-même serve de démonstration.",
    audience:
      "Recruteurs et responsables techniques qui évaluent un profil full-stack, et futurs clients qui veulent savoir comment je travaille.",
    role: "Conception, développement, infrastructure et documentation. Projet réalisé seul.",

    architecture: [
      "Pages générées statiquement au build avec le App Router de Next.js ; JavaScript côté client limité au menu mobile et au formulaire de contact.",
      "Contenu typé dans le dépôt et validé avec Zod au build, sans base de données.",
      "Image Docker multi-étapes, exécutée sans privilèges root et en lecture seule.",
      "Nginx en reverse proxy avec HTTPS (Let’s Encrypt, renouvellement automatique) sur un serveur Hetzner que j’administre.",
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
      {
        problem:
          "Une adresse de projet inexistante affichait la page 404, mais avec le code HTTP 200 : la page partiellement pré-rendue commençait à être envoyée avant que l’application sache que le projet n’existait pas.",
        solution:
          "Un proxy vérifie l’identifiant avant le rendu, à partir de la même liste de projets que les pages. Un test vérifie le code 404 dès la toute première requête.",
      },
      {
        problem:
          "Le premier déploiement automatique a échoué : la clé SSH, collée sur plusieurs lignes dans les secrets GitHub, arrivait corrompue.",
        solution:
          "Le workflow vérifie maintenant la clé avant de se connecter et accepte une version encodée en base64 sur une seule ligne, qui survit au copier-coller.",
      },
    ],

    implemented: [
      "Déploiement automatique à chaque push sur main, depuis le 24 octobre 2026.",
      "Tests de bout en bout sur ordinateur et mobile, avec contrôle d’accessibilité axe sur chaque page, exécutés contre l’image Docker avant chaque déploiement.",
      "Politique de sécurité du contenu (CSP) et en-têtes de sécurité, vérifiés par les tests.",
      "Code HTTP 404 réel pour les pages de projet inexistantes.",
      "Formulaire de contact validé côté serveur, avec limite de débit et piège anti-spam.",
    ],

    nextSteps: [
      "Limite de débit au niveau de Nginx, en plus de celle de l’application.",
      "Sauvegarde du serveur et procédure de restauration testée.",
      "Accès IPv6 (enregistrement DNS AAAA).",
    ],

    limitations: [
      "Un seul serveur, dans une seule région, sans CDN : si le serveur tombe, le site est indisponible.",
      "La supervision se limite à un contrôle toutes les 30 minutes depuis GitHub Actions (réponse du site et validité du certificat), avec un e-mail en cas d’échec.",
      "Aucune sauvegarde du serveur pour l’instant : le code, l’image et la configuration sont dans le dépôt, mais la reconstruction du serveur serait manuelle.",
      "La CSP autorise les scripts inline, parce que Next.js intègre les données de chaque page dans des balises script. L’alternative stricte (nonces) obligerait à rendre chaque page à la demande. Ce compromis est documenté dans l’ADR-0006.",
      "Les fichiers de configuration du serveur (compose.yaml, deploy.sh, Nginx) y sont copiés à la main : les modifier dans le dépôt ne met pas le serveur à jour.",
      "Le formulaire de contact garde la limite de débit en mémoire : elle repart de zéro au redémarrage et ne serait pas partagée entre plusieurs instances.",
    ],

    diagrams: ["architecture", "pipeline"],

    excerpts: [
      {
        title: "Le script de déploiement n’accepte qu’un SHA de commit",
        file: "deploy/deploy.sh",
        from: 'requested="${SSH_ORIGINAL_COMMAND',
        to: "fi",
        caption:
          "La clé SSH de GitHub Actions est liée à ce script par une commande forcée. Tout ce qui n’est pas un SHA de 40 caractères (espaces, « ; », « latest »…) est refusé.",
      },
      {
        title: "Le conteneur ne peut presque rien faire",
        file: "deploy/compose.yaml",
        from: "# --- Hardening ---",
        to: "no-new-privileges:true",
        caption:
          "Système de fichiers en lecture seule, aucune capacité Linux, aucune élévation de privilèges. Le même fichier est utilisé par le test de fumée en CI et en production.",
      },
      {
        title: "Un projet « en ligne » doit avoir une adresse",
        file: "src/content/projects/schema.ts",
        from: ".refine((project) => project.status",
        to: "});",
        caption:
          "Le contenu est validé avec Zod pendant le build. Une incohérence fait échouer le build au lieu d’arriver en production.",
      },
    ],
  },
} satisfies Project;
