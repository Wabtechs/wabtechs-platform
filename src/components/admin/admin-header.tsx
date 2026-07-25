"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "./admin-breadcrumb";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b border-sidebar-border bg-background/80 px-4 backdrop-blur-md transition-[height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
      <SidebarTrigger className="-ml-1 text-sidebar-foreground" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <AdminBreadcrumb />
    </header>
  );
}
