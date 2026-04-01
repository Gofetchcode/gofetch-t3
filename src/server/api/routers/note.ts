import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const noteRouter = router({
  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.note.findMany({
        where: { customerId: input.customerId },
        orderBy: { createdAt: "asc" },
      });
    }),

  getAll: dealerProcedure.query(async ({ ctx }) => {
    const notes = await ctx.db.note.findMany({ orderBy: { createdAt: "asc" } });
    const grouped: Record<string, typeof notes> = {};
    for (const note of notes) {
      if (!grouped[note.customerId]) grouped[note.customerId] = [];
      grouped[note.customerId].push(note);
    }
    return grouped;
  }),

  create: dealerProcedure
    .input(z.object({ customerId: z.string(), note: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.note.create({
        data: { customerId: input.customerId, noteText: input.note },
      });

      await ctx.db.activity.create({
        data: {
          customerId: input.customerId,
          type: "note",
          text: `Note: ${input.note.slice(0, 50)}`,
        },
      });

      return ctx.db.note.findMany({
        where: { customerId: input.customerId },
        orderBy: { createdAt: "asc" },
      });
    }),

  delete: dealerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.note.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
