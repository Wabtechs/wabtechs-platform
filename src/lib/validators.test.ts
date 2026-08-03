import { describe, expect, it } from "vitest";
import { contactSchema, newsletterSchema } from "@/lib/validators";

describe("contactSchema", () => {
  it("valide une requête contact valide", () => {
    const result = contactSchema.safeParse({
      name: "Jean Dupont",
      email: "jean@example.com",
      subject: "Demande de partenariat",
      message: "Bonjour, je souhaite collaborer avec Wabtechs.",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un email invalide", () => {
    const result = contactSchema.safeParse({
      name: "Jean",
      email: "pas-un-email",
      subject: "Sujet",
      message: "Message assez long pour être valide",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un message trop court", () => {
    const result = contactSchema.safeParse({
      name: "Jean",
      email: "jean@example.com",
      subject: "Sujet",
      message: "court",
    });
    expect(result.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("valide un email correct", () => {
    expect(newsletterSchema.safeParse({ email: "abonne@example.com" }).success).toBe(true);
  });

  it("rejette un email invalide", () => {
    expect(newsletterSchema.safeParse({ email: "abonne" }).success).toBe(false);
  });
});
