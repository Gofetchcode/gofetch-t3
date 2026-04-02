import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

const apiKey = (process.env.ANTHROPIC_API_KEY || "").replace(/\s+/g, "").trim();
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    const { message, customerId } = await req.json();

    if (!message) return Response.json({ error: "Message required" }, { status: 400 });

    // Gather CRM context
    let context = "You are Fetch AI, the GoFetch Auto CRM co-pilot. You help car buying advocates manage their deals.\n\n";

    const stats = await db.customer.aggregate({ _count: true });
    const activeDeals = await db.customer.count({ where: { step: { lt: 8 } } });
    const delivered = await db.customer.count({ where: { step: 8 } });
    context += `CRM Stats: ${stats._count} total customers, ${activeDeals} active deals, ${delivered} delivered.\n`;

    if (customerId) {
      const customer = await db.customer.findUnique({
        where: { id: customerId },
        include: { messages: { orderBy: { createdAt: "desc" }, take: 5 }, deskingOffers: true, documents: true },
      });
      if (customer) {
        context += `\nCurrent customer: ${customer.firstName} ${customer.lastName}, Step ${customer.step}/8, Vehicle: ${customer.vehicleSpecific || "TBD"}, Budget: ${customer.budget || "TBD"}, Lead Score: ${customer.leadScore}, Source: ${customer.source || "Unknown"}\n`;
        if (customer.deskingOffers.length > 0) {
          context += `Offers: ${customer.deskingOffers.map(o => `${o.vehicleDesc} at ${o.otdPrice} (${o.status})`).join(", ")}\n`;
        }
      }
    }

    // Get top leads for context
    const hotLeads = await db.customer.findMany({
      where: { step: { lt: 8 } },
      orderBy: { leadScore: "desc" },
      take: 5,
      select: { firstName: true, lastName: true, leadScore: true, step: true, vehicleSpecific: true },
    });
    if (hotLeads.length > 0) {
      context += `\nTop leads: ${hotLeads.map(l => `${l.firstName} ${l.lastName} (score: ${l.leadScore}, step: ${l.step})`).join(", ")}\n`;
    }

    // Call Claude API
    if (anthropic) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: context + "\nBe concise and actionable. Use **bold** for key data points. Answer as a CRM expert.",
        messages: [{ role: "user", content: message }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "Unable to process.";
      return Response.json({ response: text });
    }

    // Fallback: smart mock responses when no API key
    const lower = message.toLowerCase();
    let reply = "Based on your CRM data, I can help with lead scores, deal status, draft messages, and analytics. What would you like to know?";

    if (lower.includes("hot") || lower.includes("best lead")) {
      if (hotLeads.length > 0) {
        const top = hotLeads[0];
        reply = `Your hottest lead is **${top.firstName} ${top.lastName}** (Score: ${top.leadScore}). They're at step ${top.step} looking for a ${top.vehicleSpecific || "vehicle"}. Recommend: reach out today.`;
      }
    } else if (lower.includes("conversion") || lower.includes("rate")) {
      const total = stats._count || 1;
      reply = `Conversion rate: **${Math.round((delivered / total) * 100)}%** (${delivered} delivered out of ${total} total). Active pipeline: ${activeDeals} deals.`;
    } else if (lower.includes("next") || lower.includes("what should")) {
      reply = `**Today's priorities:**\n1. Follow up with your top-scored leads\n2. Check for any stalled deals (${activeDeals} active)\n3. Review any pending offers\n4. Respond to unanswered messages`;
    } else if (lower.includes("draft") || lower.includes("text") || lower.includes("message")) {
      reply = `Here's a draft follow-up:\n\n"Hi! Quick update — we've been negotiating with several dealers and things are looking great. Should have numbers for you very soon. Any questions in the meantime?"`;
    }

    return Response.json({ response: reply });
  } catch (err: any) {
    console.error("AI chat error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
// force rebuild Thu Apr  2 12:45:18 EDT 2026
