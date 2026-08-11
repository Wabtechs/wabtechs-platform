import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";

const bodySchema = z.object({
  repositoryId: z.string().min(1),
  githubId: z.number().int().positive(),
  bugId: z.string().min(1).nullable().optional(),
  featureId: z.string().min(1).nullable().optional(),
});

export const PATCH = safeHandler(async (req: Request) => {
  await requireAdmin();
  const body = await req.json();
  const { repositoryId, githubId, bugId, featureId } = bodySchema.parse(body);

  if (bugId && featureId) {
    return NextResponse.json(
      { error: "Lier à un seul élément (bug ou feature)." },
      { status: 400 },
    );
  }

  if (bugId) {
    const existing = await db.gitHubIssue.findFirst({
      where: { bugId, repositoryId: { not: repositoryId } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cette issue est déjà liée à un autre bug." },
        { status: 409 },
      );
    }
  }
  if (featureId) {
    const existing = await db.gitHubIssue.findFirst({
      where: { featureId, repositoryId: { not: repositoryId } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cette issue est déjà liée à une autre feature." },
        { status: 409 },
      );
    }
  }

  const issue = await db.gitHubIssue.upsert({
    where: { repositoryId_githubId: { repositoryId, githubId: BigInt(githubId) } },
    create: {
      repositoryId,
      githubId: BigInt(githubId),
      number: githubId,
      title: `Issue #${githubId}`,
      htmlUrl: `https://github.com/${"_"}/${"_"}/issues/${githubId}`,
      state: "open",
      bugId,
      featureId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: { bugId: bugId ?? null, featureId: featureId ?? null },
  });

  return NextResponse.json({ success: true, issueId: issue.id });
});
