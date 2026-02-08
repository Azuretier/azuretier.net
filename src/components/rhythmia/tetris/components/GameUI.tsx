import React from 'react';
import { WORLDS, ColorTheme } from '../constants';
import type { GameMode } from '../types';
import styles from '../VanillaGame.module.css';

interface TitleScreenProps {
    onStart: (mode: GameMode) => void;
}

/**
 * Title screen component with game mode selection
 */
export function TitleScreen({ onStart }: TitleScreenProps) {
    return (
        <div className={styles.titleScreen}>
            <h1>RHYTHMIA</h1>
            <p>リズムに乗ってブロックを積め！</p>
            <div className={styles.modeSelect}>
                <button className={styles.modeBtn} onClick={() => onStart('vanilla')}>
                    <span className={styles.modeBtnIcon}>🎵</span>
                    <span className={styles.modeBtnTitle}>VANILLA</span>
                    <span className={styles.modeBtnDesc}>地形破壊リズムゲーム</span>
                </button>
                <button className={`${styles.modeBtn} ${styles.modeBtnTd}`} onClick={() => onStart('td')}>
                    <span className={styles.modeBtnIcon}>🏰</span>
                    <span className={styles.modeBtnTitle}>TOWER DEFENSE</span>
                    <span className={styles.modeBtnDesc}>タワーを守れ！</span>
                </button>
            </div>
        </div>
    );
}

interface WorldDisplayProps {
    worldIdx: number;
}

/**
 * Displays current world name
 */
export function WorldDisplay({ worldIdx }: WorldDisplayProps) {
    return (
        <div className={styles.worldDisplay}>{WORLDS[worldIdx].name}</div>
    );
}

interface ScoreDisplayProps {
    score: number;
    scorePop: boolean;
}

/**
 * Score display with pop animation
 */
export function ScoreDisplay({ score, scorePop }: ScoreDisplayProps) {
    return (
        <div className={`${styles.scoreDisplay} ${scorePop ? styles.pop : ''}`}>
            {score.toLocaleString()}
        </div>
    );
}

interface ComboDisplayProps {
    combo: number;
}

/**
 * Combo counter display
 */
export function ComboDisplay({ combo }: ComboDisplayProps) {
    return (
        <div className={`${styles.combo} ${combo >= 2 ? styles.show : ''} ${combo >= 5 ? styles.big : ''}`}>
            {combo} COMBO!
        </div>
    );
}

interface TerrainProgressProps {
    terrainRemaining: number;
    terrainTotal: number;
    stageNumber: number;
    gameMode: GameMode;
}

/**
 * Progress display — mode-aware
 * Vanilla: terrain destruction progress
 * TD: enemy count indicator
 */
export function TerrainProgress({ terrainRemaining, terrainTotal, stageNumber, gameMode }: TerrainProgressProps) {
    if (gameMode === 'td') {
        return (
            <>
                <div className={styles.terrainLabel}>STAGE {stageNumber} — TOWER DEFENSE</div>
                <div className={styles.terrainBar}>
                    <div className={styles.terrainFill} style={{ width: `${terrainTotal > 0 ? Math.min(100, (terrainRemaining / 20) * 100) : 0}%`, background: terrainRemaining > 10 ? '#ff4444' : terrainRemaining > 5 ? '#ffaa00' : '#44ff44' }} />
                </div>
                <div style={{ color: '#aaa', fontSize: '0.7em', textAlign: 'center', marginTop: '2px' }}>
                    ENEMIES: {terrainRemaining}
                </div>
            </>
        );
    }

    // Vanilla mode: terrain destruction progress
    const pct = terrainTotal > 0 ? Math.min(100, ((terrainTotal - terrainRemaining) / terrainTotal) * 100) : 0;
    return (
        <>
            <div className={styles.terrainLabel}>STAGE {stageNumber} — DIG</div>
            <div className={styles.terrainBar}>
                <div className={styles.terrainFill} style={{ width: `${pct}%` }} />
            </div>
            <div style={{ color: '#aaa', fontSize: '0.7em', textAlign: 'center', marginTop: '2px' }}>
                {terrainRemaining} / {terrainTotal} blocks
            </div>
        </>
    );
}

interface BeatBarProps {
    beatPhase: number;
}

/**
 * Beat timing indicator bar
 */
export function BeatBar({ beatPhase }: BeatBarProps) {
    return (
        <div className={styles.beatBar}>
            <div className={styles.beatTarget} />
            <div className={styles.beatFill} style={{ width: `${beatPhase * 100}%` }} />
        </div>
    );
}

interface StatsProps {
    lines: number;
    level: number;
}

/**
 * Stats panel showing lines and level
 */
export function StatsPanel({ lines, level }: StatsProps) {
    return (
        <div className={styles.statsPanel || 'flex gap-4 mt-4 text-white text-sm'}>
            <div>LINES: {lines}</div>
            <div>LEVEL: {level}</div>
        </div>
    );
}

interface ThemeNavProps {
    colorTheme: ColorTheme;
    onThemeChange: (theme: ColorTheme) => void;
}

/**
 * Theme selector navbar
 */
export function ThemeNav({ colorTheme, onThemeChange }: ThemeNavProps) {
    return (
        <div className={styles.themeNav}>
            <span className={styles.themeLabel}>🎨 Theme:</span>
            <button
                className={`${styles.themeBtn} ${colorTheme === 'standard' ? styles.active : ''}`}
                onClick={() => onThemeChange('standard')}
            >
                Standard
            </button>
            <button
                className={`${styles.themeBtn} ${colorTheme === 'stage' ? styles.active : ''}`}
                onClick={() => onThemeChange('stage')}
            >
                Stage
            </button>
            <button
                className={`${styles.themeBtn} ${colorTheme === 'monochrome' ? styles.active : ''}`}
                onClick={() => onThemeChange('monochrome')}
            >
                Mono
            </button>
        </div>
    );
}

interface JudgmentDisplayProps {
    text: string;
    color: string;
    show: boolean;
}

/**
 * Judgment text display (PERFECT!, etc.)
 */
export function JudgmentDisplay({ text, color, show }: JudgmentDisplayProps) {
    return (
        <div
            className={`${styles.judgment} ${show ? styles.show : ''}`}
            style={{ color, textShadow: `0 0 30px ${color}` }}
        >
            {text}
        </div>
    );
}

interface TouchControlsProps {
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onMoveDown: () => void;
    onRotateCW: () => void;
    onRotateCCW: () => void;
    onHardDrop: () => void;
    onHold: () => void;
    isMobile?: boolean;
}

/**
 * Touch control buttons for mobile
 */
export function TouchControls({
    onMoveLeft,
    onMoveRight,
    onMoveDown,
    onRotateCW,
    onRotateCCW,
    onHardDrop,
    onHold,
    isMobile = true,
}: TouchControlsProps) {
    // Only render on mobile devices
    if (!isMobile) return null;
    const actions = [
        { action: 'rotateLeft', handler: onRotateCCW, label: '↺' },
        { action: 'left', handler: onMoveLeft, label: '←' },
        { action: 'down', handler: onMoveDown, label: '↓' },
        { action: 'right', handler: onMoveRight, label: '→' },
        { action: 'rotate', handler: onRotateCW, label: '↻' },
        { action: 'drop', handler: onHardDrop, label: '⬇' },
        { action: 'hold', handler: onHold, label: 'HOLD' },
    ];

    return (
        <div className={styles.controls}>
            {actions.map(({ action, handler, label }) => (
                <button
                    key={action}
                    className={styles.ctrlBtn}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        handler();
                    }}
                    onClick={handler}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
