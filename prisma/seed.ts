import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Default admin user
  const userCount = await db.dealerUser.count();
  if (userCount === 0) {
    await db.dealerUser.create({ data: { name: "Admin", pin: "7777", role: "admin" } });
    console.log("Created default admin user (PIN: 7777)");
  }

  // Default tags
  const tagCount = await db.tag.count();
  if (tagCount === 0) {
    await db.tag.createMany({
      data: [
        { name: "Hot Lead", color: "#d64545" },
        { name: "Follow Up", color: "#3b82f6" },
        { name: "Waiting Docs", color: "#f59e0b" },
        { name: "VIP", color: "#8b5cf6" },
      ],
    });
    console.log("Created default tags");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
