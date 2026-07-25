"use client";

import { useState } from "react";
import { Mail, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export function MessagesClient({ messages: initialMessages }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);

  async function markRead(id: string) {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    if (res.ok) {
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    const res = await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setMessages(messages.filter((m) => m.id !== id));
  }

  return (
    <div className="mt-8 space-y-3">
      {messages.length === 0 ? (
        <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun message.
          </CardContent>
        </Card>
      ) : (
        messages.map((msg) => (
          <Card key={msg.id} className={`border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F] ${msg.read ? "" : "border-l-4 border-l-primary"}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base text-gray-900 dark:text-white">{msg.name}</CardTitle>
                    {!msg.read && <Badge variant="destructive" className="text-xs">Nouveau</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                    {" · "}{formatDate(msg.createdAt)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`mailto:${msg.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                  {!msg.read && (
                    <Button variant="ghost" size="icon" onClick={() => markRead(msg.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteMessage(msg.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{msg.subject}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}
