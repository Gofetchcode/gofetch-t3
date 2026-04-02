import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Inbound email parser
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from, subject, body: emailBody } = body;

    // Extract email from "Name <email@example.com>" format
    const emailMatch = (from || "").match(/<(.+?)>/) || [null, from];
    const email = (emailMatch[1] || "").trim().toLowerCase();
    if (!email || !email.includes("@")) return Response.json({ error: "No valid email" }, { status: 400 });

    const nameMatch = (from || "").match(/^(.+?)\s*</);
    const fullName = nameMatch ? nameMatch[1].trim() : email.split("@")[0];
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "";

    const existing = await db.customer.findFirst({ where: { email } });
    if (existing) {
      await db.message.create({ data: { customerId: existing.id, sender: "customer", content: `Email: ${subject}\n\n${emailBody || ""}` } });
      return Response.json({ message: "Added to existing lead", id: existing.id });
    }

    const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");

    const customer = await db.customer.create({
      data: {
        firstName, lastName, email, phone: "",
        password: await bcrypt.hash(tempPw, 10), tempPassword: tempPw,
        source: "Email", notes: `Subject: ${subject}\n\n${emailBody || ""}`,
        gofetchClientId: `GF-2026-${num}`, anonymousEmail: `deals+${num}@gofetchauto.com`,
      },
    });

    return Response.json({ success: true, customerId: customer.id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
