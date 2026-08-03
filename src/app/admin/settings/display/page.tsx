"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PanelLeft,
  LayoutGrid,
  Sidebar,
  ArrowRightLeft,
  Loader2,
  Save,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIDEBAR_VARIANTS = [
  { value: "sidebar", label: "Sidebar", icon: Sidebar },
  { value: "floating", label: "Flottant", icon: LayoutGrid },
  { value: "inline", label: "Intégré", icon: PanelLeft },
] as const;

const LAYOUT_MODES = [
  { value: "default", label: "Défaut" },
  { value: "compact", label: "Compact" },
  { value: "full", label: "Complet" },
] as const;

const DIRECTIONS = [
  { value: "ltr", label: "LTR" },
  { value: "rtl", label: "RTL" },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function DisplayPage() {
  const [sidebarVariant, setSidebarVariant] = useState("sidebar");
  const [layoutMode, setLayoutMode] = useState("default");
  const [direction, setDirection] = useState("ltr");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      showToast("Paramètres d'affichage enregistrés !", "success");
    } catch {
      showToast("Erreur lors de l'enregistrement", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
      {/* Sidebar Variant */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Sidebar className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Variante de la barre latérale
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {SIDEBAR_VARIANTS.map((v) => {
              const active = sidebarVariant === v.value;
              return (
                <button
                  key={v.value}
                  onClick={() => setSidebarVariant(v.value)}
                  className={cn(
                    "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all duration-200",
                    active
                      ? "border-primary bg-primary/[0.04]"
                      : "border-gray-200/80 hover:border-gray-300 dark:border-border dark:hover:border-gray-600"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-primary/10"
                        : "bg-gray-100 group-hover:bg-gray-200/80 dark:bg-muted dark:group-hover:bg-muted/80"
                    )}
                  >
                    <v.icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        active ? "text-primary" : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[13px] font-medium",
                      active ? "text-primary" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {v.label}
                  </span>
                  {active && (
                    <div className="absolute right-2 top-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Preview */}
          <div className="mt-4 rounded-lg border border-gray-200/80 bg-gray-50 p-4 dark:border-border dark:bg-muted">
            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Aperçu</p>
            <div className="mt-2 flex h-24 gap-2 overflow-hidden rounded-md bg-white dark:bg-card">
              <div
                className={cn(
                  "flex flex-col gap-1.5 border-r border-gray-200/80 bg-gray-50 p-2 dark:border-border dark:bg-muted",
                  sidebarVariant === "floating" ? "m-1 rounded-lg border" : "",
                  sidebarVariant === "floating" ? "w-14" : "w-16"
                )}
              >
                <div className="h-2 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2 w-6 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2 w-7 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="flex-1 p-2">
                <div className="h-2 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-2 h-12 rounded bg-gray-100 dark:bg-muted" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Mode */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <LayoutGrid className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Mode de disposition
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {LAYOUT_MODES.map((m) => {
              const active = layoutMode === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => setLayoutMode(m.value)}
                  className={cn(
                    "rounded-xl border-2 px-4 py-3 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "border-primary bg-primary/[0.04] text-primary"
                      : "border-gray-200/80 text-gray-600 hover:border-gray-300 dark:border-border dark:text-gray-400 dark:hover:border-gray-600"
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Direction */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Direction du texte
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {DIRECTIONS.map((d) => {
              const active = direction === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => setDirection(d.value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "border-primary bg-primary/[0.04] text-primary"
                      : "border-gray-200/80 text-gray-600 hover:border-gray-300 dark:border-border dark:text-gray-400 dark:hover:border-gray-600"
                  )}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  {d.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          disabled={saving}
          onClick={handleSave}
          className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          {saving ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-3.5 w-3.5" />
          )}
          Enregistrer
        </Button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={cn(
              "rounded-lg px-4 py-3 text-sm font-medium shadow-lg",
              toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}
          >
            {toast.message}
          </div>
        </div>
      )}
    </motion.div>
  );
}
