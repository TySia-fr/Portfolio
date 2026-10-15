import "server-only";

import packageJson from "../../package.json";
import { site } from "@/content/site";

const COMMIT_SHA = /^[0-9a-f]{40}$/;

export type BuildInfo = {
  nextVersion: string;
  /** Full SHA, or null for local builds that have no commit attached. */
  commit: string | null;
  commitUrl: string | null;
  builtAt: Date;
};

/**
 * Facts about the running build. Values are inlined by next.config.ts at build
 * time, so prerendered pages show the commit that actually produced them.
 */
export function getBuildInfo(): BuildInfo {
  const raw = process.env.BUILD_COMMIT ?? "";
  const commit = COMMIT_SHA.test(raw) ? raw : null;

  return {
    nextVersion: packageJson.dependencies.next,
    commit,
    commitUrl: commit ? `${site.repositoryUrl}/commit/${commit}` : null,
    builtAt: new Date(process.env.BUILD_TIME ?? 0),
  };
}
