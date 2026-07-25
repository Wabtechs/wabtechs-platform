"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DocMeta } from "@/lib/mdx";

interface DocsSidebarProps {
  docs: DocMeta[];
}

export function DocsSidebar({ docs }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <nav className="space-y-1">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === `/docs/${doc.slug}`
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            {doc.title}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
}
