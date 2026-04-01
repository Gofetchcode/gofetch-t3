import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const activityRouter = router({
  getAll: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: { customer: { select: { name: true } } },
    });
  }),

  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.activity.findMany({
        where: { customerId: input.customerId },
        orderBy: { createdAt: "desc" },
      });
    }),
});
