import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const courses = await db.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { lessons: true, enrollments: true } } },
    });
    return NextResponse.json(courses);
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
      const updated = await db.course.update({
        where: { id },
        data: {
          slug: data.slug,
          title: data.title,
          description: data.description,
          coverImage: data.coverImage ?? null,
          price: data.price ?? 0,
          level: data.level ?? "beginner",
          duration: data.duration ?? null,
          published: data.published ?? false,
          featured: data.featured ?? false,
        },
      });
      await createAuditLog({ action: "UPDATE", entity: "Cours", entityId: updated.id, userId: session.user.id as string });
      return NextResponse.json(updated);
    }

    const course = await db.course.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        coverImage: data.coverImage ?? null,
        price: data.price ?? 0,
        level: data.level ?? "beginner",
        duration: data.duration ?? null,
        published: data.published ?? false,
        featured: data.featured ?? false,
      },
    });
    await createAuditLog({ action: "CREATE", entity: "Cours", entityId: course.id, userId: session.user.id as string });
    return NextResponse.json(course, { status: 201 });
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
    await db.course.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Cours", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
