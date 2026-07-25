import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { SubscribersClient } from "./subscribers-client";

export const metadata: Metadata = { title: "Abonnés newsletter" };

export default async function AdminSubscribersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const subscribers = await db.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <SubscribersClient subscribers={subscribers} />;
}
