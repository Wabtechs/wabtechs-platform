"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plug,
  PlugZap,
  Filter,
  ArrowUpDown,
  Blocks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  connected: boolean;
  color: string;
}

const INITIAL_APPS: App[] = [
  { id: "slack", name: "Slack", description: "Messagerie d'équipe et canaux de communication", icon: "💬", category: "Communication", connected: true, color: "#E01E5A" },
  { id: "notion", name: "Notion", description: "Wiki, documents et gestion de projet", icon: "📝", category: "Productivité", connected: true, color: "#000000" },
  { id: "github", name: "GitHub", description: "Dépôt de code source et collaboration", icon: "🐙", category: "Développement", connected: true, color: "#6e40c9" },
  { id: "discord", name: "Discord", description: "Communautés et voice chat", icon: "🎮", category: "Communication", connected: false, color: "#5865F2" },
  { id: "figma", name: "Figma", description: "Design d'interface et prototypes", icon: "🎨", category: "Design", connected: false, color: "#F24E1E" },
  { id: "docker", name: "Docker", description: "Conteneurs et déploiement d'applications", icon: "🐳", category: "Développement", connected: true, color: "#2496ED" },
  { id: "gmail", name: "Gmail", description: "Messagerie email Google Workspace", icon: "✉️", category: "Communication", connected: false, color: "#EA4335" },
  { id: "gitlab", name: "GitLab", description: "DevOps et pipeline CI/CD", icon: "🦊", category: "Développement", connected: false, color: "#FC6D26" },
  { id: "medium", name: "Medium", description: "Publication d'articles et blogging", icon: "📰", category: "Contenu", connected: false, color: "#00AB6C" },
  { id: "stripe", name: "Stripe", description: "Paiements en ligne et facturation", icon: "💳", category: "Finance", connected: true, color: "#635BFF" },
  { id: "telegram", name: "Telegram", description: "Messagerie instantanée sécurisée", icon: "📨", category: "Communication", connected: false, color: "#0088CC" },
  { id: "whatsapp", name: "WhatsApp", description: "Messagerie et appels WhatsApp Business", icon: "📱", category: "Communication", connected: false, color: "#25D366" },
];

type FilterStatus = "all" | "connected" | "disconnected";
type SortBy = "name" | "status";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function AppsClient() {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");

  const filtered = useMemo(() => {
    let result = apps;
    if (filter === "connected") result = result.filter((a) => a.connected);
    if (filter === "disconnected") result = result.filter((a) => !a.connected);
    if (search) result = result.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return Number(b.connected) - Number(a.connected);
    });
    return result;
  }, [apps, filter, search, sortBy]);

  const connectedCount = apps.filter((a) => a.connected).length;

  const toggleApp = (id: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a)));
  };

  return (
    <div className="min-h-screen">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Blocks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                Applications
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {connectedCount} connectée{connectedCount > 1 ? "s" : ""} sur {apps.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div variants={fadeUp} className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une app..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 rounded-lg border border-gray-200/80 bg-white pl-8 pr-3 text-[13px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-gray-200/80 bg-white p-0.5 dark:border-border dark:bg-card">
              {([
                ["all", "Tous"],
                ["connected", "Connectés"],
                ["disconnected", "Déconnectés"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                    filter === value
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400"
              onClick={() => setSortBy(sortBy === "name" ? "status" : "name")}
            >
              <ArrowUpDown className="h-3 w-3" />
              {sortBy === "name" ? "Nom" : "Statut"}
            </Button>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((app) => (
            <motion.div key={app.id} variants={fadeUp} layout>
              <Card className="group relative overflow-hidden border-gray-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 dark:border-border dark:bg-card dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-[22px] transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${app.color}12` }}
                      >
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-foreground">
                          {app.name}
                        </h3>
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                          {app.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {app.connected ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Connecté
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                          Déconnecté
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
                    {app.description}
                  </p>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant={app.connected ? "outline" : "default"}
                      className={cn(
                        "h-7 text-[11px] font-medium",
                        app.connected
                          ? "border-gray-200/80 text-gray-600 hover:border-red-300 hover:text-red-600 dark:border-border dark:text-gray-400 dark:hover:border-red-500/50 dark:hover:text-red-400"
                          : "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary/90"
                      )}
                      onClick={() => toggleApp(app.id)}
                    >
                      {app.connected ? (
                        <>
                          <PlugZap className="h-3 w-3" />
                          Déconnecter
                        </>
                      ) : (
                        <>
                          <Plug className="h-3 w-3" />
                          Connecter
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-16">
            <Filter className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Aucune application trouvée</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
