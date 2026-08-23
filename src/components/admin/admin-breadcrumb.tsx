"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";


interface BreadcrumbItem {
  label: string;
  href?: string;
}

const ROUTE_MAP: Record<string, string> = {
  admin: "Dashboard",
  analytics: "Analytics",
  posts: "Articles",
  podcasts: "Podcasts",
  projects: "Projets",
  tags: "Tags",
  users: "Utilisateurs",
  subscribers: "Abonnés",
  messages: "Messages",
  settings: "Paramètres",
  new: "Nouveau",
  edit: "Modifier",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = segments.map((segment, i) => {
    const isLast = i === segments.length - 1;
    const label =
      ROUTE_MAP[segment] ??
      (segment.length === 36 ? "Détail" : segment);
    const href = isLast ? undefined : `/${segments.slice(0, i + 1).join("/")}`;
    return { label, href };
  });

  if (breadcrumbs.length === 0) {
    breadcrumbs.push({ label: "Dashboard" });
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/40" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-sidebar-foreground">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
