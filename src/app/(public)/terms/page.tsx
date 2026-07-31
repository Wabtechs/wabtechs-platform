import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Shield, Ban, AlertTriangle, Gavel, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation de la plateforme Wabtechs.",
};

const SECTIONS = [
  {
    icon: FileText,
    title: "Acceptation des conditions",
    content: [
      "En accédant et en utilisant la plateforme Wabtechs, vous acceptez intégralement les présentes conditions d'utilisation.",
      "Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.",
      "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication.",
    ],
  },
  {
    icon: Scale,
    title: "Description du service",
    content: [
      "Wabtechs est une plateforme technologique offrant un blog, une documentation, des podcasts, des vidéos, des tutoriels et des projets open source.",
      "Le service est fourni « en l'état » et « selon la disponibilité ». Nous nous efforçons d'assurer une disponibilité maximale mais ne garantissons pas une disponibilité continue.",
      "Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment, sans préavis.",
    ],
  },
  {
    icon: Shield,
    title: "Compte utilisateur",
    content: [
      "Vous devez être âgé d'au moins 13 ans pour créer un compte.",
      "Vous êtes responsable de la confidentialité de vos identifiants de connexion.",
      "Vous vous engagez à fournir des informations exactes lors de votre inscription.",
      "Un seul compte par personne. Les comptes multiples sont interdits.",
    ],
  },
  {
    icon: Ban,
    title: "Utilisations interdites",
    content: [
      "Utiliser la plateforme à des fins illicites ou non autorisées.",
      "Tenter d'accéder aux comptes d'autres utilisateurs ou aux systèmes internes.",
      "Publier du contenu malveillant, trompeur ou violant les droits de tiers.",
      "Utiliser des robots, scrapers ou autres moyens automatisés pour accéder au service.",
      "Perturber ou surcharger les serveurs de la plateforme.",
      "Reproduire, dupliquer ou revendre tout ou partie du service sans autorisation.",
    ],
  },
  {
    icon: Gavel,
    title: "Propriété intellectuelle",
    content: [
      "Le contenu de la plateforme (textes, images, code, design) est protégé par les droits d'auteur.",
      "Les projets open source sont distribués sous licence MIT, sauf mention contraire.",
      "Vous conservez les droits sur le contenu que vous soumettez à la plateforme, mais vous nous accordez une licence non exclusive pour le diffuser.",
      "Les marques, logos et noms commerciaux de Wabtechs sont protégés.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation de responsabilité",
    content: [
      "En aucun cas Wabtechs ne sera tenu responsable des dommages indirects, spéciaux, accessoires ou consécutifs résultant de l'utilisation de la plateforme.",
      "La responsabilité totale de Wabtechs ne dépassera jamais le montant payé par vous au cours des 12 derniers mois, le cas échéant.",
      "Vous êtes seul responsable de l'utilisation que vous faites du contenu disponible sur la plateforme.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Résiliation",
    content: [
      "Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil.",
      "Nous nous réservons le droit de suspendre ou supprimer votre compte en cas de violation des présentes conditions.",
      "En cas de suppression, vos données seront traitées conformément à notre politique de confidentialité.",
    ],
  },
  {
    icon: Mail,
    title: "Contact",
    content: [
      "Pour toute question concernant ces conditions d'utilisation, contactez-nous à : legal@wabtechs.com",
      "Ces conditions sont régies par les lois de la République Démocratique du Congo.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Conditions</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Conditions d&apos;utilisation
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
