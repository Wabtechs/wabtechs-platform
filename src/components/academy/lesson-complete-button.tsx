"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LessonCompleteButton({
  lessonId,
  initialWatched,
}: {
  lessonId: string;
  initialWatched: boolean;
}) {
  const [watched, setWatched] = useState(initialWatched);
  const [loading, setLoading] = useState(false);

  const markComplete = async () => {
    if (watched) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/academy/lessons/${lessonId}/complete`, { method: "POST" });
      const body = (await res.json()) as { error?: string; progress?: number; completed?: boolean };
      if (!res.ok) throw new Error(body.error ?? "Impossible de valider la leçon.");
      setWatched(true);
      toast.success(body.completed ? "Cours terminé, félicitations !" : "Leçon validée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={watched ? "outline" : "default"}
      className={
        watched
          ? "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
          : ""
      }
      onClick={() => void markComplete()}
      disabled={loading || watched}
    >
      {watched ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Leçon terminée
        </>
      ) : (
        <>
          <Circle className="mr-2 h-4 w-4" />
          {loading ? "Validation..." : "Marquer comme terminée"}
        </>
      )}
    </Button>
  );
}
