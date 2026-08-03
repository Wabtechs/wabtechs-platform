import { describe, expect, it } from "vitest";
import { cn, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("fusionne les classes simples", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignore les valeurs falsy", () => {
    expect(cn("a", undefined, false, null, "b")).toBe("a b");
  });

  it("résout les conflits tailwind-merge (dernière classe gagne)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatDate", () => {
  it("formate une date en français", () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe("15 janvier 2024");
  });

  it("accepte une date construite localement", () => {
    expect(formatDate(new Date(2024, 5, 1))).toBe("1 juin 2024");
  });
});
