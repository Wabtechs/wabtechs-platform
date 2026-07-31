"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, BookOpen, Users, Github } from "lucide-react";
import { BgLines } from "@/components/shared/bg-lines";

const SOCIAL_PROOF = [
  { icon: Github, label: "Projets Open Source", value: "10+" },
  { icon: BookOpen, label: "Articles & Tutoriels", value: "50+" },
  { icon: Users, label: "Développeurs Rejoints", value: "500+" },
  { icon: Star, label: "Étoiles GitHub", value: "50+" },
];

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Star className="h-3.5 w-3.5" />
              Wabtechs Platform
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Construisez. Publiez.{" "}
              <span className="text-primary">Développez.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Une plateforme technologique complète — blogs, documentation, vidéos, tutoriels, 
              podcasts et ressources open source. Créée par Emmanuel Mulonda Johannes pour 
              la communauté des développeurs.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/docs" className="theme-btn">
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:text-primary"
              >
                Voir les projets
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Regarder les vidéos
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SOCIAL_PROOF.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                    <span className="ml-1 text-muted-foreground">{item.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto w-full max-w-[265px] rounded-2xl bg-[#1e1e1e] p-8"
          >
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-6 text-center">
                <span className="count-text">4+</span>
                <span className="counter-title">Années d&apos;expérience</span>
              </div>
              <div className="border-b border-white/10 pb-6 text-center">
                <span className="count-text">8+</span>
                <span className="counter-title">Projets complets</span>
              </div>
              <div className="text-center">
                <span className="count-text">153+</span>
                <span className="counter-title">Clients Satisfaits</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto hidden lg:block"
          >
            <div className="absolute left-[5%] top-[4%] h-[425px] w-[425px] rounded-full bg-[#1e1e1e]" />
            <div className="relative z-10 mx-auto h-[400px] w-[400px] overflow-hidden rounded-b-[580px] rounded-t-[565px]">
              <Image
                src="/images/hero/Emmanuel Mulonda Johannes.png"
                alt="Emmanuel Mulonda Johannes"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-4 top-10"
            >
              <Image
                src="/images/hero/progress-shape.png"
                alt=""
                width={100}
                height={100}
                className="opacity-60"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <BgLines />
    </section>
  );
}
