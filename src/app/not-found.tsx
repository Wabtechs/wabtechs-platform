import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page introuvable</h1>
      <p className="mt-2 text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
