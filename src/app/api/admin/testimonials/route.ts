import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const items = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.testimonial.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Témoignage", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const item = await db.testimonial.create({
    data: {
      name: data.name,
      role: data.role ?? null,
      text: data.text,
      image: data.image ?? null,
      order: data.order ?? 0,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Témoignage", entityId: item.id, userId: user.id as string });
  return NextResponse.json(item, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.testimonial.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Témoignage", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});