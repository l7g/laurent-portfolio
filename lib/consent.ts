"use client";

// GDPR-compliant consent management
export interface ConsentPreferences {
  necessary: boolean; // Always true, required for basic functionality
  analytics: boolean; // Optional, for website analytics
  preferences: boolean; // Optional, for remembering user choices like likes
}

export const defaultConsent: ConsentPreferences = {
  necessary: true,
  analytics: false,
  preferences: false,
};

export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === "undefined") return defaultConsent;

  const stored = localStorage.getItem("gdprConsent");

  if (!stored) return defaultConsent;

  try {
    return { ...defaultConsent, ...JSON.parse(stored) };
  } catch {
    return defaultConsent;
  }
}

export function setConsentPreferences(preferences: ConsentPreferences) {
  if (typeof window === "undefined") return;

  localStorage.setItem("gdprConsent", JSON.stringify(preferences));
  localStorage.setItem("gdprConsentDate", new Date().toISOString());

  // Trigger consent change event
  window.dispatchEvent(
    new CustomEvent("consentChanged", { detail: preferences }),
  );
}

export function hasGivenConsent(): boolean {
  if (typeof window === "undefined") return false;

  return localStorage.getItem("gdprConsent") !== null;
}

export function canUseAnalytics(): boolean {
  const preferences = getConsentPreferences();

  return preferences.analytics;
}

export function canUsePreferences(): boolean {
  const preferences = getConsentPreferences();

  return preferences.preferences;
}

export function revokeAllConsent() {
  if (typeof window === "undefined") return;

  // Clear all consent-related data
  localStorage.removeItem("gdprConsent");
  localStorage.removeItem("gdprConsentDate");
  localStorage.removeItem("cookieConsent"); // Legacy
  localStorage.removeItem("cookieConsentDate"); // Legacy

  // Clear all preference data that requires consent
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith("liked_post_") || key === "lastLikeTime") {
      localStorage.removeItem(key);
    }
  });

  // Trigger revocation event
  window.dispatchEvent(new CustomEvent("consentRevoked"));
}

// Utility to clear all likes (for privacy)
export function clearAllLikes() {
  if (typeof window === "undefined") return;

  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith("liked_post_")) {
      localStorage.removeItem(key);
    }
  });
  localStorage.removeItem("lastLikeTime");
}
