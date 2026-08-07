"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { isPathActive, SYSTEM_NAV } from "@/config/navigation";

export function NavSecondary() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>{SYSTEM_NAV.title}</SidebarGroupLabel>
      <SidebarMenu>
        {SYSTEM_NAV.items.map((item) => {
          const active = isPathActive(pathname, item.href);
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                <Link href={item.href}>
                  {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {!active && item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
