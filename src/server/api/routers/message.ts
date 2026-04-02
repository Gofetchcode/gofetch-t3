import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";

export const messageRouter = router({
  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: { customerId: input.customerId },
        orderBy: { createdAt: "asc" },
      });
    }),

  send: dealerProcedure
    .input(z.object({ customerId: z.string(), content: z.string().min(1), sender: z.string().default("agent") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.message.create({ data: input });
    }),

  // Client sends message from portal
  sendFromPortal: publicProcedure
    .input(z.object({ customerId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.message.create({
        data: { customerId: input.customerId, content: input.content, sender: "customer" },
      });
    }),
});
