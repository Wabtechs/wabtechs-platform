"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { PodcastProvider } from "./podcast-provider";
import { AnalyticsProvider } from "./analytics-provider";
import { captureError } from "@/lib/monitoring";

function ErrorBoundary({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      captureError(event.error ?? event.message);
    };
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      captureError(event.reason);
    };
    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", rejectionHandler);
    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  return <>{children}</>;
}

function AnalyticsWithSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </Suspense>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <QueryProvider>
          <PodcastProvider>
            <AnalyticsWithSuspense>
              <ErrorBoundary>{children}</ErrorBoundary>
            </AnalyticsWithSuspense>
          </PodcastProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
