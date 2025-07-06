const { PrismaClient } = require("@prisma/client");

async function testRegions() {
  // Test different Supabase regions
  const regions = [
    "us-east-1",
    "us-west-1",
    "eu-west-1",
    "eu-central-1",
    "ap-southeast-1",
    "ap-northeast-1",
  ];

  for (const region of regions) {
    console.log(`\n🌍 Testing region: ${region}`);

    const testUrls = [
      // Pooler format
      `postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-${region}.pooler.supabase.com:5432/postgres`,
      // Direct format
      `postgresql://postgres:2PMTzgX3mcYAx0y5@db.ioohfhvdyqfwgpvgxtsx.supabase.co:5432/postgres`,
    ];

    for (let i = 0; i < testUrls.length; i++) {
      try {
        console.log(
          `  🔍 Testing format ${i + 1}: ${testUrls[i].substring(0, 50)}...`,
        );

        const prisma = new PrismaClient({
          datasources: {
            db: {
              url: testUrls[i],
            },
          },
        });

        await prisma.$connect();
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log(`  ✅ SUCCESS! Working connection found:`);
        console.log(`  📋 Region: ${region}`);
        console.log(`  🔗 URL: ${testUrls[i]}`);

        await prisma.$disconnect();
        return testUrls[i];
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message.substring(0, 80)}...`);
      }
    }
  }

  console.log("\n❌ No working connection found in any region");
}

testRegions();
