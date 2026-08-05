import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode } from "@/lib/errors";

const PAGE_SIZE = 50;

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const skip = (page - 1) * PAGE_SIZE;

  const [total, users] = await Promise.all([
    db.user.count(),
    db.user.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true, comments: true } },
      },
    }),
  ]);

  return NextResponse.json({
    users,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
});

export const PATCH = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id, role } = await req.json();
  if (!id || !role) {
    throw new AppError("id et role requis", 400, ErrorCode.BAD_REQUEST);
  }
  if (!["USER", "ADMIN", "MODERATOR"].includes(role)) {
    throw new AppError("Role invalide", 400, ErrorCode.BAD_REQUEST);
  }
  const updated = await db.user.update({ where: { id }, data: { role } });
  await createAuditLog({
    action: "UPDATE",
    entity: "Utilisateur",
    entityId: updated.id,
    userId: user.id as string,
    details: JSON.stringify({ role }),
  });
  return NextResponse.json(updated);
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  const currentUser = user.id as string;
  if (id === currentUser) {
    throw new AppError(
      "Vous ne pouvez pas supprimer votre propre compte",
      400,
      ErrorCode.BAD_REQUEST,
    );
  }
  await db.user.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Utilisateur",
    entityId: id,
    userId: currentUser,
  });
  return NextResponse.json({ success: true });
});
