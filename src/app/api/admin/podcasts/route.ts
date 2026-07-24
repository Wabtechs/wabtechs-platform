import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const podcasts = await db.podcast.findMany({
      orderBy: { createdAt: "desc" },
      include: { tags: true },
    });
    return NextResponse.json(podcasts);
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
    const { id } = body;

    if (id) {
      const updated = await db.podcast.update({ where: { id }, data: body });
      return NextResponse.json(updated);
    }

    const podcast = await db.podcast.create({
      data: {
        title: body.title,
        description: body.description ?? "",
        slug: body.slug,
        audioUrl: body.audioUrl,
        duration: body.duration ?? 0,
        episode: body.episode ?? 1,
        season: body.season ?? 1,
        published: body.published ?? false,
        coverImage: body.coverImage ?? null,
      },
    });
    return NextResponse.json(podcast, { status: 201 });
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
    await db.podcast.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
