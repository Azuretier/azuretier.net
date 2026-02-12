'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { NotificationProvider } from '@/lib/notifications';
import { SkinProvider } from '@/lib/skin';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode='wait'>
      <ThemeProvider
        attribute='class'
        defaultTheme='dark'
        themes={['dark', 'light', 'kawaii']}
        enableSystem={false}
      >
        <SkinProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </SkinProvider>
      </ThemeProvider>
    </AnimatePresence>
  );
}
