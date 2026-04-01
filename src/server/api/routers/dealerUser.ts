import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const dealerUserRouter = router({
  getAll: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.dealerUser.findMany({
      select: { id: true, name: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
  }),

  create: dealerProcedure
    .input(z.object({ name: z.string().min(1), pin: z.string().min(4), role: z.string().default("agent") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dealerUser.create({ data: { name: input.name, pin: input.pin, role: input.role } });
    }),

  delete: dealerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.dealerUser.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
