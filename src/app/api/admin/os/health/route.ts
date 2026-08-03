import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const projects = await db.osProject.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { features: true, bugs: true } },
      modules: { select: { name: true, status: true, progress: true, testCoverage: true, security: true, performance: true, accessibility: true, maintainability: true, technicalDebt: true } },
    },
  });

  return NextResponse.json(projects);
});