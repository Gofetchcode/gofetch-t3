import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resendKey = (process.env.RESEND_API_KEY || "").trim();
const resend = resendKey ? new Resend(resendKey) : null;

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

    // Send password reset email
    if (resend) {
      await resend.emails.send({
        from: "GoFetch Auto <inquiry@gofetchauto.com>",
        to: [customer.email],
        subject: "GoFetch Auto — Password Reset",
        text: `Hi ${customer.firstName},\n\nYour GoFetch Auto portal password has been reset.\n\nYour new temporary password: ${newTempPw}\n\nLog in at https://gofetchauto.com/portal and you'll be asked to create a new password.\n\nIf you didn't request this reset, please contact us at (352) 410-5889.\n\n— GoFetch Auto Team`,
      });
    }

    // Also store as system message for CRM visibility
    await db.message.create({
      data: { customerId: customer.id, sender: "system", content: `Password reset email sent. Temp password: ${newTempPw}` },
    });

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
