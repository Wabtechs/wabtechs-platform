"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={href}
        className="group block rounded-[15px] border border-white/10 bg-[#1F1F1F] p-6 transition-all hover:border-[#842ae3]"
      >
        <div className="mb-4 inline-flex rounded-lg bg-[#842ae3]/10 p-3">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-[#842ae3] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 inline-flex items-center text-sm font-medium text-[#842ae3] opacity-0 transition-opacity group-hover:opacity-100">
          En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </Link>
    </motion.div>
  );
}
