import { router, createCallerFactory } from "./trpc";
import { customerRouter } from "./routers/customer";
import { noteRouter } from "./routers/note";
import { surveyRouter } from "./routers/survey";
import { tagRouter } from "./routers/tag";
import { activityRouter } from "./routers/activity";
import { dealerUserRouter } from "./routers/dealerUser";

export const appRouter = router({
  customer: customerRouter,
  note: noteRouter,
  survey: surveyRouter,
  tag: tagRouter,
  activity: activityRouter,
  dealerUser: dealerUserRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
