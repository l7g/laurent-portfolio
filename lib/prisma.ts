import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : ["error"],
    datasources: {
      db: {
        url:
          process.env.DATABASE_URL ||
          "postgresql://user:pass@localhost:5432/db",
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
