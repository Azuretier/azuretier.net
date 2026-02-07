import React from 'react';
import type { InventoryItem, CraftedCard } from '../types';
import { ITEM_MAP, WEAPON_CARD_MAP } from '../constants';
import styles from '../VanillaGame.module.css';

interface ItemSlotsProps {
    inventory: InventoryItem[];
    craftedCards: CraftedCard[];
    damageMultiplier: number;
    onCraftOpen: () => void;
}

/**
 * Modern item slot inventory display
 * Shows collected items and crafted weapon cards in a compact, stylish layout
 */
export function ItemSlots({ inventory, craftedCards, damageMultiplier, onCraftOpen }: ItemSlotsProps) {
    return (
        <div className={styles.itemSlotsPanel}>
            {/* Inventory header */}
            <div className={styles.itemSlotsHeader}>
                <span className={styles.itemSlotsTitle}>ITEMS</span>
                {damageMultiplier > 1 && (
                    <span className={styles.damageMultBadge}>
                        x{damageMultiplier.toFixed(1)}
                    </span>
                )}
            </div>

            {/* Item grid */}
            <div className={styles.itemSlotsGrid}>
                {inventory.length === 0 && (
                    <div className={styles.itemSlotEmpty}>
                        <span className={styles.itemSlotEmptyText}>DIG!</span>
                    </div>
                )}
                {inventory.map(inv => {
                    const item = ITEM_MAP[inv.itemId];
                    if (!item) return null;
                    return (
                        <div
                            key={inv.itemId}
                            className={`${styles.itemSlot} ${styles[`rarity_${item.rarity}`]}`}
                            title={`${item.name} (${item.nameJa})`}
                        >
                            <div
                                className={styles.itemSlotInner}
                                style={{
                                    borderColor: `${item.color}60`,
                                    background: `radial-gradient(circle at 30% 30%, ${item.glowColor}15, transparent)`,
                                }}
                            >
                                <span className={styles.itemSlotIcon}>{item.icon}</span>
                                <span className={styles.itemSlotCount}>{inv.count}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Crafted weapon cards */}
            {craftedCards.length > 0 && (
                <div className={styles.weaponCardSlots}>
                    {craftedCards.map((cc, idx) => {
                        const card = WEAPON_CARD_MAP[cc.cardId];
                        if (!card) return null;
                        return (
                            <div
                                key={idx}
                                className={styles.weaponCardSlot}
                                title={`${card.name} - ${card.description}`}
                                style={{
                                    borderColor: `${card.color}80`,
                                    background: `linear-gradient(135deg, ${card.color}20, transparent)`,
                                }}
                            >
                                <span className={styles.weaponCardIcon}>{card.icon}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Craft button */}
            <button className={styles.craftButton} onClick={onCraftOpen}>
                CRAFT
            </button>
        </div>
    );
}
