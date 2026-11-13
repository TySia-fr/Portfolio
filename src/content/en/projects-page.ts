import type { Widen } from "@/i18n/types";

import type { projectsPage as fr } from "../projects-page";

/** Copy for the projects list, cards and case studies, in English. */
export const projectsPage = {
  title: "Projects",
  description:
    "Projects by Siavash Izadi, full-stack JavaScript developer: problem, architecture, technical choices and source code.",
  intro:
    "Every project is documented as a case study: the problem, the architecture, the decisions and what is left to do. The code is public.",
  empty: "No project published yet. The first one is being built.",

  status: {
    live: "Live",
    "in-progress": "In progress",
  },

  card: {
    readCaseStudy: "Read the case study",
  },

  detail: {
    back: "All projects",
    facts: {
      status: "Status",
      year: "Year",
      role: "Role",
      stack: "Technologies",
    },
    links: {
      live: "Visit the site",
      repository: "Source code",
    },
    toc: "On this page",
    sections: {
      context: "Context",
      problem: "The problem",
      audience: "Who it is for",
      architecture: "Architecture",
      delivery: "Continuous delivery",
      code: "In the code",
      decisions: "Decisions and trade-offs",
      challenges: "Challenges",
      challengeProblem: "Problem",
      challengeSolution: "Solution",
      status: "Project status",
      implemented: "Done",
      nextSteps: "Planned, not done yet",
      limitations: "Known limitations",
      gallery: "Screenshots",
    },
    excerptSource: "Source",
  },
} as const satisfies Widen<typeof fr>;
