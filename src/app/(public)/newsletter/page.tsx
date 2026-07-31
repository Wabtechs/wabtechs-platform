"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Mail, Check, Loader2, Sparkles, BookOpen, Headphones, Code2, Video, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const FEATURES = [
  { icon: BookOpen, label: "Articles techniques" },
  { icon: Code2, label: "Snippets de code" },
  { icon: Headphones, label: "Nouveaux épisodes podcast" },
  { icon: Video, label: "Tutoriels vidéo" },
];

function NewsletterContent() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Email de confirmation envoyé !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Veuillez réessayer.");
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          <Mail className="mr-1 h-3 w-3" />
          Newsletter
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Restez <span className="text-primary">informé</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Recevez les derniers articles, tutoriels et actualités directement dans votre boîte mail.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <f.icon className="h-4 w-4 text-primary" />
              {f.label}
            </div>
          ))}
        </div>

        <Card className="mt-10">
          <CardContent className="pt-6">
            {confirmed === "true" ? (
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <Check className="h-6 w-6" />
                </div>
                <p className="text-lg font-medium">Inscription confirmée !</p>
                <p className="text-sm text-muted-foreground">
                  Merci ! Vous recevrez bientôt nos prochains articles.
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/">
                    Retour à l&apos;accueil
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : status === "success" ? (
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <Check className="h-6 w-6" />
                </div>
                <p className="text-lg font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur le lien dans l&apos;email pour confirmer votre inscription.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pas de spam. Désabonnement en un clic.
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    required
                    className="max-w-sm"
                    disabled={status === "loading"}
                  />
                  <Button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    S&apos;inscrire
                  </Button>
                </div>
                {status === "error" && (
                  <p className="text-sm text-destructive">{message}</p>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-12">
          <Link href="/newsletter/archive" className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">
            Voir les archives
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterPage() {
  return (
    <Suspense fallback={null}>
      <NewsletterContent />
    </Suspense>
  );
}
