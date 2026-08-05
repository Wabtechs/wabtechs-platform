"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Headphones,
  Layers,
  Tag,
  CheckSquare,
  AppWindow,
  MessageCircle,
  Users,
  Mail,
  MessageSquare,
  Settings,
  Briefcase,
  Zap,
  DollarSign,
  Building2,
  HelpCircle,
  Video,
  BookOpen,
  Code2,
  Bookmark,
  Download,
  Map,
  Calendar,
  GitCompare,
  Star,
  GraduationCap,
  PlayCircle,
  FileCode2,
  Boxes,
  KanbanSquare,
  Bug,
  CalendarCheck,
  Target,
  Blocks,
  TrendingUp,
  Wallet,
  HeartPulse,
  Sparkles,
  FileBarChart,
  Bell,
  ScrollText,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  useSidebar,
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

interface OsSidebarModule {
  id: string;
  name: string;
  project?: { name: string; color: string };
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
    title: "PROJECT OS",
    items: [
      { label: "Dashboard", href: "/admin/os", icon: Boxes },
      { label: "Projets", href: "/admin/os/projects", icon: Layers },
      { label: "Features", href: "/admin/os/features", icon: KanbanSquare },
      { label: "Bugs", href: "/admin/os/bugs", icon: Bug },
      { label: "Roadmap", href: "/admin/os/roadmap", icon: Map },
      { label: "Sprints", href: "/admin/os/sprints", icon: CalendarCheck },
      { label: "Objectifs", href: "/admin/os/objectives", icon: Target },
      { label: "Modules", href: "/admin/os/modules", icon: Blocks },
      { label: "KPI", href: "/admin/os/kpi", icon: TrendingUp },
      { label: "Business", href: "/admin/os/business", icon: Wallet },
      { label: "Santé", href: "/admin/os/health", icon: HeartPulse },
      { label: "IA", href: "/admin/os/ai", icon: Sparkles },
      { label: "Rapports", href: "/admin/os/reports", icon: FileBarChart },
      { label: "Notifications", href: "/admin/os/notifications", icon: Bell },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Articles", href: "/admin/posts", icon: FileText },
      { label: "Podcasts", href: "/admin/podcasts", icon: Headphones },
      { label: "Projets", href: "/admin/projects", icon: Layers },
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Vidéos", href: "/admin/videos", icon: Video },
      { label: "Tutoriels", href: "/admin/tutorials", icon: BookOpen },
      { label: "Snippets", href: "/admin/snippets", icon: Code2 },
      { label: "Tags", href: "/admin/tags", icon: Tag },
      { label: "Cours — Academy", href: "/admin/courses", icon: GraduationCap },
      { label: "Leçons", href: "/admin/lessons", icon: PlayCircle },
      { label: "Templates", href: "/admin/templates", icon: FileCode2 },
    ],
  },
  {
    title: "SECTIONS SITE",
    items: [
      { label: "Services", href: "/admin/services", icon: Briefcase },
      { label: "Compétences", href: "/admin/skills", icon: Zap },
      { label: "Expériences", href: "/admin/resume-items", icon: Briefcase },
      { label: "Forfaits", href: "/admin/pricing-plans", icon: DollarSign },
      { label: "Témoignages", href: "/admin/testimonials", icon: Star },
      { label: "Clients", href: "/admin/clients", icon: Building2 },
      { label: "FAQ", href: "/admin/faq-items", icon: HelpCircle },
    ],
  },
  {
    title: "RESSOURCES",
    items: [
      { label: "Ressources", href: "/admin/resources", icon: Bookmark },
      { label: "Téléchargements", href: "/admin/downloads", icon: Download },
      { label: "Roadmaps", href: "/admin/roadmaps", icon: Map },
      { label: "Événements", href: "/admin/events", icon: Calendar },
      { label: "Changelog", href: "/admin/changelogs", icon: GitCompare },
    ],
  },
  {
    title: "PRODUCTIVITY",
    items: [
      { label: "Tâches", href: "/admin/tasks", icon: CheckSquare },
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
      { label: "Journal d'audit", href: "/admin/audit", icon: ScrollText },
    ],
  },
  {
    title: "MOBILE",
    items: [
      { label: "Mobile Center", href: "/admin/mobile", icon: Smartphone },
      { label: "Applications", href: "/admin/mobile/apps", icon: AppWindow },
      { label: "Builds", href: "/admin/mobile/builds", icon: Boxes },
      { label: "Releases", href: "/admin/mobile/releases", icon: GitCompare },
      { label: "Certificats", href: "/admin/mobile/certificates", icon: Star },
      { label: "Paramètres", href: "/admin/mobile/settings", icon: Settings },
    ],
  },
];

