import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// ADF/XML lead format (Cars.com, AutoTrader, TrueCar, Edmunds)
export async function POST(req: Request) {
  try {
    const text = await req.text();

    // Parse ADF/XML — extract basic fields
    const getTag = (tag: string) => { const m = text.match(new RegExp(`<${tag}>(.*?)</${tag}>`, "s")); return m ? m[1].trim() : ""; };
    const firstName = getTag("firstname") || getTag("first");
    const lastName = getTag("lastname") || getTag("last");
    const email = getTag("email");
    const phone = getTag("phone");
    const vehicle = getTag("vehicle") || getTag("make") + " " + getTag("model");

    if (!email) return Response.json({ error: "No email in ADF" }, { status: 400 });

    const existing = await db.customer.findFirst({ where: { email: email.toLowerCase() } });
    if (existing) return Response.json({ message: "Lead exists", id: existing.id });

    const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");

    const customer = await db.customer.create({
      data: {
        firstName, lastName, email: email.toLowerCase(), phone,
        password: await bcrypt.hash(tempPw, 10), tempPassword: tempPw,
        source: "ADF/XML", vehicleSpecific: vehicle.trim(),
        gofetchClientId: `GF-2026-${num}`, anonymousEmail: `deals+${num}@gofetchauto.com`,
      },
    });

    return Response.json({ success: true, customerId: customer.id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
