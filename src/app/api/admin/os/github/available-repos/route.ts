import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { getGitHubClient, githubListAll } from "@/lib/integrations/github/client";
import type { GitHubRepo } from "@/lib/integrations/github/types";

const querySchema = z.object({
  search: z.string().min(2).max(100).optional(),
});

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();
  const client = await getGitHubClient();

  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  querySchema.parse({ search });

  const repos = await githubListAll<GitHubRepo>(
    client,
    `/user/repos?per_page=100&sort=updated&type=all`,
  );

  let filtered = repos;
  if (search) {
    const term = search.toLowerCase();
    filtered = repos.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.full_name.toLowerCase().includes(term) ||
        (r.description ?? "").toLowerCase().includes(term),
    );
  }

  return NextResponse.json({
    repos: filtered.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      defaultBranch: r.default_branch,
      visibility: r.visibility,
      archived: r.archived,
      owner: r.owner.login,
    })),
  });
});
