import { describe, expect, it } from "vitest";
import {
  getStatusMeta,
  getPriorityMeta,
  getSeverityMeta,
  getTypeMeta,
  getMethodMeta,
  healthColor,
  progressColor,
} from "@/lib/os-labels";

describe("getStatusMeta", () => {
  it("retourne la métadonnée connue", () => {
    expect(getStatusMeta("ACTIVE").label).toBe("Actif");
    expect(getStatusMeta("DONE").label).toBe("Terminée");
  });

  it("retombe sur le statut brut pour les inconnus", () => {
    const meta = getStatusMeta("CUSTOM_STATUS");
    expect(meta.label).toBe("CUSTOM_STATUS");
    expect(meta.className).toContain("slate");
  });
});

describe("getPriorityMeta", () => {
  it("retourne les libellés connus", () => {
    expect(getPriorityMeta("URGENT").label).toBe("Urgent");
    expect(getPriorityMeta("LOW").label).toBe("Basse");
  });

  it("retombe sur la valeur brute", () => {
    expect(getPriorityMeta("NOPE").label).toBe("NOPE");
  });
});

describe("getSeverityMeta", () => {
  it("retourne les libellés connus", () => {
    expect(getSeverityMeta("BLOCKER").label).toBe("Bloquant");
    expect(getSeverityMeta("TRIVIAL").label).toBe("Triviale");
  });

  it("retombe sur la valeur brute", () => {
    expect(getSeverityMeta("X").label).toBe("X");
  });
});

describe("getTypeMeta", () => {
  it("retourne les libellés connus", () => {
    expect(getTypeMeta("PLATFORM").label).toBe("Plateforme");
    expect(getTypeMeta("TOOL").label).toBe("Outil");
  });

  it("retombe sur la valeur brute", () => {
    expect(getTypeMeta("Y").label).toBe("Y");
  });
});

describe("getMethodMeta", () => {
  it("retourne les libellés connus", () => {
    expect(getMethodMeta("OKR").label).toBe("OKR");
    expect(getMethodMeta("KPI").label).toBe("KPI");
  });

  it("retombe sur la valeur brute", () => {
    expect(getMethodMeta("Z").label).toBe("Z");
  });
});

describe("healthColor", () => {
  it("est vert au-dessus de 80", () => {
    expect(healthColor(85)).toBe("text-emerald-500");
  });

  it("est ambre entre 60 et 79", () => {
    expect(healthColor(70)).toBe("text-amber-500");
    expect(healthColor(60)).toBe("text-amber-500");
  });

  it("est rouge sous 60", () => {
    expect(healthColor(59)).toBe("text-rose-500");
  });
});

describe("progressColor", () => {
  it("est vert au-dessus de 80", () => {
    expect(progressColor(90)).toBe("bg-emerald-500");
  });

  it("est ambre entre 50 et 79", () => {
    expect(progressColor(65)).toBe("bg-amber-500");
    expect(progressColor(50)).toBe("bg-amber-500");
  });

  it("est rouge sous 50", () => {
    expect(progressColor(49)).toBe("bg-rose-500");
  });
});
