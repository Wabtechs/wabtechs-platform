import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Épisodes de podcast sur les technologies et le développement web.",
};

const EPISODES = [
  { number: 12, title: "L'état de React en 2026", description: "Retour sur les nouveautés React et Server Components.", date: "12 Juillet 2026", duration: "45 min" },
  { number: 11, title: "Mon setup de développement", description: "Outils, extensions et configuration pour productivité maximale.", date: "5 Juillet 2026", duration: "38 min" },
  { number: 10, title: "Déployer sur Vercel", description: "Guide complet du déploiement Next.js sur Vercel.", date: "28 Juin 2026", duration: "52 min" },
];

export default function PodcastPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Headphones className="mr-1 h-3 w-3" /> Podcast</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Podcast <span className="gradient-text">Tech</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Épisodes réguliers sur les tendances tech et interviews.
          </p>
        </div>
        <div className="mt-16 space-y-4 max-w-3xl mx-auto">
          {EPISODES.map((ep) => (
            <Card key={ep.number} className="group cursor-pointer transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Play className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Épisode {ep.number}</span>
                    <span>·</span>
                    <span>{ep.duration}</span>
                    <span>·</span>
                    <span>{ep.date}</span>
                  </div>
                  <CardTitle className="mt-1 text-base group-hover:text-primary transition-colors">{ep.title}</CardTitle>
                  <CardDescription className="mt-1">{ep.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
