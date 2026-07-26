"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Trash2, ToggleLeft, ToggleRight, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  createdAt: Date;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function SubscribersClient({
  subscribers: initialSubs,
}: {
  subscribers: Subscriber[];
}) {
  const [subscribers, setSubscribers] = useState(initialSubs);

  async function toggleActive(id: string, active: boolean) {
    const res = await fetch("/api/admin/subscribers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    if (res.ok) {
      setSubscribers(
        subscribers.map((s) => (s.id === id ? { ...s, active } : s)),
      );
    }
  }

  async function deleteSubscriber(id: string) {
    if (!confirm("Supprimer cet abonné ?")) return;
    const res = await fetch("/api/admin/subscribers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setSubscribers(subscribers.filter((s) => s.id !== id));
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Mail className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
            Abonnés
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            {subscribers.length} abonnés au total
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-[13px] text-gray-500">Aucun abonné</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          <AnimatePresence>
            {subscribers.map((sub) => (
              <motion.div
                key={sub.id}
                variants={item}
                layout
                className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-border dark:bg-card dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                    <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                      {sub.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                      {sub.email}
                    </p>
                    {sub.name && (
                      <p className="text-[11px] text-gray-400">{sub.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sub.active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      <XCircle className="h-2.5 w-2.5" />
                      Inactif
                    </span>
                  )}
                  <button
                    onClick={() => toggleActive(sub.id, !sub.active)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-accent/[0.04] dark:hover:text-foreground"
                  >
                    {sub.active ? (
                      <ToggleRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteSubscriber(sub.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] text-gray-400">
                    {formatDate(sub.createdAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
