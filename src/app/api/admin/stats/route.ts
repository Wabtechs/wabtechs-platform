import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";

export async function GET() {
	const session = await auth();
	const admin = await requireAdmin(session);
	if (admin instanceof NextResponse) return admin;

	try {
		const [
			totalPosts,
			totalPodcasts,
			totalProjects,
			totalSubscribers,
			totalMessages,
			unreadMessages,
		] = await Promise.all([
			db.post.count(),
			db.podcast.count(),
			db.project.count(),
			db.newsletter.count({ where: { active: true } }),
			db.contactMessage.count(),
			db.contactMessage.count({ where: { read: false } }),
		]);

		const totalViews = 0;
		const recentPosts = await db.post.findMany({
			orderBy: { createdAt: "desc" },
			take: 5,
			select: {
				id: true,
				title: true,
				slug: true,
				published: true,
				views: true,
				createdAt: true,
			},
		});

		return NextResponse.json({
			totalPosts,
			totalPodcasts,
			totalProjects,
			totalSubscribers,
			totalMessages,
			unreadMessages,
			totalViews,
			recentPosts,
		});
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
