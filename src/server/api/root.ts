import { router, createCallerFactory } from "./trpc";
import { customerRouter } from "./routers/customer";
import { noteRouter } from "./routers/note";
import { messageRouter } from "./routers/message";
import { deskingRouter } from "./routers/desking";
import { outreachRouter } from "./routers/outreach";

export const appRouter = router({
  customer: customerRouter,
  note: noteRouter,
  message: messageRouter,
  desking: deskingRouter,
  outreach: outreachRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
