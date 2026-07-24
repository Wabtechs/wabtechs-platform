"use client";

import { motion } from "framer-motion";

const STATS = [
  { label: "Articles publiés", value: "50+" },
  { label: "Projets open source", value: "15+" },
  { label: "Communauté", value: "2K+" },
  { label: "Heures de contenu", value: "200+" },
];

export function StatsSection() {
  return (
    <section className="border-t py-24">
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
              <p className="text-3xl font-bold gradient-text sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
