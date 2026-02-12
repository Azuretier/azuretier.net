import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const RHYTHMIA_YOUTUBE_CHANNEL = 'https://www.youtube.com/@rhythmia_official';

const CONTENT_POOL = {
    tutorials: [
        { id: 'tut-tspin', topic: 'T-Spin', tags: ['technique', 'advanced'] },
        { id: 'tut-stacking', topic: 'Clean Stacking', tags: ['fundamentals', 'beginner'] },
        { id: 'tut-combos', topic: 'Combo Chains', tags: ['technique', 'intermediate'] },
        { id: 'tut-opener', topic: 'Openers & Setups', tags: ['strategy', 'advanced'] },
        { id: 'tut-rhythm', topic: 'Rhythm Timing', tags: ['rhythm', 'core'] },
        { id: 'tut-downstack', topic: 'Downstacking', tags: ['recovery', 'intermediate'] },
        { id: 'tut-harddrop', topic: 'Hard Drop Speed', tags: ['speed', 'fundamentals'] },
        { id: 'tut-garbage', topic: 'Garbage Management', tags: ['multiplayer', 'strategy'] },
        { id: 'tut-finesse', topic: 'Finesse & Efficiency', tags: ['speed', 'advanced'] },
        { id: 'tut-back2back', topic: 'Back-to-Back Chains', tags: ['scoring', 'intermediate'] },
        { id: 'tut-crafting', topic: 'Crafting System Guide', tags: ['items', 'core'] },
        { id: 'tut-items', topic: 'Item Strategy', tags: ['items', 'strategy'] },
        { id: 'tut-ranked', topic: 'Ranked Climbing Tips', tags: ['multiplayer', 'competitive'] },
        { id: 'tut-worlds', topic: 'World Progression', tags: ['worlds', 'exploration'] },
    ],
    videos: [
        { id: 'vid-beginner', title: 'RHYTHMIA Beginner Guide', category: 'guide' },
        { id: 'vid-tspin-tutorial', title: 'T-Spin Tutorial - From Zero to Hero', category: 'tutorial' },
        { id: 'vid-ranked-guide', title: 'How to Climb Ranked', category: 'competitive' },
        { id: 'vid-advanced-combos', title: 'Advanced Combo Techniques', category: 'tutorial' },
        { id: 'vid-update-showcase', title: 'Latest Update Showcase', category: 'news' },
        { id: 'vid-music-showcase', title: 'RHYTHMIA OST Preview', category: 'music' },
        { id: 'vid-multiplayer-tips', title: '1v1 Battle Tips & Tricks', category: 'competitive' },
        { id: 'vid-world-tour', title: 'World Tour - All Stages', category: 'showcase' },
    ],
};

interface ForYouRequest {
    locale: string;
    unlockedAdvancements: number;
    totalAdvancements: number;
    recentCategories?: string[];
}

