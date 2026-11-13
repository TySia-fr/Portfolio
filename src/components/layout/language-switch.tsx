"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALE_COOKIE, type Locale, localeInfo, locales } from "@/i18n/config";
import { alternates, href } from "@/i18n/routes";

/**
 * FR / EN switch. Links to the same page in the other language (or that
 * language's home when a page has no counterpart) and remembers the choice in
 * a cookie, so "/" no longer redirects on Accept-Language for this visitor.
 * Client Component only because it reads the current URL.
 */
export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const pair = alternates(pathname);

  return (
    <ul aria-label={label} className="flex items-center gap-1 font-mono text-xs">
      {locales.map((target) => {
        const info = localeInfo[target];
        const current = target === locale;
        return (
          <li key={target}>
            {current ? (
              <span
                aria-current="true"
                lang={info.htmlLang}
                title={info.label}
                className="block px-1.5 py-2 text-signal"
              >
                {info.short}
                <span className="sr-only"> ({info.label})</span>
              </span>
            ) : (
              <Link
                href={pair?.[target] ?? href(target, "home")}
                hrefLang={info.htmlLang}
                // No prefetch: "/" may redirect on the cookie this click sets, and a
                // prefetched answer would have been computed without it.
                prefetch={false}
                lang={info.htmlLang}
                title={info.label}
                onClick={() => {
                  document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
                }}
                className="block px-1.5 py-2 text-muted transition-colors hover:text-text"
              >
                {info.short}
                <span className="sr-only"> ({info.label})</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
