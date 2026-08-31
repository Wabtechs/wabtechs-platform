import type { Metadata } from "next";
import { mockTasks } from "./data/tasks";
import { TasksClient } from "./tasks-client";

export const metadata: Metadata = { title: "Gestion des tâches" };
export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
	return <TasksClient initialTasks={mockTasks} />;
}
