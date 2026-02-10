'use client';

import React, { useState, useMemo } from 'react';
import type { InventoryItem, CraftedCard, ItemType, WeaponCard } from '../types';
import { ITEMS, ITEM_MAP, WEAPON_CARDS, WEAPON_CARD_MAP } from '../constants';
import { ItemIcon, WeaponIcon } from './ItemIcon';
import styles from './InventoryOverlay.module.css';

// ===== Rarity colors =====
const RARITY_COLORS: Record<string, string> = {
    common: '#8B8B8B',
    uncommon: '#4FC3F7',
    rare: '#FFD700',
    epic: '#9C27B0',
    legendary: '#FFFFFF',
};

const RARITY_LABELS: Record<string, string> = {
    common: 'COMMON',
    uncommon: 'UNCOMMON',
    rare: 'RARE',
    epic: 'EPIC',
    legendary: 'LEGENDARY',
};

// Category filter tabs
type CategoryFilter = 'all' | 'materials' | 'weapons';
const CATEGORY_TABS: { id: CategoryFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '📦' },
    { id: 'materials', label: 'Materials', icon: '🪨' },
    { id: 'weapons', label: 'Weapons', icon: '⚔️' },
];

// Unified slot item for the grid
type SlotItem =
    | { kind: 'material'; item: ItemType; count: number }
    | { kind: 'weapon'; card: WeaponCard; equipped: boolean };

interface InventoryOverlayProps {
    inventory: InventoryItem[];
    craftedCards: CraftedCard[];
    damageMultiplier: number;
    onClose: () => void;
    closeKey: string;
}

