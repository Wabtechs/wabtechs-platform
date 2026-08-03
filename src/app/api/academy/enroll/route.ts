import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Connectez-vous pour vous inscrire" }, { status: 401 });
  }

  const key = (session.user.id as string) ?? getClientIp(req);
  rateLimit(`enroll:${key}`, { windowMs: 60_000, max: 20 });

  try {
    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Cours invalide" }, { status: 400 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
    }

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id as string, courseId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId: session.user.id as string,
        courseId,
        progress: 0,
        completed: false,
      },
    });
    return NextResponse.json(enrollment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
