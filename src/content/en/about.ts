import type { Widen } from "@/i18n/types";

import type { about as fr } from "../about";

/** About page in English: the same facts as the French page, nothing added. */
export const about = {
  title: "About",
  description:
    "Siavash Izadi (سیاوش ایزدی), full-stack JavaScript developer based in France: background, education, interests and way of working.",
  eyebrow: "Full-stack JavaScript developer · Computer science & cybersecurity",
  heading: "Turning ideas into web applications that work.",
  intro:
    "I am passionate about web development and new technologies. I design modern web applications and build both the front end and the back end.",

  facts: {
    title: "In short",
    items: [
      {
        label: "Degree",
        value:
          "Bachelor’s in computer engineering, Iran (2024). EQF level 6 according to ENIC-NARIC France",
      },
      { label: "Studies", value: "Computer science, University of Montpellier" },
      { label: "Projects", value: "Three applications in production, public code" },
      { label: "Looking for", value: "Software development roles" },
    ],
  },

  sections: [
    {
      id: "parcours",
      title: "My background",
      paragraphs: [
        "I hold a bachelor’s degree in computer engineering (software), earned in Iran in 2024 and recognized by ENIC-NARIC France at level 6 (bachelor’s level). I am now studying computer science at the University of Montpellier. My path combines academic training, professional experience and continuous learning.",
        "Since then, I have designed and deployed my own applications in production: this portfolio, served by my own server with continuous deployment, and NEXORA, a complete e-commerce store with payments, accounts, a back office and a test suite that proves it.",
        "Today I focus on the JavaScript ecosystem and on building complete web applications: from interface design to server logic and data management.",
      ],
    },
  ],

  timeline: {
    title: "Milestones",
    items: [
      {
        period: "Sept. 2024",
        title: "Bachelor’s in computer engineering (software)",
        body: "Islamic Azad University, Tehran. Advanced programming, algorithms, databases, software engineering, object-oriented design, Internet engineering, a software project and an internship. Level 6 (bachelor’s level) according to the ENIC-NARIC France statement of comparability.",
      },
      {
        period: "Today",
        title: "Computer science studies at the University of Montpellier",
        body: "Alongside, full-stack JavaScript development (this portfolio, NEXORA, ApplyFlow) and a search for my first role in software development.",
        current: true,
      },
    ],
  },

  interests: {
    title: "Interests",
    items: [
      {
        title: "Full-stack JavaScript development",
        body: "User interfaces, back-end development, REST APIs and databases with the tools of the JavaScript ecosystem.",
      },
      {
        title: "Front end",
        body: "Modern, responsive and intuitive interfaces, with close attention to user experience and code quality.",
      },
      {
        title: "Back end & data",
        body: "Business logic, data modeling and applications that stay maintainable as they grow.",
      },
      {
        title: "Systems & cybersecurity",
        body: "Linux, networks, web application security and vulnerability research in authorized environments.",
      },
    ],
  },

  philosophy: {
    title: "How I work",
    paragraphs: [
      "Development is not just writing code. It means understanding a problem, designing the right solution and building a product that is reliable, fast and pleasant to use.",
      "I favor problem solving, continuous learning and improving every project step by step. The quality of the user experience matters to me as much as the technical structure and security.",
    ],
  },

  next: {
    title: "What’s next?",
    paragraphs: [
      "I want to keep taking on ambitious projects, deepen my expertise in the JavaScript ecosystem and explore where web development, infrastructure and cybersecurity meet.",
      "I am open to conversations, collaborations and opportunities that let me build, learn and grow.",
    ],
    cta: { href: "/en/contact", label: "Get in touch" },
  },
} as const satisfies Widen<typeof fr>;
