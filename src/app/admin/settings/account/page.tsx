"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, AlertTriangle, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const emailSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
});

type EmailForm = z.infer<typeof emailSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe requis."),
    newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "Confirmation requise."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function AccountPage() {
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onEmailSubmit = async () => {
    setSavingEmail(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      showToast("Email modifié avec succès !", "success");
    } catch {
      showToast("Les modifications n’ont pas pu être enregistrées. Veuillez réessayer.", "error");
    } finally {
      setSavingEmail(false);
    }
  };

  const onPasswordSubmit = async () => {
    setSavingPassword(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      passwordForm.reset();
      showToast("Mot de passe modifié avec succès !", "success");
    } catch {
      showToast("Les modifications n’ont pas pu être enregistrées. Veuillez réessayer.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
      {/* Email */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
              <Mail className="text-primary h-3.5 w-3.5" />
            </div>
            <CardTitle className="dark:text-foreground text-[14px] font-semibold text-gray-900">
              Adresse email
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-foreground text-[13px] text-gray-900">
                Nouvelle adresse email
              </Label>
              <Input
                id="email"
                type="email"
                {...emailForm.register("email")}
                className="focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900"
                placeholder="nouveau@email.com"
              />
              {emailForm.formState.errors.email && (
                <p className="text-[11px] text-red-500">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={savingEmail}
              className="bg-primary h-8 text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
            >
              {savingEmail ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" />
              )}
              Mettre à jour l&apos;email
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
              <Lock className="text-primary h-3.5 w-3.5" />
            </div>
            <CardTitle className="dark:text-foreground text-[14px] font-semibold text-gray-900">
              Mot de passe
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="dark:text-foreground text-[13px] text-gray-900"
              >
                Mot de passe actuel
              </Label>
              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register("currentPassword")}
                className="focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900"
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-[11px] text-red-500">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="dark:text-foreground text-[13px] text-gray-900"
              >
                Nouveau mot de passe
              </Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
                className="focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-[11px] text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="dark:text-foreground text-[13px] text-gray-900"
              >
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
                className="focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-[11px] text-red-500">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={savingPassword}
              className="bg-primary h-8 text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
            >
              {savingPassword ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Lock className="mr-1.5 h-3.5 w-3.5" />
              )}
              Modifier le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="dark:bg-card border-red-200/80 bg-white dark:border-red-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            </div>
            <CardTitle className="dark:text-foreground text-[14px] font-semibold text-gray-900">
              Zone de danger
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">
            La suppression de votre compte est irréversible. Toutes vos données seront
            définitivement supprimées.
          </p>
          <Button type="button" variant="destructive" size="sm" className="mt-4 h-8">
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>

      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <div
            className={cn(
              "rounded-lg px-4 py-3 text-sm font-medium shadow-lg",
              toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white",
            )}
          >
            {toast.message}
          </div>
        </div>
      )}
    </motion.div>
  );
}
