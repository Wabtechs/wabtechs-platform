"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const OPTIONS = ["PLANNING", "ACTIVE", "PAUSED", "MAINTENANCE", "ARCHIVED"];

export function ProjectStatusSelect({ slug, value }: { slug: string; value: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onChange(next: string) {
    if (next === value) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/os/projects/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      toast.success("Statut mis à jour");
      router.refresh();
    } catch {
      toast.error("Échec de la mise à jour");
    } finally {
      setPending(false);
    }
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={pending}>
      <SelectTrigger className="h-8 w-[160px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o} value={o}>
            {o.charAt(0) + o.slice(1).toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
