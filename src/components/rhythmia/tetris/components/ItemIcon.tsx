import React from 'react';

interface ItemIconProps {
    itemId: string;
    size?: number;
    className?: string;
}

/**
 * SVG-based item icons replacing emoji.
 * Each item has a distinct geometric/material-inspired design.
 */
export function ItemIcon({ itemId, size = 20, className }: ItemIconProps) {
    const half = size / 2;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            className={className}
            style={{ display: 'block' }}
        >
            {renderIcon(itemId, size, half)}
        </svg>
    );
}

function renderIcon(itemId: string, size: number, half: number) {
    switch (itemId) {
        // Stone Fragment — faceted rock shard
        case 'stone':
            return (
                <g>
                    <defs>
                        <linearGradient id="stone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#B0B0B0" />
                            <stop offset="100%" stopColor="#6B6B6B" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${half * 0.6},${size * 0.1} ${size * 0.85},${size * 0.3} ${size * 0.9},${size * 0.7} ${half},${size * 0.92} ${size * 0.12},${size * 0.65} ${size * 0.2},${size * 0.25}`}
                        fill="url(#stone-grad)"
                        stroke="#9E9E9E"
                        strokeWidth="0.5"
                    />
                    <line
                        x1={half * 0.6} y1={size * 0.1}
                        x2={half} y2={size * 0.5}
                        stroke="#C0C0C0"
                        strokeWidth="0.4"
                        opacity="0.6"
                    />
                    <line
                        x1={size * 0.85} y1={size * 0.3}
                        x2={half} y2={size * 0.5}
                        stroke="#808080"
                        strokeWidth="0.4"
                        opacity="0.5"
                    />
                    <line
                        x1={half} y1={size * 0.5}
                        x2={half} y2={size * 0.92}
                        stroke="#808080"
                        strokeWidth="0.3"
                        opacity="0.4"
                    />
                </g>
            );

        // Iron Ore — metallic angular chunk with rust tint
        case 'iron':
            return (
                <g>
                    <defs>
                        <linearGradient id="iron-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4956B" />
                            <stop offset="50%" stopColor="#B87333" />
                            <stop offset="100%" stopColor="#8B5A2B" />
                        </linearGradient>
                    </defs>
                    <rect
                        x={size * 0.15} y={size * 0.2}
                        width={size * 0.7} height={size * 0.6}
                        rx={size * 0.06}
                        fill="url(#iron-grad)"
                        stroke="#A0673A"
                        strokeWidth="0.5"
                    />
                    <rect
                        x={size * 0.25} y={size * 0.3}
                        width={size * 0.2} height={size * 0.15}
                        rx={size * 0.02}
                        fill="#C8874F"
                        opacity="0.7"
                    />
                    <rect
                        x={size * 0.55} y={size * 0.55}
                        width={size * 0.15} height={size * 0.12}
                        rx={size * 0.02}
                        fill="#9A6030"
                        opacity="0.5"
                    />
                    <line
                        x1={size * 0.15} y1={size * 0.5}
                        x2={size * 0.85} y2={size * 0.5}
                        stroke="#6B3E1F"
                        strokeWidth="0.3"
                        opacity="0.3"
                    />
                </g>
            );

        // Crystal Shard — faceted gemstone with light refraction
        case 'crystal':
            return (
                <g>
                    <defs>
                        <linearGradient id="crystal-grad" x1="20%" y1="0%" x2="80%" y2="100%">
                            <stop offset="0%" stopColor="#B3E5FC" />
                            <stop offset="40%" stopColor="#4FC3F7" />
                            <stop offset="100%" stopColor="#0288D1" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${half},${size * 0.05} ${size * 0.78},${size * 0.35} ${size * 0.7},${size * 0.75} ${half},${size * 0.95} ${size * 0.3},${size * 0.75} ${size * 0.22},${size * 0.35}`}
                        fill="url(#crystal-grad)"
                        stroke="#81D4FA"
                        strokeWidth="0.5"
                    />
                    <polygon
                        points={`${half},${size * 0.05} ${size * 0.78},${size * 0.35} ${half},${size * 0.45} ${size * 0.22},${size * 0.35}`}
                        fill="#B3E5FC"
                        opacity="0.4"
                    />
                    <line
                        x1={half} y1={size * 0.05}
                        x2={half} y2={size * 0.95}
                        stroke="#E1F5FE"
                        strokeWidth="0.3"
                        opacity="0.5"
                    />
                    <line
                        x1={size * 0.22} y1={size * 0.35}
                        x2={size * 0.78} y2={size * 0.35}
                        stroke="#E1F5FE"
                        strokeWidth="0.3"
                        opacity="0.4"
                    />
                </g>
            );

        // Gold Nugget — rounded gold with metallic shine
        case 'gold':
            return (
                <g>
                    <defs>
                        <radialGradient id="gold-grad" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#FFF176" />
                            <stop offset="40%" stopColor="#FFD700" />
                            <stop offset="100%" stopColor="#C49000" />
                        </radialGradient>
                    </defs>
                    <ellipse
                        cx={half} cy={half * 1.05}
                        rx={half * 0.72} ry={half * 0.65}
                        fill="url(#gold-grad)"
                        stroke="#DAA520"
                        strokeWidth="0.5"
                    />
                    <ellipse
                        cx={half * 0.78} cy={half * 0.8}
                        rx={half * 0.22} ry={half * 0.14}
                        fill="#FFF9C4"
                        opacity="0.6"
                        transform={`rotate(-20 ${half * 0.78} ${half * 0.8})`}
                    />
                    <circle
                        cx={half * 1.25} cy={half * 1.2}
                        r={half * 0.12}
                        fill="#B8860B"
                        opacity="0.3"
                    />
                </g>
            );

        // Obsidian Core — dark sphere with inner purple glow
        case 'obsidian':
            return (
                <g>
                    <defs>
                        <radialGradient id="obs-grad" cx="40%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#CE93D8" />
                            <stop offset="40%" stopColor="#9C27B0" />
                            <stop offset="100%" stopColor="#2A0030" />
                        </radialGradient>
                        <radialGradient id="obs-inner" cx="50%" cy="50%" r="40%">
                            <stop offset="0%" stopColor="#E040FB" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                    <circle
                        cx={half} cy={half}
                        r={half * 0.75}
                        fill="url(#obs-grad)"
                        stroke="#7B1FA2"
                        strokeWidth="0.5"
                    />
                    <circle
                        cx={half} cy={half}
                        r={half * 0.35}
                        fill="url(#obs-inner)"
                    />
                    <ellipse
                        cx={half * 0.75} cy={half * 0.72}
                        rx={half * 0.18} ry={half * 0.08}
                        fill="#F3E5F5"
                        opacity="0.35"
                        transform={`rotate(-30 ${half * 0.75} ${half * 0.72})`}
                    />
                </g>
            );

        // Star Fragment — multi-pointed star with radiant glow
        case 'star':
            return (
                <g>
                    <defs>
                        <radialGradient id="star-grad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="50%" stopColor="#E0E0E0" />
                            <stop offset="100%" stopColor="#9E9E9E" />
                        </radialGradient>
                        <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                    <circle
                        cx={half} cy={half}
                        r={half * 0.85}
                        fill="url(#star-glow)"
                    />
                    {(() => {
                        const points: string[] = [];
                        for (let i = 0; i < 8; i++) {
                            const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
                            const r = i % 2 === 0 ? half * 0.72 : half * 0.32;
                            points.push(`${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`);
                        }
                        return (
                            <polygon
                                points={points.join(' ')}
                                fill="url(#star-grad)"
                                stroke="#FFFFFF"
                                strokeWidth="0.4"
                            />
                        );
                    })()}
                    <circle
                        cx={half} cy={half}
                        r={half * 0.15}
                        fill="#FFFFFF"
                        opacity="0.8"
                    />
                </g>
            );

        // ===== Shop Items =====

        // Long Sword — crimson blade
        case 'long_sword':
            return (
                <g>
                    <defs>
                        <linearGradient id="lsword-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#E8E8E8" />
                            <stop offset="100%" stopColor="#A0A0A0" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${half},${size * 0.05} ${half + size * 0.07},${size * 0.55} ${half},${size * 0.62} ${half - size * 0.07},${size * 0.55}`}
                        fill="url(#lsword-grad)"
                        stroke="#C0392B"
                        strokeWidth="0.6"
                    />
                    <rect x={half - size * 0.12} y={size * 0.6} width={size * 0.24} height={size * 0.05} rx={1} fill="#C0392B" />
                    <rect x={half - size * 0.025} y={size * 0.64} width={size * 0.05} height={size * 0.28} rx={1} fill="#8B4513" />
                    <circle cx={half} cy={size * 0.92} r={size * 0.04} fill="#C0392B" />
                </g>
            );

        // Amplifying Tome — purple magic book
        case 'amplifying_tome':
            return (
                <g>
                    <defs>
                        <linearGradient id="tome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#BB6BD9" />
                            <stop offset="100%" stopColor="#6C3483" />
                        </linearGradient>
                    </defs>
                    <rect x={size * 0.2} y={size * 0.12} width={size * 0.6} height={size * 0.76} rx={size * 0.04} fill="url(#tome-grad)" stroke="#8E44AD" strokeWidth="0.5" />
                    <rect x={size * 0.15} y={size * 0.15} width={size * 0.08} height={size * 0.7} rx={size * 0.02} fill="#6C3483" />
                    <line x1={size * 0.32} y1={size * 0.35} x2={size * 0.68} y2={size * 0.35} stroke="#D2B4DE" strokeWidth="0.5" opacity="0.6" />
                    <line x1={size * 0.32} y1={size * 0.45} x2={size * 0.62} y2={size * 0.45} stroke="#D2B4DE" strokeWidth="0.5" opacity="0.4" />
                    <line x1={size * 0.32} y1={size * 0.55} x2={size * 0.65} y2={size * 0.55} stroke="#D2B4DE" strokeWidth="0.5" opacity="0.3" />
                    <circle cx={half} cy={size * 0.72} r={size * 0.06} fill="#E8DAEF" opacity="0.5" />
                </g>
            );

        // Ruby Crystal — red faceted gem
        case 'ruby_crystal':
            return (
                <g>
                    <defs>
                        <linearGradient id="ruby-grad" x1="20%" y1="0%" x2="80%" y2="100%">
                            <stop offset="0%" stopColor="#FF6B6B" />
                            <stop offset="50%" stopColor="#E74C3C" />
                            <stop offset="100%" stopColor="#922B21" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${half},${size * 0.1} ${size * 0.8},${size * 0.4} ${size * 0.7},${size * 0.8} ${size * 0.3},${size * 0.8} ${size * 0.2},${size * 0.4}`}
                        fill="url(#ruby-grad)"
                        stroke="#C0392B"
                        strokeWidth="0.5"
                    />
                    <polygon
                        points={`${half},${size * 0.1} ${size * 0.8},${size * 0.4} ${half},${size * 0.5} ${size * 0.2},${size * 0.4}`}
                        fill="#FF8A80"
                        opacity="0.35"
                    />
                    <line x1={half} y1={size * 0.1} x2={half} y2={size * 0.8} stroke="#FFCDD2" strokeWidth="0.3" opacity="0.4" />
                </g>
            );

        // Boots of Speed — golden boot
        case 'boots_of_speed':
            return (
                <g>
                    <defs>
                        <linearGradient id="boots-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F9E79F" />
                            <stop offset="100%" stopColor="#D4AC0D" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M${size * 0.35},${size * 0.1} L${size * 0.45},${size * 0.1} L${size * 0.48},${size * 0.6} L${size * 0.8},${size * 0.75} L${size * 0.8},${size * 0.9} L${size * 0.2},${size * 0.9} L${size * 0.2},${size * 0.78} L${size * 0.32},${size * 0.6} Z`}
                        fill="url(#boots-grad)"
                        stroke="#B7950B"
                        strokeWidth="0.5"
                    />
                    <line x1={size * 0.37} y1={size * 0.25} x2={size * 0.43} y2={size * 0.25} stroke="#F1C40F" strokeWidth="0.8" opacity="0.6" />
                    <line x1={size * 0.36} y1={size * 0.35} x2={size * 0.44} y2={size * 0.35} stroke="#F1C40F" strokeWidth="0.8" opacity="0.5" />
                </g>
            );

        // Infinity Edge — iconic red-edged sword
        case 'infinity_edge':
            return (
                <g>
                    <defs>
                        <linearGradient id="ie-blade" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="50%" stopColor="#E0E0E0" />
                            <stop offset="100%" stopColor="#B0B0B0" />
                        </linearGradient>
                        <linearGradient id="ie-edge" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="#FF4444" />
                            <stop offset="100%" stopColor="#CC0000" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${half},${size * 0.02} ${half + size * 0.12},${size * 0.5} ${half + size * 0.06},${size * 0.58} ${half},${size * 0.62} ${half - size * 0.06},${size * 0.58} ${half - size * 0.12},${size * 0.5}`}
                        fill="url(#ie-blade)"
                        stroke="url(#ie-edge)"
                        strokeWidth="0.8"
                    />
                    <rect x={half - size * 0.16} y={size * 0.58} width={size * 0.32} height={size * 0.06} rx={2} fill="#C0392B" />
                    <rect x={half - size * 0.03} y={size * 0.63} width={size * 0.06} height={size * 0.22} rx={1} fill="#922B21" />
                    <polygon
                        points={`${half - size * 0.06},${size * 0.85} ${half},${size * 0.98} ${half + size * 0.06},${size * 0.85}`}
                        fill="#C0392B"
                    />
                    <line x1={half} y1={size * 0.08} x2={half} y2={size * 0.55} stroke="#FF6B6B" strokeWidth="0.5" opacity="0.4" />
                </g>
            );

        // Rabadon's Deathcap — purple wizard hat
        case 'rabadons_deathcap':
            return (
                <g>
                    <defs>
                        <linearGradient id="rab-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#D2B4DE" />
                            <stop offset="50%" stopColor="#8E44AD" />
                            <stop offset="100%" stopColor="#4A235A" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M${half},${size * 0.02} Q${size * 0.65},${size * 0.3} ${size * 0.85},${size * 0.72} L${size * 0.15},${size * 0.72} Q${size * 0.35},${size * 0.3} ${half},${size * 0.02}`}
                        fill="url(#rab-grad)"
                        stroke="#6C3483"
                        strokeWidth="0.5"
                    />
                    <ellipse cx={half} cy={size * 0.78} rx={size * 0.42} ry={size * 0.1} fill="#4A235A" stroke="#6C3483" strokeWidth="0.5" />
                    <circle cx={half * 0.85} cy={size * 0.4} r={size * 0.04} fill="#F9E79F" opacity="0.8" />
                    <circle cx={half * 1.3} cy={size * 0.55} r={size * 0.03} fill="#F9E79F" opacity="0.5" />
                    <circle cx={half} cy={size * 0.25} r={size * 0.025} fill="#F9E79F" opacity="0.6" />
                </g>
            );

        // Hextech Rocketbelt — blue tech device
        case 'hextech_rocketbelt':
            return (
                <g>
                    <defs>
                        <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5DADE2" />
                            <stop offset="100%" stopColor="#1A5276" />
                        </linearGradient>
                        <radialGradient id="hex-core" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#AED6F1" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3498DB" stopOpacity="0.2" />
                        </radialGradient>
                    </defs>
                    <rect x={size * 0.15} y={size * 0.25} width={size * 0.7} height={size * 0.5} rx={size * 0.08} fill="url(#hex-grad)" stroke="#2E86C1" strokeWidth="0.5" />
                    <circle cx={half} cy={half} r={size * 0.14} fill="url(#hex-core)" stroke="#AED6F1" strokeWidth="0.4" />
                    <rect x={size * 0.3} y={size * 0.75} width={size * 0.1} height={size * 0.15} rx={2} fill="#E74C3C" />
                    <rect x={size * 0.45} y={size * 0.75} width={size * 0.1} height={size * 0.18} rx={2} fill="#E74C3C" />
                    <rect x={size * 0.6} y={size * 0.75} width={size * 0.1} height={size * 0.15} rx={2} fill="#E74C3C" />
                    <polygon points={`${size * 0.35},${size * 0.18} ${half},${size * 0.08} ${size * 0.65},${size * 0.18}`} fill="#2E86C1" opacity="0.5" />
                </g>
            );

        // Phantom Dancer — ethereal green twin blades
        case 'phantom_dancer':
            return (
                <g>
                    <defs>
                        <linearGradient id="pd-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#82E0AA" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#1E8449" stopOpacity="0.7" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${size * 0.3},${size * 0.05} ${size * 0.4},${size * 0.05} ${size * 0.55},${size * 0.65} ${size * 0.35},${size * 0.65}`}
                        fill="url(#pd-grad)"
                        stroke="#2ECC71"
                        strokeWidth="0.4"
                        opacity="0.8"
                    />
                    <polygon
                        points={`${size * 0.6},${size * 0.05} ${size * 0.7},${size * 0.05} ${size * 0.65},${size * 0.65} ${size * 0.45},${size * 0.65}`}
                        fill="url(#pd-grad)"
                        stroke="#2ECC71"
                        strokeWidth="0.4"
                        opacity="0.6"
                    />
                    <ellipse cx={half} cy={size * 0.72} rx={size * 0.18} ry={size * 0.06} fill="#1E8449" />
                    <rect x={half - size * 0.025} y={size * 0.72} width={size * 0.05} height={size * 0.22} rx={1} fill="#145A32" />
                    <circle cx={half} cy={half * 0.6} r={size * 0.03} fill="#ABEBC6" opacity="0.7" />
                </g>
            );

        // Warmog's Armor — green heavy plate
        case 'warmogs_armor':
            return (
                <g>
                    <defs>
                        <linearGradient id="wm-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#58D68D" />
                            <stop offset="50%" stopColor="#27AE60" />
                            <stop offset="100%" stopColor="#1E8449" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M${half},${size * 0.08} L${size * 0.82},${size * 0.25} L${size * 0.78},${size * 0.75} L${half},${size * 0.92} L${size * 0.22},${size * 0.75} L${size * 0.18},${size * 0.25} Z`}
                        fill="url(#wm-grad)"
                        stroke="#196F3D"
                        strokeWidth="0.6"
                    />
                    <circle cx={half} cy={half} r={size * 0.12} fill="#ABEBC6" opacity="0.3" />
                    <line x1={half} y1={size * 0.25} x2={half} y2={size * 0.75} stroke="#196F3D" strokeWidth="0.5" opacity="0.4" />
                    <line x1={size * 0.3} y1={half} x2={size * 0.7} y2={half} stroke="#196F3D" strokeWidth="0.5" opacity="0.4" />
                </g>
            );

        // Guardian Angel — golden wings with halo
        case 'guardian_angel':
            return (
                <g>
                    <defs>
                        <linearGradient id="ga-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#F9E79F" />
                            <stop offset="100%" stopColor="#D4AC0D" />
                        </linearGradient>
                    </defs>
                    <ellipse cx={half} cy={size * 0.15} rx={size * 0.18} ry={size * 0.06} fill="none" stroke="#F1C40F" strokeWidth="1" />
                    <path
                        d={`M${half},${size * 0.25} Q${size * 0.05},${size * 0.5} ${size * 0.15},${size * 0.85} L${size * 0.35},${size * 0.6} L${half},${size * 0.92}`}
                        fill="url(#ga-grad)"
                        stroke="#B7950B"
                        strokeWidth="0.4"
                        opacity="0.8"
                    />
                    <path
                        d={`M${half},${size * 0.25} Q${size * 0.95},${size * 0.5} ${size * 0.85},${size * 0.85} L${size * 0.65},${size * 0.6} L${half},${size * 0.92}`}
                        fill="url(#ga-grad)"
                        stroke="#B7950B"
                        strokeWidth="0.4"
                        opacity="0.8"
                    />
                    <circle cx={half} cy={size * 0.4} r={size * 0.06} fill="#FEF9E7" opacity="0.8" />
                </g>
            );

        // ===== Weapon Cards =====

        // Stone Blade — simple angular sword
        case 'stone_blade':
            return (
                <g>
                    <defs>
                        <linearGradient id="sblade-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#BDBDBD" />
                            <stop offset="100%" stopColor="#757575" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${half},${size * 0.08} ${half + size * 0.1},${size * 0.6} ${half},${size * 0.7} ${half - size * 0.1},${size * 0.6}`}
                        fill="url(#sblade-grad)"
                        stroke="#9E9E9E"
                        strokeWidth="0.5"
                    />
                    <rect
                        x={half - size * 0.12} y={size * 0.65}
                        width={size * 0.24} height={size * 0.06}
                        rx={1}
                        fill="#8B6914"
                    />
                    <rect
                        x={half - size * 0.03} y={size * 0.7}
                        width={size * 0.06} height={size * 0.22}
                        rx={1}
                        fill="#6D4C11"
                    />
                </g>
            );

        // Iron Pickaxe — crossed pickaxe shape
        case 'iron_pickaxe':
            return (
                <g>
                    <defs>
                        <linearGradient id="ipick-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4956B" />
                            <stop offset="100%" stopColor="#8B5A2B" />
                        </linearGradient>
                    </defs>
                    <rect
                        x={half - size * 0.03} y={size * 0.25}
                        width={size * 0.06} height={size * 0.65}
                        rx={1}
                        fill="#6D4C11"
                        transform={`rotate(-10 ${half} ${half})`}
                    />
                    <polygon
                        points={`${size * 0.2},${size * 0.15} ${size * 0.8},${size * 0.3} ${size * 0.75},${size * 0.4} ${size * 0.25},${size * 0.28}`}
                        fill="url(#ipick-grad)"
                        stroke="#A0673A"
                        strokeWidth="0.4"
                    />
                </g>
            );

        // Crystal Wand — elegant wand with crystal tip
        case 'crystal_wand':
            return (
                <g>
                    <defs>
                        <linearGradient id="cwand-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#81D4FA" />
                            <stop offset="100%" stopColor="#0288D1" />
                        </linearGradient>
                    </defs>
                    <rect
                        x={half - size * 0.025} y={size * 0.3}
                        width={size * 0.05} height={size * 0.6}
                        rx={1}
                        fill="#5D4037"
                    />
                    <polygon
                        points={`${half},${size * 0.05} ${half + size * 0.12},${size * 0.32} ${half},${size * 0.38} ${half - size * 0.12},${size * 0.32}`}
                        fill="url(#cwand-grad)"
                        stroke="#4FC3F7"
                        strokeWidth="0.4"
                    />
                    <circle
                        cx={half} cy={size * 0.22}
                        r={size * 0.04}
                        fill="#E1F5FE"
                        opacity="0.8"
                    />
                </g>
            );

        // Gold Hammer — heavy golden hammer
        case 'gold_hammer':
            return (
                <g>
                    <defs>
                        <linearGradient id="ghamm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFF176" />
                            <stop offset="100%" stopColor="#C49000" />
                        </linearGradient>
                    </defs>
                    <rect
                        x={half - size * 0.03} y={size * 0.35}
                        width={size * 0.06} height={size * 0.55}
                        rx={1}
                        fill="#6D4C11"
                    />
                    <rect
                        x={size * 0.18} y={size * 0.12}
                        width={size * 0.64} height={size * 0.28}
                        rx={size * 0.04}
                        fill="url(#ghamm-grad)"
                        stroke="#DAA520"
                        strokeWidth="0.5"
                    />
                    <rect
                        x={size * 0.22} y={size * 0.16}
                        width={size * 0.15} height={size * 0.08}
                        rx={1}
                        fill="#FFF9C4"
                        opacity="0.4"
                    />
                </g>
            );

        // Obsidian Edge — dark crystal blade with purple edge
        case 'obsidian_edge':
            return (
                <g>
                    <defs>
                        <linearGradient id="oedge-grad" x1="30%" y1="0%" x2="70%" y2="100%">
                            <stop offset="0%" stopColor="#CE93D8" />
                            <stop offset="50%" stopColor="#7B1FA2" />
                            <stop offset="100%" stopColor="#1A0020" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`${half},${size * 0.05} ${half + size * 0.15},${size * 0.55} ${half + size * 0.04},${size * 0.65} ${half},${size * 0.7} ${half - size * 0.04},${size * 0.65} ${half - size * 0.15},${size * 0.55}`}
                        fill="url(#oedge-grad)"
                        stroke="#9C27B0"
                        strokeWidth="0.5"
                    />
                    <rect
                        x={half - size * 0.1} y={size * 0.68}
                        width={size * 0.2} height={size * 0.05}
                        rx={1}
                        fill="#4A148C"
                    />
                    <rect
                        x={half - size * 0.025} y={size * 0.72}
                        width={size * 0.05} height={size * 0.2}
                        rx={1}
                        fill="#311B45"
                    />
                    <line
                        x1={half} y1={size * 0.1}
                        x2={half} y2={size * 0.6}
                        stroke="#E1BEE7"
                        strokeWidth="0.4"
                        opacity="0.3"
                    />
                </g>
            );

        // Star Cannon — futuristic energy weapon
        case 'star_cannon':
            return (
                <g>
                    <defs>
                        <linearGradient id="scannon-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="#F5F5F5" />
                            <stop offset="100%" stopColor="#9E9E9E" />
                        </linearGradient>
                        <radialGradient id="scannon-core" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                    <rect
                        x={size * 0.1} y={half - size * 0.08}
                        width={size * 0.65} height={size * 0.16}
                        rx={size * 0.03}
                        fill="url(#scannon-grad)"
                        stroke="#BDBDBD"
                        strokeWidth="0.4"
                    />
                    <polygon
                        points={`${size * 0.7},${half - size * 0.12} ${size * 0.92},${half} ${size * 0.7},${half + size * 0.12}`}
                        fill="#E0E0E0"
                        stroke="#BDBDBD"
                        strokeWidth="0.4"
                    />
                    <circle
                        cx={size * 0.88} cy={half}
                        r={size * 0.06}
                        fill="url(#scannon-core)"
                    />
                    <rect
                        x={size * 0.15} y={half + size * 0.08}
                        width={size * 0.18} height={size * 0.18}
                        rx={size * 0.02}
                        fill="#BDBDBD"
                        stroke="#9E9E9E"
                        strokeWidth="0.3"
                    />
                </g>
            );

        default:
            return (
                <circle cx={half} cy={half} r={half * 0.6} fill="#666" stroke="#888" strokeWidth="0.5" />
            );
    }
}

/**
 * Weapon icon variant with glow background
 */
export function WeaponIcon({ cardId, size = 24, glowColor, className }: {
    cardId: string;
    size?: number;
    glowColor?: string;
    className?: string;
}) {
    return (
        <div
            className={className}
            style={{
                width: size + 8,
                height: size + 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                background: glowColor
                    ? `radial-gradient(circle, ${glowColor}30, transparent)`
                    : undefined,
            }}
        >
            <ItemIcon itemId={cardId} size={size} />
        </div>
    );
}
