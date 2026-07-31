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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
                W
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  Wabtechs
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
              href="/admin"
              className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
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
