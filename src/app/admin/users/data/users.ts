import { Shield, ShieldCheck, User, Circle, AlertCircle, Ban } from "lucide-react";

export const roles = [
  {
    value: "USER" as const,
    label: "Utilisateur",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    icon: User,
  },
  {
    value: "ADMIN" as const,
    label: "Admin",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
    icon: ShieldCheck,
  },
  {
    value: "MODERATOR" as const,
    label: "Modérateur",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    icon: Shield,
  },
] as const;

export const statuses = [
  {
    value: "active",
    label: "Actif",
    icon: Circle,
    color: "bg-emerald-500",
  },
  {
    value: "inactive",
    label: "Inactif",
    icon: AlertCircle,
    color: "bg-gray-400",
  },
  {
    value: "suspended",
    label: "Suspendu",
    icon: Ban,
    color: "bg-red-500",
  },
] as const;

export function getRoleConfig(role: string) {
  return roles.find((r) => r.value === role) ?? roles[0];
}

export function getUserStatus(user: { role: string; _count?: { posts: number; comments: number } }): string {
  if (user.role === "ADMIN" || user.role === "MODERATOR") return "active";
  if (user._count && (user._count.posts > 0 || user._count.comments > 0)) return "active";
  return "inactive";
}
