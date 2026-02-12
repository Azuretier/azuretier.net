'use client';

import * as React from 'react';
import { useSkin } from '@/lib/skin';

import { Button } from '@/components/main/ui/button';
import { FiMoon, FiSun } from 'react-icons/fi';

/**
 * Quick toggle between dark and light skins.
 * For the full skin menu (including kawaii), use SkinMenu instead.
 */
export function ThemeToggle() {
  const { currentSkin, setSkin } = useSkin();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setSkin(currentSkin === 'light' ? 'dark' : 'light')}
    >
      <FiSun size={20} className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <FiMoon
        size={20}
        className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}