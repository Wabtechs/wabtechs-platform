import type { Metadata } from "next";
import { GithubClient } from "./github-client";

export const metadata: Metadata = { title: "GitHub | Admin" };
export const dynamic = "force-dynamic";

export default function GithubPage() {
  return <GithubClient />;
}
