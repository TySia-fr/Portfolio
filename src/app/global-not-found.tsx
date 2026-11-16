import "./globals.css";

import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedLogo } from "@/components/brand/animated-logo";
import { geistSans, martianMono, vazirmatn, vazirmatnPunctuation } from "@/fonts";
import { getContent } from "@/content";
import { NotFoundView } from "@/views/not-found";

/**
 * 404 for any URL that matches no route. With one root layout per language
 * (ADR-0008) there is no layout to render it in, so this page is a document of
 * its own. The URL tells the language (/en/… is English, /fa/… Persian): the inline script
 * below sets <html lang> before the first paint, and CSS shows that block.
 */
export const metadata: Metadata = {
  title: `${getContent("fr").site.notFound.eyebrow} — Siavash Izadi`,
  robots: { index: false },
};

const pickLanguage = `var m=/^\\/(en|fa)(\\/|$)/.exec(location.pathname),l=m?m[1]:"fr",d=document.documentElement;d.lang=l;d.dir=l==="fa"?"rtl":"ltr"`;

export default function GlobalNotFound() {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${martianMono.variable} ${vazirmatn.variable} ${vazirmatnPunctuation.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
      </head>
      <body className="flex min-h-full flex-col">
        <header className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 py-2 font-mono text-sm font-medium tracking-tight [font-stretch:87.5%]"
          >
            <AnimatedLogo className="size-6 text-text" />
            siavash izadi
          </Link>
        </header>
        <main id="contenu" className="flex-1">
          <NotFoundView locales={["fr", "en", "fa"]} />
        </main>
      </body>
    </html>
  );
}
