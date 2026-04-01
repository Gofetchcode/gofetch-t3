import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const tagRouter = router({
  getAll: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.tag.findMany({ orderBy: { name: "asc" } });
  }),

  create: dealerProcedure
    .input(z.object({ name: z.string().min(1), color: z.string().default("#d4a23a") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({ data: { name: input.name, color: input.color } });
    }),

  delete: dealerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customerTag.deleteMany({ where: { tagId: input.id } });
      await ctx.db.tag.delete({ where: { id: input.id } });
      return { success: true };
    }),

  addToCustomer: dealerProcedure
    .input(z.object({ customerId: z.string(), tagId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customerTag.create({
        data: { customerId: input.customerId, tagId: input.tagId },
      });
      return { success: true };
    }),

  removeFromCustomer: dealerProcedure
    .input(z.object({ customerId: z.string(), tagId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customerTag.delete({
        where: { customerId_tagId: { customerId: input.customerId, tagId: input.tagId } },
      });
      return { success: true };
    }),
});
