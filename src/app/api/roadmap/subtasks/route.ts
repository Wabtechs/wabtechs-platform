import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { publishRoadmapEvent, invalidateAfterRoadmapChange } from "@/lib/realtime";

export const GET = safeHandler(async (req: Request) => {
  const url = new URL(req.url);
  const featureId = url.searchParams.get("featureId");
  if (!featureId) return NextResponse.json([]);

  const subtasks = await db.subtask.findMany({
    where: { featureId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(subtasks);
});

export const POST = safeHandler(async (req: Request) => {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const user = session.user;

  const body = await req.json();

  if (body.id) {
    const updated = await db.subtask.update({
      where: { id: body.id },
      data: {
        title: body.title,
        done: body.done,
      },
    });
    await createAuditLog({
      action: "subtask.updated",
      entity: "Subtask",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify({ featureId: updated.featureId, done: updated.done }),
    });
    await publishRoadmapEvent({
      type: "subtask.updated",
      entity: "Subtask",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify({ featureId: updated.featureId, done: updated.done }),
    });
    await invalidateAfterRoadmapChange();
    return NextResponse.json(updated);
  }

  const created = await db.subtask.create({
    data: {
      featureId: body.featureId,
      title: body.title,
      done: body.done ?? false,
    },
  });
  await createAuditLog({
    action: "subtask.updated",
    entity: "Subtask",
    entityId: created.id,
    userId: user.id as string,
    details: JSON.stringify({ featureId: created.featureId, created: true }),
  });
  await publishRoadmapEvent({
    type: "subtask.updated",
    entity: "Subtask",
    entityId: created.id,
    userId: user.id as string,
    details: JSON.stringify({ featureId: created.featureId, created: true }),
  });
  await invalidateAfterRoadmapChange();
  return NextResponse.json(created, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const user = session.user;

  const { id } = await req.json();
  await db.subtask.delete({ where: { id } });
  await createAuditLog({
    action: "subtask.updated",
    entity: "Subtask",
    entityId: id,
    userId: user.id as string,
    details: JSON.stringify({ deleted: true }),
  });
  await publishRoadmapEvent({
    type: "subtask.updated",
    entity: "Subtask",
    entityId: id,
    userId: user.id as string,
    details: JSON.stringify({ deleted: true }),
  });
  await invalidateAfterRoadmapChange();
  return NextResponse.json({ success: true });
});
