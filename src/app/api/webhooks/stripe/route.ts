import Stripe from "stripe";
import { db } from "@/lib/db";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2025-04-30.basil" as any }) : null;

export async function POST(req: Request) {
  if (!stripe) return Response.json({ error: "Stripe not configured" }, { status: 503 });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.metadata?.customerId;
    const tier = session.metadata?.tier || "standard";

    if (customerId) {
      const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(0)}` : "$99";

      await db.customer.update({
        where: { id: customerId },
        data: {
          paid: true,
          paidDate: new Date(),
          paidAmount: amount,
          stripePaymentId: session.id,
        },
      });

      // Log message
      await db.message.create({
        data: {
          customerId,
          sender: "system",
          content: `Payment of ${amount} received! Your ${tier} advocacy service is now active. We're moving your deal forward.`,
        },
      });

      // Reveal desking offers after payment
      await db.deskingOffer.updateMany({
        where: { customerId, isRevealed: false },
        data: { isRevealed: true },
      });
    }
  }

  return Response.json({ received: true });
}
