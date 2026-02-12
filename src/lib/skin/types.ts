/**
 * Skin (theme) type definitions
 */

export const SKIN_IDS = ['dark', 'light', 'kawaii'] as const;
export type SkinId = typeof SKIN_IDS[number];

export interface SkinMetadata {
  id: SkinId;
  name: string;
  icon: string;
  /** If set, requires this many unlocked advancements to use */
  requiredAdvancements?: number;
}

export const SKIN_METADATA: Record<SkinId, SkinMetadata> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
  },
  light: {
    id: 'light',
    name: 'Light',
    icon: '☀️',
  },
  kawaii: {
    id: 'kawaii',
    name: 'Kawaii',
    icon: '🎀',
    requiredAdvancements: 10,
  },
};

/** Number of advancements required to unlock the Kawaii theme */
export const KAWAII_REQUIRED_ADVANCEMENTS = 10;
