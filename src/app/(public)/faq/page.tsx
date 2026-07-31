import { db } from "@/lib/prisma";
import { FaqClient } from "./faq-client";

export default async function FaqPage() {
  const faqItems = await db.faqItem.findMany({ orderBy: { order: "asc" } });
  return <FaqClient faqItems={faqItems} />;
}
