import type Stripe from "stripe";
import { db } from "@/lib/prisma";

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  if (event.type !== "checkout.session.completed") return;

  const checkout = event.data.object;
  const sessionId = checkout.id;
  const userId = checkout.metadata?.userId;
  const courseId = checkout.metadata?.courseId;
  const templateId = checkout.metadata?.templateId;

  if (!userId || !sessionId) return;

  const amount = typeof checkout.amount_total === "number" ? checkout.amount_total / 100 : 0;

  if (courseId) {
    await grantCourseAccess({ userId, courseId, sessionId, amount });
  } else if (templateId) {
    await grantTemplateAccess({ userId, templateId, sessionId, amount });
  }
}

async function grantCourseAccess({
  userId,
  courseId,
  sessionId,
  amount,
}: {
  userId: string;
  courseId: string;
  sessionId: string;
  amount: number;
}): Promise<void> {
  const existingPurchase = await db.purchase.findUnique({
    where: { stripeSessionId: sessionId },
  });
  if (existingPurchase) return;

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) return;

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

async function grantTemplateAccess({
  userId,
  templateId,
  sessionId,
  amount,
}: {
  userId: string;
  templateId: string;
  sessionId: string;
  amount: number;
}): Promise<void> {
  const existingPurchase = await db.templatePurchase.findUnique({
    where: { stripeSessionId: sessionId },
  });
  if (existingPurchase) return;

  const template = await db.template.findUnique({ where: { id: templateId } });
  if (!template) return;

  await db.templatePurchase.create({
    data: { userId, templateId, stripeSessionId: sessionId, amount },
  });
}
