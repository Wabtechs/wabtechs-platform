"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, RotateCcw, Settings, Layout, User, Briefcase, Wrench, Star, CreditCard, MessageSquare, Users, Globe, Search, Loader2 } from "lucide-react";
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
  fields: { key: string; label: string; type?: "text" | "textarea" | "json" | "image" }[];
}

const TABS: Tab[] = [
  { id: "general", label: "Général", icon: Settings, fields: [
    { key: "siteName", label: "Nom du site" },
    { key: "siteDescription", label: "Description du site" },
    { key: "siteUrl", label: "URL du site" },
    { key: "authorName", label: "Nom de l'auteur" },
    { key: "authorEmail", label: "Email" },
    { key: "authorPhone", label: "Téléphone" },
    { key: "authorAddress", label: "Adresse" },
    { key: "logo", label: "Logo (URL)", type: "image" },
  ]},
  { id: "hero", label: "Hero", icon: Layout, fields: [
    { key: "greeting", label: "Salutation" },
    { key: "name", label: "Nom" },
    { key: "role", label: "Rôle" },
    { key: "description", label: "Description" },
    { key: "ctaText", label: "Texte bouton CTA" },
    { key: "cvText", label: "Texte CV" },
    { key: "heroImage", label: "Image hero", type: "image" },
    { key: "progressShape", label: "Shape décoratif", type: "image" },
  ]},
  { id: "about", label: "À propos", icon: User, fields: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Titre" },
    { key: "description", label: "Description" },
    { key: "image", label: "Photo", type: "image" },
    { key: "aboutDot", label: "Dot décoratif", type: "image" },
    { key: "viraza", label: "Badge Viraza", type: "image" },
  ]},
  { id: "resume", label: "CV", icon: Briefcase, fields: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Titre" },
    { key: "items", label: "Expériences (JSON)", type: "json" },
  ]},
  { id: "services", label: "Services", icon: Wrench, fields: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Titre" },
    { key: "items", label: "Services (JSON)", type: "json" },
  ]},
  { id: "skills", label: "Compétences", icon: Star, fields: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Titre" },
    { key: "description", label: "Description" },
    { key: "items", label: "Compétences (JSON)", type: "json" },
  ]},
  { id: "pricing", label: "Tarifs", icon: CreditCard, fields: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Titre" },
    { key: "items", label: "Tarifs (JSON)", type: "json" },
  ]},
  { id: "testimonials", label: "Témoignages", icon: MessageSquare, fields: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Titre" },
    { key: "items", label: "Témoignages (JSON)", type: "json" },
  ]},
  { id: "clients", label: "Clients", icon: Users, fields: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Titre" },
    { key: "logos", label: "Logos (JSON)", type: "json" },
  ]},
  { id: "footer", label: "Footer", icon: Globe, fields: [
    { key: "copyright", label: "Copyright" },
    { key: "quickLinks", label: "Liens rapides (JSON)", type: "json" },
  ]},
  { id: "seo", label: "SEO", icon: Search, fields: [
    { key: "ogImage", label: "Image OG", type: "image" },
    { key: "twitter", label: "Twitter handle" },
  ]},
];

export function SettingsPageClient() {
  const [activeTab, setActiveTab] = useState("general");
  const [, setSettings] = useState<Setting[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const updateField = (key: string, value: string) => setDraft((p) => ({ ...p, [key]: value }));

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
      <div className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#842ae3]" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Paramètres du site</h1>
          <p className="mt-2 text-muted-foreground">Configurez l&apos;ensemble des sections et contenus de votre site.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <div className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-[#842ae3] text-[#1e1e1e]"
                    : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white",
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white">{currentTab?.label}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchSettings} className="border-gray-200 text-muted-foreground hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/5">
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button size="sm" onClick={saveTab} disabled={saving} className="bg-[#842ae3] text-[#1e1e1e] hover:bg-[#9333ea]">
                  {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                  Sauvegarder
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentTab?.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
                  {field.type === "image" ? (
                    <div className="space-y-2">
                      <Input
                        value={draft[field.key] ?? ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                        placeholder="/images/..."
                      />
                      {(draft[field.key]) && (
                        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                          <img src={draft[field.key]} alt={field.label} className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  ) : field.type === "json" ? (
                    <div className="space-y-2">
                      <textarea
                        value={draft[field.key] ?? ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-900 focus:border-[#842ae3] focus:outline-none dark:border-white/10 dark:bg-[#131313] dark:text-white"
                        rows={10}
                        spellCheck={false}
                      />
                      <Button variant="outline" size="sm" onClick={() => formatJson(field.key)} className="border-gray-200 text-muted-foreground hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/5">
                        Formater JSON
                      </Button>
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={draft[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-[#842ae3] focus:outline-none dark:border-white/10 dark:bg-[#131313] dark:text-white"
                      rows={4}
                    />
                  ) : (
                    <Input
                      value={draft[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium shadow-lg",
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white",
          )}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
