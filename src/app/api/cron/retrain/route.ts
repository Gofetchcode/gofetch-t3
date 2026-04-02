import { db } from "@/lib/db";
import { masterRetrain } from "@/lib/ai-learning";

// Weekly cron: retrain all AI models (Sunday midnight)
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await masterRetrain(db);
    return Response.json({ success: true, ...results });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
