import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FileText, Headphones, Layers, Users, Mail, MessageSquare, Settings, BarChart3, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Articles", href: "/admin/posts", icon: FileText },
  { label: "Podcasts", href: "/admin/podcasts", icon: Headphones },
  { label: "Projets", href: "/admin/projects", icon: Layers },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Newsletter", href: "/admin/subscribers", icon: Mail },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen pt-16">
      <aside className="hidden w-56 border-r border-white/10 bg-[#131313] lg:block">
        <div className="sticky top-16 flex flex-col gap-1 p-4">
          <div className="mb-4 flex items-center gap-2 px-3">
            <BarChart3 className="h-5 w-5 text-[#842ae3]" />
            <span className="text-sm font-semibold text-white">Administration</span>
          </div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
