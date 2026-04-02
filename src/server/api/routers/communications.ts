import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";

export const communicationsRouter = router({
  getThread: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [messages, notes] = await Promise.all([
        ctx.db.message.findMany({ where: { customerId: input.customerId }, orderBy: { createdAt: "asc" } }),
        ctx.db.note.findMany({ where: { customerId: input.customerId }, orderBy: { createdAt: "asc" } }),
      ]);
      const unified = [
        ...messages.map(m => ({ ...m, channel: "message" as const, type: m.sender === "system" ? "system" : m.sender === "customer" ? "inbound" : "outbound" })),
        ...notes.map(n => ({ id: n.id, customerId: n.customerId, content: n.content, createdAt: n.createdAt, channel: "note" as const, type: "note" as const, sender: n.author })),
      ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return unified;
    }),

  send: dealerProcedure
    .input(z.object({ customerId: z.string(), content: z.string(), channel: z.enum(["text", "email", "note"]).default("text") }))
    .mutation(async ({ ctx, input }) => {
      if (input.channel === "note") {
        return ctx.db.note.create({ data: { customerId: input.customerId, content: input.content, author: "agent" } });
      }
      return ctx.db.message.create({ data: { customerId: input.customerId, content: input.content, sender: "agent" } });
    }),

  getUnified: dealerProcedure
    .input(z.object({ customerId: z.string(), channel: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      if (!input?.customerId) return [];
      const messages = await ctx.db.message.findMany({ where: { customerId: input.customerId }, orderBy: { createdAt: "asc" } });
      const notes = await ctx.db.note.findMany({ where: { customerId: input.customerId }, orderBy: { createdAt: "asc" } });
      const all = [
        ...messages.map(m => ({ ...m, channel: m.sender === "system" ? "system" : "message" })),
        ...notes.map(n => ({ id: n.id, customerId: n.customerId, content: n.content, sender: n.author, createdAt: n.createdAt, channel: "note" })),
      ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      if (input.channel) return all.filter(a => a.channel === input.channel);
      return all;
    }),

  sendFromPortal: publicProcedure
    .input(z.object({ customerId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.message.create({ data: { customerId: input.customerId, content: input.content, sender: "customer" } });
    }),
});
