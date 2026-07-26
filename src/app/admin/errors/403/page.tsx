"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function AdminForbidden() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
      className="w-full max-w-md"
    >
      <motion.div variants={fadeUp}>
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#842ae3]/10">
              <ShieldOff className="h-7 w-7 text-[#842ae3]" />
            </div>
            <h1 className="mt-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
              Accès interdit
            </h1>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
              Vous n&apos;avez pas le droit d&apos;accéder à cette ressource.
            </p>
            <Button asChild className="mt-6 h-9 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25">
              <Link href="/admin">Retour au tableau de bord</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
