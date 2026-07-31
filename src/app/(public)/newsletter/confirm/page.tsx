import type { Metadata } from "next";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Confirmation Newsletter",
  description: "Confirmation de votre inscription à la newsletter Wabtechs.",
};

export default async function ConfirmPage(props: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await props.searchParams;

  if (!token) {
    return <Result icon={XCircle} title="Lien invalide" message="Aucun token de confirmation fourni." />;
  }

  const subscriber = await db.newsletter.findUnique({ where: { token } });

  if (!subscriber) {
    return <Result icon={XCircle} title="Lien invalide" message="Ce lien de confirmation n'est pas valide ou a expiré." />;
  }

  if (subscriber.active) {
    return <Result icon={CheckCircle2} title="Déjà confirmé" message="Votre adresse email est déjà confirmée." />;
  }

  await db.newsletter.update({ where: { id: subscriber.id }, data: { active: true } });

  return <Result icon={CheckCircle2} title="Inscription confirmée !" message="Merci ! Vous recevrez bientôt nos prochains articles et tutoriels." />;
}

function Result({ icon: Icon, title, message }: { icon: typeof CheckCircle2; title: string; message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <Icon className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-3xl font-bold">{title}</h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
        <Link
          href="/"
          className="theme-btn mt-8 inline-flex items-center"
        >
          Retour à l&apos;accueil
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
