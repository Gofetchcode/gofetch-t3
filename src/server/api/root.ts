import { router, createCallerFactory } from "./trpc";
import { customerRouter } from "./routers/customer";
import { dealerRouter } from "./routers/dealer";
import { noteRouter } from "./routers/note";
import { messageRouter } from "./routers/message";
import { deskingRouter } from "./routers/desking";
import { outreachRouter } from "./routers/outreach";
import { paymentRouter } from "./routers/payment";
import { fleetRouter } from "./routers/fleet";
import { contractRouter } from "./routers/contract";
import { usersRouter } from "./routers/users";
import { tasksRouter } from "./routers/tasks";
import { communicationsRouter } from "./routers/communications";
import { webhooksRouter } from "./routers/webhooks";
import { aiRouter } from "./routers/ai";

export const appRouter = router({
  customer: customerRouter,
  dealer: dealerRouter,
  note: noteRouter,
  message: messageRouter,
  desking: deskingRouter,
  outreach: outreachRouter,
  payment: paymentRouter,
  fleet: fleetRouter,
  contract: contractRouter,
  users: usersRouter,
  tasks: tasksRouter,
  communications: communicationsRouter,
  webhooks: webhooksRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
