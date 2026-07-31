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
    const changelogs = await db.changelog.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(changelogs);
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
      const updated = await db.changelog.update({ where: { id }, data });
      await createAuditLog({ action: "UPDATE", entity: "Changelog", entityId: updated.id, userId: session.user.id as string, details: JSON.stringify(data) });
      return NextResponse.json(updated);
    }

    const changelog = await db.changelog.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content ?? null,
        version: data.version ?? null,
        date: data.date ?? null,
        published: data.published ?? false,
      },
    });
    await createAuditLog({ action: "CREATE", entity: "Changelog", entityId: changelog.id, userId: session.user.id as string });
    return NextResponse.json(changelog, { status: 201 });
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
    await db.changelog.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Changelog", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
