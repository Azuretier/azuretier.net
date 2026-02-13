'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { STORIES } from '@/lib/nostalgic-stories/definitions';
import type { Story, SplashArt } from '@/lib/nostalgic-stories/definitions';
import styles from './NostalgicStories.module.css';

interface NostalgicStoriesProps {
    isOpen: boolean;
    onClose: () => void;
}

// Generate particle elements for overlay effects
function Particles({ type, ambientColor }: { type: SplashArt['overlayType']; ambientColor: string }) {
    const particles = useMemo(() => {
        if (type === 'none') return null;

        const count = type === 'stars' ? 40 : type === 'rain' ? 50 : 25;
        return Array.from({ length: count }, (_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = type === 'rain' ? 0.6 + Math.random() * 0.4
                : type === 'snow' ? 6 + Math.random() * 6
                : type === 'embers' ? 4 + Math.random() * 4
                : type === 'petals' ? 5 + Math.random() * 5
                : 2 + Math.random() * 3; // stars
            const size = type === 'stars' ? 1 + Math.random() * 2
                : type === 'rain' ? 1
                : type === 'snow' ? 2 + Math.random() * 3
                : type === 'embers' ? 2 + Math.random() * 3
                : 1; // petals handled by class

            const animationName = type === 'stars' ? 'twinkle'
                : type === 'rain' ? 'rainfall'
                : type === 'snow' ? 'snowfall'
                : type === 'embers' ? 'emberRise'
                : 'petalFall';

            const className = type === 'stars' ? styles.star
                : type === 'rain' ? styles.raindrop
                : type === 'snow' ? styles.snow
                : type === 'embers' ? styles.ember
                : styles.petal;

            return (
                <div
                    key={i}
                    className={`${styles.particle} ${className}`}
                    style={{
                        left: `${left}%`,
                        top: type === 'stars' ? `${Math.random() * 70}%` : undefined,
                        width: type === 'petals' ? undefined : `${size}px`,
                        height: type === 'petals' || type === 'rain' ? undefined : `${size}px`,
                        animationName,
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`,
                        '--ambient-color': ambientColor,
                    } as React.CSSProperties}
                />
            );
        });
    }, [type, ambientColor]);

    if (type === 'none') return null;
    return <div className={styles.particles}>{particles}</div>;
}

// Typewriter text effect
function TypewriterText({ text, ambientColor, isComplete, onComplete }: {
    text: string;
    ambientColor: string;
    isComplete: boolean;
    onComplete: () => void;
}) {
    const [displayedChars, setDisplayedChars] = useState(0);

    useEffect(() => {
        setDisplayedChars(0);
    }, [text]);

    useEffect(() => {
        if (isComplete || displayedChars >= text.length) {
            if (displayedChars >= text.length) onComplete();
            return;
        }
        const timer = setTimeout(() => {
            setDisplayedChars(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timer);
    }, [displayedChars, text, isComplete, onComplete]);

    const shown = isComplete ? text : text.slice(0, displayedChars);
    const done = isComplete || displayedChars >= text.length;

    return (
        <span>
            {shown}
            {done && (
                <span
                    className={styles.dialogCursor}
                    style={{ '--ambient-color': ambientColor } as React.CSSProperties}
                />
            )}
        </span>
    );
}

// Story viewer (full-screen visual novel mode)
function StoryViewer({ story, onClose, onBack }: { story: Story; onClose: () => void; onBack: () => void }) {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [textComplete, setTextComplete] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const t = useTranslations('nostalgicStories');

    const scene = story.scenes[sceneIndex];
    const isLastScene = sceneIndex >= story.scenes.length - 1;

    const advance = useCallback(() => {
        if (!textComplete) {
            setTextComplete(true);
            return;
        }
        if (isLastScene) {
            setShowEnd(true);
            return;
        }
        setTextComplete(false);
        setSceneIndex(prev => prev + 1);
    }, [textComplete, isLastScene]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            advance();
        } else if (e.key === 'Escape') {
            onClose();
        }
    }, [advance, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (showEnd) {
        return (
            <motion.div
                className={styles.viewer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div
                    className={styles.splashArt}
                    style={{ background: story.scenes[story.scenes.length - 1].splashArt.background }}
                />
                <div
                    className={styles.vignette}
                    style={{ '--vignette-intensity': 0.8 } as React.CSSProperties}
                />
                <motion.div
                    className={styles.endScreen}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.endTitle}>{t('endOfChapter')}</div>
                    <div className={styles.endStoryTitle}>{t(story.titleKey)}</div>
                    <div className={styles.endActions}>
                        <button
                            className={`${styles.endBtn} ${styles.endBtnPrimary}`}
                            onClick={(e) => { e.stopPropagation(); onBack(); }}
                        >
                            {t('backToStories')}
                        </button>
                        <button
                            className={`${styles.endBtn} ${styles.endBtnSecondary}`}
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                        >
                            {t('close')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={styles.viewer}
            onClick={advance}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Splash art background */}
            <motion.div
                key={scene.id}
                className={styles.splashArt}
                style={{ background: scene.splashArt.background }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            />

            {/* Vignette */}
            <div
                className={styles.vignette}
                style={{ '--vignette-intensity': scene.splashArt.vignette } as React.CSSProperties}
            />

            {/* Particles */}
            <Particles type={scene.splashArt.overlayType} ambientColor={scene.splashArt.ambientColor} />

            {/* Bottom gradient for dialog readability */}
            <div className={styles.silhouette} />

            {/* Scene counter */}
            <div className={styles.sceneCounter}>
                {sceneIndex + 1} / {story.scenes.length}
            </div>

            {/* Close button */}
            <button
                className={styles.closeButton}
                onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
                {t('close')}
            </button>

            {/* Dialog box */}
            <div className={styles.dialogContainer}>
                <motion.div
                    key={scene.id + '-dialog'}
                    className={styles.dialogBox}
                    style={{ '--ambient-color': scene.splashArt.ambientColor } as React.CSSProperties}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    onClick={(e) => { e.stopPropagation(); advance(); }}
                >
                    <div
                        className={styles.characterName}
                        style={{ '--ambient-color': scene.splashArt.ambientColor } as React.CSSProperties}
                    >
                        {t(scene.characterKey)}
                    </div>
                    <div className={styles.dialogText}>
                        <TypewriterText
                            text={t(scene.dialogKey)}
                            ambientColor={scene.splashArt.ambientColor}
                            isComplete={textComplete}
                            onComplete={() => setTextComplete(true)}
                        />
                    </div>
                    <div className={styles.advanceHint}>
                        {textComplete ? t('clickToContinue') : ''}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function NostalgicStories({ isOpen, onClose }: NostalgicStoriesProps) {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const t = useTranslations('nostalgicStories');

    // Reset selection when panel closes
    useEffect(() => {
        if (!isOpen) setSelectedStory(null);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {/* Story viewer (full screen) */}
            {selectedStory && (
                <StoryViewer
                    key={selectedStory.id}
                    story={selectedStory}
                    onClose={onClose}
                    onBack={() => setSelectedStory(null)}
                />
            )}

            {/* Story selection panel */}
            {isOpen && !selectedStory && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.panel}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.panelHeader}>
                            <div className={styles.panelTitleGroup}>
                                <div className={styles.panelTitle}>{t('title')}</div>
                                <div className={styles.panelSubtitle}>{t('subtitle')}</div>
                            </div>
                            <button className={styles.panelCloseBtn} onClick={onClose}>
                                {t('close')}
                            </button>
                        </div>

                        <div className={styles.panelBody}>
                            {STORIES.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    className={styles.storyCard}
                                    style={{ '--card-accent': story.accentColor } as React.CSSProperties}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.06 }}
                                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                    onClick={() => setSelectedStory(story)}
                                >
                                    {/* Splash art preview */}
                                    <div
                                        className={styles.splashPreview}
                                        style={{ background: story.scenes[0].splashArt.background }}
                                    />

                                    <div className={styles.storyCardBadge}>
                                        {story.badge}
                                    </div>
                                    <div className={styles.storyCardTitle}>
                                        {t(story.titleKey)}
                                    </div>
                                    <div className={styles.storyCardSubtitle}>
                                        {t(story.subtitleKey)}
                                    </div>
                                    <div className={styles.storyCardScenes}>
                                        {t('sceneCount', { count: story.scenes.length })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
