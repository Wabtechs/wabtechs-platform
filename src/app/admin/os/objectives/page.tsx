import type { Metadata } from "next";
import Link from "next/link";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { Target } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Objectifs" };
export const dynamic = "force-dynamic";

export default async function OsObjectivesPage() {
  return (
    <div>
      <OsPageHeader
        title="Objectifs"
        description="OKR & objectifs produits"
        icon={<Target className="h-5 w-5" />}
      />
      <OsEmpty
        title="Pas d'équivalent GitHub"
        hint="Les objectifs OKR/SMART ne sont pas gérés sur GitHub. Le suivi produit s'appuie sur les issues, pull requests et releases."
      />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link
          href="/admin/os/roadmap"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Voir la roadmap
        </Link>
        <Link
          href="/admin/os/kpi"
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Voir les KPI
        </Link>
      </div>
    </div>
  );
}
