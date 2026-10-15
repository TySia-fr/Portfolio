import type { ComponentPropsWithoutRef } from "react";

/** Horizontal page frame: one max width and one gutter for the whole site. */
export function Container({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`} {...props} />
  );
}
