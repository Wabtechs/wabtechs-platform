import { describe, expect, it, vi } from "vitest";
import { findOpenCheckoutUrl } from "./stripe";

function makeStripe(sessions: unknown[]) {
  return {
    checkout: {
      sessions: {
        list: vi.fn().mockResolvedValue({ data: sessions }),
      },
    },
  };
}

describe("findOpenCheckoutUrl", () => {
  const baseSession = {
    id: "cs_test_1",
    client_reference_id: "user1",
    metadata: { courseId: "course1" },
    url: "https://checkout.stripe.com/c/pay/cs_test_1",
  };

  it("retourne l'URL d'une session ouverte pour le même utilisateur et produit", async () => {
    const stripe = makeStripe([baseSession]);
    const url = await findOpenCheckoutUrl(stripe as never, "user1", "courseId", "course1");
    expect(url).toBe("https://checkout.stripe.com/c/pay/cs_test_1");
    expect(stripe.checkout.sessions.list).toHaveBeenCalledWith(
      expect.objectContaining({ status: "open" }),
    );
  });

  it("ignore les sessions d'un autre utilisateur", async () => {
    const stripe = makeStripe([baseSession]);
    const url = await findOpenCheckoutUrl(stripe as never, "user2", "courseId", "course1");
    expect(url).toBeNull();
  });

  it("ignore les sessions d'un autre produit", async () => {
    const stripe = makeStripe([baseSession]);
    const url = await findOpenCheckoutUrl(stripe as never, "user1", "templateId", "template1");
    expect(url).toBeNull();
  });

  it("retourne null si aucune session ouverte", async () => {
    const stripe = makeStripe([]);
    const url = await findOpenCheckoutUrl(stripe as never, "user1", "courseId", "course1");
    expect(url).toBeNull();
  });
});
