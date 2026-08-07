"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const EVENT_SOURCE_URL = "/api/roadmap/events";

const QUERY_KEYS = [["roadmap-stats"], ["roadmap-data"], ["roadmap-history"], ["roadmap-activity"]];

export function useRoadmapEvents() {
  const queryClient = useQueryClient();
  const sourceRef = useRef<EventSource | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let source: EventSource | null = null;

    try {
      source = new EventSource(EVENT_SOURCE_URL);
      sourceRef.current = source;
    } catch {
      return;
    }

    source.addEventListener("change", (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent).data as string) as {
          events?: { type: string; entityTitle?: string; entity?: string }[];
        };
        const count = payload.events?.length ?? 0;
        if (count > 0) {
          for (const key of QUERY_KEYS) {
            queryClient.invalidateQueries({ queryKey: key });
          }

          if (toastTimeout.current) clearTimeout(toastTimeout.current);
          toastTimeout.current = setTimeout(() => {
            const first = payload.events?.[0];
            toast.info(`Mise à jour en temps réel`, {
              description: first
                ? `${first.type} — ${first.entityTitle ?? first.entity ?? ""}`
                : `${count} changement(s)`,
            });
          }, 400);
        }
      } catch {
        // payload malformé : on ignore
      }
    });

    source.addEventListener("connected", () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-activity"] });
    });

    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      source?.close();
      sourceRef.current = null;
    };
  }, [queryClient]);

  return sourceRef;
}
