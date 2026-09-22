import Stripe from "stripe";

let client: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (client !== undefined) return client;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    client = null;
    return client;
  }
  client = new Stripe(key);
  return client;
}
