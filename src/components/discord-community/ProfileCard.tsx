import { motion } from 'framer-motion'
import { Crown, Lightning, Trophy, Calendar } from '@phosphor-icons/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/discord-community/ui/avatar'
import { Badge } from '@/components/discord-community/ui/badge'
import { Progress } from '@/components/discord-community/ui/progress'
import { Card, CardContent, CardHeader } from '@/components/discord-community/ui/card'
import type { UserProfile, ServerRole } from '@/lib/discord-community/types'
import { xpProgress, getRankColor } from '@/lib/discord-community/types'

interface ProfileCardProps {
  profile: UserProfile
  availableRoles?: ServerRole[]
}

export function ProfileCard({ profile, availableRoles = [] }: ProfileCardProps) {
  const progress = xpProgress(profile.xp)
  const rankColor = getRankColor(profile.rank)
  const joinDate = new Date(profile.joinedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })

  const getUserRoles = () => {
    return profile.roles
      .map(roleId => availableRoles.find(r => r.id === roleId))
      .filter((role): role is ServerRole => role !== undefined)
  }

  const userRoles = getUserRoles()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="relative overflow-hidden border-2 glow-accent">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at top right, ${rankColor}, transparent 70%)`
          }}
        />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/50">
                  <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                  <AvatarFallback className="text-2xl">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <motion.div 
                  className="absolute -bottom-2 -right-2 bg-card rounded-full p-2 border-2 border-primary"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Crown className="h-5 w-5 glow-rank" style={{ color: rankColor }} weight="fill" />
                </motion.div>
              </div>
            </motion.div>

            <div className="flex-1 space-y-3">
              <div>
                <motion.h1 
                  className="text-3xl font-bold tracking-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {profile.username}
                  {profile.discriminator && (
                    <span className="text-muted-foreground font-normal">
                      #{profile.discriminator}
                    </span>
                  )}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <Badge 
                    className="text-sm font-semibold tracking-wider uppercase px-3 py-1 glow-rank"
                    style={{ 
                      backgroundColor: rankColor,
                      color: 'oklch(0.98 0 0)',
                      borderColor: rankColor
                    }}
                  >
                    {profile.rank}
                  </Badge>
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {joinDate}
                  </span>
                </motion.div>
              </div>

              <motion.div 
                className="flex items-center gap-6 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="bg-card p-2 rounded-lg border-2 font-mono font-semibold"
                    style={{ borderColor: rankColor }}
                  >
                    <span className="text-2xl" style={{ color: rankColor }}>
                      {profile.level}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground uppercase tracking-wide">
                    Level
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Lightning className="h-5 w-5 text-accent" weight="fill" />
                  <span className="font-mono font-semibold text-accent">
                    {profile.xp.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">XP</span>
                </div>

                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" weight="fill" />
                  <span className="font-mono font-semibold">
                    #{Math.floor(Math.random() * 500) + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">Rank</span>
                </div>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4 pt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {profile.level + 1}</span>
              <span className="font-mono font-semibold text-accent">
                {progress.current.toLocaleString()} / {progress.required.toLocaleString()} XP
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={progress.percentage} 
                className="h-3"
              />
              <motion.div
                className="absolute inset-0 h-3 rounded-full opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${rankColor}, transparent)`,
                  width: `${progress.percentage}%`
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            <div className="text-right text-xs text-muted-foreground">
              {progress.percentage.toFixed(1)}% complete
            </div>
          </motion.div>

          {userRoles.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {userRoles.slice(0, 5).map((role, index) => (
                <Badge 
                  key={role.id} 
                  className="text-xs font-semibold"
                  style={{
                    backgroundColor: role.color,
                    color: 'oklch(0.98 0 0)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {role.icon && <span className="mr-1">{role.icon}</span>}
                  {role.name}
                </Badge>
              ))}
              {userRoles.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{userRoles.length - 5} more
                </Badge>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
