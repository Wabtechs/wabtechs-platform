import type { Metadata } from "next";
import { TasksClient } from "./tasks-client";
import { mockTasks } from "./data/tasks";

export const metadata: Metadata = { title: "Gestion des tâches" };
export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
  return <TasksClient initialTasks={mockTasks} />;
}
