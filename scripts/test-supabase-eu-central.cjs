const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  // Test different connection string formats for EU Central Frankfurt
  const testUrls = [
    // Format 1: EU Central pooler (correct region)
    "postgresql://postgres:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",

    // Format 2: EU Central pooler with project reference in username
    "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",

    // Format 3: EU Central pooler port 6543
    "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",

    // Format 4: Direct connection
    "postgresql://postgres:2PMTzgX3mcYAx0y5@db.ioohfhvdyqfwgpvgxtsx.supabase.co:5432/postgres",
  ];

  for (let i = 0; i < testUrls.length; i++) {
    console.log(`\n🔍 Testing connection format ${i + 1}:`);
    console.log(`URL: ${testUrls[i]}`);

    try {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: testUrls[i],
          },
        },
      });

      await prisma.$connect();
      console.log(`✅ Connection ${i + 1} successful!`);

      // Test a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log(`✅ Query test successful:`, result);

      await prisma.$disconnect();

      console.log(`\n🎉 Working connection string: ${testUrls[i]}`);
      break;
    } catch (error) {
      console.log(`❌ Connection ${i + 1} failed:`, error.message);
    }
  }
}

testConnection();
