import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

export const GET = safeHandler(async (req: Request) => {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const featureId = url.searchParams.get("featureId");
  const search = url.searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (projectId) where.projectId = projectId;
  if (featureId) where.featureId = featureId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const bugs = await db.bug.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      severity: true,
      priority: true,
      status: true,
      impact: true,
      fixHours: true,
      version: true,
      reproduce: true,
      expected: true,
      actual: true,
      fix: true,
      resolvedAt: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
      featureId: true,
      assigneeId: true,
      project: { select: { id: true, slug: true, name: true, color: true } },
      feature: { select: { id: true, title: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(bugs);
});
