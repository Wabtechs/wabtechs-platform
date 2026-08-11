import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";
import { getGitHubClient } from "@/lib/integrations/github/client";
import { listRepositoryIssues } from "@/lib/integrations/github/issues";

const querySchema = z.object({
  state: z.enum(["open", "closed", "all"]).default("open"),
  take: z.coerce.number().int().min(1).max(100).default(50),
});

export const GET = safeHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await params;
    const url = new URL(req.url);
    const { state, take } = querySchema.parse(Object.fromEntries(url.searchParams));

    const repo = await db.gitHubRepository.findUnique({ where: { id } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }

    const client = await getGitHubClient();
    const issues = await listRepositoryIssues(client, repo.owner, repo.name, state);

    return NextResponse.json({
      issues: issues.slice(0, take).map((i) => ({
        githubId: i.id,
        number: i.number,
        title: i.title,
        body: i.body,
        state: i.state,
        htmlUrl: i.html_url,
        labels: i.labels.map((l) => l.name),
        assignees: i.assignees.map((a) => a.login),
        author: i.user?.login,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
        closedAt: i.closed_at,
      })),
    });
  },
);
