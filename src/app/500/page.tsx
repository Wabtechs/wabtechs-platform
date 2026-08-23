import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Custom500Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-destructive">500</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Erreur serveur</h1>
      <p className="mt-2 text-muted-foreground">Quelque chose s&apos;est mal passé côté serveur.</p>
      <Button asChild className="mt-8">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
