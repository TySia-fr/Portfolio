import "./globals.css";

import type { Metadata } from "next";
import Link from "next/link";

import { geistSans, martianMono } from "@/fonts";
import { getContent } from "@/content";

/**
 * 404 for any URL that matches no route. With one root layout per language
 * (ADR-0008) there is no single layout to render it in, so Next.js serves this
 * page as is: no header, no footer. It cannot know which language the visitor
 * wanted, so it speaks both.
 */
const fr = getContent("fr").site.notFound;
const en = getContent("en").site.notFound;

export const metadata: Metadata = {
  title: `${fr.eyebrow} — Siavash Izadi`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${geistSans.variable} ${martianMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <main
          id="contenu"
          className="mx-auto w-full max-w-6xl flex-1 px-5 py-24 sm:px-8 sm:py-32"
        >
          <p className="font-mono text-xs tracking-wider text-muted uppercase">
            {fr.eyebrow}
          </p>
          <h1 className="mt-4 font-mono text-3xl font-medium tracking-tight [font-stretch:80%] sm:text-5xl">
            {fr.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{fr.body}</p>
          <p lang="en" className="mt-3 max-w-xl text-lg text-muted">
            {en.title} {en.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              {fr.back}
            </Link>
            <Link href="/en" lang="en" hrefLang="en" className="btn btn-secondary">
              {en.back}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
