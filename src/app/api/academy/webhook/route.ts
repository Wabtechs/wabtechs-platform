import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe non configuré" }, { status: 503 });
  }

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkout = event.data.object;
    const userId = checkout.metadata?.userId;
    const courseId = checkout.metadata?.courseId;
    const sessionId = checkout.id;

    if (userId && courseId && sessionId) {
      const existingPurchase = await db.purchase.findUnique({
        where: { stripeSessionId: sessionId },
      });

      if (!existingPurchase) {
        const course = await db.course.findUnique({ where: { id: courseId } });
        const amount = typeof checkout.amount_total === "number" ? checkout.amount_total / 100 : 0;

        if (course) {
          await db.$transaction([
            db.purchase.create({
              data: { userId, courseId, stripeSessionId: sessionId, amount },
            }),
            db.enrollment.upsert({
              where: { userId_courseId: { userId, courseId } },
              create: { userId, courseId, progress: 0, completed: false },
              update: {},
            }),
          ]);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
