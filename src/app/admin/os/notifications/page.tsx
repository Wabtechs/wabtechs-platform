import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { MarkAllReadButton } from "./mark-all-read";
import { fmtDateTime } from "@/lib/os-utils";
import { Bell, Rocket, Bug, CalendarClock, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Notifications" };
export const dynamic = "force-dynamic";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  RELEASE: <Rocket className="h-3.5 w-3.5 text-emerald-500" />,
  BUG: <Bug className="h-3.5 w-3.5 text-rose-500" />,
  SPRINT: <CalendarClock className="h-3.5 w-3.5 text-blue-500" />,
  AI: <Sparkles className="h-3.5 w-3.5 text-primary" />,
};

export default async function OsNotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="Notifications"
        description={`${unread} non lue${unread > 1 ? "s" : ""} · ${notifications.length} notifications au total`}
        icon={<Bell className="h-5 w-5" />}
      >
        {unread > 0 && <MarkAllReadButton />}
      </OsPageHeader>

      {notifications.length === 0 ? (
        <OsEmpty title="Aucune notification" hint="Les notifications apparaîtront ici : releases, bugs critiques, alertes IA…" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-xl border border-gray-200/80 bg-white px-5 py-4 dark:border-border dark:bg-card ${!n.read ? "border-l-2 border-l-primary" : "opacity-60"}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5">
                {TYPE_ICONS[n.type] ?? <Bell className="h-3.5 w-3.5 text-gray-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[14px] font-medium">{n.title}</p>
                  <p className="text-[11px] text-gray-400">{fmtDateTime(n.createdAt)}</p>
                </div>
                {n.content && <p className="mt-0.5 text-[12px] text-gray-500 dark:text-gray-400">{n.content}</p>}
              </div>
              {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
