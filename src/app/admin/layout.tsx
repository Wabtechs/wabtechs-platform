import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { NavigationProgress } from "@/components/admin/navigation-progress";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<SidebarProvider>
			<NavigationProgress />
			<AppSidebar />
			<SidebarInset>
				<AdminHeader />
				<div className="flex-1 overflow-auto">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
