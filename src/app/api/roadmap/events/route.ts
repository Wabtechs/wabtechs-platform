import { db } from "@/lib/prisma";
import { formatAuditForEvent } from "@/lib/realtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POLL_INTERVAL_MS = 5000;
const KEEPALIVE_INTERVAL_MS = 15000;

interface AuditRow {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: Date;
  user: { name: string | null; avatar: string | null } | null;
}

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const url = new URL(req.url);
  const after = url.searchParams.get("after");

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: unknown, event: string) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send({ type: "connected", timestamp: new Date().toISOString() }, "connected");

      let cursor: Date = after && !Number.isNaN(Date.parse(after)) ? new Date(after) : new Date();

      const poll = setInterval(async () => {
        try {
          const logs = await db.auditLog.findMany({
            where: { createdAt: { gt: cursor } },
            select: {
              id: true,
              action: true,
              entity: true,
              entityId: true,
              details: true,
              createdAt: true,
              user: { select: { name: true, avatar: true } },
            },
            orderBy: { createdAt: "asc" },
            take: 50,
          });

          if (logs.length > 0) {
            const events = (logs as AuditRow[]).map((l) => formatAuditForEvent(l));
            send({ events }, "change");
            cursor = (logs[logs.length - 1] as AuditRow).createdAt;
          }
        } catch (error) {
          console.error("[SSE] poll error:", error);
        }
      }, POLL_INTERVAL_MS);

      const keepalive = setInterval(() => {
        send({ type: "ping", timestamp: new Date().toISOString() }, "ping");
      }, KEEPALIVE_INTERVAL_MS);

      req.signal.addEventListener("abort", () => {
        clearInterval(poll);
        clearInterval(keepalive);
        try {
          controller.close();
        } catch {
          // déjà fermé
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
