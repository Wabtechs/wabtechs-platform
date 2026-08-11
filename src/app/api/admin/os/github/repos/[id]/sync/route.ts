import { NextResponse } from "next/server";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";
import { getGitHubClient } from "@/lib/integrations/github/client";
import { syncRepository } from "@/lib/integrations/github/sync";

export const POST = safeHandler(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await params;

    const repo = await db.gitHubRepository.findUnique({ where: { id } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }

    const client = await getGitHubClient();
    const result = await syncRepository(client, `${repo.owner}/${repo.name}`);

    return NextResponse.json({ status: "done", result });
  },
);
