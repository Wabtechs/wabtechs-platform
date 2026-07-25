export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <div className="space-y-2">
          <div className="mx-auto h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-3 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
