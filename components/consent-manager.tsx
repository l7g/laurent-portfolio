"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Switch } from "@heroui/switch";
import {
  getConsentPreferences,
  setConsentPreferences,
  revokeAllConsent,
  clearAllLikes,
  type ConsentPreferences,
} from "@/lib/consent";

export default function ConsentManager() {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    preferences: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setPreferences(getConsentPreferences());
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    setConsentPreferences(preferences);
    alert("Consent preferences saved!");
  };

  const handleRevokeAll = () => {
    if (
      confirm(
        "This will clear all your stored preferences and data. Are you sure?",
      )
    ) {
      revokeAllConsent();
      setPreferences({
        necessary: true,
        analytics: false,
        preferences: false,
      });
      alert("All consent revoked and data cleared!");
    }
  };

  const handleClearLikes = () => {
    if (confirm("This will clear all your liked posts. Are you sure?")) {
      clearAllLikes();
      alert("All likes cleared!");
    }
  };

  if (!isLoaded) {
    return <div className="animate-pulse">Loading consent preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Consent Preferences</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
            <div>
              <h4 className="font-medium">Necessary</h4>
              <p className="text-sm text-default-600">
                Required for basic website functionality
              </p>
            </div>
            <Switch isSelected={true} isDisabled />
          </div>

          <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
            <div>
              <h4 className="font-medium">Preferences</h4>
              <p className="text-sm text-default-600">
                Remember your likes, settings, and choices
              </p>
            </div>
            <Switch
              isSelected={preferences.preferences}
              onValueChange={(checked: boolean) =>
                setPreferences((prev) => ({ ...prev, preferences: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
            <div>
              <h4 className="font-medium">Analytics</h4>
              <p className="text-sm text-default-600">
                Help us improve the website
              </p>
            </div>
            <Switch
              isSelected={preferences.analytics}
              onValueChange={(checked: boolean) =>
                setPreferences((prev) => ({ ...prev, analytics: checked }))
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button color="primary" onPress={handleSave}>
              Save Preferences
            </Button>
            <Button variant="bordered" onPress={handleClearLikes}>
              Clear All Likes
            </Button>
            <Button color="danger" variant="bordered" onPress={handleRevokeAll}>
              Revoke All Consent
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Current Status</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success">✓</div>
              <div className="text-sm">Necessary</div>
            </div>
            <div
              className={`p-3 rounded-lg ${preferences.preferences ? "bg-success-50" : "bg-default-100"}`}
            >
              <div
                className={`text-2xl font-bold ${preferences.preferences ? "text-success" : "text-default-400"}`}
              >
                {preferences.preferences ? "✓" : "✗"}
              </div>
              <div className="text-sm">Preferences</div>
            </div>
            <div
              className={`p-3 rounded-lg ${preferences.analytics ? "bg-success-50" : "bg-default-100"}`}
            >
              <div
                className={`text-2xl font-bold ${preferences.analytics ? "text-success" : "text-default-400"}`}
              >
                {preferences.analytics ? "✓" : "✗"}
              </div>
              <div className="text-sm">Analytics</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
