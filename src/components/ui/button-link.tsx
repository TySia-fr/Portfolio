import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

type Props = ComponentProps<typeof Link> & { variant?: Variant };

/** A link styled as a button (see .btn in globals.css). Navigation is a link, not a <button>. */
export function ButtonLink({ variant = "primary", className = "", ...props }: Props) {
  return <Link className={`btn btn-${variant} ${className}`} {...props} />;
}
