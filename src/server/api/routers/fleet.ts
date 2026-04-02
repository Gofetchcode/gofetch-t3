import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const fleetRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.fleetCompany.findFirst({ where: { contactEmail: input.email.toLowerCase() } });
      if (!company) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      const valid = await bcrypt.compare(input.password, company.password) || input.password === company.password;
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      return { success: true, company };
    }),

  getDashboard: dealerProcedure
    .input(z.object({ companyName: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where = input?.companyName ? { isFleet: true, fleetCompany: input.companyName } : { isFleet: true };
      const customers = await ctx.db.customer.findMany({ where, orderBy: { createdAt: "desc" } });
      const active = customers.filter(c => c.step < 8).length;
      const delivered = customers.filter(c => c.step === 8).length;
      return { customers, total: customers.length, active, delivered };
    }),

  submitOrder: publicProcedure
    .input(z.object({
      companyName: z.string(), contactName: z.string(), contactEmail: z.string().email(), contactPhone: z.string(),
      vehicleCount: z.number(), vehicleType: z.string(), budgetPerVehicle: z.string(), timeline: z.string(), notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let company = await ctx.db.fleetCompany.findFirst({ where: { contactEmail: input.contactEmail } });
      if (!company) {
        company = await ctx.db.fleetCompany.create({
          data: { name: input.companyName, contactName: input.contactName, contactEmail: input.contactEmail, contactPhone: input.contactPhone, password: await bcrypt.hash("fleet2026", 10) },
        });
      }
      await ctx.db.fleetCompany.update({ where: { id: company.id }, data: { totalOrders: { increment: 1 } } });
      return { success: true, companyId: company.id };
    }),

  getFleetCustomers: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.customer.findMany({ where: { isFleet: true }, include: { documents: true, deskingOffers: true }, orderBy: { createdAt: "desc" } });
  }),

  tagAsFleet: dealerProcedure
    .input(z.object({ customerId: z.string(), companyName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.update({ where: { id: input.customerId }, data: { isFleet: true, fleetCompany: input.companyName } });
      return { success: true };
    }),
});
