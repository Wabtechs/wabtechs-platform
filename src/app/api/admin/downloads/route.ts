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
    const downloads = await db.download.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(downloads);
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
      const updated = await db.download.update({ where: { id }, data });
      await createAuditLog({ action: "UPDATE", entity: "Téléchargement", entityId: updated.id, userId: session.user.id as string, details: JSON.stringify(data) });
      return NextResponse.json(updated);
    }

    const download = await db.download.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize ?? null,
        category: data.category ?? null,
        published: data.published ?? false,
      },
    });
    await createAuditLog({ action: "CREATE", entity: "Téléchargement", entityId: download.id, userId: session.user.id as string });
    return NextResponse.json(download, { status: 201 });
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
    await db.download.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Téléchargement", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
