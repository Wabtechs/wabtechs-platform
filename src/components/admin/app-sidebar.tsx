"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ModuleSwitcher } from "./module-switcher";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser, type SidebarUser } from "./nav-user";
import { useActiveModule } from "@/hooks/use-active-module";
import { SYSTEM_MODULE_ID } from "@/config/navigation";
import type { UserRole } from "@/types/navigation";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: SidebarUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { activeModule, modules, setActiveModule } = useActiveModule(
    user?.role as UserRole | undefined,
  );
  const showSystemNav = activeModule.id !== SYSTEM_MODULE_ID;

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
        <ModuleSwitcher
          activeModule={activeModule}
          modules={modules}
          onSelectModule={setActiveModule}
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMain activeModule={activeModule} />
        {showSystemNav && <NavSecondary />}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
