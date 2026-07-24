import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";

export const metadata: Metadata = { title: "Ressources" };

const RESOURCES = [
  { title: "Cheatsheet TypeScript", description: "Référence rapide TypeScript" },
  { title: "Tailwind Utilities", description: "Classes Tailwind les plus utilisées" },
  { title: "Git Commands", description: "Commandes Git essentielles" },
];

export default function ResourcesPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Link className="mr-1 h-3 w-3" /> Ressources</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Ressources <span className="gradient-text">utiles</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Outils et références pour développeurs.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <Card key={r.title} className="cursor-pointer transition-all hover:shadow-lg">
              <CardHeader><CardTitle className="text-base">{r.title}</CardTitle><CardDescription>{r.description}</CardDescription></CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
