import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Download, FileCode } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Téléchargements",
  description: "Ressources et outils téléchargeables pour développeurs.",
};

export default async function DownloadsPage() {
  const downloads = await db.download.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const grouped = downloads.reduce<Record<string, typeof downloads>>((acc, d) => {
    const cat = d.category ?? "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(d);
    return acc;
  }, {});

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Téléchargements"
          title="Téléchargements"
          highlight="gratuits"
          description="Outils, templates, configurations et cheatsheets pour booster votre productivité."
        />

        <div className="mt-16 space-y-16">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6">
                <FileCode className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">{category}</h2>
                <Badge variant="outline">{items.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <Card key={item.id} className="transition-all hover:shadow-lg group">
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
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {item.fileSize && <span>{item.fileSize}</span>}
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <a href={item.fileUrl}>
                            <Download className="mr-1 h-3.5 w-3.5" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
