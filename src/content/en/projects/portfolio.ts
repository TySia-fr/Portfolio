import type { Project } from "@/content/projects/schema";

/**
 * Case study of this website in English: a translation of
 * ../../projects/portfolio.ts. The code excerpts are cut from the same files
 * with the same markers.
 */
export const portfolio = {
  slug: "portfolio",
  title: "This portfolio",
  summary:
    "A personal site treated as a product: typed, tested on every change and deployed automatically to my own server.",
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

  // Real screenshots of the production build (pnpm screenshots), French version.
  media: {
    desktop: {
      base: "/images/projects/portfolio/home-desktop",
      widths: [960, 1600],
      width: 1600,
      height: 1000,
      alt: "Home page of siavashizadi.com on desktop (French version): headline, build spec sheet and areas of work.",
    },
    mobile: {
      base: "/images/projects/portfolio/home-mobile",
      widths: [390, 780],
      width: 780,
      height: 1688,
      alt: "Home page of siavashizadi.com on mobile (French version).",
    },
    gallery: [
      {
        base: "/images/projects/portfolio/projects-desktop",
        widths: [960, 1600],
        width: 1600,
        height: 1000,
        alt: "Projects page (French version): the featured project, with its screenshots, status and technologies.",
        caption: "The Projects page presents every project as a case study.",
      },
      {
        base: "/images/projects/portfolio/contact-desktop",
        widths: [960, 1600],
        width: 1600,
        height: 1000,
        alt: "Contact page (French version): form with name, email and message, and direct links.",
        caption:
          "The contact form is validated on the server; direct links stay available.",
      },
    ],
  },

  caseStudy: {
    problem:
      "A developer portfolio often shows screenshots and lists of technologies, with no proof that the code works in production. I wanted a site whose own construction is the demonstration.",
    audience:
      "Recruiters and engineering leads assessing a full-stack profile, and future clients who want to know how I work.",
    role: "Design, development, infrastructure and documentation. Built alone.",

    architecture: [
      "Pages generated statically at build time with the Next.js App Router; client-side JavaScript limited to the mobile menu, the language switcher and the contact form.",
      "Typed content in the repository, validated with Zod at build time, in French and English, without a database.",
      "Multi-stage Docker image, run without root privileges and read-only.",
      "Nginx as a reverse proxy with HTTPS (Let’s Encrypt, automatic renewal) on a Hetzner server I administer.",
      "Every push triggers lint, type checking, the build, then end-to-end tests (Playwright, desktop and mobile, accessibility with axe) run against the Docker image that will be deployed.",
    ],

    decisions: [
      {
        title: "No database",
        body: "The content changes rarely and one person edits it: Git is enough as a content management system. Less attack surface, nothing to back up, and pages served as static HTML.",
      },
      {
        title: "Self-hosting rather than Vercel",
        body: "Vercel would have been simpler, but it would have hidden what I wanted to learn and show: containers, reverse proxy, TLS and continuous deployment. In return, the server’s availability and updates are my responsibility.",
      },
      {
        title: "A deploy key that can do only one thing",
        body: "The SSH key used by GitHub Actions is restricted by a forced command: it can only run the deployment script, which accepts nothing but a valid commit ID. A stolen key would not give access to the server.",
      },
    ],

    challenges: [
      {
        problem:
          "The first build failed: Next.js downloaded the fonts from Google Fonts, which made the build depend on an external service.",
        solution:
          "The fonts are part of the repository. The build now depends only on the packages pinned in the lockfile.",
      },
      {
        problem:
          "With Next.js 16, the layout is no longer unmounted between pages: the mobile menu stayed open after a link was clicked.",
        solution:
          "The menu closes itself at the start of every navigation, through the onNavigate callback of the Link component.",
      },
      {
        problem:
          "A project address that did not exist showed the 404 page, but with HTTP status 200: the partially prerendered page started streaming before the application knew the project did not exist.",
        solution:
          "A proxy checks the identifier before rendering, from the same list of projects as the pages. A test checks the 404 status on the very first request.",
      },
      {
        problem:
          "The first automatic deployment failed: the SSH key, pasted over several lines into the GitHub secrets, arrived corrupted.",
        solution:
          "The workflow now checks the key before connecting and accepts a base64-encoded version on a single line, which survives copy and paste.",
      },
    ],

    implemented: [
      "Automatic deployment on every push to main, since October 24, 2026.",
      "End-to-end tests on desktop and mobile, with an axe accessibility check on every page, run against the Docker image before every deployment.",
      "Content security policy (CSP) and security headers, checked by the tests.",
      "A real HTTP 404 status for project pages that do not exist.",
      "Contact form validated on the server, with rate limiting and a spam trap.",
      "French and English versions of every page, with hreflang links and a test that every French page has its English counterpart.",
    ],

    nextSteps: [
      "Rate limiting in Nginx, on top of the application’s own.",
      "Server backups and a tested restore procedure.",
      "IPv6 access (DNS AAAA record).",
    ],

    limitations: [
      "One server, in one region, without a CDN: if the server goes down, the site is unavailable.",
      "Monitoring is limited to a check every 30 minutes from GitHub Actions (site response and certificate validity), with an email on failure.",
      "No server backup yet: the code, the image and the configuration are in the repository, but rebuilding the server would be manual.",
      "The CSP allows inline scripts, because Next.js embeds each page’s data in script tags. The strict alternative (nonces) would force every page to render on demand. This trade-off is documented in ADR-0006.",
      "The server’s configuration files (compose.yaml, deploy.sh, Nginx) are copied there by hand: changing them in the repository does not update the server.",
      "The contact form keeps its rate limit in memory: it resets on restart and would not be shared between several instances.",
    ],

    diagrams: ["architecture", "pipeline"],

    excerpts: [
      {
        title: "The deployment script accepts nothing but a commit SHA",
        file: "deploy/deploy.sh",
        from: 'requested="${SSH_ORIGINAL_COMMAND',
        to: "fi",
        caption:
          "The GitHub Actions SSH key is bound to this script by a forced command. Anything that is not a 40-character SHA (spaces, “;”, “latest”…) is refused.",
      },
      {
        title: "The container can do almost nothing",
        file: "deploy/compose.yaml",
        from: "# --- Hardening ---",
        to: "no-new-privileges:true",
        caption:
          "Read-only file system, no Linux capabilities, no privilege escalation. The same file is used by the CI smoke test and in production.",
      },
      {
        title: "A “live” project must have an address",
        file: "src/content/projects/schema.ts",
        from: ".refine((project) => project.status",
        to: "});",
        caption:
          "Content is validated with Zod during the build. An inconsistency fails the build instead of reaching production.",
      },
    ],
  },
} satisfies Project;
