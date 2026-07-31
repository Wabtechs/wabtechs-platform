export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ExternalLink, Globe } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Outils et références pour développeurs.",
};

export default async function ResourcesPage() {
  const resources = await db.resource.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const grouped = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    const type = r.type ?? "Général";
    if (!acc[type]) acc[type] = [];
    acc[type].push(r);
    return acc;
  }, {});

  const totalResources = resources.length;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Ressources"
          title="Ressources"
          highlight="utiles"
          description={`${totalResources} ressources soigneusement sélectionnées pour les développeurs web modernes.`}
        />

        <div className="mt-16 space-y-16">
          {Object.entries(grouped).map(([type, items]) => (
            <section key={type}>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">{type}</h2>
                <Badge variant="outline">{items.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={item.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                              {item.title}
                            </CardTitle>
                            {item.description && (
                              <CardDescription className="mt-1">{item.description}</CardDescription>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardHeader>
                    </Card>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Une ressource à recommander ?{" "}
            <Button asChild variant="link" className="p-0">
              <a href="https://github.com/Wabtechs/wabtechs-platform/issues/new" target="_blank" rel="noopener noreferrer">
                Ouvrez une issue sur GitHub
              </a>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
