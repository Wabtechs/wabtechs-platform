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

  const [total, posts] = await Promise.all([
    db.post.count(),
    db.post.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } }, tags: true },
    }),
  ]);

  return NextResponse.json({
    posts,
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

  if (tags !== undefined) {
    data.tags = undefined;
  }

  if (id) {
    const existing = await db.post.findUnique({ where: { id }, select: { published: true } });
    if (data.published && existing && !existing.published) {
      data.publishedAt = new Date();
    }

    const updated = await db.post.update({ where: { id }, data });
    await createAuditLog({
      action: "UPDATE",
      entity: "Article",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });

    if (tags !== undefined && Array.isArray(tags)) {
      await db.post.update({ where: { id }, data: { tags: { set: [] } } });
      for (const tagName of tags) {
        if (!tagName) continue;
        const tag = await db.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
        });
        await db.post.update({ where: { id }, data: { tags: { connect: { id: tag.id } } } });
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
      authorId: user.id as string,
    },
  });
  await createAuditLog({
    action: "CREATE",
    entity: "Article",
    entityId: post.id,
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
      await db.post.update({ where: { id: post.id }, data: { tags: { connect: { id: tag.id } } } });
    }
  }

  return NextResponse.json(post, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.post.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Article",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
