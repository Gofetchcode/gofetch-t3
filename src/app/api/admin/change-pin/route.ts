import { db } from "@/lib/db";

// One-time PIN change — protected by CRON_SECRET
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { newPin } = await req.json();
    if (!newPin || newPin.length < 4) {
      return Response.json({ error: "PIN must be at least 4 characters" }, { status: 400 });
    }

    await db.dealer.updateMany({ data: { pin: newPin } });
    await db.cRMUser.updateMany({ where: { role: "admin" }, data: { pin: newPin } });

    return Response.json({ success: true, message: "PIN changed for all admin accounts" });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
