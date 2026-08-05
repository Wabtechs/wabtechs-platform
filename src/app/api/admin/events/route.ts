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

  const [total, events] = await Promise.all([
    db.event.count(),
    db.event.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    events,
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
    const updated = await db.event.update({ where: { id }, data });
    await createAuditLog({
      action: "UPDATE",
      entity: "Événement",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });
    return NextResponse.json(updated);
  }

  const event = await db.event.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      content: data.content ?? null,
      date: data.date ?? null,
      location: data.location ?? null,
      url: data.url ?? null,
      coverImage: data.coverImage ?? null,
      type: data.type ?? null,
      published: data.published ?? false,
    },
  });
  await createAuditLog({
    action: "CREATE",
    entity: "Événement",
    entityId: event.id,
    userId: user.id as string,
  });
  return NextResponse.json(event, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.event.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Événement",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
