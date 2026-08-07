import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { auth } from "@/auth";

export const GET = safeHandler(async (req: Request) => {
  const url = new URL(req.url);
  const featureId = url.searchParams.get("featureId");
  if (!featureId) return NextResponse.json([]);

  const subtasks = await db.subtask.findMany({
    where: { featureId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(subtasks);
});

export const POST = safeHandler(async (req: Request) => {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  if (body.id) {
    const updated = await db.subtask.update({
      where: { id: body.id },
      data: {
        title: body.title,
        done: body.done,
      },
    });
    return NextResponse.json(updated);
  }

  const created = await db.subtask.create({
    data: {
      featureId: body.featureId,
      title: body.title,
      done: body.done ?? false,
    },
  });
  return NextResponse.json(created, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await req.json();
  await db.subtask.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
