"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

type Hop = { name: string; detail: string };
type Page = { href: string; label: string };

/** The URL the visitor asked for. Server render: unknown, so nothing is shown. */
function useRequestedPath(): string | null {
  return useSyncExternalStore(
    () => () => {},
    () => decodeURI(window.location.pathname),
    () => null,
  );
}

/**
 * The request's real path, replayed line by line (CSS, once): it did reach
 * the server; only the last step failed. Every hop is true for any 404 here.
 */
export function RequestTrace({
  label,
  hops,
  missing,
}: {
  label: string;
  hops: readonly Hop[];
  missing: string;
}) {
  const path = useRequestedPath();
  return (
    <figure className="nf-trace overflow-hidden rounded-[6px] border border-line bg-surface/80 font-mono text-[0.8125rem] leading-6">
      <figcaption className="border-b border-line px-4 py-2.5 text-xs text-muted">
        {label}
      </figcaption>
      <ol className="px-4 py-3">
        <li className="nf-line truncate text-text">
          <span className="text-muted">GET </span>
          {path ?? "…"}
        </li>
        {hops.map((hop) => (
          <li key={hop.name} className="nf-line flex gap-3">
            <span aria-hidden="true" className="text-[#6cc287]">
              ✓
            </span>
            <span className="w-16 shrink-0 text-text">{hop.name}</span>
            <span className="min-w-0 text-muted">{hop.detail}</span>
          </li>
        ))}
        <li className="nf-line flex gap-3">
          <span aria-hidden="true" className="text-signal">
            ✗
          </span>
          <span className="w-16 shrink-0 text-signal">404</span>
          <span className="min-w-0 text-signal">{missing}</span>
        </li>
      </ol>
    </figure>
  );
}

/** Edit distance between two strings (Levenshtein), for "did you mean". */
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]!;
      row[j] = Math.min(
        row[j]! + 1,
        row[j - 1]! + 1,
        previous + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      previous = current;
    }
  }
  return row[b.length]!;
}

const normalize = (path: string) =>
  path.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\/+$/, "") || "/";

/**
 * The closest existing page to the mistyped address, if one is close enough
 * to be a likely typo ("/projet/nexora" → "/projets/nexora").
 */
export function Suggestion({ label, pages }: { label: string; pages: readonly Page[] }) {
  const path = useRequestedPath();
  if (!path) return null;
  const wanted = normalize(path);
  let best: { page: Page; score: number } | null = null;
  for (const page of pages) {
    const candidate = normalize(page.href);
    const whole = distance(wanted, candidate);
    // A missing or extra prefix ("/nexora" for "/projets/nexora") counts as close.
    const tail = candidate.endsWith(wanted) && wanted.length > 3 ? 1 : Infinity;
    const score = Math.min(whole, tail);
    if (!best || score < best.score) best = { page, score };
  }
  if (!best || best.score > Math.max(2, Math.floor(wanted.length * 0.4))) return null;

  return (
    <p className="nf-line text-[0.9375rem] text-muted">
      {label}{" "}
      <Link
        href={best.page.href}
        className="font-mono text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
      >
        {best.page.href}
      </Link>{" "}
      <span className="text-muted">({best.page.label})</span>
    </p>
  );
}
