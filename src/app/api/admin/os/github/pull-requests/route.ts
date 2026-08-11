import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";

const querySchema = z.object({
  repositoryId: z.string().optional(),
  state: z.enum(["open", "closed", "all"]).default("all"),
  merged: z.enum(["true", "false"]).optional(),
  take: z.coerce.number().int().min(1).max(500).default(200),
});

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();
  const url = new URL(req.url);
  const { repositoryId, state, merged, take } = querySchema.parse(
    Object.fromEntries(url.searchParams),
  );

  const pullRequests = await db.gitHubPullRequest.findMany({
    where: {
      ...(repositoryId ? { repositoryId } : {}),
      ...(state === "all" ? {} : { state }),
      ...(merged ? { merged: merged === "true" } : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    take,
    include: {
      repository: { select: { id: true, fullName: true, owner: true, name: true } },
    },
  });

  return NextResponse.json({
    pullRequests: pullRequests.map((pr) => ({
      id: pr.id,
      githubId: Number(pr.githubId),
      number: pr.number,
      title: pr.title,
      body: pr.body,
      state: pr.state,
      htmlUrl: pr.htmlUrl,
      merged: pr.merged,
      author: pr.author,
      headBranch: pr.headBranch,
      baseBranch: pr.baseBranch,
      mergeCommitSha: pr.mergeCommitSha,
      createdAt: pr.createdAt,
      updatedAt: pr.updatedAt,
      mergedAt: pr.mergedAt,
      closedAt: pr.closedAt,
      syncedAt: pr.syncedAt,
      repository: pr.repository,
    })),
  });
});
