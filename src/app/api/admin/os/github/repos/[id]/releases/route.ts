import { NextResponse } from "next/server";
import { z } from "zod";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";
import { getGitHubClient } from "@/lib/integrations/github/client";
import { listRepositoryReleases } from "@/lib/integrations/github/releases";

const querySchema = z.object({
  take: z.coerce.number().int().min(1).max(50).default(30),
});

export const GET = safeHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await params;
    const url = new URL(req.url);
    const { take } = querySchema.parse(Object.fromEntries(url.searchParams));

    const repo = await db.gitHubRepository.findUnique({ where: { id } });
    if (!repo) {
      return NextResponse.json({ error: "Repository introuvable." }, { status: 404 });
    }

    const client = await getGitHubClient();
    const releases = await listRepositoryReleases(client, repo.owner, repo.name);

    return NextResponse.json({
      releases: releases.slice(0, take).map((r) => ({
        githubId: r.id,
        tagName: r.tag_name,
        name: r.name,
        body: r.body,
        htmlUrl: r.html_url,
        draft: r.draft,
        prerelease: r.prerelease,
        publishedAt: r.published_at,
        author: r.author?.login,
        assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size })),
      })),
    });
  },
);
