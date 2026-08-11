import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { safeHandler } from "@/lib/safe-handler";
import { Messages } from "@/lib/messages";

export const POST = safeHandler(
  async (_req: Request, { params }: { params: Promise<{ lessonId: string }> }) => {
    const session = await auth();
    if (!session?.user) {
      throw new AppError(Messages.errors.unauthorized, 401, ErrorCode.UNAUTHORIZED);
    }
    const { lessonId } = await params;

    const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      throw new AppError("Leçon introuvable ou supprimée", 404, ErrorCode.NOT_FOUND);
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id as string, courseId: lesson.courseId },
      },
    });
    if (!enrollment) {
      throw new AppError(
        "Vous devez être inscrit à ce cours pour continuer.",
        403,
        ErrorCode.FORBIDDEN,
      );
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
  },
);
