import { db } from "@/lib/db";
import { parseEmailBasic } from "@/lib/email-parser";

// Inbound Dealer Portal API (#10)
// Dealers submit offers directly through a public form.
// This flips the power dynamic — dealers come to GoFetch.

export async function POST(req: Request) {
  try {
    const {
      dealerName, dealerEmail, dealerPhone, contactName,
      campaignId, vehicleDesc,
      otdPrice, msrp, vin, stockNumber, color, trim,
      inStock, availabilityDate, notes, dealerFees,
    } = await req.json();

    if (!dealerName || !dealerEmail) {
      return Response.json({ error: "Dealer name and email required" }, { status: 400 });
    }

    // Find or create dealership
    let dealership = await db.dealership.findFirst({
      where: { email: dealerEmail },
    });

    if (!dealership) {
      dealership = await db.dealership.create({
        data: {
          name: dealerName,
          email: dealerEmail,
          phone: dealerPhone || null,
          contactName: contactName || null,
          isActive: true,
        },
      });
    }

    // If campaignId provided, update the matching response
    if (campaignId) {
      let response = await db.outreachResponse.findFirst({
        where: { campaignId, dealershipId: dealership.id },
      });

      if (response) {
        await db.outreachResponse.update({
          where: { id: response.id },
          data: {
            status: "received",
            otdPrice: otdPrice ? `$${otdPrice}` : null,
            vin: vin || null,
            stockNumber: stockNumber || null,
            notes: [
              notes,
              color ? `Color: ${color}` : null,
              trim ? `Trim: ${trim}` : null,
              inStock ? "In Stock" : null,
              availabilityDate ? `Available: ${availabilityDate}` : null,
              dealerFees ? `Dealer fees: $${dealerFees}` : null,
            ].filter(Boolean).join(" | "),
            respondedAt: new Date(),
            responseTime: Math.floor(
              (Date.now() - new Date(response.createdAt).getTime()) / 60000
            ),
          },
        });

        // Update campaign
        await db.outreachCampaign.update({
          where: { id: campaignId },
          data: { dealersResponded: { increment: 1 } },
        });
      } else {
        // Create new response
        response = await db.outreachResponse.create({
          data: {
            campaignId,
            dealershipId: dealership.id,
            status: "received",
            otdPrice: otdPrice ? `$${otdPrice}` : null,
            vin: vin || null,
            stockNumber: stockNumber || null,
            notes: notes || null,
            respondedAt: new Date(),
          },
        });

        await db.outreachCampaign.update({
          where: { id: campaignId },
          data: { dealersResponded: { increment: 1 } },
        });
      }

      // Update dealer stats
      const totalResp = await db.outreachResponse.count({ where: { dealershipId: dealership.id } });
      const respondedResp = await db.outreachResponse.count({
        where: { dealershipId: dealership.id, status: { not: "pending" } },
      });
      await db.dealership.update({
        where: { id: dealership.id },
        data: {
          responseRate: totalResp > 0 ? respondedResp / totalResp : 1,
          lastContacted: new Date(),
        },
      });

      return Response.json({
        success: true,
        message: "Offer submitted successfully. GoFetch will review and respond within 24 hours.",
        responseId: response.id,
      });
    }

    // No campaign — create as a general inbound offer
    // Find the most recent active campaign that matches
    const activeCampaigns = await db.outreachCampaign.findMany({
      where: { status: "active" },
      orderBy: { sentAt: "desc" },
      take: 1,
    });

    if (activeCampaigns.length > 0) {
      const campaign = activeCampaigns[0];
      const response = await db.outreachResponse.create({
        data: {
          campaignId: campaign.id,
          dealershipId: dealership.id,
          status: "received",
          otdPrice: otdPrice ? `$${otdPrice}` : null,
          vin: vin || null,
          stockNumber: stockNumber || null,
          notes: `INBOUND PORTAL SUBMISSION | ${vehicleDesc || ""} | ${notes || ""}`.trim(),
          respondedAt: new Date(),
        },
      });

      return Response.json({
        success: true,
        message: "Offer received. Our team will review it shortly.",
        responseId: response.id,
      });
    }

    return Response.json({
      success: true,
      message: "Offer received. We'll match it to an active inquiry and follow up.",
      dealershipId: dealership.id,
    });
  } catch (err: any) {
    console.error("[DealerPortal] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET — List active inquiries for the portal
export async function GET(req: Request) {
  try {
    const campaigns = await db.outreachCampaign.findMany({
      where: { status: "active" },
      select: {
        id: true,
        vehicleDesc: true,
        colorPref: true,
        maxPrice: true,
        radiusMiles: true,
        sentAt: true,
        dealersSent: true,
        dealersResponded: true,
      },
      orderBy: { sentAt: "desc" },
      take: 20,
    });

    return Response.json({
      success: true,
      inquiries: campaigns.map(c => ({
        id: c.id,
        vehicle: c.vehicleDesc,
        color: c.colorPref,
        budget: c.maxPrice,
        radius: c.radiusMiles,
        postedAt: c.sentAt,
        responsesReceived: c.dealersResponded,
      })),
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
