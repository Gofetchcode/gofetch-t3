import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";

export const paymentRouter = router({
  createCheckout: publicProcedure
    .input(z.object({ customerId: z.string(), tier: z.enum(["standard", "premium", "exotic"]).default("standard") }))
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({ where: { id: input.customerId } });
      if (!customer) return { error: "Customer not found" };
      const prices = { standard: 9900, premium: 19900, exotic: 129900 };
      return { amount: prices[input.tier], customerId: input.customerId, tier: input.tier, email: customer.email };
    }),

  getStatus: publicProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({ where: { id: input.customerId }, select: { paid: true, paidDate: true, paidAmount: true, stripePaymentId: true } });
      return customer;
    }),

  markPaid: dealerProcedure
    .input(z.object({ customerId: z.string(), amount: z.string(), stripeId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.update({
        where: { id: input.customerId },
        data: { paid: true, paidDate: new Date(), paidAmount: input.amount, stripePaymentId: input.stripeId },
      });
      return { success: true };
    }),
});
