import type { Widen } from "@/i18n/types";

import type { infrastructure as fr } from "../infrastructure";

/** How a request reaches the site, in Persian (same configuration as ../infrastructure). */
export const infrastructure = {
  title: "مسیر یک درخواست",
  caption: "پیکربندی‌ای که فایل‌های پوشهٔ deploy/ در مخزن توصیف می‌کنند.",
  host: "سرور Hetzner · هلسینکی · Ubuntu",
  nodes: [
    {
      id: "visitor",
      name: "مرورگر",
      facts: ["فقط HTTPS (HSTS)"],
    },
    {
      id: "dns",
      name: "Cloudflare DNS",
      facts: ["فقط تبدیل نام دامنه، بدون پراکسی"],
    },
    {
      id: "nginx",
      name: "Nginx",
      facts: [
        "TLS با Let’s Encrypt",
        "www و HTTP تغییر مسیر داده می‌شوند",
        "حداکثر حجم درخواست ۶۴ کیلوبایت",
      ],
      onHost: true,
    },
    {
      id: "app",
      name: "کانتینر Next.js",
      facts: [
        "فقط روی 127.0.0.1",
        "کاربر غیر root، فقط‌خواندنی",
        "سقف حافظه ۳۸۴ مگابایت",
      ],
      onHost: true,
    },
  ],
} as const satisfies Widen<typeof fr>;
