"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCheck, Loader2 } from "lucide-react";

export function MarkAllReadButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function markAll() {
    setPending(true);
    try {
      const res = await fetch("/api/admin/os/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Toutes les notifications sont marquées comme lues");
      router.refresh();
    } catch {
      toast.error("Échec de la mise à jour");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button size="sm" variant="outline" className="h-8" onClick={markAll} disabled={pending}>
      {pending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="mr-1.5 h-3.5 w-3.5" />}
      Tout marquer comme lu
    </Button>
  );
}
