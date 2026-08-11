import { describe, expect, it } from "vitest";
import {
  getErrorMessage,
  getHttpStatusMessage,
  isNetworkError,
  isTechnicalError,
  Messages,
} from "@/lib/messages";

describe("Messages", () => {
  it("expose des messages français compréhensibles", () => {
    expect(Messages.errors.internal).toBe(
      "Une erreur inattendue s’est produite. Veuillez réessayer dans quelques instants.",
    );
    expect(Messages.errors.network).toContain("Impossible de contacter le serveur");
    expect(Messages.errors.forbidden).toContain("Accès refusé");
  });
});

describe("getHttpStatusMessage", () => {
  it.each([
    [400, Messages.errors.badRequest],
    [401, Messages.errors.unauthorized],
    [403, Messages.errors.forbidden],
    [404, Messages.errors.notFound],
    [408, Messages.errors.timeout],
    [409, Messages.errors.conflict],
    [422, Messages.errors.validation],
    [429, Messages.errors.tooManyRequests],
    [500, Messages.errors.internal],
    [502, Messages.errors.internal],
    [503, Messages.errors.internal],
    [504, Messages.errors.internal],
  ])("mappe le statut %i vers un message", (status, expected) => {
    expect(getHttpStatusMessage(status)).toBe(expected);
  });
});

describe("isTechnicalError", () => {
  it("détecte les messages techniques", () => {
    expect(isTechnicalError("Internal Server Error")).toBe(true);
    expect(isTechnicalError("SQLSTATE[23000]: Integrity constraint violation")).toBe(true);
    expect(isTechnicalError("Cannot read properties of undefined (reading 'x')")).toBe(true);
    expect(isTechnicalError("PrismaClientKnownRequestError: P2002")).toBe(true);
    expect(isTechnicalError("Request failed with status code 500")).toBe(true);
    expect(isTechnicalError("at Module._compile (node:internal/modules:1:1)")).toBe(true);
  });

  it("laisse passer les messages utilisateurs", () => {
    expect(isTechnicalError("Impossible de contacter le serveur.")).toBe(false);
    expect(isTechnicalError("Veuillez saisir une adresse e-mail valide.")).toBe(false);
  });
});

describe("isNetworkError", () => {
  it("identifie les erreurs réseau", () => {
    expect(isNetworkError(new TypeError("Failed to fetch"))).toBe(true);
    expect(isNetworkError(new Error("Network request failed"))).toBe(true);
  });

  it("rejette les autres erreurs", () => {
    expect(isNetworkError(new Error("boom"))).toBe(false);
    expect(isNetworkError("boom")).toBe(false);
    expect(isNetworkError(null)).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("renvoie le message réseau pour une erreur réseau", () => {
    expect(getErrorMessage(new TypeError("Failed to fetch"))).toBe(Messages.errors.network);
  });

  it("renvoie le message pour une chaîne", () => {
    expect(getErrorMessage("Identifiant manquant.")).toBe("Identifiant manquant.");
  });

  it("renvoie le message pour une Error classique", () => {
    expect(getErrorMessage(new Error("Échec de la mise à jour"))).toBe("Échec de la mise à jour");
  });

  it("renvoie le fallback pour un message technique", () => {
    expect(getErrorMessage(new Error("Internal Server Error"))).toBe(Messages.errors.internal);
  });

  it("renvoie le fallback pour une erreur inconnue", () => {
    expect(getErrorMessage(null)).toBe(Messages.errors.internal);
    expect(getErrorMessage(undefined)).toBe(Messages.errors.internal);
  });
});
