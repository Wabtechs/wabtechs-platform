import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { db } from "@/lib/prisma";

export type AdminRole = "ADMIN" | "MODERATOR" | "USER";

export async function getDbUserRole(
	email?: string | null,
): Promise<AdminRole | null> {
	if (!email) return null;
	const user = await db.user.findUnique({
		where: { email },
		select: { role: true },
	});
	return (user?.role as AdminRole | undefined) ?? null;
}

export async function isAdmin(session: Session | null): Promise<boolean> {
	if (!session?.user?.email) return false;
	const role = await getDbUserRole(session.user.email);
	return role === "ADMIN";
}

/**
 * Vérifie côté serveur que l'utilisateur courant est bien un ADMIN,
 * en se basant sur la base de données (pas seulement le token JWT).
 */
export async function assertAdmin(
	session: Session | null,
): Promise<Session | null> {
	if (!(await isAdmin(session))) return null;
	return session;
}

export async function requireAdmin(
	session: Session | null,
): Promise<(Session & { user: NonNullable<Session["user"]> }) | NextResponse> {
	if (!(await isAdmin(session))) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
	}
	if (!session?.user) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
	}
	return session as Session & { user: NonNullable<Session["user"]> };
}
