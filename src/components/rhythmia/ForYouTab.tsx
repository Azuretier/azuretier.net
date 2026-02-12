'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './ForYouTab.module.css';

interface ContentCard {
    type: 'tutorial' | 'video' | 'tip';
    id: string;
    title: string;
    description: string;
    tags?: string[];
    url?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ForYouTabProps {
    locale: string;
    unlockedAdvancements: number;
    totalAdvancements: number;
}

const TYPE_ICONS: Record<string, string> = {
    tutorial: '📖',
    video: '▶',
    tip: '💡',
};

const DIFFICULTY_LABELS: Record<string, Record<string, string>> = {
    en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
    ja: { beginner: '初級', intermediate: '中級', advanced: '上級' },
};

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@rhythmia_official';

export default function ForYouTab({ locale, unlockedAdvancements, totalAdvancements }: ForYouTabProps) {
    const [cards, setCards] = useState<ContentCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showVideoPrompt, setShowVideoPrompt] = useState(false);
    const t = useTranslations('forYou');

    const fetchContent = useCallback(async () => {
        setLoading(true);
        setError(false);
        setShowVideoPrompt(false);
        try {
            const res = await fetch('/api/for-you', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locale,
                    unlockedAdvancements,
                    totalAdvancements,
                }),
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setCards(data.cards || []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [locale, unlockedAdvancements, totalAdvancements]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const diffLabels = DIFFICULTY_LABELS[locale] || DIFFICULTY_LABELS.en;

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner} />
                <span className={styles.loadingText}>{t('loading')}</span>
            </div>
        );
    }

    if (error || cards.length === 0) {
        return (
            <div className={styles.errorContainer}>
                <span className={styles.errorText}>{t('error')}</span>
                <button className={styles.retryButton} onClick={fetchContent}>
                    {t('retry')}
                </button>
            </div>
        );
    }

    const handleCardClick = (card: ContentCard) => {
        if (card.url) {
            window.open(card.url, '_blank', 'noopener,noreferrer');
        } else if (card.type === 'video') {
            setShowVideoPrompt(true);
        }
    };

    return (
        <div className={styles.forYouContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('title')}</h2>
                <p className={styles.sectionSubtitle}>{t('subtitle')}</p>
            </div>

            <div className={styles.cardGrid}>
                <AnimatePresence mode="wait">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            className={`${styles.card} ${styles[card.type]} ${card.type === 'video' && !card.url ? styles.videoNoUrl : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.35, delay: index * 0.06 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            onClick={() => handleCardClick(card)}
                            style={{ cursor: card.url || (card.type === 'video' && !card.url) ? 'pointer' : 'default' }}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.typeIcon}>{TYPE_ICONS[card.type] || '📌'}</span>
                                <span className={styles.typeLabel}>{t(`types.${card.type}`)}</span>
                                {card.difficulty && (
                                    <span className={`${styles.diffBadge} ${styles[`diff_${card.difficulty}`]}`}>
                                        {diffLabels[card.difficulty]}
                                    </span>
                                )}
                            </div>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <p className={styles.cardDescription}>{card.description}</p>
                            {card.tags && card.tags.length > 0 && (
                                <div className={styles.tagList}>
                                    {card.tags.map((tag) => (
                                        <span key={tag} className={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {card.url && (
                                <div className={styles.cardLink}>
                                    {t('watchOnYouTube')} →
                                </div>
                            )}
                            {card.type === 'video' && !card.url && (
                                <div className={styles.cardLinkPrompt}>
                                    {t('makeAVideo.tapToLearnMore')}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showVideoPrompt && (
                    <motion.div
                        className={styles.videoPromptCard}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <button
                            className={styles.videoPromptClose}
                            onClick={() => setShowVideoPrompt(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <span className={styles.videoPromptIcon}>🎬</span>
                        <span className={styles.videoPromptHeading}>{t('makeAVideo.heading')}</span>
                        <h3 className={styles.videoPromptTitle}>{t('makeAVideo.title')}</h3>
                        <p className={styles.videoPromptDescription}>{t('makeAVideo.description')}</p>
                        <a
                            href={YOUTUBE_CHANNEL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.videoPromptCta}
                        >
                            {t('makeAVideo.cta')}
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.refreshRow}>
                <button className={styles.refreshButton} onClick={fetchContent}>
                    {t('refresh')}
                </button>
            </div>
        </div>
    );
}
