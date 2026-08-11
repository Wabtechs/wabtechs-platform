export interface CiSummary {
  total: number;
  success: number;
  failure: number;
  neutral: number;
  cancelled: number;
  skipped: number;
  other: number;
  passRate: number;
}

export function summarizeCiRuns(runs: { conclusion?: string | null }[]): CiSummary {
  const summary: CiSummary = {
    total: runs.length,
    success: 0,
    failure: 0,
    neutral: 0,
    cancelled: 0,
    skipped: 0,
    other: 0,
    passRate: 0,
  };
  for (const r of runs) {
    const c = r.conclusion ?? "";
    if (c === "success") summary.success++;
    else if (c === "failure") summary.failure++;
    else if (c === "neutral") summary.neutral++;
    else if (c === "cancelled") summary.cancelled++;
    else if (c === "skipped") summary.skipped++;
    else summary.other++;
  }
  summary.passRate = summary.total ? Math.round((summary.success / summary.total) * 100) : 0;
  return summary;
}

export function countByKey<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const k = String(r[key] ?? "unknown");
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export function countWithinDays(
  rows: { createdAt?: Date | string | null; committedAt?: Date | string | null }[],
  days: number,
): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return rows.filter((r) => new Date(r.createdAt ?? r.committedAt ?? 0).getTime() >= cutoff).length;
}

export function commitsPerDay(
  commits: { committedAt: Date | string }[],
  days = 30,
): { label: string; commits: number }[] {
  const byDay = new Map<string, number>();
  for (const c of commits) {
    const d = new Date(c.committedAt);
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
  const out: { label: string; commits: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ label: fmt.format(d), commits: byDay.get(key) ?? 0 });
  }
  return out;
}

export function repoHealthScore(input: {
  ciPass: number;
  ciTotal: number;
  closedIssues: number;
  totalIssues: number;
  mergedPrs: number;
  totalPrs: number;
}): number {
  const ciScore = input.ciTotal === 0 ? 50 : input.ciPass;
  const closure = input.totalIssues
    ? Math.round((input.closedIssues / input.totalIssues) * 100)
    : 100;
  const merge = input.totalPrs ? Math.round((input.mergedPrs / input.totalPrs) * 100) : 100;
  return Math.round(0.5 * ciScore + 0.25 * closure + 0.25 * merge);
}

export function seriesByDate(
  rows: {
    date?: Date | string | null;
    closedAt?: Date | string | null;
    mergedAt?: Date | string | null;
  }[],
  days = 30,
): { label: string; value: number }[] {
  const byDay = new Map<string, number>();
  for (const r of rows) {
    const ts = r.date ?? r.closedAt ?? r.mergedAt;
    if (!ts) continue;
    const key = new Date(ts).toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
  const out: { label: string; value: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push({ label: fmt.format(d), value: byDay.get(d.toISOString().slice(0, 10)) ?? 0 });
  }
  return out;
}
