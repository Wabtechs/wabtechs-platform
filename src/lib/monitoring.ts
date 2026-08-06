export async function captureError(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  if (process.env.NODE_ENV === "development") {
    console.error("[Monitoring]", message, { stack, ...context });
    return;
  }

  const dsn =
    typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SENTRY_DSN : process.env.SENTRY_DSN;

  if (dsn) {
    const Sentry = await import("@sentry/nextjs");
    if (Sentry.isInitialized()) {
      Sentry.captureException(error, { extra: context });
      return;
    }
  }

  const body = {
    message,
    stack,
    context,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  };

  fetch("/api/monitoring/error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}
