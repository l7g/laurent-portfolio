import { useState, useEffect } from "react";

interface SettingsData {
  [key: string]: any;
}

export function usePublicSettings() {
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/public/settings");
      const data = await response.json();

      if (response.ok) {
        setSettings(data.data || {});
        setError(null);
      } else {
        setError(data.error || "Failed to load settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  const refresh = () => {
    loadSettings();
  };

  return {
    settings,
    loading,
    error,
    getSetting,
    refresh,
  };
}

// Helper function for getting individual settings
export async function getPublicSetting(key: string, defaultValue: any = null) {
  try {
    const response = await fetch("/api/public/settings");
    const data = await response.json();

    if (response.ok && data.data) {
      return data.data[key] !== undefined ? data.data[key] : defaultValue;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}
