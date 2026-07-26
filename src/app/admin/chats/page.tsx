import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChatsClient } from "./chats-client";

export const metadata: Metadata = { title: "Chats | Admin" };

export default async function AdminChatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return <ChatsClient />;
}
