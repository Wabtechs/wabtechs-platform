"use client";

import { useState } from "react";
import { Mail, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  createdAt: Date;
}

export function SubscribersClient({ subscribers: initialSubs }: { subscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState(initialSubs);

  async function toggleActive(id: string, active: boolean) {
    const res = await fetch("/api/admin/subscribers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    if (res.ok) {
      setSubscribers(subscribers.map((s) => (s.id === id ? { ...s, active } : s)));
    }
  }

  async function deleteSubscriber(id: string) {
    if (!confirm("Supprimer cet abonné ?")) return;
    const res = await fetch("/api/admin/subscribers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setSubscribers(subscribers.filter((s) => s.id !== id));
  }

  return (
    <div className="mt-8 space-y-2">
      {subscribers.length === 0 ? (
        <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun abonné.
          </CardContent>
        </Card>
      ) : (
        subscribers.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.email}</p>
                {sub.name && <p className="text-xs text-muted-foreground">{sub.name}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={sub.active ? "default" : "secondary"}>
                {sub.active ? "Actif" : "Inactif"}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => toggleActive(sub.id, !sub.active)}>
                {sub.active ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteSubscriber(sub.id)} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
