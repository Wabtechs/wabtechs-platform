import type { Metadata } from "next";
import { Github } from "lucide-react";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { GithubOsClient } from "./github-os-client";

export const metadata: Metadata = { title: "Project OS — GitHub" };
export const dynamic = "force-dynamic";

export default function OsGithubPage() {
  return (
    <div className="space-y-6">
      <OsPageHeader
        title="GitHub"
        description="Dépôts, issues, pull requests, releases et CI synchronisés avec Project OS"
        icon={<Github className="h-5 w-5" />}
        accent="text-[#6e40c9]"
      />
      <GithubOsClient />
    </div>
  );
}
