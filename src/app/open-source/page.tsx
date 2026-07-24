import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";

export const metadata: Metadata = { title: "Open Source" };

export default function OpenSourcePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Github className="mr-1 h-3 w-3" /> Open Source</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Open <span className="gradient-text">Source</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Mes contributions et projets open source.</p>
        </div>
        <div className="mt-16 text-center text-muted-foreground">
          <p>Plus de projets disponibles sur <a href="https://github.com/wabtechs" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        </div>
      </div>
    </div>
  );
}
