import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Abonnés newsletter" };

export default async function AdminSubscribersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const subscribers = await db.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Abonnés</h1>
        <p className="mt-2 text-muted-foreground">
          {subscribers.filter((s) => s.active).length} abonnés actifs sur {subscribers.length} au total.
        </p>

        <div className="mt-8 space-y-2">
          {subscribers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun abonné.
              </CardContent>
            </Card>
          ) : (
            subscribers.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{sub.email}</p>
                    {sub.name && <p className="text-xs text-muted-foreground">{sub.name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sub.active ? "default" : "secondary"}>
                    {sub.active ? "Actif" : "Inactif"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
