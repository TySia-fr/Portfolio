import type { Project } from "@/content/projects/schema";

/**
 * NEXORA case study in English: a translation of ../../projects/nexora.ts,
 * same sources (NEXORA repository at commit 9b0ee46), nothing added.
 */
const shots = "/images/projects/nexora";

export const nexora = {
  slug: "nexora",
  title: "NEXORA",
  summary:
    "A complete e-commerce store for a fictional brand: catalog, cart, Stripe payments, accounts and back office, with stock that cannot be oversold.",
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
      alt: "NEXORA home page: the Halo One headphones rendered in 3D, price and features.",
    },
    mobile: {
      base: `${shots}/home-mobile`,
      widths: [390],
      width: 390,
      height: 844,
      alt: "NEXORA home page on mobile.",
    },
    gallery: [
      {
        base: `${shots}/product`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "NEXORA product page: gallery, variant picker, stock and price.",
        caption:
          "Product page: variant kept in sync with the URL, live stock, keyboard-friendly gallery.",
      },
      {
        base: `${shots}/listing`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "NEXORA product list with filters by category, price and stock.",
        caption: "Catalog: filters, sorting and pagination in the URL.",
      },
      {
        base: `${shots}/cart`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "NEXORA cart with a promo code and progress toward free shipping.",
        caption: "Cart: quantities capped by stock, promo codes validated on the server.",
      },
      {
        base: `${shots}/admin`,
        widths: [960, 1440],
        width: 1440,
        height: 900,
        alt: "NEXORA admin dashboard: orders and key figures.",
        caption:
          "Back office: orders, products, stock, promo codes, reviews and audit log.",
      },
    ],
  },

  caseStudy: {
    problem:
      "An online store looks simple until the real cases: two customers buying the last unit at the same moment, a payment confirmed twice, a price changed in the browser. I wanted an e-commerce site that holds up in these cases, and to prove it with tests.",
    audience:
      "Recruiters and engineering leads assessing back-end, database and security skills, beyond the interface.",
    role: "Design, development, testing, deployment and documentation. Built alone.",

    architecture: [
      "Modular Next.js 16 monolith (App Router, Server Components, Server Actions): routes call domain services, and only these services touch the database.",
      "PostgreSQL 16 with Prisma 7, plus hand-written CHECK constraints so the database itself rejects an inconsistent total.",
      "Payments through Stripe Checkout; only the signed, idempotent webhook can mark an order as paid.",
      "better-auth authentication with sessions stored in the database; the role is never read from user input.",
      "Docker image without root privileges, read-only, with Postgres and a dedicated migration service; deployed on my server behind Nginx.",
    ],

    decisions: [
      {
        title: "Amounts in whole cents",
        body: "No floating-point numbers for money. Every order keeps a copy of the prices, names and address at the time of purchase: editing a product never rewrites a past order.",
      },
      {
        title: "Stock reserved by a single SQL query",
        body: "The reservation is a conditional UPDATE (“only if there is enough stock”), executed atomically by the database. A test sends 8 simultaneous buyers after 3 units: 3 orders go through, 5 are refused.",
      },
      {
        title: "The webhook, the only source of truth for payment",
        body: "The browser coming back after payment proves nothing. An order is marked paid only by the verified Stripe event, processed once even if it arrives several times.",
      },
    ],

    challenges: [
      {
        problem:
          "I needed product images without showing other brands’ products under the NEXORA name, which is what stock photos do.",
        solution:
          "The images are 3D renders of procedural models written with three.js from the catalog’s specifications, labeled as renders on the site.",
      },
      {
        problem:
          "The Prisma engine could not be downloaded in the environment where the migrations were prepared.",
        solution:
          "The SQL migrations were written and checked another way, and CI verifies that they match the schema exactly (drift detection).",
      },
    ],

    implemented: [
      "79 unit and integration tests: pricing, promo codes, cart, orders, concurrency, webhooks, access rights.",
      "20 end-to-end tests on the production build, including a purchase made entirely with the keyboard, IDOR and open-redirect tests, and axe accessibility checks.",
      "Back office: order state machine, atomic stock adjustments, promo codes, review moderation, audit log.",
      "CSP, security headers, rate limits, server-side validation of every input.",
      "Nightly database backup, with a tested restore.",
    ],

    nextSteps: [
      "Sending emails: address verification, password reset in production, order confirmations.",
      "Refunds executed through the Stripe API (today only recorded).",
    ],

    limitations: [
      "Payments run in Stripe test mode: no order is actually paid or shipped.",
      "Product images are 3D renders, not photographs.",
      "A product page that does not exist shows the 404 page with HTTP status 200 (and noindex).",
      "The rate limit is kept per process: enough for a single container.",
    ],

    excerpts: [],
    diagrams: [],
  },
} satisfies Project;
