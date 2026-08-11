import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";

const idParamSchema = z.object({ id: z.string().min(1) });
const bodySchema = z.object({
  projectId: z.string().min(1).nullable().optional(),
});

export const DELETE = safeHandler(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = idParamSchema.parse(await params);
    const repo = await db.gitHubRepository.findUnique({ where: { id }, select: { id: true } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }
    await db.gitHubRepository.delete({ where: { id } });
    return NextResponse.json({ success: true });
  },
);

export const PATCH = safeHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = idParamSchema.parse(await params);
    const repo = await db.gitHubRepository.findUnique({ where: { id }, select: { id: true } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }
    const body = await req.json();
    const { projectId } = bodySchema.parse(body);
    const updated = await db.gitHubRepository.update({
      where: { id },
      data: { projectId: projectId ?? null },
    });
    return NextResponse.json({ success: true, projectId: updated.projectId });
  },
);

export const GET = safeHandler(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = idParamSchema.parse(await params);
    await getRepositoryOrFail(id);

    const repo = await db.gitHubRepository.findUnique({
      where: { id },
      include: { project: { select: { id: true, slug: true, name: true, color: true } } },
    });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }

    const [issueCount, prCount, commitCount, releaseCount, runCount] = await Promise.all([
      db.gitHubIssue.count({ where: { repositoryId: id } }),
      db.gitHubPullRequest.count({ where: { repositoryId: id } }),
      db.gitHubCommit.count({ where: { repositoryId: id } }),
      db.gitHubRelease.count({ where: { repositoryId: id } }),
      db.gitHubWorkflowRun.count({ where: { repositoryId: id } }),
    ]);

    return NextResponse.json({
      repository: {
        id: repo.id,
        githubId: Number(repo.githubId),
        owner: repo.owner,
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
        defaultBranch: repo.defaultBranch,
        visibility: repo.visibility,
        language: repo.language,
        description: repo.description,
        stars: repo.stars,
        forks: repo.forks,
        openIssues: repo.openIssues,
        archived: repo.archived,
        status: repo.status,
        lastSyncAt: repo.lastSyncAt,
        project: repo.project,
      },
      counts: {
        issues: issueCount,
        pullRequests: prCount,
        commits: commitCount,
        releases: releaseCount,
        workflowRuns: runCount,
      },
    });
  },
);

async function getRepositoryOrFail(id: string) {
  const repo = await db.gitHubRepository.findUnique({ where: { id }, select: { id: true } });
  if (!repo) {
    throw new Error("Repository introuvable");
  }
  return repo;
}
