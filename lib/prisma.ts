import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL environment variable is required in production. Please set it in your environment variables.",
    );
  } else {
    console.warn(
      "DATABASE_URL environment variable is not set. Database operations will fail.",
    );
  }
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
