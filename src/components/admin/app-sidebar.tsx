"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
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
  Building2,
  CheckSquare,
  AppWindow,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  LogIn,
  UserPlus,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldOff,
  AlertTriangle,
  ServerCrash,
  CloudOff,
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

interface SubItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CollapsibleGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SubItem[];
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
    title: "PRODUCTIVITY",
    items: [
      { label: "Tasks", href: "/admin/tasks", icon: CheckSquare, badge: "12" },
      { label: "Apps", href: "/admin/apps", icon: AppWindow },
      { label: "Chats", href: "/admin/chats", icon: MessageCircle, badge: "3" },
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
      { label: "Help Center", href: "/admin/help", icon: HelpCircle, badge: "Coming Soon" },
    ],
  },
];

const PAGES_GROUPS: CollapsibleGroup[] = [
  {
    label: "Auth",
    icon: Lock,
    items: [
      { label: "Sign In", href: "/auth/sign-in", icon: LogIn },
      { label: "Sign Up", href: "/auth/sign-up", icon: UserPlus },
      { label: "Reset Password", href: "/auth/reset-password", icon: KeyRound },
      { label: "Forgot Password", href: "/auth/forgot-password", icon: Lock },
    ],
  },
  {
    label: "Errors",
    icon: ShieldAlert,
    items: [
      { label: "401", href: "/errors/401", icon: ShieldAlert },
      { label: "403", href: "/errors/403", icon: ShieldOff },
      { label: "404", href: "/errors/404", icon: AlertTriangle },
      { label: "500", href: "/errors/500", icon: ServerCrash },
      { label: "503", href: "/errors/503", icon: CloudOff },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = useCallback(
    (href: string) => {
      if (href === "/admin") return pathname === "/admin";
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/admin"
              className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  WabTechs Admin
                </span>
                <span className="text-[11px] text-sidebar-foreground/60">
                  Organisation
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

        <SidebarGroup>
          <SidebarGroupLabel>PAGES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PAGES_GROUPS.map((group) => {
                const isExpanded = openGroups[group.label] ?? false;
                return (
                  <SidebarMenuItem key={group.label}>
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className={cn(
                        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                        "[&>svg]:size-4 [&>svg]:shrink-0",
                        "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-2",
                        "text-sidebar-foreground/70",
                      )}
                    >
                      <group.icon className="h-4 w-4" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {group.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 border-l pl-2 group-data-[collapsible=icon]:hidden">
                        <SidebarMenu>
                          {group.items.map((subItem) => {
                            const active = isActive(subItem.href);
                            return (
                              <SidebarMenuItem key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none transition-colors",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                    "[&>svg]:size-4 [&>svg]:shrink-0",
                                    active
                                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                      : "text-sidebar-foreground/70",
                                  )}
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  <span className="truncate">
                                    {subItem.label}
                                  </span>
                                </Link>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
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
