'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import type { SkinId } from './types';
import { KAWAII_REQUIRED_ADVANCEMENTS } from './types';
import { getStoredSkin, setStoredSkin } from './storage';
import { getUnlockedCount } from '@/lib/advancements/storage';

interface SkinContextType {
  currentSkin: SkinId;
  setSkin: (skin: SkinId) => void;
  isKawaiiUnlocked: boolean;
  kawaiiProgress: number;
  kawaiiRequired: number;
}

const SkinContext = createContext<SkinContextType | undefined>(undefined);

/** Maps skin IDs to the class name applied to <html> via next-themes */
function skinToTheme(skin: SkinId): string {
  return skin;
}

export function SkinProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const [currentSkin, setCurrentSkin] = useState<SkinId>('dark');
  const [kawaiiProgress, setKawaiiProgress] = useState(0);

  const isKawaiiUnlocked = kawaiiProgress >= KAWAII_REQUIRED_ADVANCEMENTS;

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = getStoredSkin();
    const unlocked = getUnlockedCount();
    setKawaiiProgress(unlocked);

    if (stored) {
      // If stored skin is kawaii but no longer unlocked, fall back to dark
      if (stored === 'kawaii' && unlocked < KAWAII_REQUIRED_ADVANCEMENTS) {
        setCurrentSkin('dark');
        setStoredSkin('dark');
        setTheme('dark');
      } else {
        setCurrentSkin(stored);
        setTheme(skinToTheme(stored));
      }
    }
  }, [setTheme]);

  const setSkin = useCallback((skin: SkinId) => {
    // Prevent selecting kawaii if not unlocked
    if (skin === 'kawaii') {
      const unlocked = getUnlockedCount();
      setKawaiiProgress(unlocked);
      if (unlocked < KAWAII_REQUIRED_ADVANCEMENTS) return;
    }

    setCurrentSkin(skin);
    setStoredSkin(skin);
    setTheme(skinToTheme(skin));
  }, [setTheme]);

  // Periodically refresh kawaii unlock status
  const refreshKawaiiProgress = useCallback(() => {
    const unlocked = getUnlockedCount();
    setKawaiiProgress(unlocked);
  }, []);

  useEffect(() => {
    // Check on focus (user might have unlocked advancements in another tab/game)
    window.addEventListener('focus', refreshKawaiiProgress);
    return () => window.removeEventListener('focus', refreshKawaiiProgress);
  }, [refreshKawaiiProgress]);

  return (
    <SkinContext.Provider value={{
      currentSkin,
      setSkin,
      isKawaiiUnlocked,
      kawaiiProgress,
      kawaiiRequired: KAWAII_REQUIRED_ADVANCEMENTS,
    }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin(): SkinContextType {
  const context = useContext(SkinContext);
  if (context === undefined) {
    throw new Error('useSkin must be used within a SkinProvider');
  }
  return context;
}