export function InventoryOverlay({
    inventory,
    craftedCards,
    damageMultiplier,
    onClose,
    closeKey,
}: InventoryOverlayProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [category, setCategory] = useState<CategoryFilter>('all');

    // Build unified slot list
    const slots: SlotItem[] = useMemo(() => {
        const result: SlotItem[] = [];

        if (category === 'all' || category === 'materials') {
            for (const inv of inventory) {
                const item = ITEM_MAP[inv.itemId];
                if (item) result.push({ kind: 'material', item, count: inv.count });
            }
        }

        if (category === 'all' || category === 'weapons') {
            for (const cc of craftedCards) {
                const card = WEAPON_CARD_MAP[cc.cardId];
                if (card) result.push({ kind: 'weapon', card, equipped: true });
            }
        }

        return result;
    }, [inventory, craftedCards, category]);

    const selectedSlot = selectedIdx !== null ? slots[selectedIdx] ?? null : null;

    // Grid: 3 columns x 6 rows = 18 slots
    const GRID_COLS = 3;
    const GRID_ROWS = 6;
    const totalSlots = GRID_COLS * GRID_ROWS;

    // Active equipped weapon (first one)
    const equippedWeapon = craftedCards.length > 0 ? WEAPON_CARD_MAP[craftedCards[craftedCards.length - 1].cardId] : null;

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                {/* ===== Left Panel: Equipped Items ===== */}
                <div className={styles.leftPanel}>
                    {/* Main weapon slot */}
                    <div className={styles.equippedSection}>
                        <div
                            className={`${styles.equippedSlot} ${styles.equippedSlotMain}`}
                            style={equippedWeapon ? {
                                borderColor: `${equippedWeapon.color}60`,
                                background: `radial-gradient(circle, ${equippedWeapon.glowColor}15, transparent)`,
                            } : {}}
                        >
                            {equippedWeapon ? (
                                <>
                                    <WeaponIcon cardId={equippedWeapon.id} size={36} glowColor={equippedWeapon.glowColor} />
                                    <span className={styles.equippedCount}>x{damageMultiplier.toFixed(1)}</span>
                                </>
                            ) : (
                                <span className={styles.emptySlotX}>+</span>
                            )}
                        </div>

                        {/* Secondary equipped slots */}
                        <div className={styles.equippedRow}>
                            {craftedCards.slice(0, -1).map((cc, i) => {
                                const card = WEAPON_CARD_MAP[cc.cardId];
                                if (!card) return null;
                                return (
                                    <div
                                        key={i}
                                        className={styles.equippedSlot}
                                        style={{
                                            borderColor: `${card.color}50`,
                                            background: `radial-gradient(circle, ${card.glowColor}10, transparent)`,
                                        }}
                                    >
                                        <WeaponIcon cardId={cc.cardId} size={20} glowColor={card.glowColor} />
                                    </div>
                                );
                            })}
                            {/* Fill empty secondary slots */}
                            {Array.from({ length: Math.max(0, 2 - Math.max(0, craftedCards.length - 1)) }).map((_, i) => (
                                <div key={`empty-eq-${i}`} className={styles.equippedSlot}>
                                    <span className={styles.emptySlotX}>+</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Player stats */}
                    <div className={styles.playerStats}>
                        <div className={styles.statBadge}>
                            <span className={styles.statBadgeLabel}>POWER</span>
                            <span className={styles.statBadgeValue}>
                                {Math.round(damageMultiplier * 100)}
                            </span>
                        </div>
                    </div>

                    {/* Quick material summary */}
                    <div className={styles.quickMaterials}>
                        {inventory.slice(0, 3).map(inv => {
                            const item = ITEM_MAP[inv.itemId];
                            if (!item) return null;
                            return (
                                <div key={inv.itemId} className={styles.quickMat}>
                                    <ItemIcon itemId={inv.itemId} size={18} />
                                    <span className={styles.quickMatCount}>{inv.count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== Center Panel: Grid ===== */}
                <div className={styles.centerPanel}>
                    {/* Category tabs */}
                    <div className={styles.categoryTabs}>
                        {CATEGORY_TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`${styles.categoryTab} ${category === tab.id ? styles.categoryTabActive : ''}`}
                                onClick={() => { setCategory(tab.id); setSelectedIdx(null); }}
                            >
                                <span className={styles.categoryTabIcon}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Item grid */}
                    <div
                        className={styles.itemGrid}
                        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
                    >
                        {Array.from({ length: totalSlots }).map((_, i) => {
                            const slot = slots[i] ?? null;
                            const isSelected = selectedIdx === i;

                            if (!slot) {
                                return (
                                    <div key={i} className={styles.gridSlot}>
                                        <div className={styles.emptySlotCross}>
                                            <div className={styles.crossLine1} />
                                            <div className={styles.crossLine2} />
                                        </div>
                                    </div>
                                );
                            }

                            if (slot.kind === 'material') {
                                const rarityColor = RARITY_COLORS[slot.item.rarity] || '#8B8B8B';
                                return (
                                    <div
                                        key={i}
                                        className={`${styles.gridSlot} ${styles.gridSlotFilled} ${isSelected ? styles.gridSlotSelected : ''}`}
                                        style={{ borderColor: `${rarityColor}50` }}
                                        onClick={() => setSelectedIdx(isSelected ? null : i)}
                                    >
                                        <div className={styles.slotIconArea}>
                                            <ItemIcon itemId={slot.item.id} size={32} />
                                        </div>
                                        <div className={styles.slotBadge}>
                                            <span className={styles.slotBadgeCount}>{slot.count}</span>
                                        </div>
                                    </div>
                                );
                            }

                            // Weapon slot
                            const weaponRarity = deriveWeaponRarity(slot.card);
                            const rarityColor = RARITY_COLORS[weaponRarity] || '#8B8B8B';
                            return (
                                <div
                                    key={i}
                                    className={`${styles.gridSlot} ${styles.gridSlotFilled} ${isSelected ? styles.gridSlotSelected : ''}`}
                                    style={{
                                        borderColor: `${rarityColor}50`,
                                        background: `linear-gradient(135deg, ${slot.card.color}15, transparent)`,
                                    }}
                                    onClick={() => setSelectedIdx(isSelected ? null : i)}
                                >
                                    <div className={styles.slotIconArea}>
                                        <ItemIcon itemId={slot.card.id} size={32} />
                                    </div>
                                    {slot.equipped && (
                                        <div className={`${styles.slotBadge} ${styles.slotBadgeEquipped}`}>
                                            <span className={styles.slotBadgeIcon}>E</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== Right Panel: Detail ===== */}
                <div className={styles.rightPanel}>
                    {selectedSlot ? (
                        <DetailPanel slot={selectedSlot} />
                    ) : (
                        <div className={styles.detailEmpty}>
                            <span className={styles.detailEmptyText}>Select an item</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom bar */}
            <div className={styles.bottomBar}>
                <span className={styles.bottomHint}>
                    <span className={styles.keyBadge}>{closeKey.toUpperCase()}</span> Close
                </span>
                <span className={styles.bottomHint}>
                    <span className={styles.keyBadge}>Click</span> Select
                </span>
            </div>
        </div>
    );
}

// ===== Detail Panel =====
function DetailPanel({ slot }: { slot: SlotItem }) {
    if (slot.kind === 'material') {
        const { item, count } = slot;
        const rarityColor = RARITY_COLORS[item.rarity] || '#8B8B8B';

        return (
            <div className={styles.detailContent}>
                {/* Large icon */}
                <div className={styles.detailIconArea}>
                    <ItemIcon itemId={item.id} size={64} />
                </div>

                {/* Name + rarity */}
                <div className={styles.detailHeader}>
                    <span
                        className={styles.detailRarityBadge}
                        style={{ color: rarityColor, borderColor: `${rarityColor}50`, background: `${rarityColor}15` }}
                    >
                        {RARITY_LABELS[item.rarity]}
                    </span>
                    <h3 className={styles.detailName} style={{ color: rarityColor }}>{item.name}</h3>
                    <span className={styles.detailNameJa}>{item.nameJa}</span>
                </div>

                {/* Stats */}
                <div className={styles.detailStats}>
                    <div className={styles.detailStatRow}>
                        <span className={styles.detailStatIcon}>📦</span>
                        <span className={styles.detailStatLabel}>Count</span>
                        <span className={styles.detailStatValue}>{count}</span>
                    </div>
                    <div className={styles.detailStatRow}>
                        <span className={styles.detailStatIcon}>🎲</span>
                        <span className={styles.detailStatLabel}>Drop Weight</span>
                        <span className={styles.detailStatValue}>{item.dropWeight}</span>
                    </div>
                </div>

                {/* Description */}
                <p className={styles.detailLore}>
                    Collected from terrain blocks. Used in weapon forging recipes at the Weapon Forge.
                </p>

                {/* Power bars */}
                <div className={styles.detailBars}>
                    <div className={styles.detailBar}>
                        <span className={styles.detailBarLabel}>RARITY</span>
                        <div className={styles.detailBarTrack}>
                            <div
                                className={styles.detailBarFill}
                                style={{
                                    width: `${rarityPercent(item.rarity)}%`,
                                    background: rarityColor,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Weapon
    const { card, equipped } = slot;
    const weaponRarity = deriveWeaponRarity(card);
    const rarityColor = RARITY_COLORS[weaponRarity] || '#8B8B8B';
    const damagePercent = Math.round((card.damageMultiplier - 1) * 100);

    return (
        <div className={styles.detailContent}>
            {/* Large icon */}
            <div className={styles.detailIconArea}>
                <ItemIcon itemId={card.id} size={64} />
            </div>

            {/* Name + rarity */}
            <div className={styles.detailHeader}>
                <span
                    className={styles.detailRarityBadge}
                    style={{ color: rarityColor, borderColor: `${rarityColor}50`, background: `${rarityColor}15` }}
                >
                    {RARITY_LABELS[weaponRarity]}
                </span>
                <h3 className={styles.detailName} style={{ color: rarityColor }}>{card.name}</h3>
                <span className={styles.detailNameJa}>{card.nameJa}</span>
            </div>

            {/* Stats */}
            <div className={styles.detailStats}>
                <div className={styles.detailStatRow}>
                    <span className={styles.detailStatIcon}>⚔️</span>
                    <span className={styles.detailStatLabel}>Terrain Damage</span>
                    <span className={`${styles.detailStatValue} ${styles.detailStatGreen}`}>+{damagePercent}%</span>
                </div>
                {card.specialEffect && (
                    <div className={styles.detailStatRow}>
                        <span className={styles.detailStatIcon}>✨</span>
                        <span className={styles.detailStatLabel}>Special Effect</span>
                        <span className={`${styles.detailStatValue} ${styles.detailStatCyan}`}>{card.specialEffect}</span>
                    </div>
                )}
                {equipped && (
                    <div className={styles.detailStatRow}>
                        <span className={styles.detailStatIcon}>🛡️</span>
                        <span className={styles.detailStatLabel}>Status</span>
                        <span className={`${styles.detailStatValue} ${styles.detailStatGreen}`}>Equipped</span>
                    </div>
                )}
            </div>

            {/* Description */}
            <p className={styles.detailLore}>{card.description}</p>

            {/* Power bars */}
            <div className={styles.detailBars}>
                <div className={styles.detailBar}>
                    <span className={styles.detailBarLabel}>POWER</span>
                    <div className={styles.detailBarTrack}>
                        <div
                            className={styles.detailBarFill}
                            style={{
                                width: `${Math.min(100, (card.damageMultiplier - 1) * 125)}%`,
                                background: '#e53935',
                            }}
                        />
                    </div>
                </div>
                <div className={styles.detailBar}>
                    <span className={styles.detailBarLabel}>SPEED</span>
                    <div className={styles.detailBarTrack}>
                        <div
                            className={styles.detailBarFill}
                            style={{
                                width: card.specialEffect === 'wide_beat' ? '80%' : '50%',
                                background: '#4caf50',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helpers
function deriveWeaponRarity(weapon: WeaponCard): string {
    if (weapon.damageMultiplier >= 1.7) return 'legendary';
    if (weapon.damageMultiplier >= 1.5) return 'epic';
    if (weapon.damageMultiplier >= 1.3) return 'rare';
    if (weapon.damageMultiplier >= 1.15) return 'uncommon';
    return 'common';
}

function rarityPercent(rarity: string): number {
    const map: Record<string, number> = { common: 20, uncommon: 40, rare: 60, epic: 80, legendary: 100 };
    return map[rarity] || 20;
}
