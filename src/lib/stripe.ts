import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export function getStripeWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null;
}

export async function findOpenCheckoutUrl(
  stripe: Stripe,
  userId: string,
  metadataKey: string,
  metadataValue: string,
): Promise<string | null> {
  const { data } = await stripe.checkout.sessions.list({
    status: "open",
    limit: 100,
    created: { gte: Math.floor(Date.now() / 1000) - 30 * 60 },
  });
  const match = data.find(
    (s) => s.client_reference_id === userId && s.metadata?.[metadataKey] === metadataValue,
  );
  return match?.url ?? null;
}
