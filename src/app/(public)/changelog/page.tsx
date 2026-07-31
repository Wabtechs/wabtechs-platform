export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Calendar } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Historique des mises à jour et nouvelles fonctionnalités de Wabtechs.",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ChangelogPage() {
  const changelogs = await db.changelog.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Changelog"
          title="Historique"
          highlight="des mises à jour"
          description="Toutes les modifications, nouvelles fonctionnalités et corrections apportées à la plateforme."
        />

        <div className="mt-16 space-y-12">
          {changelogs.map((entry) => (
            <div key={entry.id}>
              <div className="flex items-center gap-3 mb-4">
                {entry.version && (
                  <Badge variant="secondary" className="font-mono">v{entry.version}</Badge>
                )}
                {entry.date && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(entry.date)}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold">{entry.title}</h2>
              {entry.content && (
                <div className="mt-4 text-sm text-muted-foreground whitespace-pre-line">
                  {entry.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
