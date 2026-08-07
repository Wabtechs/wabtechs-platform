"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { PlatformModule } from "@/types/navigation";

interface ModuleSwitcherProps {
  activeModule: PlatformModule;
  modules: PlatformModule[];
  onSelectModule: (id: string) => void;
}

export function ModuleSwitcher({ activeModule, modules, onSelectModule }: ModuleSwitcherProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip={activeModule.name}
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeModule.icon className="size-4 shrink-0" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sidebar-foreground truncate font-semibold">
                  {activeModule.name}
                </span>
                <span className="text-sidebar-foreground/50 text-xs">Module</span>
              </div>
              <ChevronsUpDown className="ml-auto shrink-0 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Modules</DropdownMenuLabel>
            {modules.map((module) => {
              const isActiveModule = module.id === activeModule.id;
              return (
                <DropdownMenuItem
                  key={module.id}
                  onClick={() => {
                    onSelectModule(module.id);
                    if (isMobile) setOpenMobile(false);
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-sm border">
                    <module.icon className="size-4 shrink-0" />
                  </div>
                  {module.name}
                  {isActiveModule && <Check className="ml-auto size-4 shrink-0" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
