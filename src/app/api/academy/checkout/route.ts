import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { rateLimit } from "@/lib/rate-limit";
import { findOpenCheckoutUrl, getStripe } from "@/lib/stripe";
import { Messages } from "@/lib/messages";

export const POST = safeHandler(async (req: Request) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: Messages.errors.unauthorized, code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const userId = session.user.id as string;
  await rateLimit(`checkout:${userId}`, { windowMs: 60_000, max: 10 });

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        success: false,
        error: "Le paiement est temporairement indisponible. Réessayez plus tard.",
        code: "PAYMENT_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json(
      { success: false, error: "Cours invalide.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) {
    return NextResponse.json(
      { success: false, error: "Cours introuvable ou supprimé.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const price = Number(course.price);
  if (price <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Ce cours est gratuit, utilisez le bouton d’inscription.",
        code: "BAD_REQUEST",
      },
      { status: 400 },
    );
  }

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Déjà inscrit", code: "CONFLICT", success: false },
      { status: 409 },
    );
  }

  const origin = new URL(req.url).origin;
  const successUrl = `${origin}/academy/${course.slug}?payment=success`;
  const cancelUrl = `${origin}/academy/${course.slug}?payment=cancel`;

  const openUrl = await findOpenCheckoutUrl(stripe, userId, "courseId", course.id);
  if (openUrl) {
    return NextResponse.json({ url: openUrl });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: { userId, courseId },
    line_items: [
      course.stripePriceId
        ? { price: course.stripePriceId, quantity: 1 }
        : {
            price_data: {
              currency: "eur",
              product_data: { name: course.title, description: course.description },
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
    ],
  });

  if (!checkoutSession.url) {
    return NextResponse.json(
      {
        success: false,
        error: "Impossible de créer la session de paiement. Veuillez réessayer.",
        code: "INTERNAL",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
});
