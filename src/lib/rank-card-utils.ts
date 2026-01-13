// Utility functions for rank card operations

/**
 * Normalize display name for consistent lookups
 * Uses NFKC normalization and converts to lowercase
 */
export function normalizeDisplayName(displayName: string): string {
  return displayName.trim().normalize('NFKC').toLowerCase();
}

/**
 * Generate stable card ID from guild and display name
 * Uses SHA-256 hash for consistent IDs
 * Works in both browser and Node.js environments
 */
export async function generateCardId(
  guildId: string,
  displayNameKey: string
): Promise<string> {
  const input = `${guildId}:${displayNameKey}`;
  
  // Use Web Crypto API (available in both browser and modern Node.js)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for older environments
  throw new Error('Web Crypto API not available');
}
