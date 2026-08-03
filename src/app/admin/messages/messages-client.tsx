"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Trash2,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const PAGE_SIZE = 10;

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function MessagesClient({
  messages: initialMessages,
}: {
  messages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
  const visibleMessages = messages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function markRead(id: string) {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    if (res.ok) {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    const res = await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const next = messages.filter((m) => m.id !== id);
      setMessages(next);
      setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil(next.length / PAGE_SIZE))));
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <MessageSquare className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
            Messages
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            {messages.length} messages ·{" "}
            {messages.filter((m) => !m.read).length} non lus
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-[13px] text-gray-500">Aucun message</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          <AnimatePresence>
            {visibleMessages.map((msg) => (
              <motion.div
                key={msg.id}
                variants={item}
                layout
                className={`rounded-xl border bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:bg-card dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)] ${
                  msg.read
                    ? "border-gray-200/80 dark:border-border"
                    : "border-l-[3px] border-l-[#842ae3] border-t-gray-200/80 border-r-gray-200/80 border-b-gray-200/80 dark:border-l-[#842ae3] dark:border-t-white/[0.06] dark:border-r-white/[0.06] dark:border-b-white/[0.06]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-medium text-gray-900 dark:text-foreground">
                          {msg.name}
                        </p>
                        {!msg.read && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                            NOUVEAU
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[12px] text-gray-400">
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-primary hover:underline"
                        >
                          {msg.email}
                        </a>
                        <span className="mx-1">·</span>
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 text-gray-400 hover:text-primary"
                    >
                      <a href={`mailto:${msg.email}`}>
                        <Send className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    {!msg.read && (
                      <button
                        onClick={() => markRead(msg.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                        title="Marquer comme lu"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 ml-12">
                  <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                    {msg.subject}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
