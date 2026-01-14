import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  Trophy, 
  Play, 
  Books,
  Lock,
  ArrowRight
} from '@phosphor-icons/react'
import { Button } from '@/components/discord-community/ui/button'
import { Card } from '@/components/discord-community/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/discord-community/ui/tabs'
import { Progress } from '@/components/discord-community/ui/progress'
import { Badge } from '@/components/discord-community/ui/badge'
import { Toaster, toast } from 'sonner'
import { RULES, getQuizzesForRule } from '@/lib/discord-community/rules'
import { RuleLesson } from '@/components/discord-community/RuleLesson'
import { RuleQuiz } from '@/components/discord-community/RuleQuiz'
import { ProgressDashboard } from '@/components/discord-community/ProgressDashboard'
import { QuickReference } from '@/components/discord-community/QuickReference'
import { Confetti } from '@/components/discord-community/Confetti'
import { useKV } from '@/hooks/use-kv'

export interface RuleProgress {
  ruleId: string
  read: boolean
  quizScore: number | null
  quizAttempts: number
  mastered: boolean
}

type TabValue = 'learn' | 'quiz' | 'progress' | 'reference'

export function HomePage() {
  const [progress, setProgress] = useKV<RuleProgress[]>('rule-progress', 
    RULES.map(rule => ({
      ruleId: rule.id,
      read: false,
      quizScore: null,
      quizAttempts: 0,
      mastered: false
    }))
  )
  
  const [currentRuleIndex, setCurrentRuleIndex] = useKV<number>('current-rule-index', 0)
  const [activeTab, setActiveTab] = useState<TabValue>('learn')
  const [showConfetti, setShowConfetti] = useState(false)
  const [totalPoints, setTotalPoints] = useKV<number>('total-points', 0)

  const ruleIndex = currentRuleIndex ?? 0
  const currentRule = RULES[ruleIndex]
  const currentProgress = progress?.find(p => p.ruleId === currentRule?.id)
  const totalRules = RULES.length
  const completedRules = progress?.filter(p => p.read).length || 0
  const masteredRules = progress?.filter(p => p.mastered).length || 0
  const allRulesMastered = progress?.every(p => p.mastered) || false

  const overallProgress = (completedRules / totalRules) * 100

  useEffect(() => {
    if (allRulesMastered && masteredRules === totalRules) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [allRulesMastered, masteredRules, totalRules])

  const handleRuleComplete = () => {
    if (!currentProgress?.read && progress) {
      setProgress(current => 
        current!.map(p => 
          p.ruleId === currentRule.id ? { ...p, read: true } : p
        )
      )
      toast.success('Rule completed! Moving to next rule...', {
        description: `You've read ${completedRules + 1} of ${totalRules} rules`
      })
      
      setTimeout(() => {
        const nextIndex = ruleIndex + 1
        if (nextIndex < RULES.length) {
          setCurrentRuleIndex(nextIndex)
        } else {
          toast.success('All rules read! Take quizzes to master them!', {
            description: 'Switch to the Quiz tab to test your knowledge'
          })
          setActiveTab('progress')
        }
      }, 1500)
    }
  }

  const handleQuizComplete = (score: number, perfect: boolean) => {
    if (!progress) return
    
    const quizQuestions = getQuizzesForRule(currentRule.id).length
    const newPoints = score * 10
    
    setProgress(current => 
      current!.map(p => 
        p.ruleId === currentRule.id
          ? { 
              ...p, 
              quizScore: score,
              quizAttempts: p.quizAttempts + 1,
              mastered: perfect
            }
          : p
      )
    )

    setTotalPoints(current => (current || 0) + newPoints)

    if (perfect) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      toast.success('Perfect score! Rule mastered! 🎉', {
        description: `+${newPoints} points earned`
      })
    } else {
      toast.success(`Quiz complete! ${score}/${quizQuestions} correct`, {
        description: `+${newPoints} points earned. ${perfect ? 'Rule mastered!' : 'Try again for a perfect score!'}`
      })
    }
  }

  const handleRuleSelect = (ruleIndex: number) => {
    if (ruleIndex === 0 || (ruleIndex > 0 && progress?.[ruleIndex - 1]?.read)) {
      setCurrentRuleIndex(ruleIndex)
      setActiveTab('learn')
    } else {
      toast.error('Complete previous rules first!', {
        description: 'Rules must be completed in order'
      })
    }
  }

  const canAccessQuiz = currentProgress?.read || false

  if (!progress || !currentRule) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.15_265/0.1),transparent_50%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 space-y-8">
        <motion.header 
          className="space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                <div className="relative p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <ShieldCheck className="h-10 w-10 text-primary" weight="duotone" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Community Rules
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Azure Community · Interactive Learning
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                <p className="text-4xl font-bold font-mono tabular-nums bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                  {totalPoints}
                </p>
              </div>
              {allRulesMastered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <Badge className="px-4 py-2 text-base font-semibold bg-gradient-to-r from-success to-success/80 text-success-foreground border-0 shadow-lg shadow-success/20">
                    <Trophy className="h-5 w-5 mr-2" weight="fill" />
                    Rules Master
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>

          <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Overall Progress</span>
                <span className="text-foreground font-semibold">
                  {completedRules}/{totalRules} completed · {masteredRules} mastered
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </Card>
        </motion.header>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1.5 bg-muted/50 border border-border/50 backdrop-blur-sm">
            <TabsTrigger value="learn" className="gap-2 py-3 font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Books className="h-4 w-4" weight="duotone" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2 py-3 font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm" disabled={!canAccessQuiz}>
              <Play className="h-4 w-4" weight="duotone" />
              <span className="hidden sm:inline">Quiz</span>
              {!canAccessQuiz && <Lock className="h-3 w-3" />}
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2 py-3 font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Trophy className="h-4 w-4" weight="duotone" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2 py-3 font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <ShieldCheck className="h-4 w-4" weight="duotone" />
              <span className="hidden sm:inline">Reference</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="learn" className="space-y-6">
              <motion.div
                key={`learn-${ruleIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RuleLesson 
                  rule={currentRule}
                  isCompleted={currentProgress?.read || false}
                  onComplete={handleRuleComplete}
                  ruleNumber={ruleIndex + 1}
                  totalRules={totalRules}
                />
              </motion.div>

              {ruleIndex < RULES.length - 1 && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setCurrentRuleIndex(ruleIndex + 1)}
                    variant="ghost"
                    className="gap-2"
                    disabled={!currentProgress?.read}
                  >
                    Skip to Next Rule
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6">
              <motion.div
                key={`quiz-${ruleIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {canAccessQuiz ? (
                  <RuleQuiz
                    rule={currentRule}
                    quizzes={getQuizzesForRule(currentRule.id)}
                    onComplete={handleQuizComplete}
                    previousScore={currentProgress?.quizScore ?? null}
                    isMastered={currentProgress?.mastered || false}
                  />
                ) : (
                  <Card className="p-12 text-center border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="inline-flex p-4 bg-muted rounded-2xl">
                        <Lock className="h-12 w-12 text-muted-foreground" weight="duotone" />
                      </div>
                      <h3 className="text-2xl font-bold">Quiz Locked</h3>
                      <p className="text-muted-foreground">
                        Complete the lesson first to unlock the quiz
                      </p>
                      <Button onClick={() => setActiveTab('learn')} className="mt-4">
                        Go to Lesson
                      </Button>
                    </div>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <ProgressDashboard
                rules={RULES}
                progress={progress}
                totalPoints={totalPoints || 0}
                onRuleSelect={handleRuleSelect}
              />
            </TabsContent>

            <TabsContent value="reference" className="space-y-6">
              <QuickReference rules={RULES} progress={progress} />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

// Exported as HomePage
