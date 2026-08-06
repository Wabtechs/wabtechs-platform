"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Une erreur est survenue</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Désolé, une erreur inattendue s&apos;est produite. Veuillez réessayer.
          </p>
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground mt-6 rounded-md px-4 py-2"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
