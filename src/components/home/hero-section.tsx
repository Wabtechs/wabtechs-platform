"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BgLines } from "@/components/shared/bg-lines";

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-lg text-muted-foreground">Salut, Je suis</span>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
              <span className="text-primary">Emmanuel Mulonda Johannes</span> Développeur
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              Nous utilisons des langages de programmation, des outils et des frameworks pour concevoir
              et mettre en œuvre des sites web qui sont à la fois fonctionnels et attrayants.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="theme-btn">
                Suis-là
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                Download my CV
                <ArrowRight className="ml-1 inline h-3 w-3" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto w-full max-w-[265px] rounded-2xl bg-[#1e1e1e] p-8"
          >
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-6 text-center">
                <span className="count-text">4</span>
                <span className="counter-title">Expériences</span>
              </div>
              <div className="border-b border-white/10 pb-6 text-center">
                <span className="count-text">8</span>
                <span className="counter-title">Projets complets</span>
              </div>
              <div className="text-center">
                <span className="count-text">100</span>
                <span className="counter-title">Clients Satisfait</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-auto hidden lg:block"
          >
            <div className="absolute left-[5%] top-[4%] h-[425px] w-[425px] rounded-full bg-[#1e1e1e]" />
            <div className="relative z-10 mx-auto h-[400px] w-[400px] overflow-hidden rounded-b-[580px] rounded-t-[565px] bg-gradient-to-b from-primary/20 to-primary/5">
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl font-bold text-primary/30">EM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <BgLines />
    </section>
  );
}
