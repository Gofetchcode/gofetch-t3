import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const dealerRouter = router({
  login: publicProcedure
    .input(z.object({ pin: z.string().min(4) }))
    .mutation(async ({ ctx, input }) => {
      const dealer = await ctx.db.dealer.findFirst({ where: { pin: input.pin } });
      const crmUser = await ctx.db.cRMUser.findFirst({ where: { pin: input.pin, isActive: true } });
      if (!dealer && !crmUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid PIN" });
      return { success: true, user: crmUser ?? { id: dealer!.id, name: dealer!.name, role: "admin" } };
    }),

  changePin: dealerProcedure
    .input(z.object({ newPin: z.string().min(4) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.dealer.updateMany({ data: { pin: input.newPin } });
      await ctx.db.cRMUser.updateMany({ where: { role: "admin" }, data: { pin: input.newPin } });
      return { success: true };
    }),

  getCustomers: dealerProcedure
    .input(z.object({
      step: z.number().optional(),
      type: z.enum(["all", "retail", "fleet"]).default("all"),
      source: z.string().optional(),
      search: z.string().optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input?.step !== undefined) where.step = input.step;
      if (input?.type === "fleet") where.isFleet = true;
      if (input?.type === "retail") where.isFleet = false;
      if (input?.source) where.source = input.source;
      if (input?.search) {
        where.OR = [
          { firstName: { contains: input.search } },
          { lastName: { contains: input.search } },
          { email: { contains: input.search } },
          { phone: { contains: input.search } },
          { vehicleSpecific: { contains: input.search } },
        ];
      }
      return ctx.db.customer.findMany({
        where,
        include: { documents: true, notesLog: { orderBy: { createdAt: "desc" }, take: 5 }, messages: { orderBy: { createdAt: "desc" }, take: 3 }, deskingOffers: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  addCustomer: dealerProcedure
    .input(z.object({
      firstName: z.string(), lastName: z.string(), email: z.string().email(), phone: z.string(),
      vehicleType: z.string().optional(), budget: z.string().optional(), step: z.number().default(0),
      source: z.string().default("Manual"), isFleet: z.boolean().default(false),
      fleetCompany: z.string().optional(), notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const bcrypt = await import("bcryptjs");
      const tempPw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
      const num = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");
      return ctx.db.customer.create({
        data: { ...input, password: await bcrypt.hash(tempPw, 10), tempPassword: tempPw, gofetchClientId: `GF-2026-${num}`, anonymousEmail: `deals+${num}@gofetchauto.com` },
      });
    }),

  updateCustomer: dealerProcedure
    .input(z.object({ id: z.string() }).catchall(z.any()))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.customer.update({ where: { id }, data });
      return { success: true };
    }),

  updateStep: dealerProcedure
    .input(z.object({ id: z.string(), step: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.update({ where: { id: input.id }, data: { step: input.step } });
      await ctx.db.cRMActivity.create({ data: { userId: "system", action: "step_changed", entity: "customer", entityId: input.id, details: `Step changed to ${input.step}` } });
      return { success: true };
    }),

  deleteCustomer: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.delete({ where: { id: input.id } });
      return { success: true };
    }),

  reassignCustomer: dealerProcedure
    .input(z.object({ customerId: z.string(), advocateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.update({ where: { id: input.customerId }, data: { assignedToId: input.advocateId } });
      return { success: true };
    }),

  addNote: dealerProcedure
    .input(z.object({ customerId: z.string(), content: z.string(), author: z.string().default("agent") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({ data: input });
    }),

  getNotes: dealerProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.note.findMany({ where: { customerId: input.customerId }, orderBy: { createdAt: "desc" } });
    }),

  getDashboardStats: dealerProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.customer.count();
    const byStep = await Promise.all(Array.from({ length: 9 }, (_, i) => ctx.db.customer.count({ where: { step: i } })));
    const paid = await ctx.db.customer.count({ where: { paid: true } });
    const fleet = await ctx.db.customer.count({ where: { isFleet: true } });
    return { total, byStep, paid, fleet, retail: total - fleet };
  }),

  getConversionFunnel: dealerProcedure.query(async ({ ctx }) => {
    const steps = await Promise.all(Array.from({ length: 9 }, (_, i) => ctx.db.customer.count({ where: { step: { gte: i } } })));
    return steps;
  }),

  getActivity: dealerProcedure
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.cRMActivity.findMany({ orderBy: { createdAt: "desc" }, take: input?.limit ?? 20 });
    }),

  exportCSV: dealerProcedure.query(async ({ ctx }) => {
    const customers = await ctx.db.customer.findMany({ orderBy: { createdAt: "desc" } });
    const headers = "First Name,Last Name,Email,Phone,Vehicle,Step,Paid,Fleet,Created\n";
    const rows = customers.map(c => `${c.firstName},${c.lastName},${c.email},${c.phone},"${c.vehicleSpecific || ""}",${c.step},${c.paid},${c.isFleet},${c.createdAt.toISOString()}`).join("\n");
    return headers + rows;
  }),
});
