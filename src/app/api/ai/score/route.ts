import { db } from "@/lib/db";
import { calculateLeadScore } from "@/lib/ai-engine";

// Score all active leads — called by cron or manually
export async function POST() {
  try {
    const customers = await db.customer.findMany({
      where: { step: { lt: 8 } },
      include: { documents: true, messages: true },
    });

    let updated = 0;
    for (const c of customers) {
      const score = calculateLeadScore(c);
      if (score !== c.leadScore) {
        await db.customer.update({ where: { id: c.id }, data: { leadScore: score } });
        // Log to AILearning
        await db.aILearning.create({
          data: {
            category: "lead_scoring",
            dataPoint: JSON.stringify({ customerId: c.id, oldScore: c.leadScore, newScore: score }),
            outcome: JSON.stringify({ score }),
          },
        });
        updated++;
      }
    }

    return Response.json({ success: true, scored: customers.length, updated });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
