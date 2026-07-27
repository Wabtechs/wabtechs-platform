import type { Metadata } from "next";
import { AppsClient } from "./apps-client";

export const metadata: Metadata = { title: "Apps | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminAppsPage() {
  return <AppsClient />;
}
