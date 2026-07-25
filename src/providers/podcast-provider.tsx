"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PodcastEpisode {
  number: number;
  title: string;
  audioSrc: string;
}

interface PodcastContextType {
  currentEpisode: PodcastEpisode | null;
  isPlaying: boolean;
  play: (episode: PodcastEpisode) => void;
  pause: () => void;
  stop: () => void;
}

const PodcastContext = createContext<PodcastContextType | null>(null);

export function usePodcast() {
  const ctx = useContext(PodcastContext);
  if (!ctx) throw new Error("usePodcast must be used within PodcastProvider");
  return ctx;
}

export function PodcastProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);
  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentEpisode(null);
  }, []);

  return (
    <PodcastContext.Provider value={{ currentEpisode, isPlaying, play, pause, stop }}>
      {children}
    </PodcastContext.Provider>
  );
}
