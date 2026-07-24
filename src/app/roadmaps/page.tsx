import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export const metadata: Metadata = { title: "Roadmaps" };

export default function RoadmapsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Map className="mr-1 h-3 w-3" /> Roadmaps</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Roadmaps <span className="gradient-text">2026</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Feuille de route et plans de développement.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Card><CardHeader><CardTitle className="text-base">Q3 2026</CardTitle><CardDescription>Forum, communauté, dashboard admin</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-base">Q4 2026</CardTitle><CardDescription>Système de commentaires, newsletter avancée</CardDescription></CardHeader></Card>
        </div>
      </div>
    </div>
  );
}
