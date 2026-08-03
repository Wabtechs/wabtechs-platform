import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  const lessons = await db.lesson.findMany({
    where: courseId ? { courseId } : undefined,
    orderBy: [{ courseId: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(lessons);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.lesson.update({
      where: { id },
      data: {
        courseId: data.courseId,
        title: data.title,
        description: data.description ?? null,
        videoUrl: data.videoUrl ?? null,
        duration: data.duration ?? 0,
        order: data.order ?? 0,
        content: data.content ?? null,
        free: data.free ?? false,
      },
    });
    await createAuditLog({ action: "UPDATE", entity: "Leçon", entityId: updated.id, userId: user.id as string });
    return NextResponse.json(updated);
  }

  const lesson = await db.lesson.create({
    data: {
      courseId: data.courseId,
      title: data.title,
      description: data.description ?? null,
      videoUrl: data.videoUrl ?? null,
      duration: data.duration ?? 0,
      order: data.order ?? 0,
      content: data.content ?? null,
      free: data.free ?? false,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Leçon", entityId: lesson.id, userId: user.id as string });
  return NextResponse.json(lesson, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.lesson.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Leçon", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});