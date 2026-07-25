import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SettingsPageClient } from "./settings-client";

export const metadata: Metadata = { title: "Paramètres du site" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");
  return <SettingsPageClient />;
}
