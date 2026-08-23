import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { MessagesClient } from "./messages-client";

export const metadata: Metadata = { title: "Messages de contact" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesClient messages={messages} />;
}
