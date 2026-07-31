export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Check, Circle, Clock, Zap } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Roadmaps",
  description: "Feuille de route et plans de développement de la plateforme Wabtechs.",
};

const STATUS_CONFIG: Record<string, { icon: typeof Check; label: string; color: string; badgeVariant: "default" | "secondary" | "outline" }> = {
  done: { icon: Check, label: "Terminé", color: "text-green-500", badgeVariant: "default" },
  "in-progress": { icon: Clock, label: "En cours", color: "text-yellow-500", badgeVariant: "secondary" },
  planned: { icon: Circle, label: "Prévu", color: "text-muted-foreground", badgeVariant: "outline" },
};

export default async function RoadmapsPage() {
  const roadmaps = await db.roadmap.findMany({
    where: { published: true },
    orderBy: [{ year: "asc" }, { order: "asc" }],
  });

  const grouped = roadmaps.reduce<Record<string, typeof roadmaps>>((acc, r) => {
    const q = r.quarter ?? "Général";
    if (!acc[q]) acc[q] = [];
    acc[q].push(r);
    return acc;
  }, {});

  const totalItems = roadmaps.length;
  const doneItems = roadmaps.filter((i) => i.status === "done").length;
  const inProgressItems = roadmaps.filter((i) => i.status === "in-progress").length;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Roadmaps"
          title="Roadmaps"
          highlight="2026-2027"
          description="Feuille de route transparente — suivez l'avancement des fonctionnalités."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>{doneItems} terminé{doneItems > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span>{inProgressItems} en cours</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-muted-foreground" />
            <span>{totalItems - doneItems - inProgressItems} prévu{totalItems - doneItems - inProgressItems > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>{totalItems} fonctionnalités au total</span>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          {Object.entries(grouped).map(([quarter, items]) => {
            const quarterDone = items.filter((i) => i.status === "done").length;
            const progress = Math.round((quarterDone / items.length) * 100);

            return (
              <div key={quarter}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">{quarter}</h2>
                  <div className="flex-1" />
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>

                <div className="relative ml-4 border-l-2 border-muted pl-8 space-y-4">
                  {items.map((item) => {
                    const config = STATUS_CONFIG[item.status]!;
                    const Icon = config.icon;
                    return (
                      <div key={item.id} className="relative flex items-center gap-3">
                        <div className={`absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background ${item.status === "done" ? "border-green-500" : item.status === "in-progress" ? "border-yellow-500" : "border-muted-foreground/30"}`}>
                          <Icon className={`h-3 w-3 ${config.color}`} />
                        </div>
                        <span className={item.status === "done" ? "text-muted-foreground line-through" : ""}>
                          {item.title}
                        </span>
                        <Badge variant={config.badgeVariant} className="text-xs">
                          {config.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
