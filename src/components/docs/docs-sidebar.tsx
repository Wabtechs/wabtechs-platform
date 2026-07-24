"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocItem {
  title: string;
  href: string;
  order: number;
}

const DOCS_NAV: DocItem[] = [
  { title: "Getting Started", href: "/docs/getting-started", order: 1 },
  { title: "Architecture", href: "/docs/architecture", order: 2 },
  { title: "API Reference", href: "/docs/api-reference", order: 3 },
  { title: "Guides", href: "/docs/guides", order: 4 },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <nav className="space-y-1">
        {DOCS_NAV.sort((a, b) => a.order - b.order).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
}
