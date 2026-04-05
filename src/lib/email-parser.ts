// GoFetch Secret Weapon — AI Email Parsing (#12)
// Reads dealer email responses and extracts: price, VIN, stock #, availability, sentiment
// Auto-populates OutreachResponse — no manual data entry

import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface ParsedDealerEmail {
  otdPrice?: number;
  msrp?: number;
  invoicePrice?: number;
  negotiatedPrice?: number;
  vin?: string;
  stockNumber?: string;
  availabilityDate?: string;
  inStock: boolean;
  color?: string;
  trim?: string;
  dealerFees?: number;
  sentiment: "positive" | "neutral" | "negative" | "declined";
  summaryOneLiner: string;
  rawExtracted: Record<string, string>;
  confidence: number; // 0-100
}

// Rule-based parser (fast, no API call)
export function parseEmailBasic(subject: string, body: string): ParsedDealerEmail {
  const text = `${subject}\n${body}`.toLowerCase();
  const original = `${subject}\n${body}`;

  const result: ParsedDealerEmail = {
    inStock: false,
    sentiment: "neutral",
    summaryOneLiner: "",
    rawExtracted: {},
    confidence: 30,
  };

  // Price extraction — look for dollar amounts
  const priceMatches = original.match(/\$\s?[\d,]+(?:\.\d{2})?/g);
  if (priceMatches) {
    const prices = priceMatches
      .map(p => parseFloat(p.replace(/[$,\s]/g, "")))
      .filter(p => p >= 10000 && p <= 200000) // realistic vehicle prices
      .sort((a, b) => a - b);

    if (prices.length >= 1) {
      // Largest is usually OTD, smallest might be negotiated
      result.otdPrice = prices[prices.length - 1];
      if (prices.length >= 2) result.negotiatedPrice = prices[0];
      result.confidence += 20;
    }
  }

  // OTD-specific extraction
  const otdMatch = original.match(/(?:otd|out[- ]the[- ]door|total)[:\s]*\$?\s?([\d,]+(?:\.\d{2})?)/i);
  if (otdMatch) {
    result.otdPrice = parseFloat(otdMatch[1].replace(/,/g, ""));
    result.confidence += 15;
  }

  // MSRP extraction
  const msrpMatch = original.match(/(?:msrp|sticker)[:\s]*\$?\s?([\d,]+(?:\.\d{2})?)/i);
  if (msrpMatch) result.msrp = parseFloat(msrpMatch[1].replace(/,/g, ""));

  // VIN extraction (17 char alphanumeric, starts with letters/digits)
  const vinMatch = original.match(/(?:vin|vehicle\s*id)[:\s#]*([A-HJ-NPR-Z0-9]{17})/i)
    || original.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
  if (vinMatch) {
    result.vin = vinMatch[1].toUpperCase();
    result.confidence += 10;
  }

  // Stock number extraction
  const stockMatch = original.match(/(?:stock|stk|stock\s*#|stock\s*no)[:\s#]*([A-Z0-9-]{3,12})/i);
  if (stockMatch) {
    result.stockNumber = stockMatch[1].toUpperCase();
    result.confidence += 10;
  }

  // Availability
  if (text.includes("in stock") || text.includes("on the lot") || text.includes("available now") || text.includes("ready for delivery")) {
    result.inStock = true;
    result.confidence += 5;
  }
  const dateMatch = original.match(/(?:available|arriving|expected|eta)[:\s]*(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\w+ \d{1,2}(?:,?\s*\d{4})?)/i);
  if (dateMatch) result.availabilityDate = dateMatch[1];

  // Color extraction
  const colorMatch = original.match(/(?:color|exterior)[:\s]*(white|black|silver|gray|grey|red|blue|green|brown|beige|pearl|midnight|ice|lunar|celestial|wind chill|magnetic|super white|blizzard)/i);
  if (colorMatch) result.color = colorMatch[1];

  // Dealer fees
  const feeMatch = original.match(/(?:doc\s*fee|dealer\s*fee|processing)[:\s]*\$?\s?([\d,]+)/i);
  if (feeMatch) result.dealerFees = parseFloat(feeMatch[1].replace(/,/g, ""));

  // Sentiment
  const declinedWords = ["not available", "don't have", "do not have", "sold", "no longer", "unable", "can't help", "cannot help", "not interested", "decline"];
  const negativeWords = ["unfortunately", "regret", "sorry", "unable", "highest discount"];
  const positiveWords = ["great deal", "best price", "special", "competitive", "happy to help", "ready to", "let's make", "work with you"];

  if (declinedWords.some(w => text.includes(w))) result.sentiment = "declined";
  else if (negativeWords.some(w => text.includes(w))) result.sentiment = "negative";
  else if (positiveWords.some(w => text.includes(w))) result.sentiment = "positive";

  // #12B: Detect "call me" responses
  const callMePatterns = ["give us a call", "call us at", "call me at", "reach out by phone", "prefer to discuss", "let's talk on the phone", "phone call", "give me a ring"];
  const isCallMe = callMePatterns.some(p => text.includes(p));
  if (isCallMe) {
    // Extract phone number
    const phoneMatch = original.match(/(?:call[^.]*?|at\s*|phone[:\s]*)(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i);
    if (phoneMatch) {
      result.rawExtracted.callBackPhone = phoneMatch[1];
    }
    result.rawExtracted.callMeDetected = "true";
    // Don't set sentiment to declined — they're interested, just want phone
    if (result.sentiment === "neutral") result.sentiment = "positive";
  }

  // Summary
  const parts: string[] = [];
  if (result.otdPrice) parts.push(`$${result.otdPrice.toLocaleString()} OTD`);
  if (result.vin) parts.push(`VIN: ...${result.vin.slice(-4)}`);
  if (result.stockNumber) parts.push(`#${result.stockNumber}`);
  if (result.inStock) parts.push("In Stock");
  if (result.sentiment === "declined") parts.push("DECLINED");
  if (isCallMe) parts.push(`PHONE_REQUIRED${result.rawExtracted.callBackPhone ? ` (${result.rawExtracted.callBackPhone})` : ""}`);
  result.summaryOneLiner = parts.join(" | ") || "Could not extract key details";

  result.confidence = Math.min(95, result.confidence);

  return result;
}

// AI-powered parser (uses Claude for sophisticated extraction)
export async function parseEmailAI(subject: string, body: string): Promise<ParsedDealerEmail> {
  // Always compute rule-based first as fallback
  const basic = parseEmailBasic(subject, body);

  if (!anthropic) return basic;

  try {
    const prompt = `You are parsing a dealer's email response to a vehicle inquiry from GoFetch Auto. Extract structured data.

EMAIL SUBJECT: ${subject}
EMAIL BODY:
${body}

Return JSON only:
{
  "otdPrice": number or null,
  "msrp": number or null,
  "invoicePrice": number or null,
  "negotiatedPrice": number or null,
  "vin": "string" or null,
  "stockNumber": "string" or null,
  "availabilityDate": "string" or null,
  "inStock": boolean,
  "color": "string" or null,
  "trim": "string" or null,
  "dealerFees": number or null,
  "sentiment": "positive" | "neutral" | "negative" | "declined",
  "summaryOneLiner": "brief one-line summary of the offer"
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return basic;

    const ai = JSON.parse(jsonMatch[0]);

    return {
      otdPrice: ai.otdPrice ?? basic.otdPrice,
      msrp: ai.msrp ?? basic.msrp,
      invoicePrice: ai.invoicePrice,
      negotiatedPrice: ai.negotiatedPrice,
      vin: ai.vin ?? basic.vin,
      stockNumber: ai.stockNumber ?? basic.stockNumber,
      availabilityDate: ai.availabilityDate ?? basic.availabilityDate,
      inStock: ai.inStock ?? basic.inStock,
      color: ai.color ?? basic.color,
      trim: ai.trim,
      dealerFees: ai.dealerFees ?? basic.dealerFees,
      sentiment: ai.sentiment ?? basic.sentiment,
      summaryOneLiner: ai.summaryOneLiner || basic.summaryOneLiner,
      rawExtracted: { ...basic.rawExtracted, ai: "true" },
      confidence: 85,
    };
  } catch (err) {
    console.error("[EmailParser AI] Error:", err);
    return basic;
  }
}
