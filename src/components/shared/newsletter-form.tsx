"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Check className="h-4 w-4" />
        Merci ! Vous serez notifié des prochains articles.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="max-w-xs"
        disabled={status === "loading"}
      />
      <Button type="submit" size="sm" disabled={status === "loading"}>
        {status === "loading" ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-1 h-4 w-4" />
        )}
        S&apos;inscrire
      </Button>
    </form>
  );
}
