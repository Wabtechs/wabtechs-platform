import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { MessagesClient } from "./messages-client";

export const metadata: Metadata = { title: "Messages de contact" };

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesClient messages={messages} />;
}
