'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FiDroplet } from 'react-icons/fi';
import { useSkin } from '@/lib/skin';
import { SKIN_IDS, SKIN_METADATA } from '@/lib/skin/types';
import type { SkinId } from '@/lib/skin/types';
import { Button } from '@/components/main/ui/button';

function SkinOption({ skinId, isActive, isLocked, progress, required, onSelect }: {
  skinId: SkinId;
  isActive: boolean;
  isLocked: boolean;
  progress: number;
  required: number;
  onSelect: () => void;
}) {
  const t = useTranslations('skin');
  const meta = SKIN_METADATA[skinId];

  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all
        ${isActive
          ? 'bg-azure-500/20 border border-azure-500/50'
          : isLocked
            ? 'opacity-50 cursor-not-allowed border border-transparent'
            : 'hover:bg-white/5 border border-transparent hover:border-white/10'
        }
      `}
    >
      <span className="text-xl flex-shrink-0">{meta.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isActive ? 'text-azure-500' : 'text-foreground'}`}>
            {t(`skins.${skinId}.name`)}
          </span>
          {isActive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-azure-500/20 text-azure-500 font-medium uppercase tracking-wider">
              {t('active')}
            </span>
          )}
          {isLocked && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-subtext font-medium">
              🔒
            </span>
          )}
        </div>
        <p className="text-xs text-subtext mt-0.5 truncate">
          {isLocked
            ? t('locked', { current: progress, required })
            : t(`skins.${skinId}.desc`)
          }
        </p>
      </div>
    </button>
  );
}

export function SkinMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('skin');
  const { currentSkin, setSkin, isKawaiiUnlocked, kawaiiProgress, kawaiiRequired } = useSkin();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('title')}
      >
        <FiDroplet size={18} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-2 border-b border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-subtext">
                {t('title')}
              </h3>
            </div>

            <div className="p-2 space-y-1">
              {SKIN_IDS.map((skinId) => {
                const isLocked = skinId === 'kawaii' && !isKawaiiUnlocked;
                return (
                  <SkinOption
                    key={skinId}
                    skinId={skinId}
                    isActive={currentSkin === skinId}
                    isLocked={isLocked}
                    progress={kawaiiProgress}
                    required={kawaiiRequired}
                    onSelect={() => {
                      if (!isLocked) {
                        setSkin(skinId);
                        setIsOpen(false);
                      }
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
