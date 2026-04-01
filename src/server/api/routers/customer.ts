import { z } from "zod";
import { router, publicProcedure, dealerProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const customerRouter = router({
  // ═══ SUBMIT CONSULTATION ═══
  submitConsultation: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        vehicle: z.string().optional(),
        price: z.string().optional(),
        timeline: z.string().optional(),
        notes: z.string().optional(),
        source: z.string().optional(),
        tradein: z.string().optional(),
        tradeinYear: z.string().optional(),
        tradeinMake: z.string().optional(),
        tradeinModel: z.string().optional(),
        tradeinMiles: z.string().optional(),
        tradeinLien: z.string().optional(),
        tradeinBalance: z.string().optional(),
        tradeinLender: z.string().optional(),
        signatureName: z.string().optional(),
        signatureData: z.string().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        utmTerm: z.string().optional(),
        utmContent: z.string().optional(),
        landingPage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tempPassword = "GoFetch" + Math.floor(1000 + Math.random() * 9000);

      const customer = await ctx.db.customer.create({
        data: {
          name: input.name,
          email: input.email.toLowerCase(),
          phone: input.phone ?? "",
          password: tempPassword,
          vehicle: input.vehicle ?? "",
          price: input.price ?? "",
          timeline: input.timeline ?? "",
          notes: input.notes ?? "",
          source: input.source ?? "",
          step: 0,
          tradein: input.tradein ?? "",
          tradeinYear: input.tradeinYear ?? "",
          tradeinMake: input.tradeinMake ?? "",
          tradeinModel: input.tradeinModel ?? "",
          tradeinMiles: input.tradeinMiles ?? "",
          tradeinLien: input.tradeinLien ?? "",
          tradeinBalance: input.tradeinBalance ?? "",
          tradeinLender: input.tradeinLender ?? "",
          utmSource: input.utmSource ?? "",
          utmMedium: input.utmMedium ?? "",
          utmCampaign: input.utmCampaign ?? "",
          utmTerm: input.utmTerm ?? "",
          utmContent: input.utmContent ?? "",
          landingPage: input.landingPage ?? "",
        },
      });

      // Save contract signature
      if (input.signatureData) {
        await ctx.db.contract.create({
          data: {
            customerId: customer.id,
            signatureName: input.signatureName ?? "",
            signatureData: input.signatureData,
          },
        });
      }

      // Log activity
      await ctx.db.activity.create({
        data: {
          customerId: customer.id,
          type: "lead",
          text: "Consultation submitted",
        },
      });

      return { success: true, tempPassword };
    }),

  // ═══ CUSTOMER LOGIN ═══
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findFirst({
        where: {
          email: input.email.toLowerCase(),
          password: input.password,
        },
        include: { files: true, contracts: true },
      });

      if (!customer) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      return { success: true, customer };
    }),

  // ═══ UPDATE PASSWORD ═══
  updatePassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        oldPassword: z.string(),
        newPassword: z.string().min(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findFirst({
        where: { email: input.email.toLowerCase(), password: input.oldPassword },
      });
      if (!customer) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });

      await ctx.db.customer.update({
        where: { id: customer.id },
        data: { password: input.newPassword },
      });

      return { success: true };
    }),

  // ═══ GET CUSTOMERS (dealer) ═══
  getAll: dealerProcedure.query(async ({ ctx }) => {
    return ctx.db.customer.findMany({
      include: { files: true, contracts: true, customerNotes: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  // ═══ ADD CUSTOMER (dealer) ═══
  add: dealerProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string(),
        phone: z.string().optional(),
        vehicle: z.string().optional(),
        color: z.string().optional(),
        price: z.string().optional(),
        savings: z.string().optional(),
        agent: z.string().optional(),
        delivery: z.string().optional(),
        step: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.create({
        data: {
          name: input.name,
          email: input.email.toLowerCase(),
          password: input.password,
          phone: input.phone ?? "",
          vehicle: input.vehicle ?? "",
          color: input.color ?? "",
          price: input.price ?? "",
          savings: input.savings ?? "",
          agent: input.agent ?? "",
          delivery: input.delivery ?? "",
          step: input.step,
        },
      });

      await ctx.db.activity.create({
        data: { customerId: customer.id, type: "lead", text: "Customer added by dealer" },
      });

      return { success: true, customer };
    }),

  // ═══ UPDATE STEP (dealer) ═══
  updateStep: dealerProcedure
    .input(z.object({ id: z.string(), step: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.update({
        where: { id: input.id },
        data: { step: input.step },
      });

      await ctx.db.activity.create({
        data: { customerId: input.id, type: "status", text: `Status changed to step ${input.step}` },
      });

      return { success: true };
    }),

  // ═══ DELETE CUSTOMER (dealer) ═══
  delete: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // ═══ BULK UPDATE STEP ═══
  bulkUpdateStep: dealerProcedure
    .input(z.object({ ids: z.array(z.string()), step: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.updateMany({
        where: { id: { in: input.ids } },
        data: { step: input.step },
      });

      for (const id of input.ids) {
        await ctx.db.activity.create({
          data: { customerId: id, type: "status", text: `Bulk status change to step ${input.step}` },
        });
      }

      return { success: true, updated: input.ids.length };
    }),

  // ═══ BULK DELETE ═══
  bulkDelete: dealerProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.customer.deleteMany({ where: { id: { in: input.ids } } });
      return { success: true, deleted: input.ids.length };
    }),
});
