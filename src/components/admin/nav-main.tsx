"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Blocks } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { isPathActive } from "@/config/navigation";
import type { NavigationItem, PlatformModule } from "@/types/navigation";

interface OsSidebarModule {
  id: string;
  name: string;
  project?: { name: string; color: string };
}

function NavItem({ item }: { item: NavigationItem }) {
  const pathname = usePathname();
  const Icon = item.icon;

  if (item.children?.length) {
    return (
      <Fragment key={item.id}>
        <li className="text-sidebar-foreground/50 flex h-8 shrink-0 items-center gap-2 px-2 text-[11px] font-semibold tracking-wider uppercase select-none group-data-[collapsible=icon]:hidden">
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span className="truncate">{item.title}</span>
        </li>
        {item.children.map((child) => (
          <NavItem key={child.id} item={child} />
        ))}
      </Fragment>
    );
  }

  const active = isPathActive(pathname, item.href);

  return (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
        <Link href={item.href}>
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {!active && item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}

function OsModules() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  if (osModules.length === 0) return null;

  const moduleId = searchParams.get("moduleId");

  return (
    <div className="mt-1">
      <SidebarSeparator className="mx-2" />
      <SidebarGroupLabel className="mt-2">Modules</SidebarGroupLabel>
      <SidebarMenu>
        {osModules.map((m) => {
          const active = pathname === "/admin/os/features" && moduleId === m.id;
          return (
            <SidebarMenuItem key={m.id}>
              <SidebarMenuButton asChild isActive={active} tooltip={m.name}>
                <Link href={`/admin/os/features?moduleId=${m.id}`}>
                  <Blocks className="h-4 w-4 shrink-0" />
                  <span>{m.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
}

export function NavMain({ activeModule }: { activeModule: PlatformModule }) {
  const showGroupLabels = activeModule.navigation.length > 1;

  return (
    <>
      {activeModule.navigation.map((group) => (
        <SidebarGroup key={group.id}>
          {showGroupLabels && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
      {activeModule.id === "project-os" && <OsModules />}
    </>
  );
}
