import { describe, expect, it } from "vitest";
import { buildGrowthSeries } from "@/lib/os-growth";

describe("buildGrowthSeries", () => {
  it("retourne une série vide sans snapshots", () => {
    expect(buildGrowthSeries([])).toEqual([]);
  });

  it("regroupe les métriques par jour", () => {
    const series = buildGrowthSeries([
      { date: "2026-08-01", metric: "stars", value: 10 },
      { date: "2026-08-01", metric: "users", value: 3 },
      { date: "2026-08-02", metric: "stars", value: 5 },
    ]);

    expect(series).toHaveLength(2);
    const total = series.reduce((sum, p) => sum + p.stars, 0);
    const totalUsers = series.reduce((sum, p) => sum + p.users, 0);
    expect(total).toBe(15);
    expect(totalUsers).toBe(3);
    expect(series.every((p) => p.label)).toBe(true);
  });

  it("additionne les valeurs d'une même métrique et même jour", () => {
    const series = buildGrowthSeries([
      { date: "2026-08-01", metric: "mrr", value: 100 },
      { date: "2026-08-01", metric: "mrr", value: 50 },
      { date: "2026-08-01", metric: "downloads", value: 7 },
    ]);

    expect(series).toHaveLength(1);
    expect(series[0]!.mrr).toBe(150);
    expect(series[0]!.downloads).toBe(7);
  });

  it("accepte les dates Date et ignore les métriques inconnues", () => {
    const series = buildGrowthSeries([
      { date: new Date("2026-08-01T10:00:00Z"), metric: "stars", value: 2 },
      { date: "2026-08-01", metric: "bogus", value: 999 },
    ]);

    expect(series).toHaveLength(1);
    expect(series[0]!.stars).toBe(2);
  });

  it("génère une étiquette lisible", () => {
    const series = buildGrowthSeries([{ date: "2026-08-01", metric: "stars", value: 1 }]);
    expect(series[0]!.label).toBeTruthy();
  });
});
