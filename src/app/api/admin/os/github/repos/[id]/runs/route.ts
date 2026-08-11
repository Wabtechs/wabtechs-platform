import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";
import { getGitHubClient } from "@/lib/integrations/github/client";
import { listRepositoryWorkflowRuns } from "@/lib/integrations/github/actions";

const querySchema = z.object({
  branch: z.string().optional(),
  take: z.coerce.number().int().min(1).max(50).default(30),
});

export const GET = safeHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await params;
    const url = new URL(req.url);
    const { branch, take } = querySchema.parse(Object.fromEntries(url.searchParams));

    const repo = await db.gitHubRepository.findUnique({ where: { id } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }

    const client = await getGitHubClient();
    const runs = await listRepositoryWorkflowRuns(client, repo.owner, repo.name, branch, take);

    return NextResponse.json({
      workflowRuns: runs.map((r) => ({
        githubId: r.id,
        runNumber: r.run_number,
        name: r.name,
        workflowId: r.workflow_id,
        branch: r.head_branch,
        headSha: r.head_sha,
        status: r.status,
        conclusion: r.conclusion,
        htmlUrl: r.html_url,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    });
  },
);
