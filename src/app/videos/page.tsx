import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

export const metadata: Metadata = { title: "Vidéos", description: "Tutoriels vidéo et contenus YouTube." };

const VIDEOS = [
  { title: "Créer une app Next.js de A à Z", description: "Tutoriel complet pour débuter avec Next.js.", views: "2.5K", date: "8 Juillet 2026" },
  { title: "Prise en main de Prisma", description: "ORM moderne pour PostgreSQL.", views: "1.8K", date: "1 Juillet 2026" },
  { title: "Tailwind CSS v4 en pratique", description: "Nouvelles features et migration.", views: "3.2K", date: "25 Juin 2026" },
];

export default function VideosPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">Vidéos</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vidéos & <span className="gradient-text">Tutoriels</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">Contenus vidéo et tutoriels pratiques.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video) => (
            <Card key={video.title} className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
              <div className="flex aspect-video items-center justify-center bg-muted">
                <Play className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardHeader>
                <CardTitle className="text-base group-hover:text-primary transition-colors">{video.title}</CardTitle>
                <CardDescription>{video.description}</CardDescription>
                <div className="text-xs text-muted-foreground">{video.views} vues · {video.date}</div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
