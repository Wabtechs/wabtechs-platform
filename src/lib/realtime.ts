import { createAuditLog } from "@/lib/audit";
import { invalidateRoadmapCache } from "@/lib/cache";

export type RoadmapEventType =
  | "feature.created"
  | "feature.updated"
  | "feature.deleted"
  | "bug.created"
  | "bug.updated"
  | "bug.deleted"
  | "module.updated"
  | "subtask.updated"
  | "roadmap.updated";

export interface RoadmapEvent {
  type: RoadmapEventType;
  entity: string;
  entityId: string;
  entityTitle?: string;
  details?: string;
  userId?: string;
  userName?: string;
  timestamp?: string;
}

const EVENT_CHANNEL = "roadmap:events";

/**
 * Publie un évènement de roadmap : écrit l'audit (source de vérité pour
 * l'historique A-Z et le SSE) et tente un publish Redis (best-effort).
 * L'historique de développement est ainsi tracé de bout en bout.
 */
export async function publishRoadmapEvent(event: RoadmapEvent): Promise<void> {
  const enriched: RoadmapEvent = {
    ...event,
    timestamp: event.timestamp ?? new Date().toISOString(),
  };

  await createAuditLog({
    action: enriched.type,
    entity: enriched.entity,
    entityId: enriched.entityId,
    userId: enriched.userId,
    details: enriched.details,
  });

  await publishToRedis(enriched);
}

async function publishToRedis(event: RoadmapEvent): Promise<void> {
  try {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      connectTimeout: 1500,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      enableOfflineQueue: false,
    });
    client.on("error", () => {});
    await client.publish(EVENT_CHANNEL, JSON.stringify(event));
    client.disconnect();
  } catch {
    // Redis optionnel : l'audit log reste la source de vérité.
  }
}

export function roadmapEvent(
  type: RoadmapEventType,
  params: Partial<Omit<RoadmapEvent, "type">>,
): RoadmapEvent {
  return { type, ...params } as RoadmapEvent;
}

export function formatAuditForEvent(log: {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: Date;
  user: { name: string | null; avatar: string | null } | null;
}): RoadmapEvent {
  return {
    id: log.id,
    type: (log.action as RoadmapEventType) ?? "roadmap.updated",
    entity: log.entity,
    entityId: log.entityId ?? "",
    details: log.details ?? undefined,
    userName: log.user?.name ?? undefined,
    timestamp: log.createdAt.toISOString(),
  } as RoadmapEvent;
}

export async function invalidateAfterRoadmapChange(): Promise<void> {
  await invalidateRoadmapCache();
}
