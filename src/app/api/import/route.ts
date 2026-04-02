import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { calculateLeadScore } from "@/lib/ai-engine";

export async function POST(req: Request) {
  try {
    const { rows, mapping } = await req.json();

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return Response.json({ error: "No rows provided" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const getValue = (field: string) => {
          const colIndex = Object.entries(mapping).find(([_, v]) => v === field)?.[0];
          if (colIndex === undefined) return "";
          const idx = parseInt(colIndex);
          return (row[idx] || "").trim();
        };

        const email = getValue("email").toLowerCase();
        if (!email || !email.includes("@")) { skipped++; continue; }

        // Dedup
        const existing = await db.customer.findFirst({ where: { email } });
        if (existing) { skipped++; continue; }

        const firstName = getValue("firstName") || "Imported";
        const lastName = getValue("lastName") || "Lead";
        const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
        const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");

        const customer = await db.customer.create({
          data: {
            firstName,
            lastName,
            email,
            phone: getValue("phone"),
            password: await bcrypt.hash(tempPw, 10),
            tempPassword: tempPw,
            vehicleType: getValue("vehicleType"),
            vehicleSpecific: getValue("vehicleSpecific"),
            budget: getValue("budget"),
            timeline: getValue("timeline"),
            source: getValue("source") || "CSV Import",
            notes: getValue("notes"),
            gofetchClientId: `GF-2026-${num}`,
            anonymousEmail: `deals+${num}@gofetchauto.com`,
          },
        });

        // Auto-score
        const score = calculateLeadScore({ budget: getValue("budget"), timeline: getValue("timeline"), vehicleType: getValue("vehicleType"), contractSigned: false, source: getValue("source") || "CSV Import" });
        await db.customer.update({ where: { id: customer.id }, data: { leadScore: score } });

        imported++;
      } catch (err: any) {
        errors.push(err.message);
      }
    }

    return Response.json({ success: true, imported, skipped, errors: errors.slice(0, 5) });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
