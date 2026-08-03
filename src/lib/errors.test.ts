import { describe, expect, it } from "vitest";
import { AppError, ErrorCode, isAppError } from "@/lib/errors";

describe("AppError", () => {
  it("crée une erreur avec code et statut", () => {
    const err = new AppError("Non autorisé", 401, ErrorCode.UNAUTHORIZED);
    expect(err.message).toBe("Non autorisé");
    expect(err.status).toBe(401);
    expect(err.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(err.name).toBe("AppError");
  });

  it("définit INTERNAL comme code par défaut", () => {
    const err = new AppError("Boom", 500);
    expect(err.code).toBe(ErrorCode.INTERNAL);
  });

  it("est une instance de Error", () => {
    expect(new AppError("x", 400)).toBeInstanceOf(Error);
  });
});

describe("isAppError", () => {
  it("identifie un AppError", () => {
    expect(isAppError(new AppError("x", 400))).toBe(true);
  });

  it("rejette les autres erreurs", () => {
    expect(isAppError(new Error("x"))).toBe(false);
    expect(isAppError("string")).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});
