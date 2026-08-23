import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } }, tags: true },
    });
    return NextResponse.json(posts);
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

    if (tags !== undefined) {
      data.tags = undefined;
    }

    if (id) {
      const existing = await db.post.findUnique({ where: { id }, select: { published: true } });
      if (data.published && existing && !existing.published) {
        data.publishedAt = new Date();
      }

      const updated = await db.post.update({
        where: { id },
        data,
      });

      if (tags !== undefined && Array.isArray(tags)) {
        await db.post.update({
          where: { id },
          data: { tags: { set: [] } },
        });
        for (const tagName of tags) {
          if (!tagName) continue;
          const tag = await db.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
          });
          await db.post.update({
            where: { id },
            data: { tags: { connect: { id: tag.id } } },
          });
        }
      }

      return NextResponse.json(updated);
    }

    const post = await db.post.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        content: data.content ?? "",
        slug: data.slug,
        published: data.published ?? false,
        featured: data.featured ?? false,
        coverImage: data.coverImage ?? null,
        readTime: data.readTime ?? 5,
        publishedAt: data.published ? new Date() : null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        ogImage: data.ogImage ?? null,
        authorId: session.user.id as string,
      },
    });

    if (tags !== undefined && Array.isArray(tags)) {
      for (const tagName of tags) {
        if (!tagName) continue;
        const tag = await db.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
        });
        await db.post.update({
          where: { id: post.id },
          data: { tags: { connect: { id: tag.id } } },
        });
      }
    }

    return NextResponse.json(post, { status: 201 });
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
    await db.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
