import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

export const GET = safeHandler(async (req: Request) => {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const moduleId = url.searchParams.get("moduleId");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (projectId) where.projectId = projectId;
  if (moduleId) where.moduleId = moduleId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const features = await db.feature.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      points: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
      moduleId: true,
      epicId: true,
      sprintId: true,
      assigneeId: true,
      project: { select: { id: true, slug: true, name: true, color: true } },
      module: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
      subtasks: { select: { id: true, title: true, done: true } },
      _count: { select: { bugs: true } },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(features);
});
