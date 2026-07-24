import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Gestion des utilisateurs" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true, comments: true } },
    },
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

        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="mt-2 text-muted-foreground">{users.length} utilisateurs inscrits.</p>

        <div className="mt-8 space-y-2">
          {users.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun utilisateur.
              </CardContent>
            </Card>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{user.name ?? "Sans nom"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {user._count.posts} articles · {user._count.comments} commentaires
                  </span>
                  <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                    {user.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
