/**
 * "À propos" copy, written by Siavash. Facts only: education, dates and
 * experience as he stated them (ADR-0003, requirements: no invented content).
 */
export const about = {
  title: "À propos",
  description:
    "Siavash Izadi, développeur full-stack JavaScript : parcours, formation, domaines d’intérêt et façon de travailler.",
  eyebrow: "Développeur full-stack JavaScript · Informatique & cybersécurité",
  heading: "Transformer des idées en applications web concrètes.",
  intro:
    "Passionné par le développement web et les nouvelles technologies, je conçois des applications web modernes et développe aussi bien le frontend que le backend.",

  facts: {
    title: "En bref",
    items: [
      { label: "Formation", value: "Bachelor en génie informatique (Iran)" },
      { label: "Études", value: "Informatique, Université de Montpellier" },
      { label: "Expérience", value: "Sites WordPress, 2021 – 2023" },
      { label: "Basé en", value: "France" },
    ],
  },

  sections: [
    {
      id: "parcours",
      title: "Mon parcours",
      paragraphs: [
        "Titulaire d’un Bachelor en génie informatique obtenu en Iran, je poursuis actuellement mes études en informatique à l’Université de Montpellier. Mon parcours associe formation académique, expérience professionnelle et apprentissage continu.",
        "De janvier 2021 à août 2023, j’ai créé et géré des sites web sous WordPress. Cette expérience m’a apporté des compétences en conception web, en UI/UX, en référencement naturel et en publicité digitale avec Google Ads. J’y ai aussi coordonné une équipe, ce qui a développé mon sens de l’organisation et ma capacité à mener des projets.",
        "Aujourd’hui, je me concentre sur l’écosystème JavaScript et sur le développement d’applications web complètes : de la conception des interfaces à la logique serveur et à la gestion des données.",
      ],
    },
  ],

  interests: {
    title: "Domaines d’intérêt",
    items: [
      {
        title: "Développement full-stack JavaScript",
        body: "Interfaces utilisateur, développement backend, API REST et bases de données avec les outils de l’écosystème JavaScript.",
      },
      {
        title: "Frontend",
        body: "Interfaces modernes, responsives et intuitives, avec une attention particulière portée à l’expérience utilisateur et à la qualité du code.",
      },
      {
        title: "Backend & données",
        body: "Logique métier, structuration des données et applications maintenables et évolutives.",
      },
      {
        title: "Systèmes & cybersécurité",
        body: "Linux, réseaux, sécurité des applications web et recherche de vulnérabilités dans des environnements autorisés.",
      },
    ],
  },

  philosophy: {
    title: "Ma façon de travailler",
    paragraphs: [
      "Développer ne consiste pas simplement à écrire du code. Il s’agit de comprendre un problème, de concevoir une solution pertinente et de construire un produit fiable, performant et agréable à utiliser.",
      "Je privilégie la résolution de problèmes, l’apprentissage continu et l’amélioration progressive de chaque projet. La qualité de l’expérience utilisateur compte autant pour moi que la structure technique et la sécurité.",
    ],
  },

  next: {
    title: "Et maintenant ?",
    paragraphs: [
      "Je veux continuer à mener des projets ambitieux, renforcer mon expertise dans l’écosystème JavaScript et explorer les liens entre développement web, infrastructure et cybersécurité.",
      "Je suis ouvert aux échanges, aux collaborations et aux opportunités qui me permettent de créer, d’apprendre et de progresser.",
    ],
    cta: { href: "/contact", label: "Me contacter" },
  },
} as const;
