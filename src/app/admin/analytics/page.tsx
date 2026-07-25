import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AnalyticsClient } from "./analytics-client";

export const metadata: Metadata = { title: "Analytics | Admin" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");
  return <AnalyticsClient />;
}