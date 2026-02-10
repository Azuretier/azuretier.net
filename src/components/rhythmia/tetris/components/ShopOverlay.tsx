'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { InventoryItem, CraftedCard, ItemType, WeaponCard } from '../types';
import { ITEMS, ITEM_MAP, WEAPON_CARDS, WEAPON_CARD_MAP } from '../constants';
import { ItemIcon } from './ItemIcon';
import styles from './ShopOverlay.module.css';

// ===== Shop Item Definitions =====
// Players spend score to buy materials or special items

export interface ShopItem {
    id: string;
    name: string;
    nameJa: string;
    description: string;
    price: number;
    icon: string; // itemId for ItemIcon
    category: 'material' | 'consumable';
    rarity: string;
    effect: string;
    tag: string;
}

const SHOP_ITEMS: ShopItem[] = [
    // Materials for purchase
    { id: 'buy_stone', name: 'Stone Fragment', nameJa: '石の欠片', description: 'Basic crafting material from terrain.', price: 100, icon: 'stone', category: 'material', rarity: 'common', effect: '+1 Stone', tag: 'Crafting' },
    { id: 'buy_iron', name: 'Iron Ore', nameJa: '鉄鉱石', description: 'Sturdy ore used in forging.', price: 250, icon: 'iron', category: 'material', rarity: 'common', effect: '+1 Iron', tag: 'Crafting' },
    { id: 'buy_crystal', name: 'Crystal Shard', nameJa: '水晶のかけら', description: 'Luminous shard with magical properties.', price: 500, icon: 'crystal', category: 'material', rarity: 'uncommon', effect: '+1 Crystal', tag: 'Crafting' },
    { id: 'buy_gold', name: 'Gold Nugget', nameJa: '金の塊', description: 'Precious metal for advanced weapons.', price: 1000, icon: 'gold', category: 'material', rarity: 'rare', effect: '+1 Gold', tag: 'Crafting' },
    { id: 'buy_obsidian', name: 'Obsidian Core', nameJa: '黒曜石の核', description: 'Volcanic glass with immense density.', price: 2200, icon: 'obsidian', category: 'material', rarity: 'epic', effect: '+1 Obsidian', tag: 'Crafting' },
    { id: 'buy_star', name: 'Star Fragment', nameJa: '星のかけら', description: 'Fragment of a fallen star. Extremely rare.', price: 5000, icon: 'star', category: 'material', rarity: 'legendary', effect: '+1 Star', tag: 'Legendary' },
    // Consumables
    { id: 'buy_heal', name: 'Health Potion', nameJa: '回復薬', description: 'Restores 20 Health over 15 seconds.', price: 50, icon: 'stone', category: 'consumable', rarity: 'common', effect: 'Consume', tag: 'Recovery' },
    { id: 'buy_combo_boost', name: 'Combo Elixir', nameJa: 'コンボ薬', description: 'Next 5 beats auto-count as PERFECT.', price: 1500, icon: 'crystal', category: 'consumable', rarity: 'rare', effect: 'Consume', tag: 'Combat Mobility' },
];

// Commonly built items (weapons as recommendations)
const RECOMMENDED_WEAPONS = WEAPON_CARDS.slice(0, 3);

// Rarity colors
const RARITY_COLORS: Record<string, string> = {
    common: '#8B8B8B',
    uncommon: '#4FC3F7',
    rare: '#FFD700',
    epic: '#9C27B0',
    legendary: '#FFFFFF',
};

// Shop tabs
type ShopTab = 'recommended' | 'all';

interface ShopOverlayProps {
    score: number;
    inventory: InventoryItem[];
    onPurchase: (shopItemId: string, cost: number) => void;
    onClose: () => void;
    closeKey: string;
}

