import Stripe from "stripe";
import { db } from "@/lib/db";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2025-04-30.basil" as any }) : null;

const TIERS: Record<string, { price: number; name: string }> = {
  standard: { price: 9900, name: "GoFetch Auto — Standard Car Buying Advocacy" },
  premium: { price: 19900, name: "GoFetch Auto — Premium Car Buying Advocacy" },
  exotic: { price: 129900, name: "GoFetch Auto — Exotic Car Buying Advocacy" },
};

export async function POST(req: Request) {
  try {
    const { customerId, tier = "standard" } = await req.json();

    if (!stripe) return Response.json({ error: "Stripe not configured" }, { status: 503 });
    if (!customerId) return Response.json({ error: "Customer ID required" }, { status: 400 });

    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return Response.json({ error: "Customer not found" }, { status: 404 });
    }

    const tierData = TIERS[tier] || TIERS.standard;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      metadata: { customerId: customer.id, tier },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: tierData.name },
            unit_amount: tierData.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/portal?payment=success`,
      cancel_url: `${appUrl}/portal?payment=cancelled`,
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
