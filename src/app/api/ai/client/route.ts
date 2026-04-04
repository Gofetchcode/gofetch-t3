import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

const apiKey = (process.env.ANTHROPIC_API_KEY || "").replace(/\s+/g, "").trim();
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    const { message, customerId } = await req.json();
    if (!message) return Response.json({ error: "Message required" }, { status: 400 });

    // Get customer context
    let context = `You are GoFetch Auto's client support assistant. You help car buyers track their deal, understand the process, and answer questions about GoFetch Auto's services.

IMPORTANT RULES:
- You are speaking to a CLIENT (car buyer), NOT a dealer or CRM user
- Never reveal dealer names, internal pricing data, or negotiation strategies
- Never mention the CRM, dealer outreach engine, or internal tools
- Be warm, professional, and reassuring
- Focus on: deal progress, timeline estimates, document requirements, payment info, general car buying questions
- If they ask about dealer details before payment: explain that dealer info is revealed after payment is confirmed
- Pricing: Standard $199, Premium $299, Exotic $1,999

`;

    if (customerId) {
      const customer = await db.customer.findUnique({
        where: { id: customerId },
        include: { documents: true, messages: { orderBy: { createdAt: "desc" }, take: 5 }, deskingOffers: { where: { isRevealed: true } } },
      });
      if (customer) {
        const steps = ["Consultation Submitted", "Lead Received", "Market Research", "Negotiating", "Client Approval", "Deal Agreed", "Paperwork & Signing", "Delivery Coordination", "Keys in Hand"];
        context += `\nClient: ${customer.firstName} ${customer.lastName}
Current step: ${customer.step + 1}/9 — ${steps[customer.step] || "In Progress"}
Vehicle: ${customer.vehicleSpecific || customer.vehicleType || "Not specified yet"}
Budget: ${customer.budget || "Not specified"}
Documents uploaded: ${customer.documents.length}
Contract signed: ${customer.contractSigned ? "Yes" : "Not yet"}
Payment: ${customer.paid ? "Paid" : "Not yet"}
Days active: ${Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / 86400000)}
`;
      }
    }

    if (anthropic) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        system: context,
        messages: [{ role: "user", content: message }],
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "I'm having trouble right now. Please call us at (352) 410-5889.";
      return Response.json({ response: text });
    }

    // Fallback without API key
    const lower = message.toLowerCase();
    if (lower.includes("step") || lower.includes("progress") || lower.includes("status")) {
      return Response.json({ response: "Your deal is being actively worked on by your GoFetch advocate. You can see your current progress in the 'My Deal' tab. Each step is updated in real-time as we make progress." });
    }
    if (lower.includes("pay") || lower.includes("cost") || lower.includes("price") || lower.includes("fee")) {
      return Response.json({ response: "Our service fees are: Standard $199, Premium $299, Exotic $1,999. Payment is only required after we've negotiated your deal and you've approved it. You'll see a 'Pay Now' button in the Payment tab when it's time." });
    }
    if (lower.includes("document") || lower.includes("upload")) {
      return Response.json({ response: "You can upload documents in the Documents tab. We accept Driver's License, Insurance Card, Proof of Income, and Pre-Approval letters. Files must be PDF, JPEG, or PNG under 10MB." });
    }
    if (lower.includes("dealer") || lower.includes("which")) {
      return Response.json({ response: "For your protection, dealer details are kept confidential until your service fee is paid. This ensures the best possible negotiation on your behalf. Once payment is confirmed, you'll see the full dealer info in your portal." });
    }
    return Response.json({ response: "Thanks for reaching out! Your GoFetch advocate is working on your deal. If you need immediate help, call us at (352) 410-5889 or check your deal progress in the 'My Deal' tab." });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
