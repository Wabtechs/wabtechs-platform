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
    const { id, tags, ...data } = body;

    if (id) {
      const existing = await db.podcast.findUnique({ where: { id }, select: { published: true } });
      if (data.published && existing && !existing.published) {
        data.publishedAt = new Date();
      }
      const updated = await db.podcast.update({ where: { id }, data });
      await createAuditLog({ action: "UPDATE", entity: "Podcast", entityId: updated.id, userId: session.user.id as string, details: JSON.stringify(data) });

      if (tags !== undefined && Array.isArray(tags)) {
        await db.podcast.update({ where: { id }, data: { tags: { set: [] } } });
        for (const tagName of tags) {
          if (!tagName) continue;
          const tag = await db.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
          });
          await db.podcast.update({ where: { id }, data: { tags: { connect: { id: tag.id } } } });
        }
      }

      return NextResponse.json(updated);
    }

    const podcast = await db.podcast.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        slug: data.slug,
        audioUrl: data.audioUrl,
        duration: data.duration ?? 0,
        episode: data.episode ?? 1,
        season: data.season ?? 1,
        published: data.published ?? false,
        coverImage: data.coverImage ?? null,
        publishedAt: data.published ? new Date() : null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        ogImage: data.ogImage ?? null,
      },
    });
    await createAuditLog({ action: "CREATE", entity: "Podcast", entityId: podcast.id, userId: session.user.id as string });

    if (tags !== undefined && Array.isArray(tags)) {
      for (const tagName of tags) {
        if (!tagName) continue;
        const tag = await db.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
        });
        await db.podcast.update({ where: { id: podcast.id }, data: { tags: { connect: { id: tag.id } } } });
      }
    }

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
    await createAuditLog({ action: "DELETE", entity: "Podcast", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
