import type { Widen } from "@/i18n/types";

import type { projectsPage as fr } from "../projects-page";

/** Copy for the projects list, cards and case studies, in Persian. */
export const projectsPage = {
  title: "پروژه‌ها",
  description:
    "پروژه‌های سیاوش ایزدی، توسعه‌دهندهٔ فول‌استک جاوااسکریپت: مسئله، معماری، انتخاب‌های فنی و کد منبع.",
  intro:
    "هر پروژه به شکل یک مطالعهٔ موردی مستند شده: مسئله، معماری، تصمیم‌ها و کارهایی که مانده. کد عمومی است.",
  empty: "هنوز پروژه‌ای منتشر نشده. اولین پروژه در حال ساخت است.",

  status: {
    live: "در حال اجرا",
    "in-progress": "در حال ساخت",
  },

  card: {
    readCaseStudy: "خواندن مطالعهٔ موردی",
  },

  detail: {
    back: "همهٔ پروژه‌ها",
    facts: {
      status: "وضعیت",
      year: "سال",
      role: "نقش",
      stack: "فناوری‌ها",
    },
    links: {
      live: "دیدن سایت",
      repository: "کد منبع",
    },
    toc: "در این صفحه",
    sections: {
      context: "زمینه",
      problem: "مسئله",
      audience: "برای چه کسی",
      architecture: "معماری",
      delivery: "انتشار پیوسته",
      code: "در کد",
      decisions: "تصمیم‌ها و بده‌بستان‌ها",
      challenges: "چالش‌ها",
      challengeProblem: "مشکل",
      challengeSolution: "راه‌حل",
      status: "وضعیت پروژه",
      implemented: "انجام‌شده",
      nextSteps: "برنامه‌ریزی‌شده، هنوز انجام نشده",
      limitations: "محدودیت‌های شناخته‌شده",
      gallery: "تصاویر",
    },
    excerptSource: "منبع",
  },
} as const satisfies Widen<typeof fr>;
