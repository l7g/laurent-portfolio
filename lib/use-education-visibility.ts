import { useState, useEffect } from "react";

export function useEducationVisibility() {
  // Start with loading state to prevent content flash
  const [isEducationVisible, setIsEducationVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEducationSetting = async () => {
      try {
        const response = await fetch("/api/public/settings");

        if (response.ok) {
          const result = await response.json();
          const settingsData = result.data || {};
          const educationValue = settingsData.show_education;

          // Handle boolean values properly - default to false if not set
          const isVisible =
            educationValue === undefined
              ? false
              : educationValue === true || educationValue === "true";

          setIsEducationVisible(isVisible);
        } else {
          // Default to false if setting doesn't exist
          setIsEducationVisible(false);
        }
      } catch (error) {
        console.error("Error fetching education visibility setting:", error);
        setIsEducationVisible(false); // Default to false on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationSetting();
  }, []);

  return { isEducationVisible, isLoading };
}
