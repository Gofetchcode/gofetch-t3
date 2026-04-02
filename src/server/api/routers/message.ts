import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";
import { detectSentiment } from "@/lib/ai-engine";

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

  // Client sends message from portal — with sentiment analysis
  sendFromPortal: publicProcedure
    .input(z.object({ customerId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const msg = await ctx.db.message.create({
        data: { customerId: input.customerId, content: input.content, sender: "customer" },
      });

      // Run sentiment detection on customer messages
      const sentiment = detectSentiment(input.content);
      if (sentiment.sentiment === "frustrated" || sentiment.sentiment === "negative") {
        await ctx.db.aIAlert.create({
          data: {
            customerId: input.customerId,
            type: `sentiment_${sentiment.sentiment}`,
            message: `${sentiment.emoji} Customer message flagged: "${input.content.slice(0, 80)}..."`,
            triggered: true,
            triggeredAt: new Date(),
          },
        });
      }

      // Log to AI learning
      await ctx.db.aILearning.create({
        data: {
          category: "messaging",
          dataPoint: JSON.stringify({ messageId: msg.id, content: input.content, sender: "customer" }),
          outcome: JSON.stringify(sentiment),
        },
      });

      return msg;
    }),
});
