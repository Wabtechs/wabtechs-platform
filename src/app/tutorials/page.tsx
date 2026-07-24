import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = { title: "Tutoriels" };

const TUTORIALS = [
  { title: "Débuter avec Next.js 16", description: "Guide complet pour créer votre première app.", level: "Débutant" },
  { title: "Prisma & PostgreSQL", description: "ORM et base de données en production.", level: "Intermédiaire" },
  { title: "Déploiement CI/CD", description: "Pipeline automatique avec GitHub Actions.", level: "Avancé" },
];

export default function TutorialsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><GraduationCap className="mr-1 h-3 w-3" /> Tutoriels</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Tutoriels <span className="gradient-text">pas-à-pas</span></h1>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TUTORIALS.map((t) => (
            <Card key={t.title} className="cursor-pointer transition-all hover:shadow-lg">
              <CardHeader>
                <Badge variant="outline" className="w-fit">{t.level}</Badge>
                <CardTitle className="mt-2 text-base">{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
