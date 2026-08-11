import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";

const querySchema = z.object({
  repositoryId: z.string().optional(),
  state: z.enum(["open", "closed", "all"]).default("all"),
  isPr: z.enum(["true", "false"]).optional(),
  take: z.coerce.number().int().min(1).max(500).default(200),
});

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();
  const url = new URL(req.url);
  const { repositoryId, state, isPr, take } = querySchema.parse(
    Object.fromEntries(url.searchParams),
  );

  const issues = await db.gitHubIssue.findMany({
    where: {
      ...(repositoryId ? { repositoryId } : {}),
      ...(state === "all" ? {} : { state }),
      ...(isPr ? { isPr: isPr === "true" } : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    take,
    include: {
      repository: { select: { id: true, fullName: true, owner: true, name: true } },
    },
  });

  return NextResponse.json({
    issues: issues.map((i) => ({
      id: i.id,
      githubId: Number(i.githubId),
      number: i.number,
      title: i.title,
      body: i.body,
      state: i.state,
      htmlUrl: i.htmlUrl,
      isPr: i.isPr,
      labels: i.labels,
      assignees: i.assignees,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      closedAt: i.closedAt,
      syncedAt: i.syncedAt,
      repository: i.repository,
    })),
  });
});
