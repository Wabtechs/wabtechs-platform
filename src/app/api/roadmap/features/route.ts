import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { createAuditLog } from "@/lib/audit";
import { publishRoadmapEvent, invalidateAfterRoadmapChange } from "@/lib/realtime";
import { incrementCounter } from "@/lib/metrics";

export const GET = safeHandler(async (req: Request) => {
  incrementCounter("/api/roadmap/features");

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

const PATCHABLE_FIELDS = ["status", "priority", "moduleId", "points"] as const;

export const PATCH = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? url.searchParams.get("featureId");
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of PATCHABLE_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ modifiable fourni" }, { status: 400 });
  }

  const previous = await db.feature.findUnique({
    where: { id },
    select: { id: true, title: true, status: true, priority: true, moduleId: true, points: true },
  });
  if (!previous) return NextResponse.json({ error: "Feature introuvable" }, { status: 404 });

  const updated = await db.feature.update({ where: { id }, data });

  await createAuditLog({
    action: "feature.updated",
    entity: "Feature",
    entityId: id,
    userId: user.id as string,
    details: JSON.stringify({ before: previous, after: data }),
  });
  await publishRoadmapEvent({
    type: "feature.updated",
    entity: "Feature",
    entityId: id,
    entityTitle: previous.title,
    details: JSON.stringify({
      before: { status: previous.status, priority: previous.priority },
      after: data,
    }),
    userId: user.id as string,
    userName: user.name ?? undefined,
  });
  await invalidateAfterRoadmapChange();

  return NextResponse.json(updated);
});
