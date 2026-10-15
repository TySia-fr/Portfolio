import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex h-11 items-center gap-2 rounded-[3px] px-5 font-mono text-[0.8125rem] font-medium transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-signal text-ink hover:bg-text",
  secondary: "border border-line text-text hover:border-muted",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant };

/** A link styled as a button. Navigation is a link, not a <button>. */
export function ButtonLink({ variant = "primary", className = "", ...props }: Props) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
