import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TasksClient } from "./tasks-client";
import { mockTasks } from "./data/tasks";

export const metadata: Metadata = { title: "Gestion des tâches" };

export default async function AdminTasksPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return <TasksClient initialTasks={mockTasks} />;
}
