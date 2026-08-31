import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";

export async function GET() {
	const session = await auth();
	const admin = await requireAdmin(session);
	if (admin instanceof NextResponse) return admin;

	try {
		const tags = await db.tag.findMany({
			orderBy: { name: "asc" },
			include: { _count: { select: { posts: true, podcasts: true } } },
		});
		return NextResponse.json(tags);
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	const session = await auth();
	const admin = await requireAdmin(session);
	if (admin instanceof NextResponse) return admin;

	try {
		const { name } = await req.json();
		if (!name || typeof name !== "string") {
			return NextResponse.json({ error: "Nom requis" }, { status: 400 });
		}
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
		const tag = await db.tag.upsert({
			where: { name: name.trim() },
			update: {},
			create: { name: name.trim(), slug },
		});
		return NextResponse.json(tag, { status: 201 });
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

export async function DELETE(req: Request) {
	const session = await auth();
	const admin = await requireAdmin(session);
	if (admin instanceof NextResponse) return admin;

	try {
		const { id } = await req.json();
		await db.tag.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
