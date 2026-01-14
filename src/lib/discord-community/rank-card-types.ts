import type { RankTier } from './types';

export interface RankCardData {
  cardId: string;
  status: 'ready' | 'not_found' | 'ambiguous' | 'loading';
  displayNameOriginal: string;
  displayNameKey: string;
  userId?: string;
  username?: string;
  avatarUrl?: string;
  level?: number;
  xp?: number;
  xpToNext?: number;
  rank?: RankTier;
  globalRank?: number;
  guildId: string;
  updatedAt: string;
  candidates?: MemberCandidate[];
}

export interface MemberCandidate {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  xp: number;
  rank: RankTier;
}

export interface EnsureRankCardRequest {
  displayName: string;
}

export interface EnsureRankCardResponse {
  success: boolean;
  rankCard: RankCardData;
  error?: string;
}

export interface Member {
  userId: string;
  username: string;
  displayName: string;
  displayNameKey: string;
  avatarUrl: string;
  xp: number;
  level: number;
  rank: RankTier;
  joinedAt: string;
  lastMessageAt?: string;
  messageCount?: number;
}
