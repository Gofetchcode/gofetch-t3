import { db } from "@/lib/db";
import { sendOutreachEmail } from "@/lib/outreach-sender";

export async function POST(req: Request) {
  try {
    const { customerId, vehicle, brand, maxPrice, color, features, timeline } = await req.json();

    const customer = await db.customer.findUnique({ where: { id: customerId }, select: { gofetchClientId: true, firstName: true, lastName: true } });
    if (!customer?.gofetchClientId) return Response.json({ error: "Customer not found" }, { status: 404 });

    // Find matching dealers
    const where: any = { isActive: true };
    if (brand) where.brand = brand;
    const dealers = await db.dealership.findMany({ where, orderBy: { responseRate: "desc" } });

    if (dealers.length === 0) return Response.json({ success: true, sent: 0, failed: 0, totalDealers: 0, message: "No matching dealers found" });

    // Auto-create campaign
    const campaign = await db.outreachCampaign.create({
      data: {
        customerId,
        vehicleDesc: vehicle || "Vehicle",
        colorPref: color || null,
        features: features || null,
        maxPrice: maxPrice || null,
        radiusMiles: 100,
        brandFilter: brand || null,
        dealersSent: 0,
        dealersResponded: 0,
        status: "active",
      },
    });

    let sent = 0;
    let failed = 0;
    const results: { dealer: string; success: boolean; method: string }[] = [];

    for (const dealer of dealers) {
      const result = await sendOutreachEmail(dealer, vehicle, {
        color, features, budget: maxPrice, timeline, clientId: customer.gofetchClientId,
      });

      if (result.success) {
        await db.outreachResponse.create({
          data: {
            campaignId: campaign.id,
            dealershipId: dealer.id,
            status: "pending",
          },
        });
        sent++;
        results.push({ dealer: dealer.name, success: true, method: result.method });
      } else {
        failed++;
        results.push({ dealer: dealer.name, success: false, method: result.method });
      }
    }

    // Update campaign with send count
    await db.outreachCampaign.update({
      where: { id: campaign.id },
      data: { dealersSent: sent },
    });

    return Response.json({
      success: true,
      campaignId: campaign.id,
      sent,
      failed,
      totalDealers: dealers.length,
      results,
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
