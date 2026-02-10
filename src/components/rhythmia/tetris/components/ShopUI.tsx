import React, { useState } from 'react';
import type { PurchasedShopItem, ShopCategory } from '../types';
import { SHOP_ITEM_MAP, SHOP_BASIC_ITEMS, SHOP_LEGENDARY_ITEMS } from '../constants';
import { ItemIcon } from './ItemIcon';
import styles from '../VanillaGame.module.css';

interface ShopUIProps {
    gold: number;
    purchasedShopItems: PurchasedShopItem[];
    ownedComponents: Record<string, number>;
    onBuy: (itemId: string) => boolean;
    onSell: (itemId: string) => boolean;
    canBuy: (itemId: string) => boolean;
    getEffectiveCost: (itemId: string) => number;
}

/** Map stat keys to existing item icons for Dungeons-style icon+text rows */
const STAT_ICON_MAP: Record<string, string> = {
    damage: 'long_sword',
    beatWindow: 'amplifying_tome',
    itemDrop: 'ruby_crystal',
    das: 'boots_of_speed',
};

const CATEGORY_BADGE_MAP: Record<string, { label: string; style: string }> = {
    damage: { label: 'DAMAGE', style: 'shopDetailBadgeDmg' },
    utility: { label: 'UTILITY', style: 'shopDetailBadgeUtil' },
    defense: { label: 'DEFENSE', style: 'shopDetailBadgeDef' },
};

const CATEGORY_TABS: { key: 'all' | ShopCategory; label: string; labelJa: string }[] = [
    { key: 'all', label: 'ALL', labelJa: '全て' },
    { key: 'damage', label: 'DAMAGE', labelJa: '攻撃' },
    { key: 'utility', label: 'UTILITY', labelJa: 'ユーティリティ' },
    { key: 'defense', label: 'DEFENSE', labelJa: '防御' },
];

/**
 * LoL-style item shop with category filters, build paths, and gold display
 */
