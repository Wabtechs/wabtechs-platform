import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";
import { getGitHubClient } from "@/lib/integrations/github/client";
import { listRepositoryPullRequests } from "@/lib/integrations/github/pull-requests";

const querySchema = z.object({
  state: z.enum(["open", "closed", "all"]).default("all"),
  take: z.coerce.number().int().min(1).max(100).default(50),
});

export const GET = safeHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await params;
    const url = new URL(req.url);
    const { state, take } = querySchema.parse(Object.fromEntries(url.searchParams));

    const repo = await db.gitHubRepository.findUnique({ where: { id } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }

    const client = await getGitHubClient();
    const pulls = await listRepositoryPullRequests(client, repo.owner, repo.name, state);

    return NextResponse.json({
      pullRequests: pulls.slice(0, take).map((p) => ({
        githubId: p.id,
        number: p.number,
        title: p.title,
        body: p.body,
        state: p.state,
        htmlUrl: p.html_url,
        author: p.user?.login,
        headBranch: p.head?.ref,
        baseBranch: p.base?.ref,
        merged: p.merged,
        mergeCommitSha: p.merge_commit_sha,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        mergedAt: p.merged_at,
        closedAt: p.closed_at,
      })),
    });
  },
);
