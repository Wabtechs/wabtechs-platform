import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const projects = await db.osProject.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { features: true, bugs: true } },
        modules: { select: { name: true, status: true, progress: true, testCoverage: true, security: true, performance: true, accessibility: true, maintainability: true, technicalDebt: true } },
      },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
