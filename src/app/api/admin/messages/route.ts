import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";

export async function GET() {
	const session = await auth();
	const admin = await requireAdmin(session);
	if (admin instanceof NextResponse) return admin;

	try {
		const messages = await db.contactMessage.findMany({
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json(messages);
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

export async function PATCH(req: Request) {
	const session = await auth();
	const admin = await requireAdmin(session);
	if (admin instanceof NextResponse) return admin;

	try {
		const { id, read } = await req.json();
		const message = await db.contactMessage.update({
			where: { id },
			data: { read },
		});
		return NextResponse.json(message);
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
		await db.contactMessage.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
