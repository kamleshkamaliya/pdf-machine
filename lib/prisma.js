import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Ye purana 'Named Export' hai (Taaki agar koi { prisma } use kar raha ho to wo na tute)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

// ✅ YE LINE ADD KI HAI (Fix for: "Export default doesn't exist")
export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;