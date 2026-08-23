"use client";

import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import { CommandPalette } from "./command-palette";
import { ThemeSwitch } from "./theme-switch";
import { ProfileDropdown } from "./profile-dropdown";
import { useUIStore } from "@/stores/ui-store";

export function AdminHeader() {
  const { toggleCommandPalette } = useUIStore();

  return (
    <>
      <CommandPalette />
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-gray-200/80 bg-background/80 px-4 backdrop-blur-md transition-[height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10 dark:border-border">
        <SidebarTrigger className="-ml-1 text-sidebar-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <AdminBreadcrumb />
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={toggleCommandPalette}
            className="flex h-8 items-center gap-2 rounded-md border border-gray-200/80 bg-sidebar/50 px-3 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:border-border"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Rechercher...</span>
            <kbd className="pointer-events-none hidden select-none rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground md:inline">
              ⌘K
            </kbd>
          </button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </header>
    </>
  );
}
