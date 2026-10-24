import type { Project } from "@/content/projects/schema";
import { projectsPage } from "@/content/projects-page";

/** "live" is the only use of the green token: it reports a real, reachable site. */
export function StatusBadge({ status }: { status: Project["status"] }) {
  const isLive = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] ${
        isLive ? "border-live/30 text-live" : "border-line text-muted"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${isLive ? "bg-live" : "border border-muted"}`}
      />
      {projectsPage.status[status]}
    </span>
  );
}
