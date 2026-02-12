/**
 * Skin storage utilities for localStorage
 */

import { SkinId, SKIN_IDS } from './types';

const STORAGE_KEY = 'azuret_skin';

function isValidSkinId(value: string): value is SkinId {
  return SKIN_IDS.includes(value as SkinId);
}

export function getStoredSkin(): SkinId | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidSkinId(stored)) {
      return stored;
    }
  } catch {}

  return null;
}

export function setStoredSkin(skin: SkinId): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, skin);
  } catch {}
}

export function clearStoredSkin(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
