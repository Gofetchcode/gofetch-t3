import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { calculateLeadScore } from "@/lib/ai-engine";

export const customerRouter = router({
  // ═══ SUBMIT CONSULTATION ═══
  submitConsultation: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string(),
        vehicleType: z.string().optional(),
        vehicleSpecific: z.string().optional(),
        budget: z.string().optional(),
        timeline: z.string().optional(),
        notes: z.string().optional(),
        source: z.string().optional(),
        contractData: z.any().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tempPassword = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
      const clientNum = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const customer = await ctx.db.customer.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email.toLowerCase(),
          phone: input.phone,
          password: hashedPassword,
          tempPassword,
          vehicleType: input.vehicleType ?? "",
          vehicleSpecific: input.vehicleSpecific ?? "",
          budget: input.budget ?? "",
          timeline: input.timeline ?? "",
          notes: input.notes ?? "",
          source: input.source ?? "Website",
          gofetchClientId: `GF-2026-${clientNum}`,
          anonymousEmail: `deals+${clientNum}@gofetchauto.com`,
          contractSigned: !!input.contractData,
          contractDate: input.contractData ? new Date() : null,
          contractData: input.contractData ?? undefined,
          utmSource: input.utmSource ?? "",
          utmMedium: input.utmMedium ?? "",
          utmCampaign: input.utmCampaign ?? "",
        },
      });

      // Welcome message
      await ctx.db.message.create({
        data: {
          customerId: customer.id,
          sender: "system",
          content: `Welcome to GoFetch Auto, ${input.firstName}! We've received your consultation request and our team will reach out within 24 hours. Your temporary portal password is: ${tempPassword}`,
        },
      });

      // Auto-calculate lead score
      const score = calculateLeadScore({
        budget: input.budget, timeline: input.timeline, vehicleType: input.vehicleType,
        contractSigned: !!input.contractData, source: input.source,
      });
      await ctx.db.customer.update({ where: { id: customer.id }, data: { leadScore: score } });

      return { success: true, tempPassword, clientId: customer.gofetchClientId };
    }),

  // ═══ CUSTOMER LOGIN ═══
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findFirst({
        where: { email: input.email.toLowerCase() },
        include: { documents: true, messages: { orderBy: { createdAt: "desc" }, take: 50 }, deskingOffers: { orderBy: { createdAt: "desc" } } },
      });
      if (!customer) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      const validPw = await bcrypt.compare(input.password, customer.password) || input.password === customer.tempPassword;
      if (!validPw) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      return {
        success: true,
        customer,
        requirePasswordChange: !customer.passwordChanged && customer.tempPassword === input.password,
      };
    }),

  // ═══ CHANGE PASSWORD ═══
  changePassword: publicProcedure
    .input(z.object({ email: z.string().email(), oldPassword: z.string(), newPassword: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findFirst({
        where: { email: input.email.toLowerCase() },
      });
      if (!customer) throw new TRPCError({ code: "UNAUTHORIZED" });
      const validOld = await bcrypt.compare(input.oldPassword, customer.password) || input.oldPassword === customer.tempPassword;
      if (!validOld) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid current password" });
      const hashedNew = await bcrypt.hash(input.newPassword, 10);
      await ctx.db.customer.update({
        where: { id: customer.id },
        data: { password: hashedNew, passwordChanged: true, tempPassword: null },
      });
      return { success: true };
    }),

  // ═══ GET ALL (dealer) ═══
  getAll: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.customer.findMany({
      include: {
        documents: true,
        notesLog: { orderBy: { createdAt: "desc" } },
        messages: { orderBy: { createdAt: "desc" }, take: 5 },
        deskingOffers: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // ═══ GET ONE (dealer) ═══
  getById: dealerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.customer.findUnique({
        where: { id: input.id },
        include: {
          documents: true,
          messages: { orderBy: { createdAt: "asc" } },
          notesLog: { orderBy: { createdAt: "desc" } },
          deskingOffers: { include: { dealership: true }, orderBy: { createdAt: "desc" } },
          touchPoints: { orderBy: { createdAt: "desc" }, take: 20 },
        },
      });
    }),

  // ═══ ADD CUSTOMER (dealer) ═══
  add: dealerProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string(),
        vehicleType: z.string().optional(),
        budget: z.string().optional(),
        step: z.number().default(0),
        isFleet: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tempPassword = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
      const clientNum = String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");
      return ctx.db.customer.create({
        data: {
          ...input,
          password: tempPassword,
          tempPassword,
          gofetchClientId: `GF-2026-${clientNum}`,
          anonymousEmail: `deals+${clientNum}@gofetchauto.com`,
        },
      });
    }),

  // ═══ UPDATE STEP ═══
  updateStep: dealerProcedure
    .input(z.object({ id: z.string(), step: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.update({ where: { id: input.id }, data: { step: input.step } });
      return { success: true };
    }),

  // ═══ UPDATE CUSTOMER ═══
  update: dealerProcedure
    .input(z.object({
      id: z.string(),
      negotiatedPrice: z.string().optional(),
      deliveryDate: z.string().optional(),
      vehicleSpecific: z.string().optional(),
      notes: z.string().optional(),
      step: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.customer.update({ where: { id }, data });
      return { success: true };
    }),

  // ═══ DELETE ═══
  delete: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // ═══ BULK ACTIONS ═══
  bulkUpdateStep: dealerProcedure
    .input(z.object({ ids: z.array(z.string()), step: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.updateMany({ where: { id: { in: input.ids } }, data: { step: input.step } });
      return { success: true, updated: input.ids.length };
    }),

  bulkDelete: dealerProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.deleteMany({ where: { id: { in: input.ids } } });
      return { success: true, deleted: input.ids.length };
    }),
});
