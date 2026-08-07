import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cacheGet, cacheSet } from "@/lib/cache";
import { findDuplicateBugs, findDuplicatePairs } from "@/lib/bug-dedup";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const bugId = url.searchParams.get("bugId");
  const all = url.searchParams.get("all") === "true";
  const cacheKey = bugId ? `duplicates:${bugId}` : "duplicates:all";

  const cached = await cacheGet<unknown>(cacheKey);
  if (cached) return NextResponse.json(cached);

  if (bugId) {
    const bug = await db.bug.findUnique({
      where: { id: bugId },
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        status: true,
        projectId: true,
        project: { select: { slug: true, name: true, color: true } },
      },
    });
    if (!bug) return NextResponse.json({ duplicates: [] });

    const duplicates = await findDuplicateBugs(bug);
    const result = { duplicates, checkedAt: new Date().toISOString() };
    await cacheSet(cacheKey, result, 60);
    return NextResponse.json(result);
  }

  if (all) {
    const pairs = await findDuplicatePairs();
    const result = { pairs, checkedAt: new Date().toISOString() };
    await cacheSet(cacheKey, result, 120);
    return NextResponse.json(result);
  }

  return NextResponse.json({ duplicates: [], pairs: [] });
}
