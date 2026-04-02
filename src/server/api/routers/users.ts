import { z } from "zod";
import { router, dealerProcedure } from "../trpc";
import bcrypt from "bcryptjs";

export const usersRouter = router({
  list: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.cRMUser.findMany({ select: { id: true, email: true, firstName: true, lastName: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: "asc" } });
  }),

  create: dealerProcedure
    .input(z.object({ email: z.string().email(), firstName: z.string(), lastName: z.string(), pin: z.string().min(4), role: z.string().default("advocate"), phone: z.string().optional(), password: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const hashedPw = input.password ? await bcrypt.hash(input.password, 10) : null;
      return ctx.db.cRMUser.create({ data: { ...input, name: `${input.firstName} ${input.lastName}`, password: hashedPw } });
    }),

  update: dealerProcedure
    .input(z.object({ id: z.string(), firstName: z.string().optional(), lastName: z.string().optional(), role: z.string().optional(), isActive: z.boolean().optional(), phone: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (data.firstName || data.lastName) {
        const existing = await ctx.db.cRMUser.findUnique({ where: { id } });
        if (existing) (data as any).name = `${data.firstName ?? existing.firstName} ${data.lastName ?? existing.lastName}`;
      }
      await ctx.db.cRMUser.update({ where: { id }, data });
      return { success: true };
    }),

  deactivate: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cRMUser.update({ where: { id: input.id }, data: { isActive: false } });
      return { success: true };
    }),

  getPermissions: dealerProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.cRMPermission.findMany({ where: { userId: input.userId } });
    }),

  updatePermissions: dealerProcedure
    .input(z.object({ userId: z.string(), module: z.string(), canView: z.boolean(), canCreate: z.boolean(), canEdit: z.boolean(), canDelete: z.boolean(), canExport: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, module, ...perms } = input;
      await ctx.db.cRMPermission.upsert({
        where: { id: `${userId}-${module}` },
        create: { userId, module, ...perms },
        update: perms,
      });
      return { success: true };
    }),

  getActivityLog: dealerProcedure
    .input(z.object({ userId: z.string().optional(), limit: z.number().default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const where = input?.userId ? { userId: input.userId } : {};
      return ctx.db.cRMActivity.findMany({ where, orderBy: { createdAt: "desc" }, take: input?.limit ?? 50 });
    }),
});
