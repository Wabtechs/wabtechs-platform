import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-neutral dark:prose-invert">
        <Badge variant="secondary" className="mb-4">Confidentialité</Badge>
        <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
        <p className="text-muted-foreground">Dernière mise à jour : Juillet 2026</p>
        <h2>Collecte des données</h2>
        <p>Nous collectons uniquement les données nécessaires au fonctionnement de la plateforme.</p>
        <h2>Cookies</h2>
        <p>Nous utilisons des cookies essentiels et d&apos;analytics pour améliorer votre expérience.</p>
        <h2>Contact</h2>
        <p>Pour toute question, contactez-nous à contact@wabtechs.com.</p>
      </div>
    </div>
  );
}
