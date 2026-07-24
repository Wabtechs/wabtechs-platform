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
        className="group block rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50"
      >
        <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </Link>
    </motion.div>
  );
}
