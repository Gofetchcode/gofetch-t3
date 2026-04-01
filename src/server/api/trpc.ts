import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "@/lib/db";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return { db, headers: opts.headers };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

// Dealer-authenticated procedure — requires PIN in header
export const dealerProcedure = t.procedure.use(async ({ ctx, next }) => {
  const pin = ctx.headers.get("x-dealer-pin");
  if (!pin) throw new TRPCError({ code: "UNAUTHORIZED", message: "Dealer PIN required" });

  const user = await ctx.db.dealerUser.findFirst({
    where: { pin, active: true },
  });
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid PIN" });

  return next({ ctx: { ...ctx, dealerUser: user } });
});
