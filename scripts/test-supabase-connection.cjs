const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  // Test different connection string formats
  const testUrls = [
    // Format 1: Standard format
    "postgresql://postgres:2PMTzgX3mcYAx0y5@db.ioohfhvdyqfwgpvgxtsx.supabase.co:5432/postgres",

    // Format 2: With pooler - session mode (project-specific)
    "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-us-east-1.pooler.supabase.com:5432/postgres",

    // Format 3: With pooler - transaction mode (project-specific)
    "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-us-east-1.pooler.supabase.com:6543/postgres",

    // Format 4: Direct connection with SSL
    "postgresql://postgres:2PMTzgX3mcYAx0y5@db.ioohfhvdyqfwgpvgxtsx.supabase.co:5432/postgres?sslmode=require",
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
