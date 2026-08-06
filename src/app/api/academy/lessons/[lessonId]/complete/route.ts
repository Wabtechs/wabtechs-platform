import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { AppError, ErrorCode, isAppError } from "@/lib/errors";

export async function POST(_req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new AppError("Authentification requise", 401, ErrorCode.UNAUTHORIZED);
    }
    const { lessonId } = await params;

    const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      throw new AppError("Leçon introuvable", 404, ErrorCode.NOT_FOUND);
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id as string, courseId: lesson.courseId },
      },
    });
    if (!enrollment) {
      throw new AppError("Inscription au cours requise", 403, ErrorCode.FORBIDDEN);
    }

    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id as string, lessonId } },
      create: {
        userId: session.user.id as string,
        lessonId,
        courseId: lesson.courseId,
      },
      update: {},
    });

    const [watchedCount, lessonCount] = await Promise.all([
      db.lessonProgress.count({
        where: { userId: session.user.id as string, courseId: lesson.courseId },
      }),
      db.lesson.count({ where: { courseId: lesson.courseId } }),
    ]);

    const progress =
      lessonCount > 0 ? Math.min(100, Math.round((watchedCount / lessonCount) * 100)) : 0;
    const completed = lessonCount > 0 && watchedCount >= lessonCount;

    await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        completed,
        completedAt: completed ? (enrollment.completedAt ?? new Date()) : null,
      },
    });

    return NextResponse.json({ progress, completed });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status, headers: error.headers },
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
