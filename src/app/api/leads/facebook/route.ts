import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Facebook/Instagram Lead Ads webhook
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // FB sends { entry: [{ changes: [{ value: { leadgen_id, ... } }] }] }
    const leadData = body.entry?.[0]?.changes?.[0]?.value || body;
    const fields = leadData.field_data || [];
    const getField = (name: string) => fields.find((f: any) => f.name === name)?.values?.[0] || "";

    const firstName = getField("first_name") || leadData.firstName || body.firstName || "";
    const lastName = getField("last_name") || leadData.lastName || body.lastName || "";
    const email = getField("email") || leadData.email || body.email || "";
    const phone = getField("phone_number") || leadData.phone || body.phone || "";

    if (!email) return Response.json({ error: "No email" }, { status: 400 });

    const existing = await db.customer.findFirst({ where: { email: email.toLowerCase() } });
    if (existing) return Response.json({ message: "Lead exists", id: existing.id });

    const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");

    const customer = await db.customer.create({
      data: {
        firstName, lastName, email: email.toLowerCase(), phone,
        password: await bcrypt.hash(tempPw, 10), tempPassword: tempPw,
        source: "Facebook Lead Ad",
        gofetchClientId: `GF-2026-${num}`, anonymousEmail: `deals+${num}@gofetchauto.com`,
      },
    });

    return Response.json({ success: true, customerId: customer.id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// FB verification challenge
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.FB_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return Response.json({ error: "Verification failed" }, { status: 403 });
}
