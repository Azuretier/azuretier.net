import { motion } from 'framer-motion'
import { Check, Lock, Star, Trophy } from '@phosphor-icons/react'
import { Card } from '@/components/discord-community/ui/card'
import { Badge } from '@/components/discord-community/ui/badge'
import { Button } from '@/components/discord-community/ui/button'
import type { Rule } from '@/lib/discord-community/rules'
import type { RuleProgress } from '@/types/community'

interface ProgressDashboardProps {
  rules: Rule[]
  progress: RuleProgress[]
  totalPoints: number
  onRuleSelect: (index: number) => void
}

export function ProgressDashboard({ rules, progress, totalPoints, onRuleSelect }: ProgressDashboardProps) {
  const completedCount = progress.filter(p => p.read).length
  const masteredCount = progress.filter(p => p.mastered).length

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="text-5xl font-bold font-mono tabular-nums mb-2 bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
            {completedCount}/{rules.length}
          </div>
          <p className="text-sm font-medium text-muted-foreground">Rules Completed</p>
        </Card>

        <Card className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="text-5xl font-bold font-mono tabular-nums mb-2 bg-gradient-to-br from-success to-success/60 bg-clip-text text-transparent">
            {masteredCount}/{rules.length}
          </div>
          <p className="text-sm font-medium text-muted-foreground">Rules Mastered</p>
        </Card>

        <Card className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="text-5xl font-bold font-mono tabular-nums mb-2 bg-gradient-to-br from-warning to-warning/60 bg-clip-text text-transparent">
            {totalPoints}
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Points</p>
        </Card>
      </div>

      {masteredCount === rules.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 text-center border-success/50 bg-gradient-to-br from-success/5 to-success/10 backdrop-blur-sm shadow-lg shadow-success/10">
            <div className="inline-flex p-6 bg-success/10 rounded-3xl mb-4">
              <Trophy className="h-20 w-20 text-success" weight="duotone" />
            </div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg text-muted-foreground">
              You've mastered all community rules! You're now a Rules Master with {totalPoints} points!
            </p>
          </Card>
        </motion.div>
      )}

      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-6">Your Progress</h3>
        <div className="space-y-3">
          {rules.map((rule, index) => {
            const ruleProgress = progress.find(p => p.ruleId === rule.id)
            const isLocked = index > 0 && !progress[index - 1]?.read
            const isRead = ruleProgress?.read || false
            const isMastered = ruleProgress?.mastered || false
            const quizScore = ruleProgress?.quizScore

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => onRuleSelect(index)}
                  disabled={isLocked}
                  variant="ghost"
                  className={`
                    w-full justify-start h-auto p-4 transition-all border
                    ${isLocked ? 'opacity-50 cursor-not-allowed border-border' : 'border-border/50 hover:border-primary/50 hover:bg-accent/50'}
                    ${isMastered ? 'bg-success/5 border-success/30' : isRead ? 'bg-primary/5 border-primary/30' : ''}
                  `}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="text-3xl">{rule.icon}</div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-base">{rule.title}</span>
                        {isMastered && (
                          <Badge className="text-xs font-semibold bg-success text-success-foreground border-0">
                            <Trophy className="h-3 w-3 mr-1" weight="fill" />
                            Mastered
                          </Badge>
                        )}
                        {isRead && !isMastered && (
                          <Badge variant="outline" className="text-xs font-medium">
                            <Check className="h-3 w-3 mr-1" />
                            Read
                          </Badge>
                        )}
                        {isLocked && (
                          <Badge variant="outline" className="text-xs font-medium">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {quizScore !== null && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" weight="duotone" />
                            Quiz: {quizScore}/2
                          </span>
                        )}
                        {ruleProgress && ruleProgress.quizAttempts > 0 && (
                          <span>{ruleProgress.quizAttempts} attempt{ruleProgress.quizAttempts !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
