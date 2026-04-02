import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Zapier inbound trigger — accepts any JSON and maps to customer
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || body.Email || body.EMAIL || "").toLowerCase();
    if (!email) return Response.json({ error: "Email required" }, { status: 400 });

    const existing = await db.customer.findFirst({ where: { email } });
    if (existing) return Response.json({ message: "Lead exists", id: existing.id });

    const firstName = body.firstName || body.first_name || body.name?.split(" ")[0] || "";
    const lastName = body.lastName || body.last_name || body.name?.split(" ").slice(1).join(" ") || "";
    const phone = body.phone || body.Phone || "";
    const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");

    const customer = await db.customer.create({
      data: {
        firstName, lastName, email, phone,
        password: await bcrypt.hash(tempPw, 10), tempPassword: tempPw,
        source: body.source || "Zapier",
        vehicleType: body.vehicleType || body.vehicle_type || "",
        budget: body.budget || "",
        timeline: body.timeline || "",
        notes: body.notes || body.message || "",
        gofetchClientId: `GF-2026-${num}`, anonymousEmail: `deals+${num}@gofetchauto.com`,
      },
    });

    return Response.json({ success: true, customerId: customer.id, clientId: customer.gofetchClientId });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
