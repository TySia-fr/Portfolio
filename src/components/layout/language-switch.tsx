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
    <div className="flex items-center gap-2">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="hidden size-3.5 text-muted sm:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <circle cx="8" cy="8" r="6.25" />
        <path d="M1.75 8h12.5M8 1.75c1.7 1.75 2.5 3.8 2.5 6.25S9.7 12.5 8 14.25C6.3 12.5 5.5 10.45 5.5 8S6.3 3.5 8 1.75Z" />
      </svg>
      <ul
        aria-label={label}
        className="flex items-center rounded-[5px] border border-line bg-surface/70 p-0.5 font-mono text-[0.6875rem] font-medium tracking-[0.08em]"
      >
        {locales.map((target) => {
          const info = localeInfo[target];
          const current = target === locale;
          const segment =
            "flex min-h-7 min-w-9 items-center justify-center rounded-[3px] px-2 transition-colors duration-[var(--duration-fast)]";
          return (
            <li key={target}>
              {current ? (
                <span
                  aria-current="true"
                  lang={info.htmlLang}
                  title={info.label}
                  className={`${segment} bg-signal text-ink`}
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
                  className={`${segment} text-muted hover:bg-line/70 hover:text-text`}
                >
                  {info.short}
                  <span className="sr-only"> ({info.label})</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
