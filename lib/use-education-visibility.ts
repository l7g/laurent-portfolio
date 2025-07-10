import { useState, useEffect } from "react";

export function useEducationVisibility() {
  const [isEducationVisible, setIsEducationVisible] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducationSetting = async () => {
      try {
        const response = await fetch("/api/public/settings");
        if (response.ok) {
          const result = await response.json();
          const settingsData = result.data || {};
          const educationValue = settingsData.show_education;

          // Handle boolean values properly
          setIsEducationVisible(
            educationValue === true || educationValue === "true",
          );
        } else {
          // Default to true if setting doesn't exist
          setIsEducationVisible(true);
        }
      } catch (error) {
        console.error("Error fetching education visibility setting:", error);
        setIsEducationVisible(true); // Default to true on error
      } finally {
        setLoading(false);
      }
    };

    fetchEducationSetting();
  }, []);

  return { isEducationVisible, loading };
}
