/**
 * Utility functions for the portfolio application
 */

/**
 * Normalizes a URL by ensuring it has a protocol (https://)
 * @param url - The URL to normalize
 * @returns The normalized URL with https:// protocol
 */
export function normalizeUrl(url: string | undefined | null): string {
  if (!url) return "";

  // If the URL already has a protocol, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Otherwise, prepend https://
  return `https://${url}`;
}

/**
 * Safely opens a URL in a new tab with proper normalization
 * @param url - The URL to open
 */
export function openUrl(url: string | undefined | null): void {
  if (!url) return;

  const normalizedUrl = normalizeUrl(url);
  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}
