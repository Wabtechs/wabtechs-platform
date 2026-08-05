import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

const PAGE_SIZE = 50;

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const skip = (page - 1) * PAGE_SIZE;

  const [total, courses] = await Promise.all([
    db.course.count(),
    db.course.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { lessons: true, enrollments: true } } },
    }),
  ]);

  return NextResponse.json({
    courses,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

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
    await createAuditLog({
      action: "UPDATE",
      entity: "Cours",
      entityId: updated.id,
      userId: user.id as string,
    });
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
  await createAuditLog({
    action: "CREATE",
    entity: "Cours",
    entityId: course.id,
    userId: user.id as string,
  });
  return NextResponse.json(course, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.course.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Cours",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
