"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Switch } from "@heroui/switch";

import {
  hasGivenConsent,
  setConsentPreferences,
  defaultConsent,
  type ConsentPreferences,
} from "@/lib/consent";

export default function CookieNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const [preferences, setPreferences] =
    useState<ConsentPreferences>(defaultConsent);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    if (!hasGivenConsent()) {
      // Show immediately for GDPR compliance
      setShowNotice(true);
    }
  }, []);

  const acceptAll = () => {
    const allConsent: ConsentPreferences = {
      necessary: true,
      analytics: true,
      preferences: true,
    };

    setConsentPreferences(allConsent);
    setShowNotice(false);
  };

  const acceptSelected = () => {
    setConsentPreferences(preferences);
    setShowNotice(false);
  };

  const declineAll = () => {
    setConsentPreferences(defaultConsent);
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-default-200">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border border-default-300">
          <CardBody className="p-4">
            <h3 className="text-sm font-semibold mb-2">
              🍪 Cookie & Privacy Notice
            </h3>
            <p className="text-xs text-default-600 mb-3">
              We use localStorage to remember your preferences and improve your
              experience. No tracking, no invasive cookies. You can withdraw
              consent anytime.{" "}
              <Link className="text-primary text-xs underline" href="/privacy">
                Read our Privacy Policy
              </Link>
            </p>

            {showDetails && (
              <div className="mb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs">
                    Necessary (Required for basic functionality)
                  </span>
                  <Switch isDisabled isSelected={true} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">
                    Preferences (Remember likes, settings)
                  </span>
                  <Switch
                    isSelected={preferences.preferences}
                    size="sm"
                    onValueChange={(checked: boolean) =>
                      setPreferences((prev) => ({
                        ...prev,
                        preferences: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Analytics (Improve website)</span>
                  <Switch
                    isSelected={preferences.analytics}
                    size="sm"
                    onValueChange={(checked: boolean) =>
                      setPreferences((prev) => ({
                        ...prev,
                        analytics: checked,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                className="text-xs"
                color="primary"
                size="sm"
                onPress={acceptAll}
              >
                ✓ Accept All
              </Button>
              {showDetails && (
                <Button
                  className="text-xs"
                  color="primary"
                  size="sm"
                  variant="bordered"
                  onPress={acceptSelected}
                >
                  Save Preferences
                </Button>
              )}
              <Button
                className="text-xs"
                size="sm"
                variant="light"
                onPress={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide" : "Customize"}
              </Button>
              <Button
                className="text-xs"
                size="sm"
                variant="bordered"
                onPress={declineAll}
              >
                ✗ Decline Optional
              </Button>
            </div>
            <p className="text-xs text-default-400 mt-2 text-center">
              Required for EU/GDPR compliance
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
