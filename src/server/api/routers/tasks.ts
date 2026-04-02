import { z } from "zod";
import { router, dealerProcedure } from "../trpc";

export const tasksRouter = router({
  list: dealerProcedure
    .input(z.object({ userId: z.string().optional(), status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input?.userId) where.userId = input.userId;
      if (input?.status) where.status = input.status;
      return ctx.db.cRMTask.findMany({ where, orderBy: { dueDate: "asc" } });
    }),

  create: dealerProcedure
    .input(z.object({ userId: z.string(), title: z.string(), description: z.string().optional(), dueDate: z.string().optional(), customerId: z.string().optional(), priority: z.string().default("normal") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cRMTask.create({ data: { ...input, dueDate: input.dueDate ? new Date(input.dueDate) : undefined } });
    }),

  update: dealerProcedure
    .input(z.object({ id: z.string(), title: z.string().optional(), status: z.string().optional(), priority: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.cRMTask.update({ where: { id }, data });
      return { success: true };
    }),

  complete: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cRMTask.update({ where: { id: input.id }, data: { status: "completed" } });
      return { success: true };
    }),

  getOverdue: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.cRMTask.findMany({ where: { status: { not: "completed" }, dueDate: { lt: new Date() } }, orderBy: { dueDate: "asc" } });
  }),

  getByCustomer: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.cRMTask.findMany({ where: { customerId: input.customerId }, orderBy: { dueDate: "asc" } });
    }),
});
