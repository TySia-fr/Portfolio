import type { Widen } from "@/i18n/types";

import type { cv as fr } from "../cv";
import { openToRoles } from "./open-to-roles";

/**
 * Résumé in Persian: the same verified facts as the French CV. The PDF is
 * printed from /fa/cv by scripts/build-cv-pdf.mjs: regenerate it in the same
 * commit as any change here.
 */
export const cv = {
  title: "رزومه",
  headline: openToRoles.short,
  description:
    "رزومهٔ سیاوش ایزدی، توسعه‌دهندهٔ فول‌استک جاوااسکریپت: پروژه‌های در حال اجرا، مهارت‌ها، تحصیلات. آمادهٔ همکاری تمام‌وقت، فریلنس و دورکاری.",
  pdf: {
    href: "/cv/Siavash-Izadi-CV-fa.pdf",
    label: "دانلود رزومه (PDF)",
  },
  location: "فرانسه",
  /** Printed résumé (PDF) only, as on the French CV. */
  phone: { display: "+33 6 66 71 24 78", href: "tel:+33666712478" },

  profileTitle: "معرفی",
  profile:
    "توسعه‌دهندهٔ فول‌استک JavaScript / TypeScript. اپلیکیشن‌های وب کامل را طراحی، تست و منتشر می‌کنم: رابط کاربری، منطق سرور، پایگاه‌داده، کانتینر و یکپارچه‌سازی پیوسته. علاقهٔ جدی به زیرساخت و امنیت اپلیکیشن.",

  projectsTitle: "پروژه‌های در حال اجرا",
  projects: [
    {
      slug: "nexora",
      name: "NEXORA — فروشگاه اینترنتی کامل",
      url: "nexora.siavashizadi.com",
      stack: "Next.js 16, TypeScript, PostgreSQL, Prisma, Stripe, better-auth, Docker",
      bullets: [
        "کاتالوگ، سبد خرید، پرداخت با Stripe (حالت آزمایشی)، حساب مشتری و پنل مدیریت با گزارش رویدادها.",
        "رزرو موجودی انبار با یک کوئری اتمی SQL: با ۸ خرید هم‌زمان برای ۳ عدد کالا تست شده، بدون فروش بیش از موجودی.",
        "۷۹ تست واحد و یکپارچگی، ۲۰ تست سرتاسری (Playwright و بررسی دسترس‌پذیری با axe) و CI کامل.",
      ],
    },
    {
      slug: "prix-au-metre",
      name: "Prix au mètre — نقشهٔ قیمت مسکن",
      url: "prixaumeter.siavashizadi.com",
      stack:
        "Next.js 16, TypeScript, PostgreSQL, Prisma, MapLibre GL, better-auth, Docker",
      bullets: [
        "قیمت میانهٔ هر متر مربع، خیابان به خیابان، از داده‌های عمومی DVF: ۱۰۴٬۸۸۳ فروش واقعی پاک‌سازی‌شده، بدون هیچ عددی زیر ۱۰ فروش.",
        "کوئری‌های اصلی زیر ۵۰ میلی‌ثانیه با ۵ میلیون فروش، اندازه‌گیری‌شده (جست‌وجو: از ۳۸۰ به ۳ میلی‌ثانیه).",
      ],
    },
    {
      slug: "portfolio",
      name: "siavashizadi.com — پورتفولیو روی سرور شخصی",
      url: "siavashizadi.com",
      stack: "Next.js 16, TypeScript, Tailwind CSS, Docker, Nginx, GitHub Actions",
      bullets: [
        "استقرار خودکار با هر push: تست‌ها، ایمیج Docker، انتشار روی سرور خودم و بازگشت به نسخهٔ قبل در صورت خطا.",
        "کانتینر بدون دسترسی root و فقط‌خواندنی؛ CSP و هدرهای امنیتی با تست بررسی می‌شوند.",
      ],
    },
    {
      slug: "applyflow",
      name: "ApplyFlow — ابزار پیگیری جست‌وجوی کار",
      url: "applyflow.siavashizadi.com",
      stack:
        "Next.js 16, TypeScript, PostgreSQL, Drizzle, better-auth, Telegram Bot API, Docker",
      bullets: [
        "درخواست‌ها، مصاحبه‌ها و پیگیری‌ها؛ آگهی‌های تازه هر روز (API سایت La Bonne Alternance)؛ بات تلگرام برای ذخیرهٔ آگهی از روی گوشی.",
        "جداسازی کاربران از هم در خود پایگاه‌داده (کلیدهای خارجی ترکیبی)؛ ۶۸ تست واحد و یکپارچگی، ۱۲ تست سرتاسری.",
      ],
    },
  ],

  skillsTitle: "مهارت‌ها",
  skills: [
    { label: "زبان‌ها", value: "TypeScript, JavaScript, SQL, HTML, CSS" },
    {
      label: "فرانت‌اند",
      value: "React, Next.js (App Router), Tailwind CSS, Accessibility",
    },
    {
      label: "بک‌اند",
      value: "Node.js, Next.js (Server Actions, Route Handlers), REST APIs, Zod",
    },
    {
      label: "داده",
      value: "PostgreSQL (بهینه‌سازی کوئری، materialized view)، Prisma, Drizzle",
    },
    { label: "تست", value: "Vitest, Playwright, axe" },
    {
      label: "DevOps",
      value: "Docker, Nginx, Linux, GitHub Actions, HTTPS (Let’s Encrypt)",
    },
    {
      label: "امنیت",
      value: "CSP، اعتبارسنجی سمت سرور، کنترل دسترسی، حداقل دسترسی",
    },
  ],

  educationTitle: "تحصیلات",
  education: [
    {
      period: "امروز",
      title: "تحصیل در رشتهٔ علوم کامپیوتر",
      place: "دانشگاه مونپلیه",
      detail: null,
    },
    {
      period: "۲۰۲۴",
      title: "کارشناسی مهندسی کامپیوتر (نرم‌افزار)",
      place: "دانشگاه آزاد اسلامی، تهران",
      detail: "سطح ۶ اروپایی (هم‌سطح لیسانس) طبق گواهی هم‌ارزی ENIC-NARIC فرانسه.",
    },
  ],

  languagesTitle: "زبان‌ها",
  languages: "فرانسوی، انگلیسی، فارسی",
} as const satisfies Widen<typeof fr>;
