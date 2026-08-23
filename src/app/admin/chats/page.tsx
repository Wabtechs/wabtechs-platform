import type { Metadata } from "next";
import { ChatsClient } from "./chats-client";

export const metadata: Metadata = { title: "Chats | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminChatsPage() {
  return <ChatsClient />;
}
