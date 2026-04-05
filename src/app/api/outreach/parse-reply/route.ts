import { db } from "@/lib/db";
import { parseEmailAI, parseEmailBasic } from "@/lib/email-parser";

// Inbound webhook: when a dealer replies to outreach, parse the email
// and auto-populate the OutreachResponse with extracted data.
// Can be triggered by Resend/SendGrid inbound webhook or manually.

export async function POST(req: Request) {
  try {
    const { from, subject, body, campaignId, dealerEmail, useAI } = await req.json();

    if (!subject && !body) {
      return Response.json({ error: "Missing email subject or body" }, { status: 400 });
    }

    // Parse the email
    const parsed = useAI
      ? await parseEmailAI(subject || "", body || "")
      : parseEmailBasic(subject || "", body || "");

    // Try to find the matching outreach response
    let response = null;

    if (campaignId && dealerEmail) {
      // Direct match: campaign + dealer email
      const dealership = await db.dealership.findFirst({
        where: { email: dealerEmail },
      });

      if (dealership) {
        response = await db.outreachResponse.findFirst({
          where: { campaignId, dealershipId: dealership.id },
        });
      }
    } else if (from) {
      // Try to match by sender email
      const senderEmail = from.match(/<([^>]+)>/)?.[1] || from.trim();
      const dealership = await db.dealership.findFirst({
        where: { email: { contains: senderEmail.split("@")[0] } },
      });

      if (dealership) {
        // Find most recent pending response for this dealer
        response = await db.outreachResponse.findFirst({
          where: { dealershipId: dealership.id, status: "pending" },
          orderBy: { createdAt: "desc" },
        });
      }
    }

    // #12C: Dedup check — if same dealer+campaign responded in last 24hrs, merge
    if (response && response.status !== "pending") {
      const hoursSince = response.respondedAt
        ? (Date.now() - new Date(response.respondedAt).getTime()) / 3600000
        : 999;

      if (hoursSince < 24) {
        // Merge: keep better price if both have prices
        const existingPrice = parseFloat((response.otdPrice || "0").replace(/[^0-9.]/g, ""));
        const newPrice = parsed.otdPrice || 0;
        const keepNewPrice = newPrice > 0 && (existingPrice <= 0 || newPrice < existingPrice);

        const mergeData: any = {};
        if (keepNewPrice) mergeData.otdPrice = `$${newPrice.toLocaleString()}`;
        if (parsed.vin && !response.vin) mergeData.vin = parsed.vin;
        if (parsed.stockNumber && !response.stockNumber) mergeData.stockNumber = parsed.stockNumber;
        mergeData.notes = `${response.notes || ""} | Updated: ${parsed.summaryOneLiner}`.trim();

        await db.outreachResponse.update({ where: { id: response.id }, data: mergeData });

        return Response.json({
          success: true,
          parsed,
          matched: true,
          merged: true,
          responseId: response.id,
          message: `Duplicate detected — merged with existing response (kept ${keepNewPrice ? "new" : "original"} price)`,
        });
      }
    }

    // Auto-populate the response if found
    if (response) {
      const updateData: any = {
        status: parsed.sentiment === "declined" ? "declined" : "received",
        respondedAt: new Date(),
        notes: parsed.summaryOneLiner,
      };

      if (parsed.otdPrice) updateData.otdPrice = `$${parsed.otdPrice.toLocaleString()}`;
      if (parsed.vin) updateData.vin = parsed.vin;
      if (parsed.stockNumber) updateData.stockNumber = parsed.stockNumber;

      // Calculate response time in minutes
      const responseTimeMin = Math.floor(
        (Date.now() - new Date(response.createdAt).getTime()) / 60000
      );
      updateData.responseTime = responseTimeMin;

      await db.outreachResponse.update({
        where: { id: response.id },
        data: updateData,
      });

      // Increment campaign response count
      await db.outreachCampaign.update({
        where: { id: response.campaignId },
        data: { dealersResponded: { increment: 1 } },
      });

      // Update dealer's response rate
      const dealerTotals = await db.outreachResponse.groupBy({
        by: ["dealershipId"],
        where: { dealershipId: response.dealershipId },
        _count: true,
      });
      const dealerResponded = await db.outreachResponse.count({
        where: { dealershipId: response.dealershipId, status: { not: "pending" } },
      });
      const total = dealerTotals[0]?._count || 1;

      await db.dealership.update({
        where: { id: response.dealershipId },
        data: {
          responseRate: dealerResponded / total,
          avgResponseTime: responseTimeMin,
          lastContacted: new Date(),
        },
      });

      // Log to AI learning
      await db.aILearning.create({
        data: {
          category: "email_parse",
          dataPoint: JSON.stringify({ subject, bodyLength: (body || "").length, from }),
          outcome: JSON.stringify(parsed),
        },
      });
    }

    return Response.json({
      success: true,
      parsed,
      matched: !!response,
      responseId: response?.id || null,
      message: response
        ? `Parsed and auto-populated response ${response.id}`
        : "Parsed but could not match to an outreach response",
    });
  } catch (err: any) {
    console.error("[ParseReply] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
