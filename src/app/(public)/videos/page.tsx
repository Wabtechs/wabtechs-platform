import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Play, Calendar, Clock } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Vidéos",
  description: "Tutoriels vidéo et contenus YouTube sur les technologies web modernes.",
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function VideosPage() {
  const videos = await db.video.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Vidéos"
          title="Vidéos &"
          highlight="Tutoriels"
          description="Contenus vidéo pour apprendre et se perfectionner — tutoriels, concepts et guides pratiques."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <a key={video.id} href={video.videoUrl} target="_blank" rel="noopener noreferrer">
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 group">
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  {video.duration > 0 && (
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDuration(video.duration)}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-sm leading-snug group-hover:text-primary transition-colors">
                    {video.title}
                  </CardTitle>
                  {video.description && (
                    <CardDescription className="line-clamp-2 text-xs">{video.description}</CardDescription>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
