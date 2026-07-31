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
    const events = await db.event.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(events);
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
      const updated = await db.event.update({ where: { id }, data });
      await createAuditLog({ action: "UPDATE", entity: "Événement", entityId: updated.id, userId: session.user.id as string, details: JSON.stringify(data) });
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
    await createAuditLog({ action: "CREATE", entity: "Événement", entityId: event.id, userId: session.user.id as string });
    return NextResponse.json(event, { status: 201 });
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
    await db.event.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Événement", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
