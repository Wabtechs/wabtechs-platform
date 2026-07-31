"use client";

import { useEffect, useState } from "react";
import { X, Mail, Loader2, Check } from "lucide-react";

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (dismissed || localStorage.getItem("nl-dismissed")) return;

    const handleExit = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
      }
    };

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.6) {
        setVisible(true);
      }
    };

    const handleTimer = setTimeout(() => {
      setVisible(true);
    }, 30000);

    document.addEventListener("mouseleave", handleExit);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mouseleave", handleExit);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(handleTimer);
    };
  }, [dismissed]);

  if (!visible || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("nl-dismissed", "true");
  }

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
      setStatus(res.ok ? "success" : "error");
      setMessage(data.message ?? data.error ?? "");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1e1e1e] p-8 shadow-2xl">
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">
            Ne manquez rien !
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Recevez les derniers articles, tutoriels et actualités directement dans votre boîte mail.
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-6 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-green-400">{message || "Inscription réussie !"}</p>
            <button onClick={dismiss} className="text-xs text-muted-foreground hover:text-white underline underline-offset-4">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              required
              disabled={status === "loading"}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-[#1e1e1e] transition-all hover:bg-[#9333ea] disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "S'abonner"
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Pas de spam. Désabonnement en un clic.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
