import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import { AuditClient } from "./audit-client";

export const metadata: Metadata = { title: "Journal d'audit" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; q?: string }>;
}) {
  const { page: pageRaw, action, q } = await searchParams;

  const currentPage = Math.max(1, Number(pageRaw) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where: Prisma.AuditLogWhereInput = {
    ...(action ? { action } : {}),
    ...(q
      ? {
          OR: [
            { entity: { contains: q, mode: "insensitive" } },
            { user: { is: { name: { contains: q, mode: "insensitive" } } } },
            { user: { is: { email: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [total, logs] = await Promise.all([
    db.auditLog.count({ where }),
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <AuditClient
      logs={logs}
      page={currentPage}
      total={total}
      pageSize={PAGE_SIZE}
      filters={{ action: action ?? null, q: q ?? null }}
    />
  );
}
