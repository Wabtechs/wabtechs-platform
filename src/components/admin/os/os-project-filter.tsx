"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function OsProjectFilter({
  projects,
  value,
  basePath,
}: {
  projects: { id: string; slug: string; name: string }[];
  value: string;
  basePath: string;
}) {
  const router = useRouter();

  return (
    <Select value={value} onValueChange={(v) => router.push(v === "all" ? basePath : `${basePath}?project=${v}`)}>
      <SelectTrigger className="w-[220px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les projets</SelectItem>
        {projects.map((p) => (
          <SelectItem key={p.id} value={p.slug}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
