import { z } from "zod";
import { router, dealerProcedure } from "../trpc";
import { rankResponses, findPriceDiscrepancies, calculateBenchmark, generateCompetitiveInsight } from "@/lib/response-scoring";
import { calculateCounterOffer, generateAICounterOffer } from "@/lib/counter-offer-engine";
import { buildTimingProfile, getOptimalSendTime, getTimingInsight } from "@/lib/dealer-timing";

export const outreachRouter = router({
  // ═══ EXISTING — Get campaigns for a customer ═══
  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.outreachCampaign.findMany({
        where: { customerId: input.customerId },
        include: { responses: { include: { dealership: true } } },
        orderBy: { sentAt: "desc" },
      });
    }),

  // ═══ EXISTING — Create campaign ═══
  create: dealerProcedure
    .input(z.object({
      customerId: z.string(),
      vehicleDesc: z.string().optional(),
      colorPref: z.string().optional(),
      features: z.string().optional(),
      maxPrice: z.string().optional(),
      radiusMiles: z.number().optional(),
      brandFilter: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.outreachCampaign.create({ data: input });
    }),

  // ═══ EXISTING — Add response ═══
  addResponse: dealerProcedure
    .input(z.object({
      campaignId: z.string(),
      dealershipId: z.string(),
      otdPrice: z.string().optional(),
      vin: z.string().optional(),
      stockNumber: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.outreachResponse.create({
        data: { ...input, status: "received", respondedAt: new Date() },
      });
      await ctx.db.outreachCampaign.update({
        where: { id: input.campaignId },
        data: { dealersResponded: { increment: 1 } },
      });
      return response;
    }),

  // ═══ EXISTING — Get all dealerships ═══
  getDealerships: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.dealership.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  // ═══ EXISTING — Add dealership ═══
  addDealership: dealerProcedure
    .input(z.object({
      name: z.string(),
      brand: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      contactName: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dealership.create({ data: input });
    }),

  // ═══ #1 — RESPONSE SCORING: Get ranked responses for a campaign ═══
  getScoredResponses: dealerProcedure
    .input(z.object({ campaignId: z.string() }))
    .query(async ({ ctx, input }) => {
      const campaign = await ctx.db.outreachCampaign.findUnique({
        where: { id: input.campaignId },
        include: {
          responses: {
            include: { dealership: true },
            where: { status: { not: "pending" } },
          },
        },
      });
      if (!campaign) return { ranked: [], discrepancies: [], benchmark: null };

      const maxPrice = campaign.maxPrice ? parseFloat(campaign.maxPrice.replace(/[^0-9.]/g, "")) : undefined;

      // Rank responses
      const ranked = rankResponses(campaign.responses, { maxPrice });

      // Find price discrepancies (regional arbitrage)
      const dealerDetails = campaign.responses.map(r => ({
        id: r.dealershipId,
        city: r.dealership?.city || undefined,
        state: r.dealership?.state || undefined,
        distanceMiles: undefined, // would need geocoding
      }));
      const discrepancies = findPriceDiscrepancies(ranked, dealerDetails);

      return { ranked, discrepancies, campaign };
    }),

  // ═══ #7 — COUNTER-OFFER: Generate counter-offer for a response ═══
  generateCounterOffer: dealerProcedure
    .input(z.object({
      responseId: z.string(),
      useAI: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.outreachResponse.findUnique({
        where: { id: input.responseId },
        include: {
          dealership: true,
          campaign: { include: { customer: true } },
        },
      });
      if (!response) throw new Error("Response not found");

      const otdPrice = parseFloat((response.otdPrice || "0").replace(/[^0-9.]/g, ""));
      if (otdPrice <= 0) throw new Error("No price to counter");

      // Get benchmark data from all deals for this vehicle type
      const vehicle = response.campaign.vehicleDesc || "Vehicle";
      const allOffers = await ctx.db.deskingOffer.findMany({
        where: { vehicleDesc: { contains: vehicle.split(" ").slice(-1)[0] } }, // match by model
        select: { otdPrice: true },
      });
      const allPrices = allOffers
        .map(o => parseFloat((o.otdPrice || "0").replace(/[^0-9.]/g, "")))
        .filter(p => p > 0);

      const benchmark = allPrices.length >= 3
        ? calculateBenchmark(otdPrice, allPrices, vehicle)
        : null;

      // Get competing offers for this campaign
      const competingResponses = await ctx.db.outreachResponse.findMany({
        where: { campaignId: response.campaignId, id: { not: response.id }, otdPrice: { not: null } },
      });
      const competingPrices = competingResponses
        .map(r => parseFloat((r.otdPrice || "0").replace(/[^0-9.]/g, "")))
        .filter(p => p > 0);
      const bestCompeting = competingPrices.length > 0 ? Math.min(...competingPrices) : undefined;

      const counterInput = {
        vehicle,
        dealerName: response.dealership?.name || "Dealer",
        dealerOTD: otdPrice,
        benchmarkAvg: benchmark?.avgOTD,
        benchmarkP25: benchmark?.p25OTD,
        bestCompetingOffer: bestCompeting,
        clientBudget: response.campaign.maxPrice
          ? parseFloat(response.campaign.maxPrice.replace(/[^0-9.]/g, ""))
          : undefined,
        clientTimeline: response.campaign.customer?.timeline || undefined,
        dealerResponseRate: response.dealership?.responseRate ?? undefined,
        isPreferred: response.dealership?.isPreferred ?? false,
      };

      const counter = input.useAI
        ? await generateAICounterOffer(counterInput)
        : calculateCounterOffer(counterInput);

      return { counter, benchmark };
    }),

  // ═══ #7 — Send counter-offer email ═══
  sendCounterOffer: dealerProcedure
    .input(z.object({
      responseId: z.string(),
      emailSubject: z.string(),
      emailBody: z.string(),
      counterPrice: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.outreachResponse.findUnique({
        where: { id: input.responseId },
        include: { dealership: true },
      });
      if (!response?.dealership?.email) throw new Error("No dealer email");

      // Use Resend to send
      const { Resend } = await import("resend");
      const resendKey = (process.env.RESEND_API_KEY || "").trim();
      if (resendKey) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "GoFetch Auto <inquiry@gofetchauto.com>",
          to: [response.dealership.email],
          replyTo: "inquiry@gofetchauto.com",
          subject: input.emailSubject,
          text: input.emailBody,
        });
      }

      // Update response with counter info
      await ctx.db.outreachResponse.update({
        where: { id: input.responseId },
        data: {
          notes: `Counter-offer sent: $${input.counterPrice.toLocaleString()}. ${response.notes || ""}`,
          status: "countered",
        },
      });

      return { success: true };
    }),

  // ═══ #9 — PREFERRED NETWORK: Manage dealer tiers ═══
  getPreferredNetwork: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.dealership.findMany({
      where: { isPreferred: true },
      orderBy: [{ preferredTier: "asc" }, { responseRate: "desc" }],
    });
  }),

  updateDealerTier: dealerProcedure
    .input(z.object({
      dealershipId: z.string(),
      isPreferred: z.boolean(),
      preferredTier: z.string().optional(),
      agreedTerms: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { dealershipId, ...data } = input;
      if (data.isPreferred && !data.preferredTier) data.preferredTier = "standard";
      await ctx.db.dealership.update({
        where: { id: dealershipId },
        data: { ...data, partnerSince: data.isPreferred ? new Date() : null },
      });
      return { success: true };
    }),

  getDealerStats: dealerProcedure
    .input(z.object({ dealershipId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [totalResponses, respondedCount, avgPrice] = await Promise.all([
        ctx.db.outreachResponse.count({ where: { dealershipId: input.dealershipId } }),
        ctx.db.outreachResponse.count({ where: { dealershipId: input.dealershipId, status: { not: "pending" } } }),
        ctx.db.outreachResponse.findMany({
          where: { dealershipId: input.dealershipId, otdPrice: { not: null } },
          select: { otdPrice: true },
        }),
      ]);

      const prices = avgPrice
        .map(r => parseFloat((r.otdPrice || "0").replace(/[^0-9.]/g, "")))
        .filter(p => p > 0);

      return {
        totalOutreach: totalResponses,
        responded: respondedCount,
        responseRate: totalResponses > 0 ? respondedCount / totalResponses : 0,
        avgOTD: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
        totalDeals: prices.length,
      };
    }),

  // ═══ #13 — COMPETITIVE INTEL: Vehicle benchmark ═══
  getVehicleBenchmark: dealerProcedure
    .input(z.object({
      vehicle: z.string(),
      currentPrice: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Search for deals matching this vehicle (fuzzy by model name)
      const modelWord = input.vehicle.split(" ").pop() || input.vehicle;
      const offers = await ctx.db.deskingOffer.findMany({
        where: {
          OR: [
            { vehicleDesc: { contains: modelWord } },
            { vehicleDesc: { contains: input.vehicle } },
          ],
        },
        select: { otdPrice: true, createdAt: true },
      });

      const prices = offers
        .map(o => parseFloat((o.otdPrice || "0").replace(/[^0-9.]/g, "")))
        .filter(p => p > 0);

      const benchmark = calculateBenchmark(
        input.currentPrice || 0,
        prices,
        input.vehicle
      );

      const insight = input.currentPrice
        ? generateCompetitiveInsight(input.vehicle, input.currentPrice, benchmark)
        : null;

      return { benchmark, insight, dealCount: prices.length };
    }),

  // ═══ DEALER TIMING INTELLIGENCE ═══
  getDealerTiming: dealerProcedure
    .input(z.object({ dealershipId: z.string() }))
    .query(async ({ ctx, input }) => {
      const responses = await ctx.db.outreachResponse.findMany({
        where: { dealershipId: input.dealershipId, respondedAt: { not: null } },
        select: { respondedAt: true, createdAt: true, responseTime: true },
        take: 100,
        orderBy: { createdAt: "desc" },
      });

      const profile = buildTimingProfile(input.dealershipId, responses);
      const optimalTime = getOptimalSendTime(profile);
      const insight = getTimingInsight(profile);

      return { profile, optimalTime, insight };
    }),

  // ═══ #4 — AUTO FOLLOW-UP: Trigger follow-ups for stale campaigns ═══
  triggerFollowUps: dealerProcedure
    .input(z.object({ campaignId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.db.outreachCampaign.findUnique({
        where: { id: input.campaignId },
        include: {
          responses: { include: { dealership: true } },
        },
      });
      if (!campaign) throw new Error("Campaign not found");

      const { sendFollowUp } = await import("@/lib/outreach-sender");
      const daysSinceSent = Math.floor(
        (Date.now() - new Date(campaign.sentAt).getTime()) / 86400000
      );

      let sent = 0;
      const pendingResponses = campaign.responses.filter(r => r.status === "pending");

      for (const resp of pendingResponses) {
        if (!resp.dealership?.email) continue;
        const result = await sendFollowUp(
          resp.dealership,
          campaign.vehicleDesc || "Vehicle",
          daysSinceSent,
          campaign.customerId
        );
        if (result.sent) {
          await ctx.db.outreachResponse.update({
            where: { id: resp.id },
            data: { notes: `Follow-up #${daysSinceSent <= 1 ? 1 : daysSinceSent <= 2 ? 2 : 3} sent ${new Date().toISOString()}` },
          });
          sent++;
        }
      }

      return { sent, total: pendingResponses.length };
    }),
});
