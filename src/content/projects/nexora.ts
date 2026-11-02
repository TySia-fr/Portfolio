import type { Project } from "./schema";

/**
 * NEXORA case study. Every claim comes from the NEXORA repository (README,
 * ADRs, docs/feature-report.md) at commit 9b0ee46. Screenshots are the
 * repository's own captures of the production build (docs/screenshots).
 */
const shots = "/images/projects/nexora";

export const nexora = {
  slug: "nexora",
  title: "NEXORA",
  summary:
    "Boutique e-commerce complète pour une marque fictive : catalogue, panier, paiement Stripe, comptes et back-office, avec un stock qui ne peut pas être survendu.",
  status: "live",
  year: 2026,
  featured: true,
  stack: [
    "Next.js 16",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Stripe",
    "better-auth",
    "Vitest",
    "Playwright",
    "Docker",
  ],

  links: {
    live: "https://nexora.siavashizadi.com",
    repository: "https://github.com/TySia-fr/Nexora",
  },

  media: {
    desktop: {
      base: `${shots}/home`,
      widths: [960, 1440],
      width: 1440,
      height: 900,
      alt: "Page d’accueil de NEXORA : casque Halo One rendu en 3D, prix et caractéristiques.",
    },
    mobile: {
      base: `${shots}/home-mobile`,
      widths: [390],
      width: 390,
      height: 844,
      alt: "Page d’accueil de NEXORA sur mobile.",
    },
    gallery: [
      {
        base: `${shots}/product`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "Page produit NEXORA : galerie, choix de variante, stock et prix.",
        caption:
          "Page produit : variante synchronisée avec l’URL, stock en direct, galerie au clavier.",
      },
      {
        base: `${shots}/listing`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "Liste des produits NEXORA avec filtres par catégorie, prix et stock.",
        caption: "Catalogue : filtres, tri et pagination dans l’URL.",
      },
      {
        base: `${shots}/cart`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "Panier NEXORA avec code promo et progression vers la livraison gratuite.",
        caption:
          "Panier : quantités limitées par le stock, codes promo validés côté serveur.",
      },
      {
        base: `${shots}/admin`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "Tableau de bord d’administration NEXORA : commandes et indicateurs.",
        caption:
          "Back-office : commandes, produits, stock, codes promo, avis et journal d’audit.",
      },
    ],
  },

  caseStudy: {
    problem:
      "Une boutique en ligne paraît simple jusqu’aux cas réels : deux clients qui achètent la dernière unité au même moment, un paiement confirmé deux fois, un prix modifié dans le navigateur. Je voulais un e-commerce qui résiste à ces cas, et le prouver par des tests.",
    audience:
      "Recruteurs et responsables techniques qui évaluent des compétences back-end, base de données et sécurité, au-delà de l’interface.",
    role: "Conception, développement, tests, déploiement et documentation. Projet réalisé seul.",

    architecture: [
      "Monolithe modulaire Next.js 16 (App Router, Server Components, Server Actions) : les routes appellent des services de domaine, seuls ces services accèdent à la base.",
      "PostgreSQL 16 avec Prisma 7, et des contraintes CHECK écrites à la main pour que la base refuse elle-même un total incohérent.",
      "Paiement par Stripe Checkout ; seul le webhook signé et idempotent peut marquer une commande comme payée.",
      "Authentification better-auth avec sessions en base ; le rôle n’est jamais lu depuis une entrée utilisateur.",
      "Image Docker sans privilèges root, en lecture seule, avec Postgres et un service de migration dédié ; déployée sur mon serveur derrière Nginx.",
    ],

    decisions: [
      {
        title: "Les montants en centimes entiers",
        body: "Aucun nombre à virgule pour l’argent. Chaque commande garde une copie des prix, des noms et de l’adresse au moment de l’achat : modifier un produit ne réécrit jamais une commande passée.",
      },
      {
        title: "Un stock réservé par une seule requête SQL",
        body: "La réservation est un UPDATE conditionnel (« seulement si le stock suffit »), exécuté par la base de façon atomique. Un test lance 8 acheteurs simultanés sur 3 unités : 3 commandes passent, 5 sont refusées.",
      },
      {
        title: "Le webhook, seule source de vérité du paiement",
        body: "Le retour du navigateur après paiement ne prouve rien. La commande n’est marquée payée que par l’événement Stripe vérifié, traité une seule fois même s’il arrive plusieurs fois.",
      },
    ],

    challenges: [
      {
        problem:
          "Il fallait des images de produits sans montrer les produits d’autres marques sous le nom NEXORA, ce que font les photos de banque d’images.",
        solution:
          "Les images sont des rendus 3D de modèles procéduraux écrits avec three.js d’après les caractéristiques du catalogue, signalés comme rendus sur le site.",
      },
      {
        problem:
          "Le moteur de Prisma ne pouvait pas être téléchargé dans l’environnement où les migrations ont été préparées.",
        solution:
          "Les migrations SQL ont été écrites et vérifiées autrement, et la CI contrôle qu’elles correspondent exactement au schéma (détection de dérive).",
      },
    ],

    implemented: [
      "79 tests unitaires et d’intégration : prix, codes promo, panier, commandes, concurrence, webhooks, droits d’accès.",
      "20 tests de bout en bout sur le build de production, dont un achat entièrement au clavier, des tests d’IDOR et de redirection ouverte, et des contrôles d’accessibilité axe.",
      "Back-office : machine à états des commandes, ajustements de stock atomiques, codes promo, modération des avis, journal d’audit.",
      "CSP, en-têtes de sécurité, limites de débit, validation de toutes les entrées côté serveur.",
      "Sauvegarde nocturne de la base, avec restauration testée.",
    ],

    nextSteps: [
      "Envoi d’e-mails : vérification d’adresse, réinitialisation du mot de passe en production, confirmations de commande.",
      "Remboursements exécutés par l’API Stripe (aujourd’hui seulement enregistrés).",
    ],

    limitations: [
      "Les paiements fonctionnent en mode test Stripe : aucune commande n’est réellement payée ni expédiée.",
      "Les images de produits sont des rendus 3D, pas des photographies.",
      "Une page de produit inexistante affiche la page 404 avec le code HTTP 200 (et noindex).",
      "La limite de débit est gardée par processus : suffisant pour un seul conteneur.",
    ],

    excerpts: [],
    diagrams: [],
  },
} satisfies Project;
