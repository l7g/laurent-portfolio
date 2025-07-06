import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findDuplicateSettings() {
  console.log("Checking for duplicate site settings...");

  try {
    const settings = await prisma.site_settings.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(`Found ${settings.length} total settings`);

    // Group by key to find duplicates
    const settingsByKey = settings.reduce((acc, setting) => {
      if (!acc[setting.key]) {
        acc[setting.key] = [];
      }
      acc[setting.key].push(setting);
      return acc;
    }, {});

    const duplicates = Object.entries(settingsByKey)
      .filter(([key, settingList]) => settingList.length > 1)
      .map(([key, settingList]) => ({
        key,
        duplicates: settingList,
      }));

    if (duplicates.length === 0) {
      console.log("No duplicates found!");
      return;
    }

    console.log(`Found ${duplicates.length} keys with duplicates:`);

    for (const { key, duplicates: settingList } of duplicates) {
      console.log(`\n--- ${key} ---`);
      settingList.forEach((setting, index) => {
        console.log(`  [${index + 1}] ID: ${setting.id}`);
        console.log(`      Value: ${setting.value}`);
        console.log(`      Created: ${setting.createdAt}`);
        console.log(`      Public: ${setting.isPublic}`);
        console.log(`      Description: ${setting.description || "None"}`);
      });
    }

    return duplicates;
  } catch (error) {
    console.error("Error finding duplicates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function removeDuplicateSettings() {
  const duplicates = await findDuplicateSettings();

  if (!duplicates || duplicates.length === 0) {
    return;
  }

  console.log(
    "\nRemoving duplicates (keeping the oldest entry for each key)...",
  );

  for (const { key, duplicates: settingList } of duplicates) {
    // Keep the first one (oldest), remove the rest
    const toKeep = settingList[0];
    const toRemove = settingList.slice(1);

    console.log(`\nFor key "${key}":`);
    console.log(`  Keeping: ${toKeep.id} (${toKeep.createdAt})`);

    for (const setting of toRemove) {
      console.log(`  Removing: ${setting.id} (${setting.createdAt})`);
      try {
        await prisma.site_settings.delete({
          where: { id: setting.id },
        });
        console.log(`    ✓ Deleted`);
      } catch (error) {
        console.error(`    ✗ Failed to delete: ${error}`);
      }
    }
  }

  console.log("\nFinished removing duplicates!");
}

// Run the function
findDuplicateSettings()
  .then(() => {
    console.log(
      "\nWould you like to remove the duplicates? (This will keep the oldest entry for each key)",
    );
    console.log("If yes, uncomment the line below and run the script again:");
    console.log("// removeDuplicateSettings();");
  })
  .catch(console.error);
