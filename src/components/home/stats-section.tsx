"use client";

import { motion } from "framer-motion";
import { BgLines } from "@/components/shared/bg-lines";

const STATS = [
  { label: "Expériences", value: "4+" },
  { label: "Projets complets", value: "8+" },
  { label: "Clients Satisfaits", value: "153+" },
  { label: "Clients Internationaux", value: "183+" },
];

export function StatsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <BgLines />
    </section>
  );
}
