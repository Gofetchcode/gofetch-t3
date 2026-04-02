import { db } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = (process.env.ANTHROPIC_API_KEY || "").replace(/\s+/g, "").trim();
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question) return Response.json({ error: "Question required" }, { status: 400 });

    // Gather real analytics data
    const total = await db.customer.count();
    const delivered = await db.customer.count({ where: { step: 8 } });
    const paid = await db.customer.count({ where: { paid: true } });
    const fleet = await db.customer.count({ where: { isFleet: true } });
    const retail = total - fleet;
    const active = await db.customer.count({ where: { step: { lt: 8 } } });
    const byStep = await Promise.all(Array.from({ length: 9 }, (_, i) => db.customer.count({ where: { step: i } })));
    const recentLeads = await db.customer.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 86400000) } } });
    const avgScore = await db.customer.aggregate({ _avg: { leadScore: true }, where: { step: { lt: 8 } } });

    const context = `CRM Analytics Data:
- Total customers: ${total}, Active: ${active}, Delivered: ${delivered}, Paid: ${paid}
- Fleet: ${fleet}, Retail: ${retail}
- Pipeline: ${byStep.map((c, i) => `Step ${i}: ${c}`).join(", ")}
- Last 30 days: ${recentLeads} new leads
- Avg lead score: ${Math.round(avgScore._avg?.leadScore || 0)}
- Conversion rate: ${total > 0 ? Math.round((delivered / total) * 100) : 0}%
- Revenue estimate: $${paid * 99} (at $99/deal avg)`;

    if (anthropic) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: `You are an analytics assistant for GoFetch Auto CRM. Answer questions about business performance using this data:\n\n${context}\n\nBe concise. Use specific numbers. Format with **bold** for key metrics.`,
        messages: [{ role: "user", content: question }],
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "Unable to process.";
      return Response.json({ answer: text });
    }

    // Fallback without API key
    const lower = question.toLowerCase();
    let answer = `Based on your CRM data: **${total}** total customers, **${active}** active deals, **${delivered}** delivered. Conversion rate: **${total > 0 ? Math.round((delivered / total) * 100) : 0}%**.`;

    if (lower.includes("close") || lower.includes("deal")) {
      answer = `You've closed **${delivered}** deals total. Conversion rate: **${total > 0 ? Math.round((delivered / total) * 100) : 0}%**. ${recentLeads} new leads in the last 30 days.`;
    } else if (lower.includes("revenue") || lower.includes("money")) {
      answer = `Estimated revenue: **$${paid * 99}** from ${paid} paid deals. Fleet: ${fleet} clients, Retail: ${retail} clients.`;
    } else if (lower.includes("source") || lower.includes("lead")) {
      answer = `**${recentLeads}** new leads in the last 30 days. Average lead score: **${Math.round(avgScore._avg?.leadScore || 0)}**. Pipeline: ${byStep.filter(c => c > 0).length} active stages.`;
    } else if (lower.includes("response") || lower.includes("time")) {
      answer = `Average lead score: **${Math.round(avgScore._avg?.leadScore || 0)}**. ${active} deals currently active across the pipeline.`;
    }

    return Response.json({ answer });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
