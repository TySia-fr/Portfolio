import type { Widen } from "@/i18n/types";

import type { pipeline as fr } from "../pipeline";
import { site } from "../site";

const blob = (path: string) => `${site.repositoryUrl}/blob/main/${path}`;

/** The delivery pipeline in Persian. Each step names the file that implements it. */
export const pipeline = {
  title: "از git push تا انتشار",
  intro:
    "هر تغییر همین مسیر را بدون هیچ مرحلهٔ دستی طی می‌کند. اگر مرحله‌ای شکست بخورد، مرحلهٔ بعد شروع نمی‌شود.",
  caption:
    "این نمودار فرایندی را نشان می‌دهد که در مخزن تنظیم شده، نه وضعیت لحظه‌ای سرور را.",
  sourceLabel: "دیدن فایل",
  steps: [
    {
      id: "push",
      name: "GitHub",
      action: "git push روی main",
      detail: "کد و تاریخچه‌اش عمومی است.",
      file: { label: "repository", href: site.repositoryUrl },
    },
    {
      id: "ci",
      name: "GitHub Actions",
      action: "بررسی",
      detail: "lint، قالب‌بندی، تایپ‌ها و build، سپس تست‌های سرتاسری روی ایمیج Docker.",
      file: { label: "ci.yml", href: blob(".github/workflows/ci.yml") },
    },
    {
      id: "image",
      name: "ایمیج Docker",
      action: "انتشار",
      detail:
        "چندمرحله‌ای، با کاربر غیر root. در GHCR منتشر می‌شود و برچسبش SHA همان commit است.",
      file: { label: "Dockerfile", href: blob("Dockerfile") },
    },
    {
      id: "deploy",
      name: "deploy.sh",
      action: "استقرار",
      detail:
        "کلید SSH فقط به این اسکریپت محدود است. جز یک SHA چیزی نمی‌پذیرد و اگر نسخهٔ جدید سالم نباشد، به نسخهٔ قبلی برمی‌گردد.",
      file: { label: "deploy.sh", href: blob("deploy/deploy.sh") },
    },
    {
      id: "serve",
      name: "VPS · Nginx",
      action: "پاسخ‌دهی",
      detail:
        "HTTPS با Let’s Encrypt. Nginx درخواست‌ها را به کانتینری می‌فرستد که فقط از داخل سرور در دسترس است.",
      file: { label: "nginx", href: blob("deploy/nginx/siavashizadi.com.conf") },
    },
  ],
} as const satisfies Widen<typeof fr>;
