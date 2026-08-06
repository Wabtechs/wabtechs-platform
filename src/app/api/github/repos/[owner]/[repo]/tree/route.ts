import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode, isAppError } from "@/lib/errors";
import { githubFetch } from "@/lib/github";

interface GitHubTree {
  sha: string;
  truncated: boolean;
  tree: Array<{ path: string; mode: string; type: string; size?: number; url: string }>;
}

interface GitHubRepoDetail {
  default_branch: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  try {
    const user = await requireAdmin();
    const { owner, repo } = await params;
    const url = new URL(_req.url);
    const branch = url.searchParams.get("branch");

    const connection = await db.githubConnection.findUnique({
      where: { userId: user.id as string },
    });
    if (!connection) {
      throw new AppError("Compte GitHub non connecté", 401, ErrorCode.UNAUTHORIZED);
    }

    const token = connection.accessToken;
    const base = `/repos/${owner}/${repo}`;

    let defaultBranch = branch ?? null;
    if (!defaultBranch) {
      const detail = await githubFetch<GitHubRepoDetail>(token, base);
      defaultBranch = detail.default_branch;
    }
    if (!defaultBranch) {
      throw new AppError("Branche du dépôt introuvable", 404, ErrorCode.NOT_FOUND);
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
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status, headers: error.headers },
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
