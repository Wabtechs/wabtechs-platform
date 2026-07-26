"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { AudioPlayer } from "@/components/podcast/audio-player";
import { usePodcast } from "@/providers/podcast-provider";
import { Play, Pause, Clock, Calendar, ExternalLink } from "lucide-react";

const EPISODES = [
  { number: 12, title: "L'état de React en 2026", description: "Retour sur les nouveautés React 19, Server Components, Actions et l'avenir du framework.", date: "12 Juillet 2026", duration: "45 min", tags: ["React", "Server Components"], audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { number: 11, title: "Mon setup de développement", description: "Outils, extensions VS Code, configuration terminal, et workflow productivité maximale.", date: "5 Juillet 2026", duration: "38 min", tags: ["Productivité", "Outils"], audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { number: 10, title: "Déployer sur Vercel", description: "Guide complet du déploiement Next.js sur Vercel — config, edge functions, ISR, analytics.", date: "28 Juin 2026", duration: "52 min", tags: ["Vercel", "DevOps"], audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { number: 9, title: "TypeScript strict mode", description: "Pourquoi et comment activer le mode strict — noUncheckedIndexedAccess, discriminated unions, type guards.", date: "21 Juin 2026", duration: "41 min", tags: ["TypeScript", "Bonnes pratiques"], audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { number: 8, title: "Prisma ORM en production", description: "Retour d'expérience sur Prisma — schema design, migrations, performance, et pièges à éviter.", date: "14 Juin 2026", duration: "48 min", tags: ["Prisma", "Database"], audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { number: 7, title: "Tailwind CSS v4 — Ce qui change", description: "Nouvelle configuration CSS-first, oklch colors, nouvelles utilities et migration depuis v3.", date: "7 Juin 2026", duration: "35 min", tags: ["Tailwind", "CSS"], audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
];

const PLATFORMS = [
  { name: "YouTube", url: "https://youtube.com/@wabtechs" },
  { name: "Spotify", url: "#" },
  { name: "Apple Podcasts", url: "#" },
  { name: "RSS Feed", url: "#" },
];

export default function PodcastPage() {
  const { currentEpisode, isPlaying, play, pause } = usePodcast();
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  return (
    <div className="pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Podcast"
          title="Podcast"
          highlight="Tech"
          description="Épisodes réguliers sur les tendances tech, tutoriels et interviews de développeurs."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {PLATFORMS.map((platform) => (
            <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="cursor-pointer border-white/10 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <ExternalLink className="mr-1 h-3 w-3" />
                {platform.name}
              </Badge>
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-4 max-w-4xl mx-auto">
          {EPISODES.map((ep) => {
            const isCurrent = currentEpisode?.number === ep.number;
            const isEpPlaying = isCurrent && isPlaying;
            return (
              <div key={ep.number}>
                <Card
                  className={`transition-all group cursor-pointer ${isCurrent ? "border-primary bg-[#1F1F1F]" : "border-white/10 bg-[#1F1F1F] hover:border-primary/50"}`}
                  onClick={() => {
                    setSelectedEpisode(selectedEpisode === ep.number ? null : ep.number);
                  }}
                >
                  <CardHeader className="flex flex-row items-start gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isEpPlaying) pause();
                        else play({ number: ep.number, title: ep.title, audioSrc: ep.audioSrc });
                      }}
                      className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
                    >
                      {isEpPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs border-white/10">
                          Épisode {ep.number}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {ep.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ep.date}
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-lg text-white group-hover:text-primary transition-colors">
                        {ep.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{ep.description}</CardDescription>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {ep.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/5 text-muted-foreground">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                {selectedEpisode === ep.number && (
                  <div className="mt-2">
                    <AudioPlayer src={ep.audioSrc} title={ep.title} duration={ep.duration} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
