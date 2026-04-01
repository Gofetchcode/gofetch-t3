import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";

export const surveyRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        customerId: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        ratings: z.object({ q1: z.number(), q2: z.number(), q3: z.number(), q4: z.number(), q5: z.number() }),
        averageRating: z.number(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.survey.create({
        data: {
          customerId: input.customerId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          q1: input.ratings.q1,
          q2: input.ratings.q2,
          q3: input.ratings.q3,
          q4: input.ratings.q4,
          q5: input.ratings.q5,
          averageRating: input.averageRating,
          comment: input.comment ?? "",
        },
      });
      return { success: true };
    }),

  getAll: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.survey.findMany({ orderBy: { submittedAt: "desc" } });
  }),
});
