// GoFetch Secret Weapon — AI Counter-Offer Engine (#7)
// Generates intelligent counter-offers based on market data, deal benchmarks, and negotiation strategy

import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface CounterOfferInput {
  vehicle: string;
  dealerName: string;
  dealerOTD: number;
  msrp?: number;
  invoicePrice?: number;
  benchmarkAvg?: number;
  benchmarkP25?: number;
  bestCompetingOffer?: number;
  clientBudget?: number;
  clientTimeline?: string;
  dealerResponseRate?: number;
  isPreferred?: boolean;
  previousCounters?: { amount: number; rejected: boolean }[];
}

export interface CounterOffer {
  suggestedPrice: number;
  strategy: "aggressive" | "moderate" | "conservative";
  reasoning: string;
  emailSubject: string;
  emailBody: string;
  talkingPoints: string[];
  confidence: number; // 0-100 — how likely dealer accepts
}

// Rule-based counter-offer calculation (fast, no API needed)
export function calculateCounterOffer(input: CounterOfferInput): CounterOffer {
  const {
    vehicle, dealerName, dealerOTD, msrp, invoicePrice,
    benchmarkAvg, benchmarkP25, bestCompetingOffer,
    clientBudget, clientTimeline, dealerResponseRate,
    isPreferred, previousCounters,
  } = input;

  // Determine target price
  let targetPrice = dealerOTD;
  let strategy: "aggressive" | "moderate" | "conservative" = "moderate";
  const talkingPoints: string[] = [];

  // Start with invoice if we know it (target 3-5% above invoice)
  if (invoicePrice) {
    targetPrice = Math.round(invoicePrice * 1.03);
    talkingPoints.push(`Invoice price research suggests fair market is near $${targetPrice.toLocaleString()}`);
  }

  // Use benchmark data if available
  if (benchmarkP25 && benchmarkP25 < dealerOTD) {
    targetPrice = Math.min(targetPrice, benchmarkP25);
    talkingPoints.push(`GoFetch data: 25% of similar deals close at or below $${benchmarkP25.toLocaleString()}`);
  }

  // Use competing offer as leverage
  if (bestCompetingOffer && bestCompetingOffer < dealerOTD) {
    targetPrice = Math.min(targetPrice, bestCompetingOffer);
    talkingPoints.push(`We have a competing offer at $${bestCompetingOffer.toLocaleString()} from another dealer`);
    strategy = "aggressive";
  }

  // Client budget constraint
  if (clientBudget && clientBudget < dealerOTD) {
    targetPrice = Math.min(targetPrice, clientBudget);
    talkingPoints.push(`Client's budget ceiling is $${clientBudget.toLocaleString()}`);
  }

  // Don't counter below a reasonable floor (85% of OTD)
  const floor = Math.round(dealerOTD * 0.85);
  if (targetPrice < floor) targetPrice = floor;

  // Adjust strategy based on context
  const discount = ((dealerOTD - targetPrice) / dealerOTD) * 100;
  if (discount > 8) strategy = "aggressive";
  else if (discount < 3) strategy = "conservative";

  // Previous counter history
  if (previousCounters && previousCounters.length > 0) {
    const lastRejected = previousCounters[previousCounters.length - 1];
    if (lastRejected.rejected) {
      // Move up 40% of the gap
      const gap = dealerOTD - lastRejected.amount;
      targetPrice = Math.round(lastRejected.amount + gap * 0.4);
      strategy = "moderate";
      talkingPoints.push("Revised from our previous position to find middle ground");
    }
  }

  // #7D: Multi-dealer leverage — reference competing offers (anonymized)
  if (bestCompetingOffer && bestCompetingOffer < dealerOTD) {
    const numCompeting = previousCounters ? previousCounters.length + 1 : 2;
    talkingPoints.push(`We have ${numCompeting} competing offers, with the current best at $${bestCompetingOffer.toLocaleString()}`);
  }

  // Preferred dealer — be slightly less aggressive
  if (isPreferred) {
    targetPrice = Math.round(targetPrice * 1.01);
    strategy = strategy === "aggressive" ? "moderate" : strategy;
    talkingPoints.push("Valued partner — seeking fair deal for both sides");
  }

  // Timeline urgency
  if (clientTimeline === "ASAP") {
    talkingPoints.push("Client ready to close immediately for the right price");
  }

  // Confidence estimate
  let confidence = 50;
  if (discount <= 3) confidence = 80;
  else if (discount <= 5) confidence = 65;
  else if (discount <= 8) confidence = 45;
  else confidence = 25;
  if (bestCompetingOffer && bestCompetingOffer < dealerOTD) confidence += 15;
  if (isPreferred) confidence += 10;
  confidence = Math.min(95, Math.max(10, confidence));

  // #7C: Walk-away threshold — stop negotiating near floor
  const walkAwayFloor = invoicePrice ? Math.round(invoicePrice * 1.01) : Math.round(dealerOTD * 0.88);
  if (targetPrice <= walkAwayFloor + 300) {
    talkingPoints.push("Near floor price — further negotiation unlikely to yield results");
    strategy = "conservative";
    confidence = Math.min(confidence, 30);
  }

  const savings = dealerOTD - targetPrice;
  const reasoning = `Counter at $${targetPrice.toLocaleString()} (${discount.toFixed(1)}% below their OTD of $${dealerOTD.toLocaleString()}). Expected savings: $${savings.toLocaleString()}. Strategy: ${strategy}.`;

  const emailSubject = `Counter-offer — ${vehicle} — GoFetch Auto`;
  const emailBody = generateCounterEmail(vehicle, dealerName, dealerOTD, targetPrice, talkingPoints, clientTimeline);

  return {
    suggestedPrice: targetPrice,
    strategy,
    reasoning,
    emailSubject,
    emailBody,
    talkingPoints,
    confidence,
  };
}

