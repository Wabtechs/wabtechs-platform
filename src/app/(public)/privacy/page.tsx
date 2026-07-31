import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Cookie, Mail, Database, Trash2, UserCheck, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de la plateforme Wabtechs.",
};

const SECTIONS = [
  {
    icon: Database,
    title: "Collecte des données",
    content: [
      "Nous collectons les données que vous nous fournissez directement lors de votre inscription : nom, adresse email et mot de passe (chiffré).",
      "Nous collectons automatiquement certaines informations techniques : adresse IP, type de navigateur, pages visitées et durée de session, dans le but d'améliorer la plateforme.",
      "Nous ne collectons jamais de données sensibles (données bancaires, numéros de sécurité sociale, etc.).",
    ],
  },
  {
    icon: Eye,
    title: "Utilisation des données",
    content: [
      "Vos données sont utilisées exclusivement pour le fonctionnement de la plateforme : authentification, personnalisation de l'expérience et communication relative à votre compte.",
      "Nous utilisons les données de navigation de manière agrégée et anonymisée pour analyser l'utilisation de la plateforme et améliorer nos services.",
      "Nous ne vendons jamais vos données personnelles à des tiers.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies",
    content: [
      "Cookies essentiels : nécessaires au fonctionnement de la plateforme (authentification, préférences). Ils ne peuvent pas être désactivés.",
      "Cookies d'analyse : nous aident à comprendre comment les visiteurs utilisent le site (pages visitées, temps passé). Vous pouvez les désactiver.",
      "Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.",
    ],
  },
  {
    icon: Trash2,
    title: "Conservation des données",
    content: [
      "Vos données de compte sont conservées tant que votre compte est actif.",
      "Lors de la suppression de votre compte, toutes vos données personnelles sont supprimées dans un délai de 30 jours.",
      "Les données agrégées et anonymisées peuvent être conservées indéfiniment à des fins statistiques.",
    ],
  },
  {
    icon: UserCheck,
    title: "Vos droits (RGPD)",
    content: [
      "Droit d'accès : vous pouvez demander une copie de toutes les données que nous détenons à votre sujet.",
      "Droit de rectification : vous pouvez corriger vos données personnelles depuis votre profil ou en nous contactant.",
      "Droit à l'effacement : vous pouvez demander la suppression complète de votre compte et de vos données.",
      "Droit à la portabilité : vous pouvez exporter vos données dans un format structuré (JSON).",
      "Droit d'opposition : vous pouvez vous opposer au traitement de vos données à tout moment.",
    ],
  },
  {
    icon: Shield,
    title: "Sécurité",
    content: [
      "Toutes les communications sont chiffrées via TLS/HTTPS.",
      "Les mots de passe sont hachés avec bcrypt et ne sont jamais stockés en clair.",
      "Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.",
    ],
  },
  {
    icon: FileText,
    title: "Services tiers",
    content: [
      "Vercel : hébergement de la plateforme. Les données sont stockées dans l'Union Européenne.",
      "Neon : base de données PostgreSQL managed. Chiffrée au repos et en transit.",
      "Nous n'utilisons pas de services de tracking publicitaire.",
    ],
  },
  {
    icon: Mail,
    title: "Contact",
    content: [
      "Pour toute question relative à la protection de vos données, contactez-nous à : privacy@wabtechs.com",
      "Vous pouvez également exercer vos droits en nous écrivant à la même adresse.",
      "Si vous estimez que le traitement de vos données n'est pas conforme au RGPD, vous avez le droit de déposer une plainte auprès de la CNIL.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Confidentialité</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-muted-foreground">
            Dernière mise à jour : 25 Juillet 2026
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {SECTIONS.map((section) => (
            <Card key={section.title}>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <section.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-primary/40">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
