import { db } from "@/lib/db";
import { detectSentiment } from "@/lib/ai-engine";

// Analyze sentiment on recent messages and flag frustrated customers
export async function POST() {
  try {
    const recentMessages = await db.message.findMany({
      where: { sender: "customer", createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      include: { customer: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });

    const flagged: string[] = [];

    for (const msg of recentMessages) {
      const result = detectSentiment(msg.content);

      if (result.sentiment === "frustrated" || result.sentiment === "negative") {
        // Create AI alert
        await db.aIAlert.create({
          data: {
            customerId: msg.customerId,
            type: `sentiment_${result.sentiment}`,
            message: `Customer message flagged as ${result.sentiment}: "${msg.content.slice(0, 100)}..."`,
            triggered: true,
            triggeredAt: new Date(),
          },
        });

        // Log to learning
        await db.aILearning.create({
          data: {
            category: "sentiment",
            dataPoint: JSON.stringify({ messageId: msg.id, content: msg.content }),
            outcome: JSON.stringify(result),
          },
        });

        flagged.push(msg.customerId);
      }
    }

    return Response.json({ success: true, analyzed: recentMessages.length, flagged: flagged.length });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
