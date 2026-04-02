import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const deskingRouter = router({
  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.deskingOffer.findMany({
        where: { customerId: input.customerId },
        include: { dealership: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: dealerProcedure
    .input(z.object({
      customerId: z.string(),
      dealershipId: z.string().optional(),
      dealerName: z.string().optional(),
      dealerAddress: z.string().optional(),
      dealerContact: z.string().optional(),
      dealerPhone: z.string().optional(),
      stockNumber: z.string().optional(),
      vin: z.string().optional(),
      vehicleDesc: z.string().optional(),
      msrp: z.string().optional(),
      negotiatedPrice: z.string().optional(),
      otdPrice: z.string().optional(),
      savings: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.deskingOffer.create({ data: input });
    }),

  updateStatus: dealerProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deskingOffer.update({ where: { id: input.id }, data: { status: input.status } });
      return { success: true };
    }),

  reveal: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deskingOffer.update({ where: { id: input.id }, data: { isRevealed: true } });
      return { success: true };
    }),

  delete: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deskingOffer.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
