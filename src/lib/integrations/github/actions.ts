import { db } from "@/lib/prisma";
import type { GitHubClient } from "./client";
import type { GitHubWorkflowRun } from "./types";

export async function listRepositoryWorkflowRuns(
  client: GitHubClient,
  owner: string,
  name: string,
  branch?: string,
  perPage = 50,
) {
  const branchParam = branch ? `&branch=${encodeURIComponent(branch)}` : "";
  const data = await client.fetch<{ total_count: number; workflow_runs: GitHubWorkflowRun[] }>(
    `/repos/${owner}/${name}/actions/runs?per_page=${perPage}${branchParam}`,
  );
  return data.workflow_runs ?? [];
}

export async function listProjectWorkflowRuns(projectId: string, take = 30) {
  return db.gitHubWorkflowRun.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function mapWorkflowRun(
  gh: GitHubWorkflowRun,
  repositoryId: string,
  projectId?: string | null,
) {
  return {
    githubId: gh.id,
    repositoryId,
    runNumber: gh.run_number,
    name: gh.name ?? null,
    workflowId: gh.workflow_id ?? null,
    branch: gh.head_branch ?? null,
    headSha: gh.head_sha ?? null,
    status: gh.status ?? null,
    conclusion: gh.conclusion ?? null,
    htmlUrl: gh.html_url,
    createdAt: gh.created_at ? new Date(gh.created_at) : new Date(),
    updatedAt: gh.updated_at ? new Date(gh.updated_at) : null,
    projectId: projectId ?? null,
    syncedAt: new Date(),
  };
}

export function summarizeCiStatus(runs: GitHubWorkflowRun[]): string {
  if (!runs || runs.length === 0) return "idle";
  const latest = runs.reduce((a, b) =>
    new Date(b.created_at ?? "").getTime() > new Date(a.created_at ?? "").getTime() ? b : a,
  );
  if (latest.status === "in_progress" || latest.status === "queued") return "running";
  if (latest.conclusion === "success") return "success";
  if (latest.conclusion === "failure") return "failure";
  if (latest.conclusion === "neutral") return "neutral";
  if (latest.conclusion === "cancelled") return "cancelled";
  return "unknown";
}
