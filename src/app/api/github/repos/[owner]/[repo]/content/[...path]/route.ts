import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode, isAppError } from "@/lib/errors";
import { githubFetch } from "@/lib/github";

interface GitHubContent {
  name: string;
  path: string;
  size: number;
  type: string;
  encoding: string;
  content: string;
  html_url: string;
  download_url: string | null;
  message?: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner: string; repo: string; path: string[] }> },
) {
  try {
    const user = await requireAdmin();
    const { owner, repo, path } = await params;
    const url = new URL(_req.url);
    const ref = url.searchParams.get("ref");

    if (path.length === 0) {
      throw new AppError("Chemin de fichier manquant", 400, ErrorCode.BAD_REQUEST);
    }

    const connection = await db.githubConnection.findUnique({
      where: { userId: user.id as string },
    });
    if (!connection) {
      throw new AppError("Compte GitHub non connecté", 401, ErrorCode.UNAUTHORIZED);
    }

    const filePath = path.map((segment) => encodeURIComponent(segment)).join("/");
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    const data = await githubFetch<GitHubContent>(
      connection.accessToken,
      `/repos/${owner}/${repo}/contents/${filePath}${query}`,
    );

    if (data.type !== "file" || data.message) {
      throw new AppError("Ce chemin ne pointe pas vers un fichier", 400, ErrorCode.BAD_REQUEST);
    }

    const content =
      data.encoding === "base64"
        ? Buffer.from(data.content, "base64").toString("utf-8")
        : data.content;

    return NextResponse.json({
      name: data.name,
      path: data.path,
      size: data.size,
      content,
      htmlUrl: data.html_url,
      downloadUrl: data.download_url,
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
