import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  // Default dealer
  const dealerCount = await db.dealer.count();
  if (dealerCount === 0) {
    await db.dealer.create({ data: { pin: "7777", name: "GoFetch Auto" } });
    console.log("Created default dealer (PIN: 7777)");
  }

  // Default CRM admin
  const userCount = await db.cRMUser.count();
  if (userCount === 0) {
    await db.cRMUser.create({
      data: { email: "inquiry@gofetchauto.com", name: "Admin", pin: "7777", role: "admin" },
    });
    console.log("Created default CRM admin");
  }

  // Default tenant config
  const tenantCount = await db.tenantConfig.count();
  if (tenantCount === 0) {
    await db.tenantConfig.create({ data: {} });
    console.log("Created default tenant config");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