export function ShopUI({
    gold,
    purchasedShopItems,
    ownedComponents,
    onBuy,
    onSell,
    canBuy,
    getEffectiveCost,
}: ShopUIProps) {
    const [activeCategory, setActiveCategory] = useState<'all' | ShopCategory>('all');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const selectedDef = selectedItem ? SHOP_ITEM_MAP[selectedItem] : null;

    return (
        <div className={styles.shopContainer}>
            {/* Gold display */}
            <div className={styles.shopGoldBar}>
                <span className={styles.shopGoldIcon}>
                    <ItemIcon itemId="gold" size={18} />
                </span>
                <span className={styles.shopGoldAmount}>{gold}</span>
            </div>

            {/* Category tabs */}
            <div className={styles.shopCategoryTabs}>
                {CATEGORY_TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.shopCategoryTab} ${activeCategory === tab.key ? styles.shopCategoryTabActive : ''}`}
                        onClick={() => setActiveCategory(tab.key)}
                    >
                        <span className={styles.shopCategoryTabLabel}>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className={styles.shopBody}>
                {/* Item grid */}
                <div className={styles.shopItemGrid}>
                    {/* Legendary items section */}
                    {(activeCategory === 'all' || SHOP_LEGENDARY_ITEMS.some(i => i.category === activeCategory)) && (
                        <>
                            <div className={styles.shopSectionHeader}>LEGENDARY</div>
                            <div className={styles.shopItemRow}>
                                {SHOP_LEGENDARY_ITEMS
                                    .filter(item => activeCategory === 'all' || item.category === activeCategory)
                                    .map(item => {
                                        const owned = purchasedShopItems.some(p => p.itemId === item.id);
                                        const affordable = canBuy(item.id);
                                        const cost = getEffectiveCost(item.id);
                                        return (
                                            <button
                                                key={item.id}
                                                className={`${styles.shopItemCard} ${styles.shopItemLegendary} ${owned ? styles.shopItemOwned : ''} ${selectedItem === item.id ? styles.shopItemSelected : ''}`}
                                                onClick={() => setSelectedItem(item.id)}
                                                onDoubleClick={() => { if (!owned) onBuy(item.id); }}
                                            >
                                                <div className={styles.shopItemIconWrap} style={{ background: `radial-gradient(circle, ${item.glowColor}25, transparent)` }}>
                                                    <ItemIcon itemId={item.icon} size={28} />
                                                </div>
                                                <div className={styles.shopItemName}>{item.nameJa}</div>
                                                <div className={styles.shopItemCost} style={{ color: affordable && !owned ? '#FFD700' : 'rgba(255,255,255,0.3)' }}>
                                                    {owned ? 'OWNED' : `${cost}g`}
                                                </div>
                                                {owned && <div className={styles.shopItemOwnedBadge}>EQUIPPED</div>}
                                            </button>
                                        );
                                    })}
                            </div>
                        </>
                    )}

                    {/* Basic items section */}
                    {(activeCategory === 'all' || SHOP_BASIC_ITEMS.some(i => i.category === activeCategory)) && (
                        <>
                            <div className={styles.shopSectionHeader}>COMPONENTS</div>
                            <div className={styles.shopItemRow}>
                                {SHOP_BASIC_ITEMS
                                    .filter(item => activeCategory === 'all' || item.category === activeCategory)
                                    .map(item => {
                                        const owned = ownedComponents[item.id] || 0;
                                        const affordable = canBuy(item.id);
                                        return (
                                            <button
                                                key={item.id}
                                                className={`${styles.shopItemCard} ${styles.shopItemBasic} ${selectedItem === item.id ? styles.shopItemSelected : ''}`}
                                                onClick={() => setSelectedItem(item.id)}
                                                onDoubleClick={() => onBuy(item.id)}
                                            >
                                                <div className={styles.shopItemIconWrap} style={{ background: `radial-gradient(circle, ${item.glowColor}20, transparent)` }}>
                                                    <ItemIcon itemId={item.icon} size={22} />
                                                </div>
                                                <div className={styles.shopItemName}>{item.nameJa}</div>
                                                <div className={styles.shopItemCost} style={{ color: affordable ? '#FFD700' : 'rgba(255,255,255,0.3)' }}>
                                                    {item.cost}g
                                                </div>
                                                {owned > 0 && (
                                                    <div className={styles.shopItemOwnedCount}>x{owned}</div>
                                                )}
                                            </button>
                                        );
                                    })}
                            </div>
                        </>
                    )}
                </div>

                {/* Item detail panel — Hybrid Wynncraft container + Dungeons content */}
                {selectedDef && (
                    <div className={styles.shopDetailPanel}>
                        {/* Header: Icon + Name + Power Level */}
                        <div className={styles.shopDetailHeader}>
                            <div className={styles.shopDetailIcon} style={{ background: `radial-gradient(circle, ${selectedDef.glowColor}20, rgba(91,33,182,0.1))` }}>
                                <ItemIcon itemId={selectedDef.icon} size={32} />
                            </div>
                            <div className={styles.shopDetailTitle}>
                                <div className={styles.shopDetailName} style={{ color: selectedDef.color }}>
                                    {selectedDef.name}
                                </div>
                                <div className={styles.shopDetailNameJa}>{selectedDef.nameJa}</div>
                            </div>
                            <div className={styles.shopDetailPower}>
                                <span>PWR</span>
                                <span className={styles.shopDetailPowerNum}>{Math.floor(selectedDef.totalCost / 100)}</span>
                            </div>
                        </div>

                        {/* Tier + Category badges */}
                        <div className={styles.shopDetailBadges}>
                            <span className={`${styles.shopDetailBadge} ${selectedDef.tier === 'legendary' ? styles.shopDetailBadgeLegendary : styles.shopDetailBadgeBasic}`}>
                                {selectedDef.tier === 'legendary' ? 'LEGENDARY' : 'BASIC'}
                            </span>
                            <span className={`${styles.shopDetailBadge} ${styles[CATEGORY_BADGE_MAP[selectedDef.category]?.style || 'shopDetailBadgeDmg']}`}>
                                {CATEGORY_BADGE_MAP[selectedDef.category]?.label || selectedDef.category.toUpperCase()}
                            </span>
                        </div>

                        <div className={styles.shopDetailDivider} />

                        {/* Gold cost */}
                        <div className={styles.shopDetailCostLine}>
                            <ItemIcon itemId="gold" size={14} />
                            <span className={styles.shopDetailCost}>{getEffectiveCost(selectedDef.id)}g</span>
                            {selectedDef.tier === 'legendary' && (
                                <span className={styles.shopDetailTotalCost}>({selectedDef.totalCost}g total)</span>
                            )}
                        </div>

                        {/* Stats — Dungeons-style icon+text rows */}
                        {selectedDef.stats.length > 0 && (
                            <>
                                <div className={styles.shopDetailDivider} />
                                <div className={styles.shopDetailStats}>
                                    {selectedDef.stats.map((stat, i) => (
                                        <div key={i} className={styles.shopDetailStat}>
                                            <div className={styles.shopDetailStatIcon}>
                                                <ItemIcon itemId={STAT_ICON_MAP[stat.key] || selectedDef.icon} size={14} />
                                            </div>
                                            <span>{stat.labelJa}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Passive — unique ability */}
                        {selectedDef.passive && (
                            <>
                                <div className={styles.shopDetailDivider} />
                                <div className={styles.shopDetailPassive}>
                                    <div className={styles.shopDetailPassiveLabel}>
                                        UNIQUE PASSIVE: <span className={styles.shopDetailPassiveName}>{selectedDef.passive.nameJa}</span>
                                    </div>
                                    <div className={styles.shopDetailPassiveDesc}>{selectedDef.passive.descriptionJa}</div>
                                </div>
                            </>
                        )}

                        {/* Build path for legendary items */}
                        {selectedDef.tier === 'legendary' && selectedDef.buildsFrom.length > 0 && (
                            <>
                                <div className={styles.shopDetailDivider} />
                                <div className={styles.shopBuildPath}>
                                    <div className={styles.shopBuildPathLabel}>BUILD PATH</div>
                                    <div className={styles.shopBuildPathItems}>
                                        {selectedDef.buildsFrom.map((compId, i) => {
                                            const comp = SHOP_ITEM_MAP[compId];
                                            if (!comp) return null;
                                            const owned = (ownedComponents[compId] || 0) > i
                                                ? true
                                                : selectedDef.buildsFrom.slice(0, i).filter(c => c === compId).length < (ownedComponents[compId] || 0);
                                            return (
                                                <div key={i} className={`${styles.shopBuildPathItem} ${owned ? styles.shopBuildPathItemOwned : ''}`}>
                                                    <ItemIcon itemId={comp.icon} size={18} />
                                                    <span className={styles.shopBuildPathItemCost}>{comp.cost}g</span>
                                                </div>
                                            );
                                        })}
                                        <div className={styles.shopBuildPathPlus}>+</div>
                                        <div className={styles.shopBuildPathRecipe}>
                                            <span className={styles.shopBuildPathRecipeCost}>{selectedDef.cost}g</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Builds into (for basic items) */}
                        {selectedDef.tier === 'basic' && selectedDef.buildsInto.length > 0 && (
                            <>
                                <div className={styles.shopDetailDivider} />
                                <div className={styles.shopBuildPath}>
                                    <div className={styles.shopBuildPathLabel}>BUILDS INTO</div>
                                    <div className={styles.shopBuildPathItems}>
                                        {selectedDef.buildsInto.map(targetId => {
                                            const target = SHOP_ITEM_MAP[targetId];
                                            if (!target) return null;
                                            return (
                                                <button
                                                    key={targetId}
                                                    className={styles.shopBuildPathTarget}
                                                    onClick={() => setSelectedItem(targetId)}
                                                >
                                                    <ItemIcon itemId={target.icon} size={20} />
                                                    <span className={styles.shopBuildPathTargetName}>{target.nameJa}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Lore / flavor text */}
                        {selectedDef.lore && (
                            <>
                                <div className={styles.shopDetailDivider} />
                                <div className={styles.shopDetailLore}>
                                    &ldquo;{selectedDef.loreJa || selectedDef.lore}&rdquo;
                                </div>
                            </>
                        )}

                        {/* Buy / Sell buttons */}
                        <div className={styles.shopDetailActions}>
                            {(() => {
                                const isLegendary = selectedDef.tier === 'legendary';
                                const isOwned = isLegendary
                                    ? purchasedShopItems.some(p => p.itemId === selectedDef.id)
                                    : false;
                                const basicOwned = ownedComponents[selectedDef.id] || 0;
                                const affordable = canBuy(selectedDef.id);

                                return (
                                    <>
                                        {!isOwned && (
                                            <button
                                                className={`${styles.shopBuyBtn} ${affordable ? styles.shopBuyBtnActive : ''}`}
                                                disabled={!affordable}
                                                onClick={() => onBuy(selectedDef.id)}
                                            >
                                                BUY — {getEffectiveCost(selectedDef.id)}g
                                            </button>
                                        )}
                                        {(isOwned || basicOwned > 0) && (
                                            <button
                                                className={styles.shopSellBtn}
                                                onClick={() => onSell(selectedDef.id)}
                                            >
                                                SELL — +{Math.floor((isLegendary ? selectedDef.totalCost : selectedDef.cost) * 0.5)}g
                                            </button>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
