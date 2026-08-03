import { describe, expect, it } from "vitest";
import {
  MAX_UPLOAD_SIZE,
  sanitizeFilename,
  validateUpload,
} from "@/lib/upload";

describe("validateUpload", () => {
  it("accepte une image valide", () => {
    expect(
      validateUpload({ name: "photo.png", size: 1024, type: "image/png" }),
    ).toBeNull();
  });

  it("accepte un PDF", () => {
    expect(
      validateUpload({ name: "doc.pdf", size: 2048, type: "application/pdf" }),
    ).toBeNull();
  });

  it("rejette un fichier vide", () => {
    expect(
      validateUpload({ name: "empty.png", size: 0, type: "image/png" }),
    ).toBe("Fichier vide");
  });

  it("rejette un fichier trop volumineux", () => {
    expect(
      validateUpload({ name: "big.png", size: MAX_UPLOAD_SIZE + 1, type: "image/png" }),
    ).toContain("trop volumineux");
  });

  it("rejette un type non autorisé", () => {
    expect(
      validateUpload({ name: "virus.exe", size: 512, type: "application/x-msdownload" }),
    ).toBe("Type de fichier non autorisé");
  });

  it("rejette un fichier sans nom ni type", () => {
    expect(validateUpload({ name: "", size: 10, type: "" })).toBe("Fichier invalide");
  });

  it("rejette un type image dont l'extension ne correspond pas", () => {
    expect(
      validateUpload({ name: "arch.rar", size: 512, type: "image/png" }),
    ).toBe("Type de fichier non autorisé");
  });
});

describe("sanitizeFilename", () => {
  it("remplace les caractères dangereux", () => {
    const result = sanitizeFilename("../café & menus.png");
    expect(result).not.toContain("/");
    expect(result).not.toContain("&");
    expect(result).not.toContain(" ");
    expect(result).toMatch(/^[a-zA-Z0-9._-]+$/);
  });

  it("conserve les caractères sûrs", () => {
    expect(sanitizeFilename("hero-cover_v2.png")).toBe("hero-cover_v2.png");
  });
});
