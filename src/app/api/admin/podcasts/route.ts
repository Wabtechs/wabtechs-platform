import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

const PAGE_SIZE = 50;

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const skip = (page - 1) * PAGE_SIZE;

  const [total, podcasts] = await Promise.all([
    db.podcast.count(),
    db.podcast.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: { tags: { select: { id: true, name: true, slug: true } } },
    }),
  ]);

  return NextResponse.json({
    podcasts,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, tags, ...data } = body;

  if (id) {
    const existing = await db.podcast.findUnique({ where: { id }, select: { published: true } });
    if (data.published && existing && !existing.published) {
      data.publishedAt = new Date();
    }
    const updated = await db.podcast.update({ where: { id }, data });
    await createAuditLog({
      action: "UPDATE",
      entity: "Podcast",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });

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
  await createAuditLog({
    action: "CREATE",
    entity: "Podcast",
    entityId: podcast.id,
    userId: user.id as string,
  });

  if (tags !== undefined && Array.isArray(tags)) {
    for (const tagName of tags) {
      if (!tagName) continue;
      const tag = await db.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      });
      await db.podcast.update({
        where: { id: podcast.id },
        data: { tags: { connect: { id: tag.id } } },
      });
    }
  }

  return NextResponse.json(podcast, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.podcast.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Podcast",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
