import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { isAppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { findOpenCheckoutUrl, getStripe } from "@/lib/stripe";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Template invalide" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Connectez-vous pour acheter ce template" },
        { status: 401 },
      );
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

    const template = await db.template.findUnique({ where: { slug } });
    if (!template || !template.published) {
      return NextResponse.json({ error: "Template introuvable" }, { status: 404 });
    }

    const price = Number(template.price);
    if (price <= 0) {
      return NextResponse.json(
        { error: "Ce template est gratuit, utilisez le bouton de téléchargement" },
        { status: 400 },
      );
    }

    const existingPurchase = await db.templatePurchase.findFirst({
      where: { userId, templateId: template.id },
    });
    if (existingPurchase) {
      return NextResponse.json({ error: "Déjà acheté" }, { status: 409 });
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
        { error: "Impossible de créer la session de paiement" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status, headers: error.headers },
      );
    }
    console.error("[checkout]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
