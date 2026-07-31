export interface OsBadgeMeta {
  label: string;
  className: string;
}

export const OS_STATUS_META: Record<string, OsBadgeMeta> = {
  PLANNING: { label: "Planifié", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  ACTIVE: { label: "Actif", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  PAUSED: { label: "En pause", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  MAINTENANCE: { label: "Maintenance", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  ARCHIVED: { label: "Archivé", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  BACKLOG: { label: "Backlog", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  PLANNED: { label: "Planifiée", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  READY: { label: "Prête", className: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  DEVELOPMENT: { label: "En dev", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  REVIEW: { label: "Revue", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  TESTING: { label: "Tests", className: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400" },
  VALIDATION: { label: "Validation", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  DONE: { label: "Terminée", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  RELEASED: { label: "Publiée", className: "bg-green-600/10 text-green-600 dark:text-green-400" },
  NEW: { label: "Nouveau", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  TRIAGED: { label: "Trié", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  IN_PROGRESS: { label: "En cours", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  FIXED: { label: "Corrigé", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  VERIFIED: { label: "Vérifié", className: "bg-green-600/10 text-green-600 dark:text-green-400" },
  CLOSED: { label: "Fermé", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  WONTFIX: { label: "Non corrigé", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  NOT_STARTED: { label: "Pas démarré", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  ON_TRACK: { label: "On track", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  AT_RISK: { label: "À risque", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  DELAYED: { label: "En retard", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
  COMPLETED: { label: "Complété", className: "bg-green-600/10 text-green-600 dark:text-green-400" },
  CANCELLED: { label: "Annulé", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
};

export const OS_PRIORITY_META: Record<string, OsBadgeMeta> = {
  URGENT: { label: "Urgent", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  HIGH: { label: "Haute", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  MEDIUM: { label: "Moyenne", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  LOW: { label: "Basse", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
};

export const OS_SEVERITY_META: Record<string, OsBadgeMeta> = {
  BLOCKER: { label: "Bloquant", className: "bg-red-600/15 text-red-600 dark:text-red-400" },
  CRITICAL: { label: "Critique", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  MAJOR: { label: "Majeure", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  MINOR: { label: "Mineure", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  TRIVIAL: { label: "Triviale", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
};

export const OS_TYPE_META: Record<string, OsBadgeMeta> = {
  PLATFORM: { label: "Plateforme", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  APP: { label: "Application", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  LIBRARY: { label: "Librairie", className: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  TOOL: { label: "Outil", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  SERVICE: { label: "Service", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  OTHER: { label: "Autre", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
};

export const OS_METHOD_META: Record<string, OsBadgeMeta> = {
  OKR: { label: "OKR", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  SMART: { label: "SMART", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  KPI: { label: "KPI", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
};

export function getStatusMeta(status: string): OsBadgeMeta {
  return OS_STATUS_META[status] ?? { label: status, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" };
}

export function getPriorityMeta(priority: string): OsBadgeMeta {
  return OS_PRIORITY_META[priority] ?? { label: priority, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" };
}

export function getSeverityMeta(severity: string): OsBadgeMeta {
  return OS_SEVERITY_META[severity] ?? { label: severity, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" };
}

export function getTypeMeta(type: string): OsBadgeMeta {
  return OS_TYPE_META[type] ?? { label: type, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" };
}

export function getMethodMeta(method: string): OsBadgeMeta {
  return OS_METHOD_META[method] ?? { label: method, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" };
}

export function healthColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-rose-500";
}

export function progressColor(value: number): string {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 50) return "bg-amber-500";
  return "bg-rose-500";
}
