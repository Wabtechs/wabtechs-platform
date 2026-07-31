import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get("unread") === "true";
    const notifications = await db.notification.findMany({
      where: { userId: session.user.id as string, ...(unreadOnly ? { read: false } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { id, all } = await req.json();
    if (all) {
      await db.notification.updateMany({ where: { userId: session.user.id as string }, data: { read: true } });
      return NextResponse.json({ success: true });
    }
    await db.notification.updateMany({ where: { id, userId: session.user.id as string }, data: { read: true } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
