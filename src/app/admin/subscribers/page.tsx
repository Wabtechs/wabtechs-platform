import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { SubscribersClient } from "./subscribers-client";

export const metadata: Metadata = { title: "Abonnés newsletter" };
export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await db.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <SubscribersClient subscribers={subscribers} />;
}
