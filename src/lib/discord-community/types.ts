export type RankTier = 'accordian' | 'arcadia' | 'apex' | 'legendary'

export interface UserProfile {
  id: string
  username: string
  discriminator?: string
  avatarUrl: string
  xp: number
  level: number
  rank: RankTier
  rulesAgreed: boolean
  roles: string[]
  joinedAt: string
}

export interface ServerRole {
  id: string
  name: string
  description: string
  color: string
  icon?: string
  category: 'activity' | 'interest' | 'contribution' | 'special'
  maxSelect?: number
}

export interface Rule {
  id: string
  title: string
  description: string
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100))
}

export function xpForLevel(level: number): number {
  return level * level * 100
}

export function xpProgress(xp: number): { current: number; required: number; percentage: number } {
  const level = calculateLevel(xp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const xpInLevel = xp - currentLevelXp
  const xpRequired = nextLevelXp - currentLevelXp
  
  return {
    current: xpInLevel,
    required: xpRequired,
    percentage: (xpInLevel / xpRequired) * 100
  }
}

export function getRankForLevel(level: number): RankTier {
  if (level >= 50) return 'legendary'
  if (level >= 30) return 'apex'
  if (level >= 15) return 'arcadia'
  return 'accordian'
}

export function getRankColor(rank: RankTier): string {
  const colors = {
    accordian: 'oklch(0.65 0.15 60)',
    arcadia: 'oklch(0.70 0.02 250)',
    apex: 'oklch(0.75 0.18 90)',
    legendary: 'oklch(0.60 0.20 290)'
  }
  return colors[rank]
}
