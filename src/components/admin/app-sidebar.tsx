"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Headphones,
  Layers,
  Users,
  Mail,
  MessageSquare,
  Settings,
  Tag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Articles", href: "/admin/posts", icon: FileText },
      { label: "Podcasts", href: "/admin/podcasts", icon: Headphones },
      { label: "Projets", href: "/admin/projects", icon: Layers },
      { label: "Tags", href: "/admin/tags", icon: Tag },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      { label: "Utilisateurs", href: "/admin/users", icon: Users },
      { label: "Abonnés", href: "/admin/subscribers", icon: Mail },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isActive = useCallback(
    (href: string) => {
      if (href === "/admin") return pathname === "/admin";
      return pathname.startsWith(href);
    },
    [pathname],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/admin"
              className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#842ae3] text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
                W
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  WabTechs
                </span>
                <span className="text-[11px] text-sidebar-foreground/60">
                  Admin
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((navItem) => {
                  const active = isActive(navItem.href);
                  return (
                    <SidebarMenuItem key={navItem.href}>
                      <Link
                        href={navItem.href}
                        className={cn(
                          "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                          "[&>svg]:size-4 [&>svg]:shrink-0",
                          "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-2",
                          active
                            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70",
                        )}
                      >
                        <navItem.icon className="h-4 w-4" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {navItem.label}
                        </span>
                      </Link>
                      {!active && navItem.badge && (
                        <SidebarMenuBadge>
                          {navItem.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#842ae3] text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
                E
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  Emmanuel
                </span>
                <span className="text-[11px] text-sidebar-foreground/60">
                  Admin
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
