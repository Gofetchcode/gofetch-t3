import { db } from "@/lib/db";
import { sendOutreachEmail, sendADFToDealerCRM } from "@/lib/outreach-sender";

// Execute outreach campaign: send to all matching dealers
export async function POST(req: Request) {
  try {
    const { campaignId, customerId, vehicle, brand, radiusMiles, maxPrice, color, features, timeline } = await req.json();

    // Get customer's anonymous ID
    const customer = await db.customer.findUnique({ where: { id: customerId }, select: { gofetchClientId: true } });
    if (!customer?.gofetchClientId) return Response.json({ error: "Customer not found" }, { status: 404 });

    // Find matching dealers
    const where: any = { isActive: true };
    if (brand) where.brand = brand;
    const dealers = await db.dealership.findMany({ where, orderBy: { responseRate: "desc" } });

    let sent = 0;
    let failed = 0;

    for (const dealer of dealers) {
      // Try ADF first (higher response rate), fallback to email
      const result = await sendOutreachEmail(dealer, vehicle, {
        color, features, budget: maxPrice, timeline, clientId: customer.gofetchClientId,
      });

      if (result.success) {
        // Create response tracking record
        await db.outreachResponse.create({
          data: {
            campaignId: campaignId || "manual",
            dealershipId: dealer.id,
            status: "pending",
          },
        });
        sent++;
      } else {
        failed++;
      }
    }

    // Update campaign stats
    if (campaignId) {
      await db.outreachCampaign.update({
        where: { id: campaignId },
        data: { dealersSent: sent },
      });
    }

    return Response.json({ success: true, sent, failed, totalDealers: dealers.length });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
