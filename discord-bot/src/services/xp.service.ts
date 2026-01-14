import type { UserProfile } from '../types/index.js';
import { calculateLevel, getRankForLevel } from '../utils/xp.js';
import { kvService } from './kv.service.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('XPService');

export class XPService {
  private xpCooldowns: Map<string, number> = new Map();
  private xpPerMessage: number = 10;
  private cooldownSeconds: number = 60;

  async addXP(userId: string, username: string, amount: number, _reason: string): Promise<{
    profile: UserProfile;
    leveledUp: boolean;
    oldLevel: number;
    rankChanged: boolean;
  }> {
    let profile = await kvService.getUserProfile(userId);
    
    if (!profile) {
      profile = this.createDefaultProfile(userId, username);
    }

    const oldLevel = profile.level;
    const oldRank = profile.rank;
    
    profile.xp += amount;
    profile.level = calculateLevel(profile.xp);
    profile.rank = getRankForLevel(profile.level);
    profile.lastMessageAt = new Date().toISOString();
    profile.messageCount = (profile.messageCount || 0) + 1;

    await kvService.setUserProfile(userId, profile);

    const leveledUp = profile.level > oldLevel;
    const rankChanged = profile.rank !== oldRank;

    if (leveledUp) {
      logger.info(`User ${username} leveled up to level ${profile.level}`);
    }
    if (rankChanged) {
      logger.info(`User ${username} ranked up to ${profile.rank}`);
    }

    return { profile, leveledUp, oldLevel, rankChanged };
  }

  canGainXP(userId: string): boolean {
    const lastGain = this.xpCooldowns.get(userId);
    if (!lastGain) return true;
    
    const now = Date.now();
    const timeSince = (now - lastGain) / 1000;
    
    return timeSince >= this.cooldownSeconds;
  }

  setCooldown(userId: string): void {
    this.xpCooldowns.set(userId, Date.now());
  }

  async processMessageXP(userId: string, username: string): Promise<{
    gained: boolean;
    profile?: UserProfile;
    leveledUp?: boolean;
    rankChanged?: boolean;
  }> {
    if (!this.canGainXP(userId)) {
      return { gained: false };
    }

    this.setCooldown(userId);
    
    const result = await this.addXP(userId, username, this.xpPerMessage, 'message');
    
    return {
      gained: true,
      profile: result.profile,
      leveledUp: result.leveledUp,
      rankChanged: result.rankChanged
    };
  }

  async getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
    const userIds = await kvService.getAllUserIds();
    const profiles: UserProfile[] = [];

    for (const userId of userIds) {
      const profile = await kvService.getUserProfile(userId);
      if (profile) {
        profiles.push(profile);
      }
    }

    return profiles
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }

  private createDefaultProfile(userId: string, username: string): UserProfile {
    return {
      id: userId,
      username,
      avatarUrl: `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`,
      xp: 0,
      level: 0,
      rank: 'accordian',
      rulesAgreed: false,
      roles: ['member'],
      joinedAt: new Date().toISOString(),
      messageCount: 0
    };
  }

  async setXP(userId: string, username: string, xp: number): Promise<UserProfile> {
    let profile = await kvService.getUserProfile(userId);
    
    if (!profile) {
      profile = this.createDefaultProfile(userId, username);
    }

    profile.xp = xp;
    profile.level = calculateLevel(xp);
    profile.rank = getRankForLevel(profile.level);

    await kvService.setUserProfile(userId, profile);
    
    return profile;
  }
}

export const xpService = new XPService();
