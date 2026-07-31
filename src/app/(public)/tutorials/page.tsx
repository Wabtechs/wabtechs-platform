import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { BookOpen } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tutoriels",
  description: "Tutoriels pas-à-pas pour maîtriser les technologies modernes.",
};

export default async function TutorialsPage() {
  const tutorials = await db.tutorial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Tutoriels"
          title="Tutoriels"
          highlight="pas-à-pas"
          description="Apprenez à votre rythme avec des guides pratiques et des projets concrets."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
                {tutorial.description && (
                  <CardDescription className="mt-3">{tutorial.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">Tutoriel</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
