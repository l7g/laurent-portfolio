import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Validate DATABASE_URL is set in production
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is required in production. Please set it in your environment variables.",
  );
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL!,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
