"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <Badge variant="secondary" className="mb-4"><Mail className="mr-1 h-3 w-3" /> Newsletter</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Restez <span className="gradient-text">informé</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Recevez les derniers articles, tutoriels et actualités directement dans votre boîte mail.
        </p>
        {submitted ? (
          <div className="mt-8 rounded-lg border bg-muted/50 p-6">
            <p className="text-lg font-medium">Merci pour votre inscription ! 🎉</p>
            <p className="mt-2 text-muted-foreground">Vous recevrez un email de confirmation.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="max-w-sm"
            />
            <Button type="submit">S&apos;inscrire</Button>
          </form>
        )}
      </div>
    </div>
  );
}
