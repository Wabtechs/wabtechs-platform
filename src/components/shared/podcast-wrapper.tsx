"use client";

import { PodcastProvider } from "@/providers/podcast-provider";
import { MiniPlayer } from "@/components/podcast/mini-player";

export function PodcastWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PodcastProvider>
      {children}
      <MiniPlayer />
    </PodcastProvider>
  );
}
