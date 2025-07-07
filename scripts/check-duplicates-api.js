// Simple script to check for duplicate site settings via API
async function checkDuplicateSettings() {
  try {
    console.log("Fetching all site settings...");

    const response = await fetch("http://localhost:3000/api/settings");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let settings = data.data || data;

    if (!Array.isArray(settings)) {
      console.log("No settings found or invalid format");
      return;
    }

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

    console.log(`\nFound ${duplicates.length} keys with duplicates:`);

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
    console.error("Error checking duplicates:", error);
  }
}

// Run the function
checkDuplicateSettings();
