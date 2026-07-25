"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MiniPlayerProps {
  title: string;
  audioSrc: string;
}

export function MiniPlayer({ title }: MiniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="h-0.5 bg-muted">
          <div className="h-full w-1/3 bg-primary transition-all" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
