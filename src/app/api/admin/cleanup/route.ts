import { db } from "@/lib/db";

// One-time cleanup: remove test clients from production
// Protected by CRON_SECRET
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find test clients (names containing "Test", "Load", or "test")
    const testClients = await db.customer.findMany({
      where: {
        OR: [
          { firstName: { contains: "Load" } },
          { lastName: { contains: "Test" } },
          { firstName: { contains: "Test" } },
          { email: { contains: "test@" } },
          { email: { contains: "loadtest" } },
        ],
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (testClients.length === 0) {
      return Response.json({ success: true, message: "No test clients found", deleted: 0 });
    }

    const ids = testClients.map(c => c.id);

    // Delete related records first (cascade may handle this, but be explicit)
    await db.message.deleteMany({ where: { customerId: { in: ids } } });
    await db.note.deleteMany({ where: { customerId: { in: ids } } });
    await db.document.deleteMany({ where: { customerId: { in: ids } } });
    await db.deskingOffer.deleteMany({ where: { customerId: { in: ids } } });
    await db.outreachCampaign.deleteMany({ where: { customerId: { in: ids } } });
    await db.aIAlert.deleteMany({ where: { customerId: { in: ids } } });
    await db.touchPoint.deleteMany({ where: { customerId: { in: ids } } });

    // Delete the customers
    const result = await db.customer.deleteMany({ where: { id: { in: ids } } });

    return Response.json({
      success: true,
      deleted: result.count,
      clients: testClients.map(c => `${c.firstName} ${c.lastName} (${c.email})`),
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
