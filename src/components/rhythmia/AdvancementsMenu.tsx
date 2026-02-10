'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ADVANCEMENTS } from '@/lib/advancements/definitions';
import { loadAdvancementState } from '@/lib/advancements/storage';
import type { AdvancementCategory, AdvancementState } from '@/lib/advancements/types';
import styles from './AdvancementsMenu.module.css';

const CATEGORY_ORDER: AdvancementCategory[] = ['general', 'lines', 'score', 'tspin', 'combo', 'multiplayer'];

const CATEGORY_LABELS: Record<string, Record<AdvancementCategory, string>> = {
    en: {
        general: 'General',
        lines: 'Lines',
        score: 'Score',
        tspin: 'T-Spin',
        combo: 'Combo',
        multiplayer: 'Multiplayer',
    },
    ja: {
        general: '全般',
        lines: 'ライン',
        score: 'スコア',
        tspin: 'Tスピン',
        combo: 'コンボ',
        multiplayer: 'マルチプレイ',
    },
};

function formatNumber(n: number): string {
    if (n >= 10000000) return `${(n / 1000000).toFixed(0)}M`;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 10000) return `${(n / 1000).toFixed(0)}K`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
}

interface AdvancementsMenuProps {
    onClose: () => void;
    overlay?: boolean;
}

export function AdvancementsMenu({ onClose, overlay = false }: AdvancementsMenuProps) {
    const [advState, setAdvState] = useState<AdvancementState | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<AdvancementCategory>('general');
    const t = useTranslations();

    useEffect(() => {
        setAdvState(loadAdvancementState());
    }, []);

    if (!advState) return null;

    const unlockedCount = advState.unlockedIds.length;
    const totalCount = ADVANCEMENTS.length;
    const progressPercent = Math.round((unlockedCount / totalCount) * 100);
    const filteredAdvancements = ADVANCEMENTS.filter(a => a.category === selectedCategory);

    // Detect locale from translations
    const locale = t('lobby.play') === 'PLAY' ? 'en' : 'ja';
    const categoryLabels = CATEGORY_LABELS[locale] || CATEGORY_LABELS.en;

    const panel = (
        <div className={styles.panel}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.title}>{t('advancements.title')}</h2>
                    <div className={styles.progressLabel}>
                        {unlockedCount} / {totalCount} ({progressPercent}%)
                    </div>
                </div>
                <button className={styles.back} onClick={onClose}>
                    &larr; {t('lobby.back')}
                </button>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Category tabs */}
            <div className={styles.tabs}>
                {CATEGORY_ORDER.map(cat => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {categoryLabels[cat]}
                        </button>
                    );
                })}
            </div>

            {/* Advancement list */}
            <div className={styles.list}>
                {filteredAdvancements.map(adv => {
                    const unlocked = advState.unlockedIds.includes(adv.id);
                    const currentValue = advState.stats[adv.statKey];
                    const progress = Math.min(1, currentValue / adv.threshold);
                    const displayName = t(`advancements.${adv.id}.name`);
                    const displayDesc = t(`advancements.${adv.id}.desc`);

                    return (
                        <div
                            key={adv.id}
                            className={`${styles.item} ${unlocked ? styles.itemUnlocked : styles.itemLocked}`}
                        >
                            <div className={styles.itemIcon}>
                                {unlocked ? adv.icon : '🔒'}
                            </div>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemName}>{displayName}</div>
                                <div className={styles.itemDesc}>{displayDesc}</div>
                                <div className={styles.itemProgressBar}>
                                    <div
                                        className={styles.itemProgressFill}
                                        style={{ width: `${progress * 100}%` }}
                                    />
                                </div>
                                <div className={styles.itemProgressText}>
                                    {formatNumber(currentValue)} / {formatNumber(adv.threshold)}
                                </div>
                            </div>
                            {unlocked && <div className={styles.itemCheck}>&#10003;</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    if (overlay) {
        return (
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
            >
                {panel}
            </motion.div>
        );
    }

    return panel;
}

export default AdvancementsMenu;
