"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Lock, CreditCard } from "lucide-react";

export function EnrollButton({ courseId, price }: { courseId: string; price: number }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const paid = price > 0;

  if (status === "loading") {
    return (
      <Button size="lg" disabled className="w-full sm:w-auto">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Chargement...
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button size="lg" className="w-full sm:w-auto" onClick={() => signIn()}>
        <Lock className="mr-2 h-4 w-4" />
        Se connecter pour s&apos;inscrire
      </Button>
    );
  }

  if (done) {
    return (
      <Button size="lg" disabled className="w-full bg-emerald-500 hover:bg-emerald-500 sm:w-auto">
        <Check className="mr-2 h-4 w-4" />
        Inscrit !
      </Button>
    );
  }

  async function handleAction() {
    setLoading(true);
    try {
      if (paid) {
        const res = await fetch("/api/academy/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          window.location.href = data.url;
          return;
        }
        alert(data?.error ?? "Une erreur est survenue");
      } else {
        const res = await fetch("/api/academy/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        if (res.ok) {
          setDone(true);
          router.refresh();
        } else {
          const data = await res.json();
          if (data?.error === "Déjà inscrit") setDone(true);
          else alert(data?.error ?? "Une erreur est survenue");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="lg" onClick={handleAction} disabled={loading} className="w-full sm:w-auto">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : paid ? (
        <CreditCard className="mr-2 h-4 w-4" />
      ) : null}
      {loading
        ? paid
          ? "Redirection vers le paiement..."
          : "Inscription..."
        : paid
          ? `Acheter le cours — ${price}€`
          : "S'inscrire au cours"}
    </Button>
  );
}
