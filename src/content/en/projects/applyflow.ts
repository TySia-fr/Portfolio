import type { Project } from "@/content/projects/schema";

/**
 * ApplyFlow case study in English: a translation of ../../projects/applyflow.ts,
 * same sources (ApplyFlow repository at commit 6066019), nothing added.
 */
const shots = "/images/projects/applyflow";

export const applyflow = {
  slug: "applyflow",
  title: "ApplyFlow",
  summary:
    "Job-search tracker: applications, interviews and follow-ups in one place, new offers found every day, and a Telegram bot to manage it all from a phone.",
  status: "live",
  year: 2026,
  featured: false,
  stack: [
    "Next.js 16",
    "TypeScript",
    "PostgreSQL",
    "Drizzle",
    "better-auth",
    "dnd-kit",
    "Telegram Bot API",
    "Vitest",
    "Playwright",
    "Docker",
  ],

  links: {
    live: "https://applyflow.siavashizadi.com",
    repository: "https://github.com/TySia-fr/ApplyFlow",
  },

  media: {
    desktop: {
      base: `${shots}/dashboard-light`,
      widths: [960, 1440],
      width: 1440,
      height: 720,
      alt: "ApplyFlow dashboard: number of applications, response, interview and offer rates, and applications per week.",
    },
    gallery: [
      {
        base: `${shots}/dashboard-dark`,
        widths: [960, 1440],
        width: 1440,
        height: 720,
        alt: "The same ApplyFlow dashboard in dark mode.",
        caption: "Light and dark mode, interface in English and French. Sample data.",
      },
    ],
  },

  caseStudy: {
    problem:
      "During a job search, applications get lost between a spreadsheet, emails and notes: you no longer know whom to follow up with, or what works. I wanted a tool that keeps the whole history and computes honest rates, without reading a trend into a sample that is too small.",
    audience:
      "Anyone applying seriously; and, for this portfolio, engineering leads who want to see a multi-user application with proper isolation.",
    role: "Design, development, testing, deployment and documentation. Built alone.",

    architecture: [
      "Modular monolith with one-way dependencies: interface → Server Actions (authentication and validation) → domain services → database.",
      "PostgreSQL 16 with Drizzle ORM; every status change is an appended event, never an overwritten value.",
      "Little client-side JavaScript: Server Components and Server Actions, charts rendered on the server; only the Kanban board (dnd-kit) is a heavy client component.",
      "Documents (résumés, cover letters) in private storage, type checked from the file contents, downloadable by their owner only.",
      "Telegram bot over an authenticated webhook; scheduled jobs (daily offers, reminders) called by the server’s cron on protected routes, without a queue container.",
      "Docker images built by GitHub Actions and published to GHCR; the server only pulls them, with automatic rollback.",
    ],

    decisions: [
      {
        title: "Isolation between users in three layers",
        body: "Every query is filtered by the session’s user; tables reference each other through composite foreign keys (user, id), so the database itself refuses a link between two accounts; and the tests try every operation as the wrong user.",
      },
      {
        title: "Rates computed from the history",
        body: "An application rejected after an interview still counts as an interview. Small samples are flagged as such instead of being shown as a trend.",
      },
      {
        title: "Find and save, never apply on the user’s behalf",
        body: "The bot and job discovery add opportunities to the tracker; they never send an application. Applying automatically breaks job boards’ terms and cannot be undone after a mistake.",
      },
      {
        title: "Server Actions rather than a REST API",
        body: "The application has a single client, its own interface: typed server actions avoid an API layer to maintain. The choice and its limits are documented in an ADR.",
      },
    ],

    challenges: [
      {
        problem:
          "Two simultaneous status changes could produce a history in the wrong order.",
        solution:
          "A status change locks the row, and event timestamps use clock_timestamp(): the order shown follows the real order of the writes.",
      },
      {
        problem:
          "The bot downloads the job links users send it: a link to an internal address of the server would have allowed an SSRF attack.",
        solution:
          "The IP address is checked at the moment of DNS resolution (no rebinding window), every redirect is validated again, with size and time limits. Data comes from schema.org JobPosting markup; otherwise the bot asks for “Role @ Company” instead of guessing.",
      },
    ],

    implemented: [
      "Twelve-stage pipeline: filterable table and Kanban board with saved drag and drop.",
      "Interviews with time zones, follow-ups, calendar, document versions.",
      "Discovery: saved searches on La Bonne Alternance (public API), new offers every day, added to the tracker in one click, without duplicates.",
      "Telegram bot: account linking through a one-time link, adding an offer by sharing its link, daily offers with buttons, reminders before interviews and follow-ups, each sent once.",
      "Demo mode without an account: a private space with sample data, deleted after 24 hours.",
      "68 unit and integration tests, 12 end-to-end tests with axe accessibility checks, including Telegram linking through the real webhook route; full CI.",
    ],

    nextSteps: [
      "Sending emails (address verification, password reset) and two-factor authentication.",
    ],

    limitations: [
      "The CSP allows inline scripts, for the same reason as on this site (ADR-0006).",
      "Links from sites that block robots (LinkedIn) cannot be read: the bot then asks for the role and the company.",
      "The La Bonne Alternance API is for non-commercial use only: fine for this project, a blocker for a paid product.",
      "Uploaded files are not scanned by an antivirus; they are never executed or displayed inline.",
    ],

    excerpts: [],
    diagrams: [],
  },
} satisfies Project;
