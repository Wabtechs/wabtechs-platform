"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  RotateCcw,
  Settings,
  Layout,
  User,
  Briefcase,
  Wrench,
  Star,
  CreditCard,
  MessageSquare,
  Users,
  Globe,
  Search,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: {
    key: string;
    label: string;
    type?: "text" | "textarea" | "json" | "image";
  }[];
}

const TABS: Tab[] = [
  {
    id: "general",
    label: "Général",
    icon: Settings,
    fields: [
      { key: "siteName", label: "Nom du site" },
      { key: "siteDescription", label: "Description du site" },
      { key: "siteUrl", label: "URL du site" },
      { key: "authorName", label: "Nom de l'auteur" },
      { key: "authorEmail", label: "Email" },
      { key: "authorPhone", label: "Téléphone" },
      { key: "authorAddress", label: "Adresse" },
      { key: "logo", label: "Logo (URL)", type: "image" },
    ],
  },
  {
    id: "hero",
    label: "Hero",
    icon: Layout,
    fields: [
      { key: "greeting", label: "Salutation" },
      { key: "name", label: "Nom" },
      { key: "role", label: "Rôle" },
      { key: "description", label: "Description" },
      { key: "ctaText", label: "Texte bouton CTA" },
      { key: "cvText", label: "Texte CV" },
      { key: "heroImage", label: "Image hero", type: "image" },
      { key: "progressShape", label: "Shape décoratif", type: "image" },
    ],
  },
  {
    id: "about",
    label: "À propos",
    icon: User,
    fields: [
      { key: "badge", label: "Badge" },
      { key: "title", label: "Titre" },
      { key: "description", label: "Description" },
      { key: "image", label: "Photo", type: "image" },
      { key: "aboutDot", label: "Dot décoratif", type: "image" },
      { key: "viraza", label: "Badge Viraza", type: "image" },
    ],
  },
  {
    id: "resume",
    label: "CV",
    icon: Briefcase,
    fields: [
      { key: "badge", label: "Badge" },
      { key: "title", label: "Titre" },
      { key: "items", label: "Expériences (JSON)", type: "json" },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: Wrench,
    fields: [
      { key: "badge", label: "Badge" },
      { key: "title", label: "Titre" },
      { key: "items", label: "Services (JSON)", type: "json" },
    ],
  },
  {
    id: "skills",
    label: "Compétences",
    icon: Star,
    fields: [
      { key: "badge", label: "Badge" },
      { key: "title", label: "Titre" },
      { key: "description", label: "Description" },
      { key: "items", label: "Compétences (JSON)", type: "json" },
    ],
  },
  {
    id: "pricing",
    label: "Tarifs",
    icon: CreditCard,
    fields: [
      { key: "badge", label: "Badge" },
      { key: "title", label: "Titre" },
      { key: "items", label: "Tarifs (JSON)", type: "json" },
    ],
  },
  {
    id: "testimonials",
    label: "Témoignages",
    icon: MessageSquare,
    fields: [
      { key: "badge", label: "Badge" },
      { key: "title", label: "Titre" },
      { key: "items", label: "Témoignages (JSON)", type: "json" },
    ],
  },
  {
    id: "clients",
    label: "Clients",
    icon: Users,
    fields: [
      { key: "badge", label: "Badge" },
      { key: "title", label: "Titre" },
      { key: "logos", label: "Logos (JSON)", type: "json" },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    icon: Globe,
    fields: [
      { key: "copyright", label: "Copyright" },
      { key: "quickLinks", label: "Liens rapides (JSON)", type: "json" },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    icon: Search,
    fields: [
      { key: "ogImage", label: "Image OG", type: "image" },
      { key: "twitter", label: "Twitter handle" },
    ],
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function SettingsPageClient() {
  const [activeTab, setActiveTab] = useState("general");
  const [, setSettings] = useState<Setting[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data: Setting[] = await res.json();
      setSettings(data);
      const map: Record<string, string> = {};
      for (const s of data) map[s.key] = s.value;
      setDraft(map);
    } catch {
      setToast({ message: "Erreur de chargement", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const updateField = (key: string, value: string) =>
    setDraft((p) => ({ ...p, [key]: value }));

  const saveTab = async () => {
    setSaving(true);
    try {
      const tab = TABS.find((t) => t.id === activeTab);
      if (!tab) return;
      const settingsToSave = tab.fields.map((f) => ({
        key: f.key,
        value: draft[f.key] ?? "",
        group: tab.id,
      }));
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToSave }),
      });
      if (!res.ok) throw new Error("Erreur");
      setToast({ message: "Paramètres sauvegardés !", type: "success" });
    } catch {
      setToast({ message: "Erreur de sauvegarde", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const formatJson = (key: string) => {
    try {
      const parsed = JSON.parse(draft[key] ?? "[]");
      updateField(key, JSON.stringify(parsed, null, 2));
    } catch {
      setToast({ message: "JSON invalide", type: "error" });
    }
  };

  const currentTab = TABS.find((t) => t.id === activeTab);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
          Paramètres du site
        </h1>
        <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
          Configurez l&apos;ensemble des sections et contenus de votre site.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary/[0.08] text-primary dark:bg-primary/[0.12]"
                  : "text-gray-500 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-accent/[0.04] dark:hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10"
              >
                {currentTab && (
                  <currentTab.icon className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
              <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
                {currentTab?.label}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSettings}
                className="h-8 border-gray-200/80 text-gray-500 hover:bg-gray-50 dark:border-border dark:text-gray-400 dark:hover:bg-accent/[0.04]"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Réinitialiser
              </Button>
              <Button
                size="sm"
                onClick={saveTab}
                disabled={saving}
                className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
              >
                {saving ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                )}
                Sauvegarder
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentTab?.fields.map((field) => (
              <div key={field.key}>
                <label className="mb-2 block text-[13px] font-medium text-gray-900 dark:text-foreground">
                  {field.label}
                </label>
                {field.type === "image" ? (
                  <div className="space-y-2">
                    <Input
                      value={draft[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                      placeholder="/images/..."
                    />
                    {draft[field.key] && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200/80 dark:border-border">
                        <img
                          src={draft[field.key]}
                          alt={field.label}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : field.type === "json" ? (
                  <div className="space-y-2">
                    <textarea
                      value={draft[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 font-mono text-[13px] text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                      rows={10}
                      spellCheck={false}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => formatJson(field.key)}
                      className="h-8 border-gray-200/80 text-gray-500 hover:bg-gray-50 dark:border-border dark:text-gray-400 dark:hover:bg-accent/[0.04]"
                    >
                      Formater JSON
                    </Button>
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={draft[field.key] ?? ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 text-[13px] text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                    rows={4}
                  />
                ) : (
                  <Input
                    value={draft[field.key] ?? ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={cn(
              "rounded-lg px-4 py-3 text-sm font-medium shadow-lg",
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white",
            )}
          >
            {toast.message}
          </div>
        </div>
      )}
    </motion.div>
  );
}
