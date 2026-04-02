import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const noteRouter = router({
  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.note.findMany({
        where: { customerId: input.customerId },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: dealerProcedure
    .input(z.object({ customerId: z.string(), content: z.string().min(1), author: z.string().default("agent") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({ data: input });
    }),

  delete: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.note.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
