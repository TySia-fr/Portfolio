import type { Widen } from "@/i18n/types";

import type { home as fr } from "../home";
import { openToRoles } from "./open-to-roles";

/** Home page copy in Persian. Same facts as the French page. */
export const home = {
  banner: { href: "/fa/open-to-roles", label: openToRoles.banner },
  eyebrow: "توسعه‌دهندهٔ فول‌استک جاوااسکریپت · فرانسه",
  title: "اپلیکیشن وب می‌سازم، از پایگاه‌داده تا انتشار نهایی.",
  lead: "با Next.js، Node.js و TypeScript. هر پروژه با یکپارچه‌سازی پیوسته (CI) بررسی و مستند می‌شود: کد عمومی است و تصمیم‌ها هم.",
  focus: {
    title: "روی چه چیزهایی کار می‌کنم",
    items: [
      { label: "اپلیکیشن‌های فول‌استک", detail: "Next.js، Node.js، TypeScript" },
      { label: "زیرساخت", detail: "Docker، Nginx، Linux، CI/CD" },
      { label: "امنیت اپلیکیشن", detail: "هدرهای امنیتی، اعتبارسنجی، حداقل دسترسی" },
    ],
  },
  terminal: {
    command: "git push origin main",
    result: "✓ tests · Docker image · deployed",
  },
  primaryCta: { href: "/fa/projects", label: "دیدن پروژه‌ها" },
  secondaryCta: { href: "/fa/contact", label: "تماس با من" },

  about: {
    href: "/fa/about",
    title: "به‌طور خلاصه",
    text: "کارشناسی مهندسی کامپیوتر دارم (سطح ۶ اروپایی، تأییدشده توسط ENIC-NARIC فرانسه) و در دانشگاه مونپلیه علوم کامپیوتر می‌خوانم. اپلیکیشن‌های وب کامل می‌سازم و منتشر می‌کنم و به زیرساخت و امنیت علاقهٔ زیادی دارم.",
    link: "بیشتر دربارهٔ من",
  },

  pipeline: {
    eyebrow: "پشت صحنه",
  },

  selectedProjects: {
    href: "/fa/projects",
    title: "پروژه‌های منتخب",
    all: "همهٔ پروژه‌ها",
  },

  specSheet: {
    title: "شناسنامهٔ فنی",
    subtitle: "این سایت هم یک پروژه است. این‌طور ساخته شده:",
    rows: {
      framework: "فریم‌ورک",
      language: "زبان",
      language_value: "TypeScript، حالت strict",
      rendering: "رندر",
      rendering_value: "صفحه‌های ایستا که هنگام build ساخته می‌شوند",
      delivery: "انتشار",
      delivery_value: "GitHub Actions → Docker → Nginx",
      source: "کد منبع",
      source_value: "عمومی در GitHub",
      commit: "Commit",
      commit_local: "build محلی",
      builtAt: "زمان build",
    },
  },
} as const satisfies Widen<typeof fr>;
