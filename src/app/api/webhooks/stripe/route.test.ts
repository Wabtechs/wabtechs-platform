import { describe, expect, it, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  coursePurchaseFindUnique: vi.fn(),
  coursePurchaseCreate: vi.fn(),
  courseFindUnique: vi.fn(),
  enrollmentUpsert: vi.fn(),
  templatePurchaseFindUnique: vi.fn(),
  templatePurchaseCreate: vi.fn(),
  templateFindUnique: vi.fn(),
  $transaction: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: { constructEvent: mocks.constructEvent },
  }),
  getStripeWebhookSecret: () => "whsec_test",
}));

vi.mock("@/lib/prisma", () => ({
  db: {
    purchase: {
      findUnique: mocks.coursePurchaseFindUnique,
      create: mocks.coursePurchaseCreate,
    },
    course: { findUnique: mocks.courseFindUnique },
    enrollment: { upsert: mocks.enrollmentUpsert },
    templatePurchase: {
      findUnique: mocks.templatePurchaseFindUnique,
      create: mocks.templatePurchaseCreate,
    },
    template: { findUnique: mocks.templateFindUnique },
    $transaction: mocks.$transaction,
  },
}));

import { POST } from "./route";

function makeRequest(payload: string, signature?: string): Request {
  const req = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body: payload,
  });
  if (signature) req.headers.set("stripe-signature", signature);
  return req;
}

function checkoutCompleted(metadata: Record<string, string>, id = "cs_test_1") {
  return {
    type: "checkout.session.completed",
    data: {
      object: {
        id,
        amount_total: 3900,
        metadata,
      },
    },
  };
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.courseFindUnique.mockResolvedValue({ id: "course1", price: "39" });
    mocks.templateFindUnique.mockResolvedValue({ id: "template1", price: "29" });
    mocks.$transaction.mockImplementation(async (queries: unknown[]) => queries);
  });

  it("retourne 400 si la signature est manquante", async () => {
    const res = await POST(makeRequest('{"type":"checkout.session.completed"}'));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si la signature est invalide", async () => {
    mocks.constructEvent.mockImplementation(() => {
      throw new Error("signature mismatch");
    });
    const res = await POST(makeRequest("payload", "bad-signature"));
    expect(res.status).toBe(400);
    expect(mocks.coursePurchaseCreate).not.toHaveBeenCalled();
  });

  it("créé Purchase et Enrollment pour un cours", async () => {
    mocks.constructEvent.mockReturnValue(
      checkoutCompleted({ userId: "user1", courseId: "course1" }),
    );
    mocks.coursePurchaseFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest("{}", "valid-signature"));
    expect(res.status).toBe(200);

    expect(mocks.coursePurchaseCreate).toHaveBeenCalledWith({
      data: { userId: "user1", courseId: "course1", stripeSessionId: "cs_test_1", amount: 39 },
    });
    expect(mocks.enrollmentUpsert).toHaveBeenCalledWith({
      where: { userId_courseId: { userId: "user1", courseId: "course1" } },
      create: { userId: "user1", courseId: "course1", progress: 0, completed: false },
      update: {},
    });
  });

  it("créé TemplatePurchase pour un template", async () => {
    mocks.constructEvent.mockReturnValue(
      checkoutCompleted({ userId: "user1", templateId: "template1" }),
    );
    mocks.templatePurchaseFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest("{}", "valid-signature"));
    expect(res.status).toBe(200);

    expect(mocks.templatePurchaseCreate).toHaveBeenCalledWith({
      data: { userId: "user1", templateId: "template1", stripeSessionId: "cs_test_1", amount: 39 },
    });
    expect(mocks.enrollmentUpsert).not.toHaveBeenCalled();
  });

  it("est idempotent : pas de double accès", async () => {
    mocks.constructEvent.mockReturnValue(
      checkoutCompleted({ userId: "user1", courseId: "course1" }),
    );
    mocks.coursePurchaseFindUnique.mockResolvedValue({ id: "purchase1" });

    const res = await POST(makeRequest("{}", "valid-signature"));
    expect(res.status).toBe(200);
    expect(mocks.coursePurchaseCreate).not.toHaveBeenCalled();
  });

  it("ignore les événements non liés au checkout", async () => {
    mocks.constructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_1" } },
    });

    const res = await POST(makeRequest("{}", "valid-signature"));
    expect(res.status).toBe(200);
    expect(mocks.coursePurchaseCreate).not.toHaveBeenCalled();
    expect(mocks.templatePurchaseCreate).not.toHaveBeenCalled();
  });
});
