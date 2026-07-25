"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
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

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const isActive = useCallback(
    (href: string) => {
      if (href === "/admin") return pathname === "/admin";
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const toggleGroup = useCallback((title: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }, []);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-gray-100 px-4 transition-all duration-300 dark:border-white/[0.06]",
          collapsed ? "justify-center" : "gap-2.5",
        )}
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#842ae3] shadow-sm shadow-[#842ae3]/20">
          <span className="text-[11px] font-bold text-white">W</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold tracking-tight text-gray-900 dark:text-white">
              WabTechs
            </span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Admin
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const isCollapsed = collapsedGroups.has(group.title);
          return (
            <div key={group.title} className="mb-5">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="mb-1.5 flex w-full items-center justify-between px-2.5 py-1"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
                    {group.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-gray-400 transition-transform duration-200",
                      isCollapsed && "-rotate-90",
                    )}
                  />
                </button>
              )}

              <AnimatePresence initial={false}>
                {(!collapsed || true) && (
                  <motion.div
                    initial={false}
                    animate={{ height: isCollapsed && !collapsed ? 0 : "auto", opacity: isCollapsed && !collapsed ? 0 : 1 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-[1px]">
                      {group.items.map((navItem) => {
                        const active = isActive(navItem.href);
                        return (
                          <Link
                            key={navItem.href}
                            href={navItem.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "group relative flex items-center rounded-lg transition-all duration-200",
                              collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-2.5 py-2",
                              active
                                ? "bg-[#842ae3]/[0.08] text-[#842ae3] dark:bg-[#842ae3]/[0.12]"
                                : "text-gray-500 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.04] dark:hover:text-white",
                            )}
                            title={collapsed ? navItem.label : undefined}
                          >
                            {active && (
                              <motion.div
                                layoutId="sidebar-active"
                                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#842ae3]"
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                              />
                            )}
                            <navItem.icon
                              className={cn(
                                "h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200",
                                active
                                  ? "text-[#842ae3]"
                                  : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                              )}
                            />
                            {!collapsed && (
                              <span className="flex-1 text-[13px] font-medium">
                                {navItem.label}
                              </span>
                            )}
                            {!collapsed && navItem.badge && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#842ae3]/10 px-1.5 text-[10px] font-semibold text-[#842ae3]">
                                {navItem.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!collapsed && (
        <div className="hidden border-t border-gray-100 px-3 py-3 lg:block dark:border-white/[0.06]">
          <button
            onClick={() => setCollapsed(true)}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
          >
            <PanelLeftClose className="h-4 w-4" />
            <span>Réduire</span>
          </button>
        </div>
      )}

      {collapsed && (
        <div className="hidden border-t border-gray-100 px-3 py-3 lg:block dark:border-white/[0.06]">
          <button
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-center rounded-lg px-2 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* User */}
      <div className="border-t border-gray-100 px-3 py-3 dark:border-white/[0.06]">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-gray-100/80 dark:hover:bg-white/[0.04]",
            collapsed ? "justify-center" : "gap-2.5",
          )}
        >
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#842ae3] text-[11px] font-bold text-white shadow-sm shadow-[#842ae3]/20">
            E
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[12px] font-medium text-gray-900 dark:text-white">
                Emmanuel
              </p>
              <p className="text-[10px] text-gray-400">Admin</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-20 z-40 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-gray-50 lg:hidden dark:border-white/10 dark:bg-[#111]/80 dark:hover:bg-[#1a1a1a]"
      >
        <Menu className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col lg:border-r lg:border-gray-100/80 lg:bg-white/50 lg:pt-16 lg:transition-all lg:duration-300",
          "dark:lg:border-white/[0.06] dark:lg:bg-[#0a0a0a]/80",
          collapsed ? "lg:w-[68px]" : "lg:w-[240px]",
        )}
      >
        <div className="flex-1 backdrop-blur-xl">{sidebarContent}</div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-gray-100 bg-white pt-16 dark:border-white/[0.06] dark:bg-[#0a0a0a]"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
