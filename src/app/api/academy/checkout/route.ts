import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { rateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe";

export const POST = safeHandler(async (req: Request) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Connectez-vous pour acheter ce cours" }, { status: 401 });
  }

  const userId = session.user.id as string;
  await rateLimit(`checkout:${userId}`, { windowMs: 60_000, max: 10 });

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Paiement temporairement indisponible. Réessayez plus tard." },
      { status: 503 },
    );
  }

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json({ error: "Cours invalide" }, { status: 400 });
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  const price = Number(course.price);
  if (price <= 0) {
    return NextResponse.json(
      { error: "Ce cours est gratuit, utilisez le bouton d'inscription" },
      { status: 400 },
    );
  }

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
  }

  const origin = new URL(req.url).origin;
  const successUrl = `${origin}/academy/${course.slug}?payment=success`;
  const cancelUrl = `${origin}/academy/${course.slug}?payment=cancel`;

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
      { error: "Impossible de créer la session de paiement" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
});
