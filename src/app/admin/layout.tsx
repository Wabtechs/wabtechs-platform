import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { NavigationProgress } from "@/components/admin/navigation-progress";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/login");

  return (
    <SidebarProvider>
      <NavigationProgress />
      <AppSidebar />
      <SidebarInset className="bg-muted/50 dark:bg-background">
        <AdminHeader />
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
