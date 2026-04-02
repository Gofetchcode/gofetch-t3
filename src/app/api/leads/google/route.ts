import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Google Ads lead form extensions webhook
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.user_column_data || body;
    const getCol = (name: string) => data.find?.((c: any) => c.column_id === name)?.string_value || body[name] || "";

    const firstName = getCol("FIRST_NAME") || body.firstName || "";
    const lastName = getCol("LAST_NAME") || body.lastName || "";
    const email = getCol("EMAIL") || body.email || "";
    const phone = getCol("PHONE_NUMBER") || body.phone || "";

    if (!email) return Response.json({ error: "No email" }, { status: 400 });

    const existing = await db.customer.findFirst({ where: { email: email.toLowerCase() } });
    if (existing) return Response.json({ message: "Lead exists", id: existing.id });

    const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");

    const customer = await db.customer.create({
      data: {
        firstName, lastName, email: email.toLowerCase(), phone,
        password: await bcrypt.hash(tempPw, 10), tempPassword: tempPw,
        source: "Google Ads",
        gofetchClientId: `GF-2026-${num}`, anonymousEmail: `deals+${num}@gofetchauto.com`,
      },
    });

    return Response.json({ success: true, customerId: customer.id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
