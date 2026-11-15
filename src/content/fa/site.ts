import type { Widen } from "@/i18n/types";

import type { site as fr } from "../site";
import { site as base } from "../site";

/**
 * Site-wide copy in Persian (ADR-0009). Identity and links come from the
 * French module. Persian text uses Persian punctuation, ی/ک (never ي/ك) and
 * the zero-width non-joiner (نیم‌فاصله) wherever Persian spelling needs it.
 */
export const site = {
  ...base,
  portrait: { ...base.portrait, alt: "تصویر سیاوش ایزدی" },
  role: "توسعه‌دهندهٔ فول‌استک جاوااسکریپت",

  nav: [
    { href: "/fa/projects", label: "پروژه‌ها" },
    { href: "/fa/open-to-roles", label: "آمادهٔ همکاری" },
    { href: "/fa/about", label: "دربارهٔ من" },
    { href: "/fa/contact", label: "تماس" },
  ],

  ui: {
    skipToContent: "رفتن به محتوا",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    mainNavigation: "منوی اصلی",
    home: "صفحهٔ اصلی",
    tagline: "فول‌استک",
    language: "زبان",
  },

  notFound: {
    eyebrow: "خطای ۴۰۴",
    title: "این صفحه وجود ندارد.",
    body: "شاید نشانی را اشتباه وارد کرده‌اید، یا این صفحه جابه‌جا شده است.",
    back: "بازگشت به صفحهٔ اصلی",
    trace: {
      label: "درخواست شما چه مسیری رفت",
      hops: [
        { name: "DNS", detail: "دامنه پیدا شد" },
        { name: "Nginx", detail: "اتصال HTTPS برقرار شد" },
        { name: "Next.js", detail: "جست‌وجوی صفحه" },
      ],
      missing: "صفحه‌ای در این نشانی نیست",
    },
    suggestion: "شاید دنبال این صفحه بودید:",
    elsewhere: "صفحه‌های سایت",
  },

  meta: {
    description:
      "سیاوش ایزدی (Siavash Izadi)، توسعه‌دهندهٔ فول‌استک جاوااسکریپت در فرانسه: پروژه‌ها، روش کار و راه‌های تماس.",
  },

  footer: {
    cvHref: "/fa/cv",
    legalHref: "/fa/legal",
    sourceCode: "کد منبع",
    legal: "اطلاعات حقوقی",
    cv: "رزومه",
    builtFrom: "نسخه",
  },
} as const satisfies Widen<typeof fr>;
