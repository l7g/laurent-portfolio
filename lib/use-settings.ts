// Helper function for getting individual settings
export async function getPublicSetting(key: string, defaultValue: any = null) {
  try {
    const response = await fetch("/api/public/settings", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();

    if (response.ok && data.data) {
      return data.data[key] !== undefined ? data.data[key] : defaultValue;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}
