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

  const [total, videos] = await Promise.all([
    db.video.count(),
    db.video.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    videos,
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
    const updated = await db.video.update({ where: { id }, data });
    await createAuditLog({
      action: "UPDATE",
      entity: "Vidéo",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });
    return NextResponse.json(updated);
  }

  const video = await db.video.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      videoUrl: data.videoUrl,
      thumbnail: data.thumbnail ?? null,
      duration: data.duration ?? 0,
      published: data.published ?? false,
    },
  });
  await createAuditLog({
    action: "CREATE",
    entity: "Vidéo",
    entityId: video.id,
    userId: user.id as string,
  });
  return NextResponse.json(video, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.video.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Vidéo",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
