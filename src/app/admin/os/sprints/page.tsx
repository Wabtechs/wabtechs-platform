import type { Metadata } from "next";
import Link from "next/link";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { CalendarCheck } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Sprints" };
export const dynamic = "force-dynamic";

export default async function OsSprintsPage() {
  return (
    <div>
      <OsPageHeader
        title="Sprints"
        description="Itérations de développement"
        icon={<CalendarCheck className="h-5 w-5" />}
      />
      <OsEmpty
        title="Pas d'équivalent GitHub"
        hint="Les sprints n'existent pas dans les données GitHub. Les itérations sont pilotées via les pull requests et les issues ouvertes."
      />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link
          href="/admin/os/features"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Voir les features (PRs)
        </Link>
        <Link
          href="/admin/os/roadmap"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Voir la roadmap
        </Link>
      </div>
    </div>
  );
}
