import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages de contact" };

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const messages = await db.contactMessage.findMany({
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

        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="mt-2 text-muted-foreground">
          {messages.length} messages · {messages.filter((m) => !m.read).length} non lus
        </p>

        <div className="mt-8 space-y-3">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun message.
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className={message.read ? "" : "border-l-4 border-l-primary"}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{message.name}</CardTitle>
                        {!message.read && <Badge variant="destructive" className="text-xs">Nouveau</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <a href={`mailto:${message.email}`} className="hover:underline">{message.email}</a>
                        {" · "}{formatDate(message.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`mailto:${message.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      <form
                        action="/api/admin/messages"
                        method="PATCH"
                        className="inline"
                      >
                        {!message.read && (
                          <Button variant="ghost" size="icon" formAction="PATCH" type="submit">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </form>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{message.subject}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message.message}</p>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
