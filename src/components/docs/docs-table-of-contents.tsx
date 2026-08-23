"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function DocsTableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState("");

  const headings = useMemo(() => {
    const regex = /^(#{1,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1]!.length;
      const text = match[2]!;
      const id = text.toLowerCase().replace(/\s+/g, "-");
      items.push({ id, text, level });
    }
    return items;
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block">
      <div className="sticky top-24">
        <h4 className="mb-4 text-sm font-semibold">Sur cette page</h4>
        <ul className="space-y-2 text-sm">
          {headings.map((h) => (
            <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
              <a
                href={`#${h.id}`}
                className={cn(
                  "block transition-colors hover:text-foreground",
                  activeId === h.id ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
