import type { Project } from "@/content/projects/schema";

/**
 * Prix au mètre case study in English: a translation of
 * ../../projects/prix-au-metre.ts, same sources (Prix-au-meter repository at
 * commit c16e8cb), nothing added. The app itself is in French.
 */
const shots = "/images/projects/prix-au-metre";

export const prixAuMetre = {
  slug: "prix-au-metre",
  title: "Prix au mètre",
  summary:
    "Interactive map of French property prices, street by street: median price per m² computed from the public DVF data, five-year trends and side-by-side neighborhoods.",
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
      alt: "Map of Montpellier in Prix au mètre (French interface): every street is a circle colored by its median price per m²; on the left, €3,476/m² for the city and the 2021–2025 trend.",
    },
    gallery: [
      {
        base: `${shots}/area`,
        widths: [640, 800],
        width: 800,
        height: 600,
        alt: "The Beaux-Arts neighborhood of Montpellier selected: its outline on the map, median price, apartments and houses, and the trend line.",
        caption:
          "One neighborhood: median, price range and yearly trend. Houses, with only 4 sales, show “Données insuffisantes” (not enough data).",
      },
      {
        base: `${shots}/compare`,
        widths: [640, 800],
        width: 800,
        height: 600,
        alt: "Two Montpellier neighborhoods compared, Beaux-Arts and Port Marianne: median prices, number of sales and overlaid trend lines.",
        caption:
          "Two neighborhoods side by side: medians, number of sales, percentage gap and overlaid trends.",
      },
    ],
  },

  caseStudy: {
    problem:
      "Property prices published online are often city-wide averages that never say how many sales they rest on. The actual sales are public in France (DVF), but raw: one sale can bundle several properties, some are symbolic. I wanted reliable prices at street level, computed honestly, and fast even at the scale of the whole country.",
    audience:
      "People looking to buy or sell; and, for this portfolio, engineering leads who want to see data processing, optimized and measured SQL, and an accessible map.",
    role: "Design, data cleaning, development, testing, performance measurement, deployment and documentation. Built alone.",

    architecture: [
      "Next.js 16 (App Router): map, search and charts on the client; a REST API (route handlers) validated with Zod, with uniform errors.",
      "PostgreSQL 16 without PostGIS: points indexed with GiST, materialized views for medians by street, neighborhood and year, refreshed without blocking reads.",
      "Hand-written SQL for the statistics (medians, fuzzy search); Prisma 7 for accounts and favorites, on the same connection pool.",
      "Import: download of the official DVF files, Zod validation, cleaning, assignment of each sale to its INSEE neighborhood (IRIS) through an in-memory spatial index, batched inserts.",
      "MapLibre GL map on an OpenFreeMap basemap, no API key; hand-written SVG trend chart, with a real table for screen readers.",
      "Docker images built by GitHub Actions and published to GHCR; a tools image runs the migrations and the import on the server, behind Nginx over HTTPS.",
    ],

    decisions: [
      {
        title: "Medians, and nothing under 10 sales",
        body: "An average is pulled by a few extreme sales; a median is not. Any figure computed from fewer than 10 sales is withheld on the server, before it reaches the browser: the interface shows “not enough data” and the number of sales.",
      },
      {
        title: "Eight cleaning rules, every rejection counted",
        body: "DVF repeats the total value of a sale on every property: only single-dwelling sales are kept. Bounds of €200 to €30,000 per m², then outliers removed per department, property type and year. Every rejection is counted by reason in the import log.",
      },
      {
        title: "Respecting the DVF terms of use",
        body: "The data must not be used to re-identify people or be indexed by search engines: the site publishes only aggregated medians, never a single sale, and every page is noindex.",
      },
      {
        title: "Performance measured, not assumed",
        body: "Target: 95% of key queries under 50 ms server-side, with 5 million sales (national scale, synthetic data). Every API query is measured with EXPLAIN ANALYZE; the full plans are in the repository.",
      },
    ],

    challenges: [
      {
        problem:
          "Searching by neighborhood name took about 380 ms over 42,000 nearly identical names: every match was ranked before keeping eight.",
        solution:
          "A GiST trigram index with nearest-neighbor (KNN) ordering stops as soon as it has the requested results: about 3 ms.",
      },
      {
        problem: "The view of every commune in France took about 65 ms.",
        solution:
          "The limit is applied before the join, with a partial index on the number of sales: about 25 ms.",
      },
      {
        problem: "A WebGL map cannot be used with a keyboard or a screen reader.",
        solution:
          "Every visible street or commune is also listed as buttons; search follows the WAI-ARIA combobox pattern, and the tests run axe across the whole journey.",
      },
    ],

    implemented: [
      "Live with the real data for Hérault (2021–2025): 104,883 sales after cleaning, 578 neighborhoods. Montpellier: €3,476/m² median over 12,733 sales.",
      "Map by street and by commune, typo-tolerant search for cities and neighborhoods, yearly trend by property type, comparison of two neighborhoods.",
      "Accounts and favorites: each user sees and changes only their own, proven by an access-control test.",
      "Idempotent import: re-running a department replaces its data in a single transaction.",
      "Every key query under 50 ms (95th percentile) with 5 million sales.",
      "28 unit tests, 5 integration tests on a real PostgreSQL database, 4 end-to-end tests with axe; full CI.",
    ],

    nextSteps: [
      "Import more departments, then re-run the performance measurements on real data.",
    ],

    limitations: [
      "Only Hérault is imported in production so far.",
      "Streets are drawn as points (the median position of their sales): DVF has no street geometry.",
      "Neighborhood boundaries change over time; sales are assigned with the current boundaries.",
      "Reference medians cover the last three years: they smooth out very recent moves, which the yearly chart shows.",
    ],

    excerpts: [],
    diagrams: [],
  },
} satisfies Project;
