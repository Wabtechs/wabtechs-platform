import { Wrench, Mail, Github, ExternalLink } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-8">
        <Wrench className="h-10 w-10 animate-pulse" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Maintenance planifiée
      </h1>

      <p className="mt-4 max-w-md text-muted-foreground">
        Nous effectuons une maintenance pour améliorer la plateforme.
        Nous serons de retour très rapidement.
      </p>

      <div className="mt-8 flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
        Estimation : retour dans moins d&apos;une heure
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href="https://github.com/Wabtechs/wabtechs-platform"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
        <a
          href="https://twitter.com/wabtechs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          Twitter
        </a>
        <a
          href="mailto:contact@wabtechs.com"
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Mail className="h-4 w-4" />
          contact@wabtechs.com
        </a>
      </div>
    </div>
  );
}
