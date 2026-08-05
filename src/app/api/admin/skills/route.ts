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

  const [total, skills] = await Promise.all([
    db.skill.count(),
    db.skill.findMany({
      skip,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json({
    skills,
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
    const updated = await db.skill.update({
      where: { id },
      data,
    });
    await createAuditLog({
      action: "UPDATE",
      entity: "Compétence",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });
    return NextResponse.json(updated);
  }

  const item = await db.skill.create({
    data: {
      name: data.name,
      percent: data.percent,
      image: data.image ?? null,
      order: data.order ?? 0,
    },
  });
  await createAuditLog({
    action: "CREATE",
    entity: "Compétence",
    entityId: item.id,
    userId: user.id as string,
  });
  return NextResponse.json(item, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.skill.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Compétence",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
