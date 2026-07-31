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
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true, comments: true } },
      },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id, role } = await req.json();
    if (!id || !role) {
      return NextResponse.json({ error: "id et role requis" }, { status: 400 });
    }
    if (!["USER", "ADMIN", "MODERATOR"].includes(role)) {
      return NextResponse.json({ error: "Role invalide" }, { status: 400 });
    }
    const updated = await db.user.update({ where: { id }, data: { role } });
    await createAuditLog({ action: "UPDATE", entity: "Utilisateur", entityId: updated.id, userId: session.user.id as string, details: JSON.stringify({ role }) });
    return NextResponse.json(updated);
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
    const currentUser = session.user.id as string;
    if (id === currentUser) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
    }
    await db.user.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Utilisateur", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
