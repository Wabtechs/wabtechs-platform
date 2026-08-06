import { describe, expect, it } from "vitest";
import { NAV_LINKS, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

describe("NAV_LINKS", () => {
  it("contient les liens principaux de navigation", () => {
    expect(NAV_LINKS.some((l) => l.href === "/")).toBe(true);
    expect(NAV_LINKS.some((l) => l.href === "/blog")).toBe(true);
    expect(NAV_LINKS.every((l) => l.href.startsWith("/"))).toBe(true);
  });
});

describe("FOOTER_LINKS", () => {
  it("expose les groupes plateforme, resources, company et legal", () => {
    for (const group of ["plateforme", "resources", "company", "legal"]) {
      expect(FOOTER_LINKS[group as keyof typeof FOOTER_LINKS]).toBeDefined();
      expect(FOOTER_LINKS[group as keyof typeof FOOTER_LINKS].length).toBeGreaterThan(0);
    }
  });

  it("chaque lien a un href et un label", () => {
    const all = Object.values(FOOTER_LINKS).flat();
    for (const link of all) {
      expect(link.href).toBeTruthy();
      expect(link.label).toBeTruthy();
    }
  });
});

describe("SOCIAL_LINKS", () => {
  it("liste les réseaux sociaux avec leurs icônes", () => {
    expect(SOCIAL_LINKS.length).toBeGreaterThan(0);
    for (const social of SOCIAL_LINKS) {
      expect(social.href.startsWith("https://")).toBe(true);
      expect(social.icon).toBeTruthy();
    }
  });

  it("contient GitHub", () => {
    expect(SOCIAL_LINKS.some((s) => s.icon === "github")).toBe(true);
  });
});
