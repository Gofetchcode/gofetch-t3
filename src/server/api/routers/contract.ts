import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";

export const contractRouter = router({
  submit: publicProcedure
    .input(z.object({ customerId: z.string(), signatureData: z.string(), signatureName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.update({
        where: { id: input.customerId },
        data: { contractSigned: true, contractDate: new Date(), contractData: { signatureData: input.signatureData, signatureName: input.signatureName, signedAt: new Date().toISOString() } },
      });
      return { success: true };
    }),

  get: publicProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({ where: { id: input.customerId }, select: { contractSigned: true, contractDate: true, contractData: true } });
      return customer;
    }),
});
