import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const webhooksRouter = router({
  list: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.webhookEndpoint.findMany({ orderBy: { createdAt: "desc" } });
  }),

  create: dealerProcedure
    .input(z.object({ name: z.string(), url: z.string().url(), events: z.any(), secret: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.webhookEndpoint.create({ data: { ...input, secret: input.secret || crypto.randomUUID() } });
    }),

  update: dealerProcedure
    .input(z.object({ id: z.string(), name: z.string().optional(), url: z.string().optional(), events: z.any().optional(), isActive: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.webhookEndpoint.update({ where: { id }, data });
      return { success: true };
    }),

  delete: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.webhookEndpoint.delete({ where: { id: input.id } });
      return { success: true };
    }),

  test: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const endpoint = await ctx.db.webhookEndpoint.findUnique({ where: { id: input.id } });
      if (!endpoint) return { success: false, error: "Not found" };
      try {
        const res = await fetch(endpoint.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Webhook-Secret": endpoint.secret || "" },
          body: JSON.stringify({ event: "test", timestamp: new Date().toISOString(), data: { message: "Test webhook from GoFetch CRM" } }),
        });
        return { success: true, status: res.status };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }),
});
