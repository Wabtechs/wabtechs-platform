import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { UsersClient } from "./users-client";

export const metadata: Metadata = { title: "Gestion des utilisateurs | Admin" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      avatar: true,
      _count: { select: { posts: true, comments: true } },
    },
  });

  return (
    <UsersClient
      users={users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      }))}
      currentUserId={session.user.id as string}
    />
  );
}
