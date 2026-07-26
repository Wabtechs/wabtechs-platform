"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  ArrowLeft,
  MessageSquare,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "other";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Équipe Développement",
    avatar: "🛠️",
    lastMessage: "Le déploiement est terminé sur staging",
    lastTime: "il y a 2m",
    unread: 3,
    online: true,
    messages: [
      { id: "m1", sender: "other", text: "Bonjour, est-ce que le build de production est prêt ?", time: "14:30" },
      { id: "m2", sender: "user", text: "Oui, j'ai lancé le pipeline il y a 10 minutes", time: "14:32" },
      { id: "m3", sender: "other", text: "Parfait. Il y a un souci avec les tests E2E sur le endpoint /api/auth", time: "14:35" },
      { id: "m4", sender: "user", text: "Je regarde ça tout de suite", time: "14:36" },
      { id: "m5", sender: "other", text: "C'était un problème de variable d'environnement manquante, c'est corrigé", time: "14:42" },
      { id: "m6", sender: "user", text: "Merci ! Je relance les tests maintenant", time: "14:43" },
      { id: "m7", sender: "other", text: "Le déploiement est terminé sur staging", time: "14:50" },
    ],
  },
  {
    id: "c2",
    name: "Support Client",
    avatar: "🎧",
    lastMessage: "Le ticket #4521 a été résolu",
    lastTime: "il y a 15m",
    unread: 1,
    online: true,
    messages: [
      { id: "m1", sender: "other", text: "Un client signale un problème de connexion OAuth", time: "13:10" },
      { id: "m2", sender: "user", text: "Ok, je transfère au service auth", time: "13:12" },
      { id: "m3", sender: "other", text: "Le client dit que ça marche maintenant, merci", time: "13:45" },
      { id: "m4", sender: "user", text: "Parfait, je clôture le ticket", time: "13:47" },
      { id: "m5", sender: "other", text: "Le ticket #4521 a été résolu", time: "13:50" },
    ],
  },
  {
    id: "c3",
    name: "Marketing",
    avatar: "📊",
    lastMessage: "Les métriques du mois sont prêtes",
    lastTime: "il y a 1h",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", sender: "other", text: "Bonjour, avez-vous les stats de trafic du mois ?", time: "11:00" },
      { id: "m2", sender: "user", text: "Oui, je les envoie dans quelques minutes", time: "11:05" },
      { id: "m3", sender: "user", text: "Voici le rapport : +32% de trafic organique", time: "11:15" },
      { id: "m4", sender: "other", text: "Excellent ! On dépasse nos objectifs", time: "11:18" },
      { id: "m5", sender: "other", text: "Les métriques du mois sont prêtes", time: "11:20" },
    ],
  },
  {
    id: "c4",
    name: "Direction",
    avatar: "👔",
    lastMessage: "Réunion reportée à vendredi",
    lastTime: "il y a 3h",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", sender: "other", text: "La réunion de planning est prévue demain à 10h", time: "09:00" },
      { id: "m2", sender: "user", text: "Noté, je serai là", time: "09:05" },
      { id: "m3", sender: "other", text: "Finalement on reporte à vendredi, conflit d'agenda", time: "10:30" },
      { id: "m4", sender: "user", text: "Pas de problème, vendredi ça marche", time: "10:32" },
      { id: "m5", sender: "other", text: "Réunion reportée à vendredi", time: "10:35" },
    ],
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export function ChatsClient() {
  const [conversations] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [conversations, search]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeId) return;
    setNewMessage("");
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="min-h-screen">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                Chats
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {totalUnread > 0
                  ? `${totalUnread} message${totalUnread > 1 ? "s" : ""} non lu${totalUnread > 1 ? "s" : ""}`
                  : "Aucun message non lu"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div variants={fadeUp}>
          <Card className="flex h-[calc(100vh-220px)] overflow-hidden border-gray-200/80 bg-white dark:border-border dark:bg-card">
            {/* Sidebar */}
            <div
              className={cn(
                "flex w-full flex-col border-r border-gray-100/80 dark:border-white/[0.04] sm:w-80 lg:w-96",
                activeId ? "hidden sm:flex" : "flex"
              )}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100/80 px-4 py-3 dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <h2 className="text-[13px] font-semibold text-gray-900 dark:text-foreground">
                    Conversations
                  </h2>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    {conversations.length}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="h-7 bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary/90"
                >
                  <Plus className="h-3 w-3" />
                  Nouvelle
                </Button>
              </div>

              {/* Search */}
              <div className="border-b border-gray-100/80 px-3 py-2 dark:border-white/[0.04]">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-full rounded-lg border border-gray-200/80 bg-gray-50/50 pl-8 pr-3 text-[13px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20 dark:border-border dark:bg-accent/50 dark:text-foreground dark:focus:bg-card"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={search}
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="divide-y divide-gray-100/80 dark:divide-white/[0.04]"
                  >
                    {filtered.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setActiveId(conv.id)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                          activeId === conv.id
                            ? "bg-primary/5 dark:bg-primary/10"
                            : "hover:bg-gray-50/80 dark:hover:bg-accent/[0.02]"
                        )}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[18px] dark:bg-white/5">
                            {conv.avatar}
                          </div>
                          {conv.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-card" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-[13px] font-medium text-gray-900 dark:text-foreground">
                              {conv.name}
                            </p>
                            <span className="ml-2 flex-shrink-0 text-[10px] text-gray-400">
                              {conv.lastTime}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center justify-between">
                            <p className="truncate text-[12px] text-gray-500 dark:text-gray-400">
                              {conv.lastMessage}
                            </p>
                            {conv.unread > 0 && (
                              <span className="ml-2 flex-shrink-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Search className="mb-2 h-6 w-6 text-gray-300 dark:text-gray-600" />
                    <p className="text-[12px] text-gray-400">Aucune conversation</p>
                  </div>
                )}
              </div>
            </div>

            {/* Conversation View */}
            <div
              className={cn(
                "flex flex-1 flex-col",
                activeId ? "flex" : "hidden sm:flex"
              )}
            >
              {active ? (
                <>
                  {/* Conversation Header */}
                  <div className="flex items-center gap-3 border-b border-gray-100/80 px-4 py-3 dark:border-white/[0.04]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:hidden"
                      onClick={() => setActiveId(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[16px] dark:bg-white/5">
                        {active.avatar}
                      </div>
                      {active.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-card" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                        {active.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {active.online ? "En ligne" : "Hors ligne"}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-4">
                      {active.messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className={cn(
                            "flex",
                            msg.sender === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-2.5",
                              msg.sender === "user"
                                ? "bg-primary text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md dark:bg-white/[0.06] dark:text-foreground"
                            )}
                          >
                            <p className="text-[13px] leading-relaxed">{msg.text}</p>
                            <p
                              className={cn(
                                "mt-1 text-[10px]",
                                msg.sender === "user"
                                  ? "text-white/60"
                                  : "text-gray-400 dark:text-gray-500"
                              )}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Compose */}
                  <div className="border-t border-gray-100/80 px-4 py-3 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Écrire un message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="h-9 flex-1 rounded-lg border border-gray-200/80 bg-gray-50/50 px-3 text-[13px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20 dark:border-border dark:bg-accent/50 dark:text-foreground dark:focus:bg-card"
                      />
                      <Button
                        size="icon"
                        className="h-9 w-9 bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary/90"
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center">
                  <MessageSquare className="mb-3 h-10 w-10 text-gray-200 dark:text-gray-700" />
                  <p className="text-[14px] font-medium text-gray-400 dark:text-gray-500">
                    Sélectionnez une conversation
                  </p>
                  <p className="mt-1 text-[12px] text-gray-300 dark:text-gray-600">
                    pour commencer à discuter
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
