import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SubscribersClient } from "./subscribers-client";

export const metadata: Metadata = { title: "Abonnés newsletter" };

export default async function AdminSubscribersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const subscribers = await db.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Abonnés</h1>
        <p className="mt-2 text-muted-foreground">
          {activeCount} abonnés actifs sur {subscribers.length} au total.
        </p>

        <SubscribersClient subscribers={subscribers} />
      </div>
    </div>
  );
}
