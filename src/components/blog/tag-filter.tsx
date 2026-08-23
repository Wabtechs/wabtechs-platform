"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: { tag: string; count: number }[];
  selectedTag: string | null;
  onSelect: (tag: string | null) => void;
}

export function TagFilter({ tags, selectedTag, onSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selectedTag === null ? "default" : "outline"}
        className={cn("cursor-pointer transition-colors", selectedTag === null && "bg-primary text-primary-foreground")}
        onClick={() => onSelect(null)}
      >
        Tous
      </Badge>
      {tags.map((t) => (
        <Badge
          key={t.tag}
          variant={selectedTag === t.tag ? "default" : "outline"}
          className={cn("cursor-pointer transition-colors", selectedTag === t.tag && "bg-primary text-primary-foreground")}
          onClick={() => onSelect(selectedTag === t.tag ? null : t.tag)}
        >
          {t.tag} ({t.count})
        </Badge>
      ))}
    </div>
  );
}
