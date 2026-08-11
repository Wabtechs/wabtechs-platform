import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { linkRepository } from "@/lib/integrations/github/repositories";

const bodySchema = z.object({
  owner: z.string().min(1),
  name: z.string().min(1),
  projectId: z.string().min(1).nullable().optional(),
});

export const POST = safeHandler(async (req: Request) => {
  await requireAdmin();
  const body = await req.json();
  const { owner, name, projectId } = bodySchema.parse(body);
  const repo = await linkRepository({ owner, name, projectId });
  return NextResponse.json(
    {
      id: repo.id,
      githubId: repo.githubId,
      fullName: repo.fullName,
      url: repo.url,
      defaultBranch: repo.defaultBranch,
      visibility: repo.visibility,
      language: repo.language,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: repo.openIssues,
      archived: repo.archived,
      lastSyncAt: repo.lastSyncAt,
      projectId: repo.projectId,
    },
    { status: 201 },
  );
});
