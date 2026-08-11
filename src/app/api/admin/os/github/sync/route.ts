import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { getGitHubClient } from "@/lib/integrations/github/client";
import { syncRepository, syncAll } from "@/lib/integrations/github/sync";
import { db } from "@/lib/prisma";

const idParamSchema = z.object({ id: z.string().min(1) });

export const POST = safeHandler(async (req: Request) => {
  await requireAdmin();
  const client = await getGitHubClient();

  let body = {} as { repositoryId?: string };
  try {
    body = (await req.json()) as { repositoryId?: string };
  } catch {
    body = {};
  }

  if (body.repositoryId) {
    const parsed = idParamSchema.safeParse({ id: body.repositoryId });
    if (!parsed.success) {
      return NextResponse.json({ error: "repositoryId invalide." }, { status: 400 });
    }
    const repo = await db.gitHubRepository.findUnique({ where: { id: body.repositoryId } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }
    const result = await syncRepository(client, `${repo.owner}/${repo.name}`);
    return NextResponse.json({ status: "done", result });
  }

  const summary = await syncAll(client);
  return NextResponse.json({ status: "done", summary });
});
