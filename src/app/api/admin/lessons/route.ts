import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  try {
    const lessons = await db.lesson.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(lessons);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
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
      await createAuditLog({ action: "UPDATE", entity: "Leçon", entityId: updated.id, userId: session.user.id as string });
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
    await createAuditLog({ action: "CREATE", entity: "Leçon", entityId: lesson.id, userId: session.user.id as string });
    return NextResponse.json(lesson, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await db.lesson.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Leçon", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
