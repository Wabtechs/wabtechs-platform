import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { findOpenCheckoutUrl, getStripe } from "@/lib/stripe";
import { safeHandler } from "@/lib/safe-handler";
import { Messages } from "@/lib/messages";

export const POST = safeHandler(
  async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Template invalide", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

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

    const template = await db.template.findUnique({ where: { slug } });
    if (!template || !template.published) {
      return NextResponse.json(
        { success: false, error: "Template introuvable ou supprimé", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const price = Number(template.price);
    if (price <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Ce template est gratuit, utilisez le bouton de téléchargement",
          code: "BAD_REQUEST",
        },
        { status: 400 },
      );
    }

    const existingPurchase = await db.templatePurchase.findFirst({
      where: { userId, templateId: template.id },
    });
    if (existingPurchase) {
      return NextResponse.json(
        { error: "Déjà acheté", code: "CONFLICT", success: false },
        { status: 409 },
      );
    }

    const origin = new URL(req.url).origin;
    const successUrl = `${origin}/templates/${template.slug}?purchase=success`;
    const cancelUrl = `${origin}/templates/${template.slug}?purchase=cancel`;

    const openUrl = await findOpenCheckoutUrl(stripe, userId, "templateId", template.id);
    if (openUrl) {
      return NextResponse.json({ url: openUrl });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { userId, templateId: template.id },
      line_items: [
        template.stripePriceId
          ? { price: template.stripePriceId, quantity: 1 }
          : {
              price_data: {
                currency: "eur",
                product_data: { name: template.name, description: template.description },
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
  },
);
