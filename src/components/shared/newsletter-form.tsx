"use client";

import { useState } from "react";
import { Mail, Loader2, Check, ArrowRight } from "lucide-react";
import { getErrorMessage, Messages } from "@/lib/messages";

export function NewsletterForm() {
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
      setStatus(res.ok ? "success" : "error");
      setMessage(data.message ?? data.error ?? "");
      if (res.ok) setEmail("");
    } catch (e) {
      setStatus("error");
      setMessage(getErrorMessage(e, Messages.errors.network));
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-400">
        <Check className="h-4 w-4" />
        {message || "Email de confirmation envoyé !"}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-0 border-b border-white/20 pb-3">
      <Mail className="text-muted-foreground mb-1 h-4 w-4" />
      <input
        type="email"
        placeholder="Adresse e-mail"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setStatus("idle");
        }}
        required
        disabled={status === "loading"}
        className="text-foreground flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/30"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-primary rounded-[14px] px-5 py-2.5 text-xs font-semibold text-[#1e1e1e] transition-colors hover:bg-[#9333ea] disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <>
            S&apos;inscrire <ArrowRight className="ml-1 inline h-3 w-3" />
          </>
        )}
      </button>
    </form>
  );
}
