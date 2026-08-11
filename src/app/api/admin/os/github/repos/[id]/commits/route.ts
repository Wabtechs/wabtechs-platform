import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";
import { getGitHubClient } from "@/lib/integrations/github/client";
import { listRepositoryCommits } from "@/lib/integrations/github/commits";

const querySchema = z.object({
  branch: z.string().optional(),
  since: z.string().datetime().optional(),
  take: z.coerce.number().int().min(1).max(100).default(50),
});

export const GET = safeHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await params;
    const url = new URL(req.url);
    const { branch, since, take } = querySchema.parse(Object.fromEntries(url.searchParams));

    const repo = await db.gitHubRepository.findUnique({ where: { id } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }

    const client = await getGitHubClient();
    const commits = await listRepositoryCommits(client, repo.owner, repo.name, branch, since);

    return NextResponse.json({
      commits: commits.slice(0, take).map((c) => ({
        sha: c.sha,
        message: c.commit?.message,
        authorName: c.commit?.author?.name,
        authorEmail: c.commit?.author?.email,
        authorLogin: c.author?.login,
        url: c.html_url,
        committedAt: c.commit?.author?.date,
      })),
    });
  },
);
