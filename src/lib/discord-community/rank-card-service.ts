import type { RankCardData, Member, MemberCandidate } from './rank-card-types';
import { calculateLevel, getRankForLevel, xpForLevel } from './types';

// Mock member data - in a real app, this would come from Firestore or a database
const mockMembers: Record<string, Member[]> = {};

// Store rank cards in localStorage
const RANK_CARD_STORAGE_KEY = 'discord-rank-cards';

function normalizeDisplayName(displayName: string): string {
  return displayName.trim().normalize('NFKC').toLowerCase();
}

function generateCardId(guildId: string, displayNameKey: string): string {
  // Create a stable hash from guildId and displayNameKey
  const data = `${guildId}:${displayNameKey}`;
  // Simple hash for client-side (in real app, use crypto on server)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function getRankCards(): Record<string, RankCardData> {
  try {
    const stored = localStorage.getItem(RANK_CARD_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveRankCard(cardId: string, rankCard: RankCardData): void {
  try {
    const cards = getRankCards();
    cards[cardId] = rankCard;
    localStorage.setItem(RANK_CARD_STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Failed to save rank card:', error);
  }
}

// Initialize mock members for testing
function initializeMockMembers(guildId: string): void {
  if (!mockMembers[guildId]) {
    mockMembers[guildId] = [
      {
        userId: '123456789',
        username: 'TestUser',
        displayName: 'Test User',
        displayNameKey: normalizeDisplayName('Test User'),
        avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
        xp: 5000,
        level: calculateLevel(5000),
        rank: getRankForLevel(calculateLevel(5000)),
        joinedAt: new Date().toISOString(),
        messageCount: 150,
      },
      {
        userId: '987654321',
        username: 'Azuret',
        displayName: 'あずれっと',
        displayNameKey: normalizeDisplayName('あずれっと'),
        avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
        xp: 25000,
        level: calculateLevel(25000),
        rank: getRankForLevel(calculateLevel(25000)),
        joinedAt: new Date().toISOString(),
        messageCount: 750,
      },
      {
        userId: '555555555',
        username: 'CoolDev',
        displayName: 'Cool Dev 🚀',
        displayNameKey: normalizeDisplayName('Cool Dev 🚀'),
        avatarUrl: 'https://cdn.discordapp.com/embed/avatars/2.png',
        xp: 15000,
        level: calculateLevel(15000),
        rank: getRankForLevel(calculateLevel(15000)),
        joinedAt: new Date().toISOString(),
        messageCount: 420,
      },
    ];
  }
}

export async function ensureRankCard(
  guildId: string,
  displayName: string
): Promise<{ success: boolean; rankCard: RankCardData; error?: string }> {
  try {
    // Normalize the display name
    const normalizedName = displayName.trim().normalize('NFKC');
    const displayNameKey = normalizedName.toLowerCase();
    
    // Generate stable card ID
    const cardId = generateCardId(guildId, displayNameKey);
    
    // Initialize mock data for testing
    initializeMockMembers(guildId);
    
    // Search for members with matching display name
    const members = mockMembers[guildId] || [];
    const matches = members.filter(m => m.displayNameKey === displayNameKey);
    
    let rankCard: RankCardData;
    
    if (matches.length === 0) {
      // No matches found
      rankCard = {
        cardId,
        status: 'not_found',
        displayNameOriginal: normalizedName,
        displayNameKey,
        guildId,
        updatedAt: new Date().toISOString(),
      };
    } else if (matches.length === 1) {
      // Single match - create ready rank card
      const member = matches[0];
      const allMembers = members.sort((a, b) => b.xp - a.xp);
      const globalRank = allMembers.findIndex(m => m.userId === member.userId) + 1;
      
      // Calculate XP to next level
      const nextLevelXp = xpForLevel(member.level + 1);
      const xpToNext = nextLevelXp - member.xp;
      
      rankCard = {
        cardId,
        status: 'ready',
        displayNameOriginal: member.displayName,
        displayNameKey,
        userId: member.userId,
        username: member.username,
        avatarUrl: member.avatarUrl,
        level: member.level,
        xp: member.xp,
        xpToNext,
        rank: member.rank,
        globalRank,
        guildId,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Multiple matches - ambiguous
      const candidates: MemberCandidate[] = matches.map(m => ({
        userId: m.userId,
        username: m.username,
        displayName: m.displayName,
        avatarUrl: m.avatarUrl,
        level: m.level,
        xp: m.xp,
        rank: m.rank,
      }));
      
      rankCard = {
        cardId,
        status: 'ambiguous',
        displayNameOriginal: normalizedName,
        displayNameKey,
        guildId,
        candidates,
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Save to localStorage
    saveRankCard(cardId, rankCard);
    
    return { success: true, rankCard };
  } catch (error) {
    console.error('Error ensuring rank card:', error);
    return {
      success: false,
      rankCard: {
        cardId: 'error',
        status: 'not_found',
        displayNameOriginal: displayName,
        displayNameKey: normalizeDisplayName(displayName),
        guildId,
        updatedAt: new Date().toISOString(),
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getRankCard(
  guildId: string,
  displayName: string
): Promise<{ success: boolean; rankCard: RankCardData | null }> {
  try {
    const displayNameKey = normalizeDisplayName(displayName);
    const cardId = generateCardId(guildId, displayNameKey);
    
    const cards = getRankCards();
    const rankCard = cards[cardId];
    
    if (!rankCard) {
      return { success: false, rankCard: null };
    }
    
    return { success: true, rankCard };
  } catch (error) {
    console.error('Error getting rank card:', error);
    return { success: false, rankCard: null };
  }
}
