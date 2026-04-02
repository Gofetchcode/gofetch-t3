import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return Response.json({ error: "Email required" }, { status: 400 });

    const customer = await db.customer.findFirst({ where: { email: email.toLowerCase() } });
    if (!customer) return Response.json({ success: true }); // Don't reveal if email exists

    const newTempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    await db.customer.update({
      where: { id: customer.id },
      data: { password: await bcrypt.hash(newTempPw, 10), tempPassword: newTempPw, passwordChanged: false },
    });

    await db.message.create({
      data: { customerId: customer.id, sender: "system", content: `Your password has been reset. New temporary password: ${newTempPw}. You'll be asked to change it on next login.` },
    });

    // In production, send this via email instead of storing in message
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