function generateCounterEmail(
  vehicle: string,
  dealerName: string,
  dealerOTD: number,
  counterPrice: number,
  talkingPoints: string[],
  timeline?: string
): string {
  const timelineText = timeline === "ASAP"
    ? "Our client is ready to complete this purchase immediately."
    : "Our client is actively shopping and comparing offers.";

  return `Hi ${dealerName} Internet Sales Team,

Thank you for your quote of $${dealerOTD.toLocaleString()} OTD on the ${vehicle}.

After reviewing market data and competing offers, we'd like to counter at $${counterPrice.toLocaleString()} OTD.

${talkingPoints.map(tp => `• ${tp}`).join("\n")}

${timelineText}

GoFetch Auto represents qualified, ready-to-buy clients. We deliver fast, no-hassle transactions with minimal floor time.

Please let us know if you can work with this number. We're ready to proceed.

Ricardo Gamon
GoFetch Auto | (352) 410-5889
inquiry@gofetchauto.com`;
}

// AI-powered counter-offer (uses Claude for sophisticated negotiation)
export async function generateAICounterOffer(input: CounterOfferInput): Promise<CounterOffer> {
  // Always compute rule-based first as fallback
  const ruleBased = calculateCounterOffer(input);

  if (!anthropic) return ruleBased;

  try {
    const prompt = `You are an expert automotive negotiator working for GoFetch Auto, a buyer-side advocacy service. Generate a counter-offer.

DEAL CONTEXT:
- Vehicle: ${input.vehicle}
- Dealer: ${input.dealerName}
- Dealer's OTD price: $${input.dealerOTD.toLocaleString()}
${input.msrp ? `- MSRP: $${input.msrp.toLocaleString()}` : ""}
${input.invoicePrice ? `- Invoice: $${input.invoicePrice.toLocaleString()}` : ""}
${input.benchmarkAvg ? `- GoFetch avg deal price: $${input.benchmarkAvg.toLocaleString()}` : ""}
${input.benchmarkP25 ? `- GoFetch 25th percentile: $${input.benchmarkP25.toLocaleString()}` : ""}
${input.bestCompetingOffer ? `- Best competing offer: $${input.bestCompetingOffer.toLocaleString()}` : ""}
${input.clientBudget ? `- Client budget: $${input.clientBudget.toLocaleString()}` : ""}
- Client timeline: ${input.clientTimeline || "flexible"}
- Dealer response rate: ${input.dealerResponseRate ? `${(input.dealerResponseRate * 100).toFixed(0)}%` : "unknown"}
- Preferred dealer: ${input.isPreferred ? "yes" : "no"}
${input.previousCounters?.length ? `- Previous counters: ${input.previousCounters.map(c => `$${c.amount.toLocaleString()} (${c.rejected ? "rejected" : "pending"})`).join(", ")}` : ""}

Return JSON only:
{
  "suggestedPrice": number,
  "strategy": "aggressive" | "moderate" | "conservative",
  "reasoning": "brief explanation",
  "talkingPoints": ["point1", "point2", "point3"],
  "confidence": number (0-100, likelihood dealer accepts)
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return ruleBased;

    const ai = JSON.parse(jsonMatch[0]);
    const emailBody = generateCounterEmail(
      input.vehicle, input.dealerName, input.dealerOTD,
      ai.suggestedPrice, ai.talkingPoints, input.clientTimeline
    );

    return {
      suggestedPrice: ai.suggestedPrice,
      strategy: ai.strategy,
      reasoning: ai.reasoning,
      emailSubject: `Counter-offer — ${input.vehicle} — GoFetch Auto`,
      emailBody,
      talkingPoints: ai.talkingPoints,
      confidence: ai.confidence,
    };
  } catch (err) {
    console.error("[CounterOffer AI] Error:", err);
    return ruleBased;
  }
}
