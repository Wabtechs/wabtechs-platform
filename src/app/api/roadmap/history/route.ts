import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cacheGet, cacheSet, assertCacheKey } from "@/lib/cache";

export const dynamic = "force-dynamic";

const MAX_LIMIT = 100;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const entity = url.searchParams.get("entity") ?? undefined;
  const entityId = url.searchParams.get("entityId") ?? undefined;
  const action = url.searchParams.get("action") ?? undefined;
  const from = url.searchParams.get("from") ?? undefined;
  const to = url.searchParams.get("to") ?? undefined;
  const search = url.searchParams.get("search") ?? undefined;
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get("limit") ?? "50")));

  const cacheKey = `history:${entity ?? "all"}:${entityId ?? "all"}:${action ?? "all"}:${from ?? "all"}:${to ?? "all"}:${search ?? "all"}:${page}:${limit}`;
  assertCacheKey(cacheKey);

  const cached = await cacheGet<unknown>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const where: Prisma.AuditLogWhereInput = {};
  if (entity) where.entity = entity;
  if (entityId) where.entityId = entityId;
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  if (search) {
    where.OR = [
      { details: { contains: search, mode: "insensitive" } },
      { action: { contains: search, mode: "insensitive" } },
      { entity: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, items] = await Promise.all([
    db.auditLog.count({ where }),
    db.auditLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        details: true,
        createdAt: true,
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const result = {
    items: items.map((a) => ({
      id: a.id,
      action: a.action,
      entity: a.entity,
      entityId: a.entityId,
      details: a.details,
      createdAt: a.createdAt.toISOString(),
      userId: a.user?.id ?? null,
      userName: a.user?.name ?? null,
      avatar: a.user?.avatar ?? null,
    })),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };

  await cacheSet(cacheKey, result, 8);
  return NextResponse.json(result);
}
