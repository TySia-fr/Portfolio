import type { Project } from "./schema";

/**
 * Prix au mètre case study. Every claim comes from the Prix-au-meter
 * repository (README, DECISIONS, PROGRESS, docs/benchmarks) at commit c16e8cb.
 * Screenshots are captures of the live site (real DVF data for Hérault),
 * taken on 2026-11-21.
 */
const shots = "/images/projects/prix-au-metre";

export const prixAuMetre = {
  slug: "prix-au-metre",
  title: "Prix au mètre",
  summary:
    "Carte interactive des prix immobiliers, rue par rue : prix médian au m² calculé depuis les données publiques DVF, évolution sur cinq ans et comparaison de quartiers.",
  status: "live",
  year: 2026,
  featured: true,
  stack: [
    "Next.js 16",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "MapLibre GL",
    "better-auth",
    "Zod",
    "Vitest",
    "Playwright",
    "Docker",
  ],

  links: {
    live: "https://prixaumeter.siavashizadi.com",
    repository: "https://github.com/TySia-fr/Prix-au-meter",
  },

  media: {
    desktop: {
      base: `${shots}/map`,
      widths: [640, 800],
      width: 800,
      height: 600,
      alt: "Carte de Montpellier dans Prix au mètre : chaque rue est un cercle coloré selon son prix médian au m² ; à gauche, 3 476 €/m² pour la commune et l’évolution 2021-2025.",
    },
    gallery: [
      {
        base: `${shots}/area`,
        widths: [640, 800],
        width: 800,
        height: 600,
        alt: "Quartier Beaux-Arts à Montpellier sélectionné : contour du quartier sur la carte, prix médian, détail appartements et maisons, courbe d’évolution.",
        caption:
          "Un quartier : médiane, fourchette des prix et évolution annuelle. Les maisons, avec 4 ventes seulement, affichent « Données insuffisantes ».",
      },
      {
        base: `${shots}/compare`,
        widths: [640, 800],
        width: 800,
        height: 600,
        alt: "Comparaison de deux quartiers de Montpellier, Beaux-Arts et Port Marianne : prix médians, nombre de ventes et courbes superposées.",
        caption:
          "Deux quartiers côte à côte : médianes, nombre de ventes, écart en pourcentage et évolutions superposées.",
      },
    ],
  },

  caseStudy: {
    problem:
      "Les prix immobiliers affichés en ligne sont souvent des moyennes par ville, sans dire sur combien de ventes ils reposent. Les ventes réelles sont pourtant publiques (DVF), mais brutes : une vente peut regrouper plusieurs biens, certaines sont symboliques. Je voulais des prix fiables à l’échelle de la rue, calculés honnêtement, et rapides même à l’échelle de la France entière.",
    audience:
      "Les personnes qui cherchent à acheter ou à vendre ; et, pour ce portfolio, les responsables techniques qui veulent voir du traitement de données, du SQL optimisé et mesuré, et une carte accessible.",
    role: "Conception, nettoyage des données, développement, tests, mesures de performance, déploiement et documentation. Projet réalisé seul.",

    architecture: [
      "Next.js 16 (App Router) : la carte, la recherche et les graphiques côté client ; une API REST (route handlers) validée par Zod, avec des erreurs uniformes.",
      "PostgreSQL 16 sans PostGIS : points indexés en GiST, vues matérialisées pour les médianes par rue, par quartier et par année, rafraîchies sans bloquer la lecture.",
      "SQL écrit à la main pour les statistiques (médianes, recherche approximative) ; Prisma 7 pour les comptes et les favoris, sur le même pool de connexions.",
      "Import : téléchargement des fichiers DVF officiels, validation Zod, nettoyage, rattachement de chaque vente à son quartier INSEE (IRIS) par un index spatial en mémoire, insertion par lots.",
      "Carte MapLibre GL sur un fond OpenFreeMap, sans clé d’API ; graphique d’évolution en SVG écrit à la main, avec un vrai tableau pour les lecteurs d’écran.",
      "Images Docker construites par GitHub Actions et publiées sur GHCR ; une image d’outils lance les migrations et l’import sur le serveur, derrière Nginx en HTTPS.",
    ],

    decisions: [
      {
        title: "Des médianes, et rien sous 10 ventes",
        body: "Un prix moyen est tiré par quelques ventes extrêmes ; la médiane non. Tout chiffre calculé sur moins de 10 ventes est retiré sur le serveur, avant d’atteindre le navigateur : l’interface affiche « Données insuffisantes » et le nombre de ventes.",
      },
      {
        title: "Huit règles de nettoyage, chaque rejet compté",
        body: "DVF répète la valeur totale d’une vente sur chaque bien : seules les ventes d’un seul logement sont gardées. Bornes de 200 à 30 000 €/m², puis valeurs extrêmes écartées par département, type de bien et année. Chaque rejet est compté par motif dans le journal d’import.",
      },
      {
        title: "Respecter les conditions d’utilisation de DVF",
        body: "Les données interdisent de ré-identifier des personnes et d’être indexées par les moteurs de recherche : le site ne publie que des médianes agrégées, jamais une vente isolée, et chaque page est en noindex.",
      },
      {
        title: "La performance mesurée, pas supposée",
        body: "Objectif : 95 % des requêtes clés sous 50 ms côté serveur, avec 5 millions de ventes (échelle nationale, données synthétiques). Chaque requête de l’API est mesurée avec EXPLAIN ANALYZE ; les plans complets sont dans le dépôt.",
      },
    ],

    challenges: [
      {
        problem:
          "La recherche par nom de quartier prenait environ 380 ms sur 42 000 noms presque identiques : chaque correspondance était classée avant d’en garder huit.",
        solution:
          "Un index trigramme GiST avec un tri par proximité (KNN) s’arrête dès qu’il a trouvé les résultats demandés : environ 3 ms.",
      },
      {
        problem: "La vue des communes de toute la France prenait environ 65 ms.",
        solution:
          "La limite est appliquée avant la jointure, avec un index partiel sur le nombre de ventes : environ 25 ms.",
      },
      {
        problem:
          "Une carte WebGL n’est utilisable ni au clavier ni avec un lecteur d’écran.",
        solution:
          "Chaque rue ou commune visible est aussi listée sous forme de boutons ; la recherche suit le modèle combobox WAI-ARIA, et les tests passent axe sur tout le parcours.",
      },
    ],

    implemented: [
      "En ligne avec les vraies données de l’Hérault (2021-2025) : 104 883 ventes après nettoyage, 578 quartiers. Montpellier : 3 476 €/m² médian sur 12 733 ventes.",
      "Carte par rue et par commune, recherche de villes et de quartiers tolérante aux fautes, évolution annuelle par type de bien, comparaison de deux quartiers.",
      "Comptes et favoris : chaque utilisateur ne voit et ne modifie que les siens, prouvé par un test de contrôle d’accès.",
      "Import idempotent : relancer un département remplace ses données dans une seule transaction.",
      "Toutes les requêtes clés sous 50 ms (95e centile) avec 5 millions de ventes.",
      "28 tests unitaires, 5 tests d’intégration sur une vraie base PostgreSQL, 4 tests de bout en bout avec axe ; CI complète.",
    ],

    nextSteps: [
      "Importer d’autres départements, puis relancer les mesures de performance sur des données réelles.",
    ],

    limitations: [
      "Seul l’Hérault est importé en production pour l’instant.",
      "Les rues sont dessinées comme des points (position médiane de leurs ventes) : DVF ne contient pas la géométrie des rues.",
      "Les contours des quartiers changent avec le temps ; les ventes sont rattachées aux contours actuels.",
      "Les médianes de référence portent sur les trois dernières années : elles lissent les mouvements très récents, que le graphique annuel montre.",
    ],

    excerpts: [],
    diagrams: [],
  },
} satisfies Project;
