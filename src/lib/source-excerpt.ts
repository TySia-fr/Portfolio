import "server-only";

import { readFileSync } from "node:fs";
import { join, normalize } from "node:path";

import type { Excerpt } from "@/content/projects/schema";

/**
 * Returns the lines of a repository file from the line containing `from` to the
 * line containing `to`, inclusive. Runs at build time when pages are
 * prerendered. Throws (and fails the build) if the file or a marker is missing.
 */
export function readExcerpt({
  file,
  from,
  to,
}: Pick<Excerpt, "file" | "from" | "to">): string {
  const path = normalize(file);
  if (path.startsWith("..") || path.startsWith("/")) {
    throw new Error(`Excerpt path must stay inside the repository: ${file}`);
  }

  // turbopackIgnore: this runs while prerendering, never at request time, so the
  // repository must NOT be traced into the production server bundle.
  const lines = readFileSync(
    join(/*turbopackIgnore: true*/ process.cwd(), path),
    "utf8",
  ).split("\n");
  const start = lines.findIndex((line) => line.includes(from));
  const end =
    start === -1 ? -1 : lines.findIndex((line, i) => i >= start && line.includes(to));
  if (start === -1 || end === -1) {
    throw new Error(`Excerpt markers not found in ${file}: "${from}" … "${to}"`);
  }

  // Remove the common indentation so the excerpt starts at column 0.
  const slice = lines.slice(start, end + 1);
  const indent = Math.min(
    ...slice
      .filter((line) => line.trim())
      .map((line) => line.match(/^ */)?.[0].length ?? 0),
  );
  return slice.map((line) => line.slice(indent)).join("\n");
}