const STORAGE_KEY = "admin-sidebar:collapsed-groups";

function getStoredCollapsed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state: sidebarState } = useSidebar();
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>(getStoredCollapsed);
  const [osModules, setOsModules] = useState<OsSidebarModule[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/os/modules")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return;
        const list = data as OsSidebarModule[];
        setOsModules(
          [...list].sort(
            (a, b) =>
              (a.project?.name ?? "").localeCompare(b.project?.name ?? "") ||
              a.name.localeCompare(b.name),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setOsModules([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/admin") return pathname === "/admin";
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const activeGroupTitle = NAV_GROUPS.find((group) =>
    group.items.some((item) => isActive(item.href)),
  )?.title;

  const moduleId = searchParams.get("moduleId");

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (activeGroupTitle) {
      setCollapsedGroups((prev) =>
        prev.includes(activeGroupTitle) ? prev.filter((title) => title !== activeGroupTitle) : prev,
      );
    }
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsedGroups));
    } catch {
      // ignore
    }
  }, [collapsedGroups]);

  const setGroupOpen = useCallback((title: string, open: boolean) => {
    setCollapsedGroups((prev) =>
      open ? prev.filter((t) => t !== title) : prev.includes(title) ? prev : [...prev, title],
    );
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/admin"
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm transition-colors outline-none group-data-[collapsible=icon]:justify-center"
            >
              <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
                W
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sidebar-foreground text-sm font-semibold">Wabtechs</span>
                <span className="text-sidebar-foreground/60 text-[11px]">Admin</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => {
          const collapsed = sidebarState !== "collapsed" && collapsedGroups.includes(group.title);
          return (
            <Collapsible
              key={group.title}
              open={!collapsed}
              onOpenChange={(open) => setGroupOpen(group.title, open)}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="hover:text-sidebar-foreground/80 w-full cursor-pointer select-none"
                >
                  <CollapsibleTrigger className="flex items-center gap-2">
                    {group.title}
                    <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((navItem) => {
                        const active = isActive(navItem.href);
                        return (
                          <SidebarMenuItem key={navItem.href}>
                            <Link
                              href={navItem.href}
                              className={cn(
                                "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm transition-colors outline-none",
                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                "focus-visible:ring-sidebar-ring focus-visible:ring-2",
                                "[&>svg]:size-4 [&>svg]:shrink-0",
                                "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-2",
                                active
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-sidebar-foreground/70",
                              )}
                            >
                              <navItem.icon className="h-4 w-4" />
                              <span className="truncate group-data-[collapsible=icon]:hidden">
                                {navItem.label}
                              </span>
                            </Link>
                            {!active && navItem.badge && (
                              <SidebarMenuBadge>{navItem.badge}</SidebarMenuBadge>
                            )}
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                    {group.title === "PROJECT OS" && osModules.length > 0 && (
                      <div className="mt-1">
                        <SidebarSeparator className="mx-2" />
                        <SidebarGroupLabel className="mt-2">Modules</SidebarGroupLabel>
                        <SidebarMenu>
                          {osModules.map((m) => {
                            const active = pathname === "/admin/os/features" && moduleId === m.id;
                            return (
                              <SidebarMenuItem key={m.id}>
                                <Link
                                  href={`/admin/os/features?moduleId=${m.id}`}
                                  className={cn(
                                    "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm transition-colors outline-none",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    "focus-visible:ring-sidebar-ring focus-visible:ring-2",
                                    "[&>svg]:size-4 [&>svg]:shrink-0",
                                    "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-2",
                                    active
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                      : "text-sidebar-foreground/70",
                                  )}
                                >
                                  <Blocks className="h-4 w-4" />
                                  <span className="truncate group-data-[collapsible=icon]:hidden">
                                    {m.name}
                                  </span>
                                </Link>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </div>
                    )}
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/admin"
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm transition-colors outline-none group-data-[collapsible=icon]:justify-center"
            >
              <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
                E
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sidebar-foreground text-sm font-semibold">Emmanuel</span>
                <span className="text-sidebar-foreground/60 text-[11px]">Admin</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
