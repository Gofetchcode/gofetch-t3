import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const aiRouter = router({
  getAlerts: dealerProcedure
    .input(z.object({ customerId: z.string().optional(), triggered: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input?.customerId) where.customerId = input.customerId;
      if (input?.triggered !== undefined) where.triggered = input.triggered;
      return ctx.db.aIAlert.findMany({ where, include: { customer: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
    }),

  getLeadScores: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.customer.findMany({
      where: { step: { lt: 8 } },
      select: { id: true, firstName: true, lastName: true, leadScore: true, step: true, vehicleType: true, timeline: true, createdAt: true },
      orderBy: { leadScore: "desc" },
      take: 50,
    });
  }),

  calculateScore: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const c = await ctx.db.customer.findUnique({ where: { id: input.customerId }, include: { documents: true, messages: true } });
      if (!c) return { score: 0 };
      let score = 0;
      if (c.budget) { const b = parseInt(c.budget.replace(/\D/g, "")); if (b > 60000) score += 20; else if (b > 30000) score += 10; else score += 5; }
      if (c.timeline === "ASAP") score += 30; else if (c.timeline === "1-2 Weeks") score += 20; else if (c.timeline === "1 Month") score += 10; else score += 5;
      if (c.vehicleType?.includes("Exotic")) score += 20; else if (c.vehicleType?.includes("New")) score += 10;
      if (c.documents.length > 0) score += 15;
      if (c.contractSigned) score += 25;
      if (c.messages.some(m => m.sender === "customer")) score += 10;
      score = Math.min(score, 100);
      await ctx.db.customer.update({ where: { id: input.customerId }, data: { leadScore: score } });
      return { score };
    }),

  triggerEscalation: dealerProcedure
    .input(z.object({ customerId: z.string(), alertType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.aIAlert.create({ data: { customerId: input.customerId, type: input.alertType, message: `Escalation: ${input.alertType}`, triggered: true, triggeredAt: new Date() } });
    }),

  sendAutoText: dealerProcedure
    .input(z.object({ customerId: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.message.create({ data: { customerId: input.customerId, content: input.message, sender: "system" } });
      await ctx.db.aIAlert.create({ data: { customerId: input.customerId, type: "ai_auto_text", message: input.message, triggered: true, triggeredAt: new Date(), autoTextSent: true } });
      return { success: true };
    }),

  getAIActivity: dealerProcedure
    .input(z.object({ hours: z.number().default(24) }).optional())
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - (input?.hours ?? 24) * 60 * 60 * 1000);
      const alerts = await ctx.db.aIAlert.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "desc" } });
      const autoTexts = alerts.filter(a => a.autoTextSent).length;
      const escalations = alerts.filter(a => a.type.includes("no_response")).length;
      const reassigned = alerts.filter(a => a.type === "reassigned").length;
      return { total: alerts.length, autoTexts, escalations, reassigned, alerts };
    }),
});
