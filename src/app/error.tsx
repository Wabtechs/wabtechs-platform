"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-destructive">500</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Une erreur est survenue</h1>
      <p className="mt-2 text-muted-foreground">
        Désolé, une erreur inattendue s&apos;est produite. Veuillez réessayer.
      </p>
      <Button onClick={reset} className="mt-8">
        Réessayer
      </Button>
    </div>
  );
}
