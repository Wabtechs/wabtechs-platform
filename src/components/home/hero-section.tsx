"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl" />
        <div className="absolute right-0 top-1/2 -z-10 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/2 rounded-full bg-gradient-to-l from-violet-500/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-8 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Plateforme en constante évolution
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Développez.{" "}
            <span className="gradient-text">Partagez.</span>{" "}
            Innovez.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            La plateforme de référence pour les développeurs francophones.
            Articles, documentation, projets open source et bien plus.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/blog">
                Explorer le blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/wabtechs" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