interface ContentCard {
    type: 'tutorial' | 'video' | 'tip';
    id: string;
    title: string;
    description: string;
    tags?: string[];
    url?: string;
    thumbnail?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export async function POST(request: NextRequest) {
    try {
        const body: ForYouRequest = await request.json();
        const { locale, unlockedAdvancements, totalAdvancements, recentCategories } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { cards: getFallbackContent(locale, unlockedAdvancements, totalAdvancements) },
                { status: 200 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const progressPercent = totalAdvancements > 0
            ? Math.round((unlockedAdvancements / totalAdvancements) * 100)
            : 0;

        const skillLevel = progressPercent < 15 ? 'beginner'
            : progressPercent < 50 ? 'intermediate'
            : 'advanced';

        const prompt = `You are a content curator for RHYTHMIA, a rhythm x tetris fusion puzzle game. Generate personalized content recommendations for a player.

Player context:
- Skill level: ${skillLevel} (${unlockedAdvancements}/${totalAdvancements} advancements unlocked, ${progressPercent}%)
- Language: ${locale === 'ja' ? 'Japanese' : 'English'}
- Recent activity categories: ${recentCategories?.join(', ') || 'none'}

Available tutorials: ${JSON.stringify(CONTENT_POOL.tutorials.map(t => t.topic))}
Available videos: ${JSON.stringify(CONTENT_POOL.videos.map(v => v.title))}
YouTube channel: ${RHYTHMIA_YOUTUBE_CHANNEL}

Generate exactly 6 content cards as a JSON array. Each card should have:
- "type": "tutorial" | "video" | "tip"
- "id": unique string identifier
- "title": compelling title (${locale === 'ja' ? 'in Japanese' : 'in English'}, max 40 chars)
- "description": brief helpful description (${locale === 'ja' ? 'in Japanese' : 'in English'}, max 100 chars)
- "tags": array of 1-3 short tags
- "difficulty": "beginner" | "intermediate" | "advanced"

Mix the types: include 2 tutorials, 2 videos, and 2 tips. Prioritize content that matches the player's skill level. For beginner players, focus on fundamentals. For advanced players, focus on competitive strategies and optimization.

For videos, reference actual video titles from the available list and include a "url" field pointing to the YouTube channel.

For tips, generate unique gameplay advice relevant to the player's progress level.

Return ONLY the JSON array, no markdown fencing, no explanation.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        let cards: ContentCard[];
        try {
            const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
            cards = JSON.parse(cleaned);
            if (!Array.isArray(cards)) throw new Error('Not an array');
            cards = cards.slice(0, 6).map((card) => ({
                type: card.type || 'tip',
                id: card.id || `gen-${Math.random().toString(36).slice(2, 8)}`,
                title: String(card.title || '').slice(0, 60),
                description: String(card.description || '').slice(0, 150),
                tags: Array.isArray(card.tags) ? card.tags.slice(0, 3) : [],
                difficulty: ['beginner', 'intermediate', 'advanced'].includes(card.difficulty ?? '') ? card.difficulty : 'beginner',
                url: card.url || undefined,
            }));
        } catch {
            cards = getFallbackContent(locale, unlockedAdvancements, totalAdvancements);
        }

        return NextResponse.json({ cards });
    } catch (error) {
        console.error('For You API error:', error);
        return NextResponse.json(
            { cards: getFallbackContent('en', 0, 1) },
            { status: 200 }
        );
    }
}

function getFallbackContent(locale: string, unlocked: number, total: number): ContentCard[] {
    const isJa = locale === 'ja';
    const progressPercent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    const isBeginner = progressPercent < 25;

    if (isBeginner) {
        return [
            {
                type: 'tutorial',
                id: 'fb-stacking',
                title: isJa ? '基本スタッキングガイド' : 'Clean Stacking Basics',
                description: isJa ? 'きれいに積む基本テクニックをマスターしよう' : 'Master the fundamentals of building a clean board',
                tags: ['fundamentals', 'beginner'],
                difficulty: 'beginner',
            },
            {
                type: 'video',
                id: 'fb-vid-beginner',
                title: isJa ? 'RHYTHMIA 初心者ガイド' : 'RHYTHMIA Beginner Guide',
                description: isJa ? 'ゲームの基本を動画で学ぼう' : 'Learn the basics with this video walkthrough',
                tags: ['guide', 'video'],
                url: RHYTHMIA_YOUTUBE_CHANNEL,
                difficulty: 'beginner',
            },
            {
                type: 'tip',
                id: 'fb-tip-rhythm',
                title: isJa ? 'リズムに合わせてドロップ' : 'Drop to the Beat',
                description: isJa ? 'ビートに合わせてピースを落とすとボーナスポイント獲得' : 'Time your piece drops to the rhythm for bonus points',
                tags: ['rhythm', 'scoring'],
                difficulty: 'beginner',
            },
            {
                type: 'tutorial',
                id: 'fb-harddrop',
                title: isJa ? 'ハードドロップ活用法' : 'Hard Drop Mastery',
                description: isJa ? 'スピードアップのためのハードドロップテクニック' : 'Speed up your gameplay with hard drop techniques',
                tags: ['speed', 'fundamentals'],
                difficulty: 'beginner',
            },
            {
                type: 'video',
                id: 'fb-vid-ost',
                title: isJa ? 'RHYTHMIA サウンドトラック' : 'RHYTHMIA OST Preview',
                description: isJa ? 'ゲームの音楽を聴いてみよう' : 'Listen to the game soundtrack',
                tags: ['music'],
                url: RHYTHMIA_YOUTUBE_CHANNEL,
                difficulty: 'beginner',
            },
            {
                type: 'tip',
                id: 'fb-tip-adv',
                title: isJa ? '進捗を集めよう' : 'Collect Advancements',
                description: isJa ? '進捗を3つ解除してバトルアリーナを開放しよう' : 'Unlock 3 advancements to access the Battle Arena',
                tags: ['progression'],
                difficulty: 'beginner',
            },
        ];
    }

    return [
        {
            type: 'tutorial',
            id: 'fb-tspin',
            title: isJa ? 'Tスピン完全攻略' : 'T-Spin Mastery Guide',
            description: isJa ? 'Tスピンの全パターンとセットアップを解説' : 'All T-Spin patterns and setups explained',
            tags: ['technique', 'advanced'],
            difficulty: 'advanced',
        },
        {
            type: 'video',
            id: 'fb-vid-ranked',
            title: isJa ? 'ランク戦攻略ガイド' : 'How to Climb Ranked',
            description: isJa ? 'ランク戦で勝つための戦略を動画で解説' : 'Strategies for climbing the ranked ladder',
            tags: ['competitive', 'ranked'],
            url: RHYTHMIA_YOUTUBE_CHANNEL,
            difficulty: 'advanced',
        },
        {
            type: 'tip',
            id: 'fb-tip-b2b',
            title: isJa ? 'Back-to-Backを維持' : 'Keep Back-to-Back Alive',
            description: isJa ? 'B2Bチェインを維持して火力を最大化しよう' : 'Maintain B2B chains to maximize your attack power',
            tags: ['scoring', 'strategy'],
            difficulty: 'intermediate',
        },
        {
            type: 'tutorial',
            id: 'fb-garbage',
            title: isJa ? 'お邪魔ライン対策' : 'Garbage Line Management',
            description: isJa ? '対戦でのお邪魔ライン対処法をマスター' : 'Master dealing with garbage lines in battles',
            tags: ['multiplayer', 'strategy'],
            difficulty: 'intermediate',
        },
        {
            type: 'video',
            id: 'fb-vid-combos',
            title: isJa ? '上級コンボテクニック' : 'Advanced Combo Techniques',
            description: isJa ? '連続コンボで大量のラインを送り込む方法' : 'Send massive garbage with consecutive combos',
            tags: ['technique', 'competitive'],
            url: RHYTHMIA_YOUTUBE_CHANNEL,
            difficulty: 'advanced',
        },
        {
            type: 'tip',
            id: 'fb-tip-finesse',
            title: isJa ? 'フィネスで差をつけろ' : 'Finesse Makes the Difference',
            description: isJa ? '最小限のキー入力で正確にピースを配置しよう' : 'Place pieces with minimal key presses for maximum speed',
            tags: ['speed', 'optimization'],
            difficulty: 'advanced',
        },
    ];
}
