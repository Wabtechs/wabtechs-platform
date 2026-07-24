import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-neutral dark:prose-invert">
        <Badge variant="secondary" className="mb-4">Conditions</Badge>
        <h1 className="text-3xl font-bold">Conditions d&apos;utilisation</h1>
        <p className="text-muted-foreground">Dernière mise à jour : Juillet 2026</p>
        <h2>Utilisation</h2>
        <p>En utilisant cette plateforme, vous acceptez les présentes conditions.</p>
        <h2>Contenu</h2>
        <p>Le contenu est fourni à titre informatif et éducatif.</p>
      </div>
    </div>
  );
}
