"use client";

import { useState, useEffect } from "react";
import { Switch } from "@heroui/switch";
import { Spinner } from "@heroui/spinner";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function EducationVisibilityToggle() {
  const [isEducationVisible, setIsEducationVisible] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch current setting
  useEffect(() => {
    const fetchEducationSetting = async () => {
      try {
        const response = await fetch("/api/settings/show_education");

        if (response.ok) {
          const result = await response.json();
          const setting = result.data;

          setIsEducationVisible(
            setting?.value === "true" || setting?.value === true,
          );
        } else if (response.status === 404) {
          // If setting doesn't exist, default to true
          setIsEducationVisible(true);
        } else {
          console.error("Error fetching education setting:", response.status);
          setIsEducationVisible(true);
        }
      } catch (error) {
        console.error("Error fetching education setting:", error);
        setIsEducationVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationSetting();
  }, []);

  const handleToggle = async (value: boolean) => {
    setUpdating(true);
    setStatus("idle");

    try {
      // Use PUT which now handles upsert automatically
      const response = await fetch("/api/settings/show_education", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: value.toString(),
          type: "boolean",
          description:
            "Controls whether education-related content is visible on the site",
          isPublic: true,
        }),
      });

      if (response.ok) {
        setIsEducationVisible(value);
        setStatus("success");

        // Clear success status after 2 seconds
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to update setting");
      }
    } catch (error) {
      console.error("Error updating education setting:", error);
      setStatus("error");

      // Clear error status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm text-default-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Switch
        color={isEducationVisible ? "success" : "default"}
        isDisabled={updating}
        isSelected={isEducationVisible}
        size="lg"
        onValueChange={handleToggle}
      >
        <span className="text-sm font-medium">
          {isEducationVisible ? "Education Visible" : "Education Hidden"}
        </span>
      </Switch>

      {updating && (
        <div className="flex items-center gap-1">
          <Spinner size="sm" />
          <span className="text-xs text-default-500">Updating...</span>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-1 text-success">
          <CheckCircleIcon className="w-4 h-4" />
          <span className="text-xs">Updated!</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-1 text-danger">
          <ExclamationTriangleIcon className="w-4 h-4" />
          <span className="text-xs">Error updating</span>
        </div>
      )}
    </div>
  );
}
