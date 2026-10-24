import type { ReactNode } from "react";

/**
 * Shared building blocks for long-form pages (case studies, À propos, legal).
 * One place decides how a section title, a fact or a bullet list looks.
 */

export function ProseSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className="scroll-mt-24"
    >
      <h2
        id={id ? `${id}-title` : undefined}
        className="font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
      >
        {title}
      </h2>
      <div className="mt-4 grid gap-4 text-[1.0625rem] leading-relaxed text-muted [&_p]:text-pretty">
        {children}
      </div>
    </section>
  );
}

export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.14em] text-muted uppercase">{label}</dt>
      <dd className="mt-2 text-text">{children}</dd>
    </div>
  );
}

export function DashList({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="relative pl-5">
          <span aria-hidden="true" className="absolute left-0 text-muted">
            –
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TextLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className="text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
    >
      {children}
      {external ? <span aria-hidden="true"> ↗</span> : null}
    </a>
  );
}
