"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw, Copy } from "lucide-react";

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

  function copyDigest() {
    if (error.digest) {
      navigator.clipboard.writeText(error.digest);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <p className="text-6xl font-bold text-destructive">500</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Une erreur est survenue</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Désolé, une erreur inattendue s&apos;est produite. Veuillez réessayer.
      </p>

      {error.digest && (
        <Card className="mt-6 max-w-sm w-full">
          <CardContent className="flex items-center justify-between gap-3 pt-4 pb-3">
            <span className="text-xs text-muted-foreground font-mono truncate">
              ID: {error.digest}
            </span>
            <button
              onClick={copyDigest}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
              title="Copier l'ID d'erreur"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
