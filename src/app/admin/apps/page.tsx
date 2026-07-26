import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppsClient } from "./apps-client";

export const metadata: Metadata = { title: "Apps | Admin" };

export default async function AdminAppsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return <AppsClient />;
}