export function ShopOverlay({
    score,
    inventory,
    onPurchase,
    onClose,
    closeKey,
}: ShopOverlayProps) {
    const [tab, setTab] = useState<ShopTab>('recommended');
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter items by tab and search
    const displayedItems = useMemo(() => {
        let items = SHOP_ITEMS;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter(i =>
                i.name.toLowerCase().includes(q) ||
                i.nameJa.includes(q) ||
                i.tag.toLowerCase().includes(q)
            );
        }
        return items;
    }, [searchQuery]);

    const canAfford = useCallback((price: number) => score >= price, [score]);

    const handlePurchase = useCallback(() => {
        if (!selectedItem || !canAfford(selectedItem.price)) return;
        onPurchase(selectedItem.id, selectedItem.price);
    }, [selectedItem, canAfford, onPurchase]);

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                {/* ===== Left Column: Main Shop ===== */}
                <div className={styles.mainPanel}>
                    {/* Tab bar */}
                    <div className={styles.tabBar}>
                        <button
                            className={`${styles.tab} ${tab === 'recommended' ? styles.tabActive : ''}`}
                            onClick={() => setTab('recommended')}
                        >
                            RECOMMENDED
                        </button>
                        <button
                            className={`${styles.tab} ${tab === 'all' ? styles.tabActive : ''}`}
                            onClick={() => setTab('all')}
                        >
                            ALL ITEMS
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>✕</button>
                    </div>

                    {/* Search bar */}
                    <div className={styles.searchBar}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Click Here to Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {tab === 'recommended' ? (
                        <>
                            {/* Recommended section */}
                            <div className={styles.sectionTitle}>SELECT AN ITEM TO BUILD</div>
                            <div className={styles.recommendedGrid}>
                                {RECOMMENDED_WEAPONS.map(card => (
                                    <div key={card.id} className={styles.recommendCard}>
                                        <h4 className={styles.recommendName}>{card.name}</h4>
                                        <div className={styles.recommendIcon}>
                                            <ItemIcon itemId={card.id} size={48} />
                                        </div>
                                        <div className={styles.recommendPrice}>
                                            <span className={styles.coinIcon}>●</span>
                                            {card.recipe.reduce((sum, r) => {
                                                const shopItem = SHOP_ITEMS.find(s => s.icon === r.itemId);
                                                return sum + (shopItem ? shopItem.price * r.count : 0);
                                            }, 0)}
                                        </div>
                                        <div className={styles.recommendTag}>{card.specialEffect || 'Basic'}</div>
                                        <div className={styles.recommendRating}>
                                            <span className={styles.infoIcon}>ⓘ</span>
                                            <span>Generally Good</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}

                    {/* All items / search results */}
                    {(tab === 'all' || searchQuery) && (
                        <>
                            <div className={styles.sectionTitle}>
                                {searchQuery ? 'SEARCH RESULTS' : 'ALL ITEMS'}
                            </div>
                        </>
                    )}

                    {/* Item grid (always shown) */}
                    <div className={styles.itemGrid}>
                        {displayedItems.map(item => {
                            const affordable = canAfford(item.price);
                            const rarityColor = RARITY_COLORS[item.rarity] || '#8B8B8B';
                            const isSelected = selectedItem?.id === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className={`${styles.shopCard} ${isSelected ? styles.shopCardSelected : ''} ${!affordable ? styles.shopCardDisabled : ''}`}
                                    onClick={() => setSelectedItem(item)}
                                    style={{ borderColor: isSelected ? `${rarityColor}60` : undefined }}
                                >
                                    <div className={styles.shopCardIcon}>
                                        <ItemIcon itemId={item.icon} size={28} />
                                    </div>
                                    <div className={styles.shopCardInfo}>
                                        <span className={styles.shopCardName} style={{ color: rarityColor }}>{item.name}</span>
                                        <span className={styles.shopCardPrice}>
                                            <span className={styles.coinIcon}>●</span>
                                            {item.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Commonly built */}
                    {tab === 'recommended' && (
                        <>
                            <div className={styles.sectionTitle}>COMMONLY BUILT</div>
                            <div className={styles.commonlyBuilt}>
                                {SHOP_ITEMS.filter(i => i.category === 'material').map(item => (
                                    <div
                                        key={item.id}
                                        className={styles.commonItem}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <ItemIcon itemId={item.icon} size={24} />
                                        <span className={styles.commonItemPrice}>
                                            <span className={styles.coinIcon}>●</span>
                                            {item.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Bottom action bar */}
                    <div className={styles.actionBar}>
                        <button className={styles.actionBtn} disabled>SELL</button>
                        <button className={styles.actionBtn} disabled>UNDO</button>
                        <span className={styles.goldDisplay}>
                            <span className={styles.coinIcon}>●</span>
                            {score.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* ===== Right Column: Detail Pane ===== */}
                <div className={styles.detailPane}>
                    {selectedItem ? (
                        <>
                            <div className={styles.detailHeader}>BUILDS INTO</div>
                            <div className={styles.buildsIntoSlots}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className={styles.buildsIntoSlot} />
                                ))}
                            </div>

                            {/* Selected item preview */}
                            <div className={styles.detailPreview}>
                                <div className={styles.detailPreviewIcon}>
                                    <ItemIcon itemId={selectedItem.icon} size={56} />
                                    {canAfford(selectedItem.price) && (
                                        <div className={styles.detailCheckmark}>✓</div>
                                    )}
                                </div>
                                <div className={styles.detailPreviewCount}>
                                    <span className={styles.coinIcon}>●</span>
                                    {selectedItem.price}
                                </div>
                            </div>

                            {/* Purchase button */}
                            <button
                                className={`${styles.purchaseBtn} ${canAfford(selectedItem.price) ? styles.purchaseBtnActive : ''}`}
                                disabled={!canAfford(selectedItem.price)}
                                onClick={handlePurchase}
                            >
                                PURCHASE ITEM
                            </button>

                            {/* Item info */}
                            <div className={styles.detailInfo}>
                                <div className={styles.detailInfoIcon}>
                                    <ItemIcon itemId={selectedItem.icon} size={28} />
                                </div>
                                <div className={styles.detailInfoText}>
                                    <h4 className={styles.detailInfoName} style={{ color: RARITY_COLORS[selectedItem.rarity] }}>
                                        {selectedItem.name}
                                    </h4>
                                    <span className={styles.detailInfoPrice}>
                                        <span className={styles.coinIcon}>●</span>
                                        {selectedItem.price}
                                    </span>
                                </div>
                            </div>

                            {/* Effect */}
                            <div className={styles.detailEffect}>
                                <span className={styles.detailEffectIcon}>◉</span>
                                <span className={styles.detailEffectLabel}>{selectedItem.effect}</span>
                            </div>
                            <p className={styles.detailDesc}>{selectedItem.description}</p>
                        </>
                    ) : (
                        <div className={styles.detailEmptyState}>
                            <span>Select an item to view details</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom hints */}
            <div className={styles.bottomBar}>
                <span className={styles.bottomHint}>
                    <span className={styles.keyBadge}>{closeKey.toUpperCase()}</span> Close Shop
                </span>
            </div>
        </div>
    );
}
