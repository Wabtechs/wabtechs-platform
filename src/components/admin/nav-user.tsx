"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { logoutAction } from "@/app/actions/auth";

export interface SidebarUser {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  MODERATOR: "Modérateur",
  USER: "Utilisateur",
};

export function NavUser({ user }: { user?: SidebarUser }) {
  const router = useRouter();
  const name = user?.name ?? "Admin";
  const email = user?.email ?? "";
  const roleLabel = ROLE_LABELS[user?.role ?? ""] ?? "Admin";
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip={name}
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="bg-primary text-[11px] font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sidebar-foreground truncate font-semibold">{name}</span>
                <span className="text-sidebar-foreground/50 text-xs">{roleLabel}</span>
              </div>
              <ChevronsUpDown className="ml-auto shrink-0 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="w-48 rounded-lg">
            <DropdownMenuLabel className="flex flex-col gap-1 p-2 text-sm">
              <span className="font-semibold">{name}</span>
              <span className="text-muted-foreground text-xs">{email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutAction()}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
