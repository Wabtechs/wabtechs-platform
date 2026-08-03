import { describe, expect, it } from "vitest";
import { fmtEur, fmtNum, fmtDate, fmtDateTime, daysUntil, pct } from "@/lib/os-utils";

describe("fmtEur", () => {
  it("formate un montant entier", () => {
    expect(fmtEur(1200)).toBe("1\u202F200\u00A0€");
  });

  it("gère null et undefined", () => {
    expect(fmtEur(null)).toBe("0 €");
    expect(fmtEur(undefined)).toBe("0 €");
  });

  it("accepte une chaîne décimale", () => {
    expect(fmtEur("500.5")).toBe("501\u00A0€");
  });
});

describe("fmtNum", () => {
  it("formate un nombre avec séparateur", () => {
    expect(fmtNum(1234567)).toBe("1\u202F234\u202F567");
  });

  it("gère null", () => {
    expect(fmtNum(null)).toBe("0");
  });
});

describe("fmtDate / fmtDateTime", () => {
  it("renvoie un tiret si la valeur est absente", () => {
    expect(fmtDate(null)).toBe("—");
    expect(fmtDateTime(undefined)).toBe("—");
  });

  it("formate une date", () => {
    expect(fmtDate(new Date(2024, 6, 1))).toBe("1 juil. 2024");
  });
});

describe("daysUntil", () => {
  it("renvoie null sans valeur", () => {
    expect(daysUntil(null)).toBeNull();
  });

  it("calcule un délai positif", () => {
    const inDays = daysUntil(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));
    expect(inDays).toBe(5);
  });
});

describe("pct", () => {
  it("formate un pourcentage", () => {
    expect(pct(75)).toBe("75%");
  });

  it("gère null", () => {
    expect(pct(null)).toBe("0%");
  });
});
