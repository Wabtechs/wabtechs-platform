import type { Task, TaskStatus, TaskPriority, TaskLabel } from "./schema";

export const statuses: { value: TaskStatus; label: string; color: string }[] = [
  { value: "todo", label: "À faire", color: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400" },
  { value: "in-progress", label: "En cours", color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  { value: "done", label: "Terminé", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
];

export const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Basse", color: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400" },
  { value: "medium", label: "Moyenne", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  { value: "high", label: "Haute", color: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
];

export const labels: { value: TaskLabel; label: string; color: string }[] = [
  { value: "bug", label: "Bug", color: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  { value: "feature", label: "Fonctionnalité", color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
  { value: "improvement", label: "Amélioration", color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  { value: "documentation", label: "Documentation", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Corriger le bug d'authentification OAuth",
    status: "in-progress",
    priority: "high",
    label: "bug",
    createdAt: new Date("2025-07-20"),
  },
  {
    id: "2",
    title: "Ajouter la page de projets",
    status: "todo",
    priority: "high",
    label: "feature",
    createdAt: new Date("2025-07-21"),
  },
  {
    id: "3",
    title: "Optimiser les images du blog",
    status: "done",
    priority: "medium",
    label: "improvement",
    createdAt: new Date("2025-07-18"),
  },
  {
    id: "4",
    title: "Rédiger la documentation API",
    status: "in-progress",
    priority: "medium",
    label: "documentation",
    createdAt: new Date("2025-07-19"),
  },
  {
    id: "5",
    title: "Implémenter la recherche globale",
    status: "todo",
    priority: "medium",
    label: "feature",
    createdAt: new Date("2025-07-22"),
  },
  {
    id: "6",
    title: "Corriger le formulaire de contact",
    status: "done",
    priority: "low",
    label: "bug",
    createdAt: new Date("2025-07-15"),
  },
  {
    id: "7",
    title: "Ajouter le mode sombre au dashboard",
    status: "todo",
    priority: "low",
    label: "improvement",
    createdAt: new Date("2025-07-23"),
  },
  {
    id: "8",
    title: "Mettre à jour les dépendances npm",
    status: "in-progress",
    priority: "low",
    label: "improvement",
    createdAt: new Date("2025-07-17"),
  },
  {
    id: "9",
    title: "Documenter le processus de déploiement",
    status: "todo",
    priority: "medium",
    label: "documentation",
    createdAt: new Date("2025-07-24"),
  },
  {
    id: "10",
    title: "Ajouter les notifications en temps réel",
    status: "todo",
    priority: "high",
    label: "feature",
    createdAt: new Date("2025-07-25"),
  },
];

export function getStatusByValue(value: TaskStatus) {
  return statuses.find((s) => s.value === value);
}

export function getPriorityByValue(value: TaskPriority) {
  return priorities.find((p) => p.value === value);
}

export function getLabelByValue(value: TaskLabel) {
  return labels.find((l) => l.value === value);
}
