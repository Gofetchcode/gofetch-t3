import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, source, vehicleType, budget, timeline, notes } = body;

    if (!email) return Response.json({ error: "Email required" }, { status: 400 });

    // Dedup check
    const existing = await db.customer.findFirst({ where: { email: email.toLowerCase() } });
    if (existing) return Response.json({ message: "Lead already exists", customerId: existing.id }, { status: 200 });

    const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");

    const customer = await db.customer.create({
      data: {
        firstName: firstName || "", lastName: lastName || "", email: email.toLowerCase(), phone: phone || "",
        password: await bcrypt.hash(tempPw, 10), tempPassword: tempPw,
        source: source || "Webhook", vehicleType: vehicleType || "", budget: budget || "",
        timeline: timeline || "", notes: notes || "",
        gofetchClientId: `GF-2026-${num}`, anonymousEmail: `deals+${num}@gofetchauto.com`,
      },
    });

    await db.message.create({ data: { customerId: customer.id, sender: "system", content: `Welcome! Lead received via webhook.` } });

    return Response.json({ success: true, customerId: customer.id, clientId: customer.gofetchClientId });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
