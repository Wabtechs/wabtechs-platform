import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Trophy, Users } from "lucide-react";

export const metadata: Metadata = { title: "Communauté", description: "Rejoignez la communauté WabTechs." };

export default function CommunityPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Users className="mr-1 h-3 w-3" /> Communauté</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Communauté <span className="gradient-text">WabTechs</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Échangez, partagez et grandissez ensemble.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card><CardHeader><MessageSquare className="h-8 w-8 text-primary" /><CardTitle className="mt-2">Forum</CardTitle><CardDescription>Discussions et entraide entre membres.</CardDescription></CardHeader></Card>
          <Card><CardHeader><Trophy className="h-8 w-8 text-primary" /><CardTitle className="mt-2">Classements</CardTitle><CardDescription>Contributions et réputation des membres.</CardDescription></CardHeader></Card>
          <Card><CardHeader><Users className="h-8 w-8 text-primary" /><CardTitle className="mt-2">Événements</CardTitle><CardDescription>Meetups, lives et activités communautaires.</CardDescription></CardHeader></Card>
        </div>
      </div>
    </div>
  );
}
