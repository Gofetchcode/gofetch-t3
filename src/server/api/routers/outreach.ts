import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const outreachRouter = router({
  // Get campaigns for a customer
  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.outreachCampaign.findMany({
        where: { customerId: input.customerId },
        include: { responses: { include: { dealership: true } } },
        orderBy: { sentAt: "desc" },
      });
    }),

  // Create campaign
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

  // Add response
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

  // Get all dealerships
  getDealerships: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.dealership.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  // Add dealership
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
});
