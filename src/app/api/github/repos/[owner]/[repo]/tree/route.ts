import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode } from "@/lib/errors";
import { githubFetch } from "@/lib/github";
import { safeHandler } from "@/lib/safe-handler";

interface GitHubTree {
  sha: string;
  truncated: boolean;
  tree: Array<{ path: string; mode: string; type: string; size?: number; url: string }>;
}

interface GitHubRepoDetail {
  default_branch: string;
}

export const GET = safeHandler(
  async (req: Request, { params }: { params: Promise<{ owner: string; repo: string }> }) => {
    const user = await requireAdmin();
    const { owner, repo } = await params;
    const url = new URL(req.url);
    const branch = url.searchParams.get("branch");

    const connection = await db.githubConnection.findUnique({
      where: { userId: user.id as string },
    });
    if (!connection) {
      throw new AppError("Votre compte GitHub n’est pas connecté.", 401, ErrorCode.UNAUTHORIZED);
    }

    const token = connection.accessToken;
    const base = `/repos/${owner}/${repo}`;

    let defaultBranch = branch ?? null;
    if (!defaultBranch) {
      const detail = await githubFetch<GitHubRepoDetail>(token, base);
      defaultBranch = detail.default_branch;
    }
    if (!defaultBranch) {
      throw new AppError("La branche demandée est introuvable.", 404, ErrorCode.NOT_FOUND);
    }

    const tree = await githubFetch<GitHubTree>(
      token,
      `${base}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`,
    );

    const files = tree.tree
      .filter((entry) => entry.type === "blob")
      .map((entry) => ({ path: entry.path, size: entry.size ?? 0 }));

    return NextResponse.json({
      sha: tree.sha,
      truncated: tree.truncated,
      defaultBranch,
      files,
    });
  },
);
