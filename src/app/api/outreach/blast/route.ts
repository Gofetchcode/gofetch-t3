import { db } from "@/lib/db";
import { sendOutreachEmail } from "@/lib/outreach-sender";
import { submitDealerForm, PLATFORM_TEMPLATES } from "@/lib/form-submitter";

// The Secret Weapon — blast outreach to all matching dealers
// Uses: form submission (preferred) → email (fallback)
export async function POST(req: Request) {
  try {
    const { customerId, vehicle, brand, maxPrice, color, features, timeline, radiusMiles } = await req.json();

    const customer = await db.customer.findUnique({
      where: { id: customerId },
      select: { gofetchClientId: true, firstName: true, lastName: true },
    });
    if (!customer?.gofetchClientId) return Response.json({ error: "Customer not found" }, { status: 404 });

    // Find matching dealers
    const where: any = { isActive: true };
    if (brand) where.brand = brand;
    const dealers = await db.dealership.findMany({ where, orderBy: { responseRate: "desc" } });

    if (dealers.length === 0) return Response.json({ success: true, sent: 0, message: "No matching dealers found" });

    // Create campaign
    const campaign = await db.outreachCampaign.create({
      data: {
        customerId,
        vehicleDesc: vehicle,
        colorPref: color || null,
        features: features || null,
        maxPrice: maxPrice || null,
        radiusMiles: radiusMiles || 250,
        brandFilter: brand || null,
        dealersSent: 0,
        status: "active",
      },
    });

    const results: { dealer: string; method: string; success: boolean }[] = [];
    let sent = 0;
    let failed = 0;

    for (const dealer of dealers) {
      let success = false;
      let method = "none";

      // Strategy 1: Form submission (if we have form mapping)
      if (dealer.website) {
        // Check if dealer has a stored form mapping
        const formMapping = await db.dealership.findUnique({
          where: { id: dealer.id },
          select: { formUrl: true, formPlatform: true },
        }).catch(() => null);

        if (formMapping?.formUrl && formMapping?.formPlatform) {
          const template = PLATFORM_TEMPLATES[formMapping.formPlatform] || PLATFORM_TEMPLATES.generic;
          const result = await submitDealerForm(
            { dealerId: dealer.id, dealerName: dealer.name, formUrl: formMapping.formUrl, ...template },
            { vehicle, color, features, budget: maxPrice, timeline, clientId: customer.gofetchClientId }
          );
          success = result.success;
          method = success ? `form_${formMapping.formPlatform}` : "form_failed";
        }
      }

      // Strategy 2: Email fallback
      if (!success && dealer.email) {
        const emailResult = await sendOutreachEmail(dealer, vehicle, {
          color, features, budget: maxPrice, timeline, clientId: customer.gofetchClientId,
        });
        success = emailResult.success;
        method = emailResult.method;
      }

      // Track response
      if (success) {
        await db.outreachResponse.create({
          data: { campaignId: campaign.id, dealershipId: dealer.id, status: "pending" },
        });
        sent++;
      } else {
        failed++;
      }

      results.push({ dealer: dealer.name, method, success });
    }

    // Update campaign
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
      message: `Outreach sent to ${sent}/${dealers.length} dealers via form submission and email`,
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
