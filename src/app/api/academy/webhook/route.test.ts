import { describe, expect, it, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  purchaseFindUnique: vi.fn(),
  purchaseCreate: vi.fn(),
  courseFindUnique: vi.fn(),
  enrollmentUpsert: vi.fn(),
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
      findUnique: mocks.purchaseFindUnique,
      create: mocks.purchaseCreate,
    },
    course: { findUnique: mocks.courseFindUnique },
    enrollment: { upsert: mocks.enrollmentUpsert },
    $transaction: mocks.$transaction,
  },
}));

import { POST } from "./route";

function makeRequest(payload: string, signature?: string): Request {
  const req = new Request("http://localhost/api/academy/webhook", {
    method: "POST",
    body: payload,
  });
  if (signature) req.headers.set("stripe-signature", signature);
  return req;
}

describe("POST /api/academy/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.courseFindUnique.mockResolvedValue({ id: "course1", price: "39" });
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
    expect(mocks.$transaction).not.toHaveBeenCalled();
  });

  it("créé la Purchase et l'Enrollment sur checkout.session.completed", async () => {
    mocks.constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          amount_total: 3900,
          metadata: { userId: "user1", courseId: "course1" },
        },
      },
    });
    mocks.purchaseFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest("{}", "valid-signature"));
    expect(res.status).toBe(200);

    expect(mocks.purchaseCreate).toHaveBeenCalledWith({
      data: { userId: "user1", courseId: "course1", stripeSessionId: "cs_test_1", amount: 39 },
    });
    expect(mocks.enrollmentUpsert).toHaveBeenCalledWith({
      where: { userId_courseId: { userId: "user1", courseId: "course1" } },
      create: { userId: "user1", courseId: "course1", progress: 0, completed: false },
      update: {},
    });
  });

  it("est idempotent : n'accordé pas l'accès deux fois", async () => {
    mocks.constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          amount_total: 3900,
          metadata: { userId: "user1", courseId: "course1" },
        },
      },
    });
    mocks.purchaseFindUnique.mockResolvedValue({ id: "purchase1" });

    const res = await POST(makeRequest("{}", "valid-signature"));
    expect(res.status).toBe(200);
    expect(mocks.$transaction).not.toHaveBeenCalled();
  });

  it("ignore les événements non liés au checkout", async () => {
    mocks.constructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_1" } },
    });

    const res = await POST(makeRequest("{}", "valid-signature"));
    expect(res.status).toBe(200);
    expect(mocks.$transaction).not.toHaveBeenCalled();
  });
});
