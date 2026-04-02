import { db } from "@/lib/db";

// REST API v1 — /api/v1/customers
export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return Response.json({ error: "API key required" }, { status: 401 });
  // TODO: validate API key against stored keys

  const url = new URL(req.url);
  const step = url.searchParams.get("step");
  const type = url.searchParams.get("type");
  const limit = parseInt(url.searchParams.get("limit") || "50");

  const where: any = {};
  if (step) where.step = parseInt(step);
  if (type === "fleet") where.isFleet = true;
  if (type === "retail") where.isFleet = false;

  const customers = await db.customer.findMany({ where, take: Math.min(limit, 200), orderBy: { createdAt: "desc" },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, step: true, vehicleSpecific: true, isFleet: true, paid: true, createdAt: true, gofetchClientId: true },
  });

  return Response.json({ data: customers, count: customers.length });
}

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return Response.json({ error: "API key required" }, { status: 401 });

  const body = await req.json();
  // Forward to webhook handler
  const res = await fetch(new URL("/api/leads/webhook", req.url).toString(), {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  return Response.json(await res.json(), { status: res.status });
}
