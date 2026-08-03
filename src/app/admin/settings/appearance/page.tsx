"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Palette, Sun, Moon, Monitor, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "system", label: "Système", icon: Monitor },
  { value: "dark", label: "Sombre", icon: Moon },
] as const;

const FONTS = [
  { value: "inter", label: "Inter" },
  { value: "manrope", label: "Manrope" },
  { value: "system", label: "Système" },
] as const;

const BORDER_RADIUS = [
  { value: "default", label: "Défaut", radius: "0.5rem" },
  { value: "large", label: "Plus grand", radius: "0.75rem" },
  { value: "small", label: "Petit", radius: "0.25rem" },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedRadius, setSelectedRadius] = useState("default");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      showToast("Apparence enregistrée !", "success");
    } catch {
      showToast("Erreur lors de l'enregistrement", "error");
    }
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
      {/* Theme */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Palette className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Thème
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => {
              const active = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200",
                    active
                      ? "border-primary bg-primary/[0.04]"
                      : "border-gray-200/80 hover:border-gray-300 dark:border-border dark:hover:border-gray-600"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-primary/10"
                        : "bg-gray-100 group-hover:bg-gray-200/80 dark:bg-muted dark:group-hover:bg-muted/80"
                    )}
                  >
                    <t.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        active ? "text-primary" : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[13px] font-medium",
                      active
                        ? "text-primary"
                        : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {t.label}
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

          {/* Preview */}
          <div className="mt-4 rounded-lg border border-gray-200/80 bg-gray-50 p-4 dark:border-border dark:bg-muted">
            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Aperçu</p>
            <div className="mt-2 flex gap-2">
              <div className="h-8 w-8 rounded-full bg-primary" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2.5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-[14px] font-bold text-primary">Aa</span>
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Police
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FONTS.map((f) => {
              const active = selectedFont === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setSelectedFont(f.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "border-primary bg-primary/[0.04] text-primary"
                      : "border-gray-200/80 text-gray-600 hover:border-gray-300 dark:border-border dark:text-gray-400 dark:hover:border-gray-600"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <div className="h-3.5 w-3.5 rounded border-2 border-primary" />
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Rayon de bordure
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {BORDER_RADIUS.map((r) => {
              const active = selectedRadius === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setSelectedRadius(r.value)}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200",
                    active
                      ? "border-primary bg-primary/[0.04]"
                      : "border-gray-200/80 hover:border-gray-300 dark:border-border dark:hover:border-gray-600"
                  )}
                >
                  <div
                    className="h-10 w-10 border-2 border-gray-300 dark:border-gray-600"
                    style={{ borderRadius: r.radius }}
                  />
                  <span
                    className={cn(
                      "text-[12px] font-medium",
                      active ? "text-primary" : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {r.label}
                  </span>
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
          onClick={handleSave}
          className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
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
