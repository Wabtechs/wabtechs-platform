import { describe, expect, it } from "vitest";
import { generateCertificateNumber, generateCertificatePdf } from "@/lib/certificate";

describe("generateCertificateNumber", () => {
  it("génère un numéro au format WBT-YYYY-XXXXXX", () => {
    const number = generateCertificateNumber();
    expect(number).toMatch(/^WBT-\d{4}-[A-Z0-9]{6}$/);
  });

  it("génère des numéros uniques", () => {
    const a = generateCertificateNumber();
    const b = generateCertificateNumber();
    expect(a).not.toBe(b);
  });
});

describe("generateCertificatePdf", () => {
  it("génère un PDF valide avec le nom et le cours", async () => {
    const bytes = await generateCertificatePdf({
      name: "Jean Dupont",
      courseTitle: "Next.js 16 — De zéro à pro",
      number: "WBT-2026-ABCDEF",
      date: "6 août 2026",
    });

    expect(bytes.length).toBeGreaterThan(500);
    const header = Buffer.from(bytes.slice(0, 5)).toString("utf-8");
    expect(header).toBe("%PDF-");
  });
});
