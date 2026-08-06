"use client";

import { useState } from "react";
import { Loader2, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadButton({
  slug,
  downloadUrl,
  repoUrl,
  free,
  price,
}: {
  slug: string;
  downloadUrl: string | null;
  repoUrl: string | null;
  free: boolean;
  price: number;
}) {
  const [loading, setLoading] = useState(false);

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

  if (free) {
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

  return (
    <Button
      size="lg"
      disabled
      title="Le paiement arrive bientôt"
      className="w-full cursor-not-allowed sm:w-auto"
    >
      <Lock className="mr-2 h-4 w-4" />
      Acheter — {price}€ (bientôt)
    </Button>
  );
}
