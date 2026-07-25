"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { usePodcast } from "@/providers/podcast-provider";

export function MiniPlayer() {
  const { currentEpisode, isPlaying, pause, play, stop } = usePodcast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;
    audio.src = currentEpisode.audioSrc;
    if (isPlaying) audio.play().catch(() => {});
  }, [currentEpisode, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); pause(); }
    else { audio.play().catch(() => {}); play(currentEpisode!); }
  }, [isPlaying, currentEpisode, pause, play]);

  const skip = (s: number) => {
    const a = audioRef.current;
    if (a) a.currentTime = Math.max(0, Math.min(a.duration, a.currentTime + s));
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (a) { a.muted = !a.muted; setIsMuted(!isMuted); }
  };

  if (!currentEpisode) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1c1c1c]/95 backdrop-blur-xl"
      >
        <audio ref={audioRef} preload="metadata" />
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button onClick={() => skip(-15)} className="text-muted-foreground hover:text-white transition-colors">
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#842ae3] text-[#1e1e1e] transition-colors hover:bg-[#9333ea]"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button onClick={() => skip(30)} className="text-muted-foreground hover:text-white transition-colors">
            <SkipForward className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">{currentEpisode.title}</p>
            <p className="text-xs text-muted-foreground">Épisode {currentEpisode.number}</p>
          </div>
          <button onClick={toggleMute} className="text-muted-foreground hover:text-white transition-colors">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button onClick={stop} className="text-muted-foreground hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-[#842ae3] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
