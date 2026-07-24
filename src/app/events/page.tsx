import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const metadata: Metadata = { title: "Événements" };

export default function EventsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Calendar className="mr-1 h-3 w-3" /> Événements</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Événements <span className="gradient-text">& Meetups</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Prochains événements et activités communautaires.</p>
        </div>
        <div className="mt-16 space-y-4 max-w-3xl mx-auto">
          <Card><CardHeader><CardTitle className="text-base">WabTechs Meetup #1</CardTitle><CardDescription>15 Août 2026 · Kinshasa</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-base">Live Coding : Build in Public</CardTitle><CardDescription>22 Août 2026 · YouTube Live</CardDescription></CardHeader></Card>
        </div>
      </div>
    </div>
  );
}
