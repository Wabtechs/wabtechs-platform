interface Snapshot {
  date: Date | string;
  metric: string;
  value: number;
}

export const METRIC_SNAPSHOT_LIMIT = 90;

export type GrowthPoint = {
  label: string;
  stars: number;
  users: number;
  mrr: number;
  downloads: number;
};

export function buildGrowthSeries(snapshots: Snapshot[]): GrowthPoint[] {
  const byDate = new Map<string, GrowthPoint>();
  for (const s of snapshots) {
    const key = new Date(s.date).toISOString().slice(0, 10);
    const entry = byDate.get(key) ?? {
      label: new Intl.DateTimeFormat("fr-FR", { month: "short", day: "numeric" }).format(
        new Date(s.date),
      ),
      stars: 0,
      users: 0,
      mrr: 0,
      downloads: 0,
    };
    if (s.metric === "stars") entry.stars += s.value;
    if (s.metric === "users") entry.users += s.value;
    if (s.metric === "mrr") entry.mrr += s.value;
    if (s.metric === "downloads") entry.downloads += s.value;
    byDate.set(key, entry);
  }
  return [...byDate.values()].sort((a, b) => a.label.localeCompare(b.label));
}
