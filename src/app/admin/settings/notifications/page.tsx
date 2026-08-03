"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Zap, Clock, Sparkles, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}

const FREQUENCIES = [
  { value: "immediate", label: "Immédiat", icon: Zap },
  { value: "daily", label: "Quotidien", icon: Clock },
  { value: "weekly", label: "Hebdomadaire", icon: Bell },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function NotificationsPage() {
  const [saving, setSaving] = useState(false);
  const [frequency, setFrequency] = useState<string>("immediate");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "email",
      label: "Notifications par email",
      description: "Recevez des notifications importantes par email",
      icon: Mail,
      enabled: true,
    },
    {
      id: "push",
      label: "Notifications push",
      description: "Recevez des notifications push dans le navigateur",
      icon: Bell,
      enabled: true,
    },
    {
      id: "newsletter",
      label: "Newsletter",
      description: "Recevez notre newsletter hebdomadaire",
      icon: Mail,
      enabled: false,
    },
    {
      id: "features",
      label: "Nouvelles fonctionnalités",
      description: "Soyez informé des nouvelles fonctionnalités",
      icon: Sparkles,
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setToast({ message: "Paramètres de notification enregistrés !", type: "success" });
    } catch {
      setToast({ message: "Erreur lors de l'enregistrement", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
      {/* Toggles */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Préférences de notification
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100/80 dark:divide-white/[0.04]">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-muted">
                    <setting.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                      {setting.label}
                    </Label>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(setting.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequency */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
              Fréquence
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {FREQUENCIES.map((f) => {
              const active = frequency === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                    active
                      ? "border-primary bg-primary/[0.04]"
                      : "border-gray-200/80 hover:border-gray-300 dark:border-border dark:hover:border-gray-600"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-primary/10"
                        : "bg-gray-100 dark:bg-muted"
                    )}
                  >
                    <f.icon
                      className={cn(
                        "h-5 w-5",
                        active ? "text-primary" : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[12px] font-medium",
                      active ? "text-primary" : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {f.label}
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
