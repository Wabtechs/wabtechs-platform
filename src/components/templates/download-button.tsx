"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Loader2, Download, Lock, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadButton({
  slug,
  downloadUrl,
  repoUrl,
  free,
  owned,
  price,
}: {
  slug: string;
  downloadUrl: string | null;
  repoUrl: string | null;
  free: boolean;
  owned?: boolean;
  price: number;
}) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (free || owned) {
    return (
      <FreeDownload
        slug={slug}
        downloadUrl={downloadUrl}
        repoUrl={repoUrl}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

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
      <Button size="lg" onClick={() => signIn()} className="w-full sm:w-auto">
        <Lock className="mr-2 h-4 w-4" />
        Se connecter pour acheter
      </Button>
    );
  }

  if (done) {
    return (
      <Button size="lg" disabled className="w-full bg-emerald-500 hover:bg-emerald-500 sm:w-auto">
        <Check className="mr-2 h-4 w-4" />
        Déjà acheté
      </Button>
    );
  }

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch(`/api/templates/${slug}/checkout`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (data?.error === "Déjà acheté") {
        setDone(true);
      } else {
        alert(data?.error ?? "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="lg" onClick={handleBuy} disabled={loading} className="w-full sm:w-auto">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {loading ? "Redirection vers le paiement..." : `Acheter — ${price}€`}
    </Button>
  );
}

function FreeDownload({
  slug,
  downloadUrl,
  repoUrl,
  loading,
  setLoading,
}: {
  slug: string;
  downloadUrl: string | null;
  repoUrl: string | null;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/templates/${slug}/download`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const url = data.url ?? downloadUrl ?? repoUrl;
        if (url) window.open(url, "_blank");
      } else if (downloadUrl || repoUrl) {
        const url = downloadUrl ?? repoUrl;
        if (url) window.open(url, "_blank");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="lg" onClick={handleDownload} disabled={loading} className="w-full sm:w-auto">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {loading ? "Téléchargement..." : "Télécharger gratuitement"}
    </Button>
  );
}
