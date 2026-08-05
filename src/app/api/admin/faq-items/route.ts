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

  const [total, items] = await Promise.all([
    db.faqItem.count(),
    db.faqItem.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { order: "asc" },
    }),
  ]);

  return NextResponse.json({
    items,
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
    const updated = await db.faqItem.update({
      where: { id },
      data,
    });
    await createAuditLog({
      action: "UPDATE",
      entity: "FAQ",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });
    return NextResponse.json(updated);
  }

  const item = await db.faqItem.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category ?? null,
      order: data.order ?? 0,
    },
  });
  await createAuditLog({
    action: "CREATE",
    entity: "FAQ",
    entityId: item.id,
    userId: user.id as string,
  });
  return NextResponse.json(item, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.faqItem.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "FAQ",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
