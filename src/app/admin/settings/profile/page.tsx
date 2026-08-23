"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Camera, Loader2, Save, Github, Twitter, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
  github: z.string().url("URL invalide").optional().or(z.literal("")),
  twitter: z.string().url("URL invalide").optional().or(z.literal("")),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      github: "",
      twitter: "",
      website: "",
    },
  });

  const onSubmit = async (_data: ProfileForm) => {
    setSaving(true);
    try {
      // TODO: API call
      await new Promise((r) => setTimeout(r, 1000));
      setToast({ message: "Profil enregistré avec succès !", type: "success" });
    } catch {
      setToast({ message: "Erreur lors de l'enregistrement", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (toast) {
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar & Basic Info */}
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Camera className="h-3.5 w-3.5 text-primary" />
              </div>
              <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
                Informations personnelles
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                EM
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 border-gray-200/80 dark:border-border"
                >
                  <Camera className="mr-1.5 h-3.5 w-3.5" />
                  Changer l&apos;avatar
                </Button>
                <p className="mt-1.5 text-[11px] text-gray-400">
                  PNG, JPG. Max 2 Mo.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] text-gray-900 dark:text-foreground">
                Nom complet
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                placeholder="Votre nom"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] text-gray-900 dark:text-foreground">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="text-[11px] text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[13px] text-gray-900 dark:text-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className="border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                rows={3}
                placeholder="Décrivez-vous en quelques mots..."
              />
              {errors.bio && (
                <p className="text-[11px] text-red-500">{errors.bio.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-3.5 w-3.5 text-primary" />
              </div>
              <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
                Réseaux sociaux
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2 text-[13px] text-gray-900 dark:text-foreground">
                <Github className="h-3.5 w-3.5" />
                GitHub
              </Label>
              <Input
                id="github"
                {...register("github")}
                className="h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                placeholder="https://github.com/votre-profil"
              />
              {errors.github && (
                <p className="text-[11px] text-red-500">{errors.github.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2 text-[13px] text-gray-900 dark:text-foreground">
                <Twitter className="h-3.5 w-3.5" />
                Twitter
              </Label>
              <Input
                id="twitter"
                {...register("twitter")}
                className="h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                placeholder="https://twitter.com/votre-profil"
              />
              {errors.twitter && (
                <p className="text-[11px] text-red-500">{errors.twitter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2 text-[13px] text-gray-900 dark:text-foreground">
                <Globe className="h-3.5 w-3.5" />
                Site web
              </Label>
              <Input
                id="website"
                {...register("website")}
                className="h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
                placeholder="https://votre-site.com"
              />
              {errors.website && (
                <p className="text-[11px] text-red-500">{errors.website.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={saving}
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
      </form>

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
