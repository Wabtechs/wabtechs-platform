import type { Metadata } from "next";
import Link from "next/link";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { Blocks } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Modules" };
export const dynamic = "force-dynamic";

export default async function OsModulesPage() {
  return (
    <div>
      <OsPageHeader
        title="Modules"
        description="Découpage applicatif"
        icon={<Blocks className="h-5 w-5" />}
      />
      <OsEmpty
        title="Pas d'équivalent GitHub"
        hint="Le découpage en modules n'est pas représenté dans les données GitHub. Suivez l'architecture via les dépôts, issues et pull requests."
      />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link
          href="/admin/os/projects"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Voir les dépôts
        </Link>
        <Link
          href="/admin/os/features"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Voir les features (PRs)
        </Link>
      </div>
    </div>
  );
}
