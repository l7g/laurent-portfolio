const { PrismaClient } = require("@prisma/client");

process.env.DATABASE_URL =
  "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient();

async function checkData() {
  try {
    const users = await prisma.users.findMany();
    console.log(
      "Users:",
      users.map((u) => ({ id: u.id, email: u.email })),
    );

    const categories = await prisma.blog_categories.findMany();
    console.log(
      "Categories:",
      categories.map((c) => ({ id: c.id, name: c.name })),
    );
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
