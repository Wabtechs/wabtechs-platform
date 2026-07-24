export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mb-8" />
      <h1 className="text-3xl font-bold tracking-tight">Maintenance en cours</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Nous effectuons une maintenance planifiée. Nous serons de retour très bientôt.
      </p>
    </div>
  );
}
