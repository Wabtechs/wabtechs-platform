import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/admin-header";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { NavigationProgress } from "@/components/admin/navigation-progress";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const session = await auth();
	if (!session?.user) redirect("/login?callbackUrl=/admin");

	const user = await db.user.findUnique({
		where: { email: session.user.email ?? "" },
		select: { role: true },
	});

	if (user?.role !== "ADMIN") redirect("/");
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
