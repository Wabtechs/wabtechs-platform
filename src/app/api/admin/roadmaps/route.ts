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
    const roadmaps = await db.roadmap.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(roadmaps);
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
      const updated = await db.roadmap.update({ where: { id }, data });
      await createAuditLog({ action: "UPDATE", entity: "Roadmap", entityId: updated.id, userId: session.user.id as string, details: JSON.stringify(data) });
      return NextResponse.json(updated);
    }

    const roadmap = await db.roadmap.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        status: data.status ?? "planned",
        quarter: data.quarter ?? null,
        year: data.year ?? null,
        order: data.order ?? 0,
        published: data.published ?? false,
      },
    });
    await createAuditLog({ action: "CREATE", entity: "Roadmap", entityId: roadmap.id, userId: session.user.id as string });
    return NextResponse.json(roadmap, { status: 201 });
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
    await db.roadmap.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Roadmap", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
