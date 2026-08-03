import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode } from "@/lib/errors";

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");
  const search = url.searchParams.get("search");

  const where: { postId?: string; content?: { contains: string } } = {};
  if (postId) where.postId = postId;
  if (search) where.content = { contains: search };

  const comments = await db.comment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, email: true, avatar: true } },
      post: { select: { id: true, title: true, slug: true } },
      parent: { select: { id: true, content: true } },
    },
  });

  return NextResponse.json(comments);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, postId, parentId, ...data } = body;

  if (id) {
    const existing = await db.comment.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      throw new AppError("Commentaire introuvable", 404, ErrorCode.NOT_FOUND);
    }

    const updated = await db.comment.update({
      where: { id },
      data: {
        content: data.content ?? undefined,
        authorId: data.authorId ?? undefined,
        postId: postId ? String(postId) : undefined,
        parentId: parentId ? String(parentId) : undefined,
      },
    });
    await createAuditLog({
      action: "UPDATE",
      entity: "Comment",
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });

    return NextResponse.json(updated);
  }

  if (!postId) {
    throw new AppError("postId requis", 400, ErrorCode.BAD_REQUEST);
  }

  const created = await db.comment.create({
    data: {
      content: data.content,
      authorId: data.authorId ?? (user.id as string),
      postId: String(postId),
      parentId: parentId ? String(parentId) : null,
    },
  });
  await createAuditLog({
    action: "CREATE",
    entity: "Comment",
    entityId: created.id,
      userId: user.id as string,
    });

  return NextResponse.json(created, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  if (!id) {
    throw new AppError("id requis", 400, ErrorCode.BAD_REQUEST);
  }

  const comment = await db.comment.findUnique({
    where: { id },
    select: { id: true, postId: true },
  });
  if (!comment) {
    throw new AppError("Commentaire introuvable", 404, ErrorCode.NOT_FOUND);
  }

  await db.comment.deleteMany({ where: { parentId: id } });
  await db.comment.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entity: "Comment",
    entityId: comment.id,
    userId: user.id as string,
    details: JSON.stringify({ postId: comment.postId }),
  });

  return NextResponse.json({ success: true });
});
