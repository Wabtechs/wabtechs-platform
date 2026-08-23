import type { Metadata } from "next";
import { AnalyticsClient } from "./analytics-client";

export const metadata: Metadata = { title: "Analytics | Admin" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  return <AnalyticsClient />;
}
