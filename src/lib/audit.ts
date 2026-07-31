import { db } from "@/lib/prisma";

export async function createAuditLog(params: {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  details?: string;
}) {
  try {
    await db.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        userId: params.userId ?? null,
        details: params.details ?? null,
      },
    });
  } catch {
    console.error("AuditLog failed:", params);
  }
}
