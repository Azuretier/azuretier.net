import { motion } from 'framer-motion'
import { Check, Lightbulb, CheckCircle, XCircle } from '@phosphor-icons/react'
import { Card } from '@/components/discord-community/ui/card'
import { Button } from '@/components/discord-community/ui/button'
import { Badge } from '@/components/discord-community/ui/badge'
import { Separator } from '@/components/discord-community/ui/separator'
import type { Rule } from '@/lib/discord-community/rules'

interface RuleLessonProps {
  rule: Rule
  isCompleted: boolean
  onComplete: () => void
  ruleNumber: number
  totalRules: number
}

export function RuleLesson({ rule, isCompleted, onComplete, ruleNumber, totalRules }: RuleLessonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-8 border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{rule.icon}</div>
              <div>
                <Badge variant="outline" className="mb-3 font-medium">
                  Rule {ruleNumber} of {totalRules}
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight">{rule.title}</h2>
              </div>
            </div>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <Badge className="px-3 py-1.5 font-semibold bg-success text-success-foreground border-0">
                  <Check className="h-4 w-4 mr-1.5" weight="bold" />
                  Completed
                </Badge>
              </motion.div>
            )}
          </div>

          <Separator />

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-foreground/80">
              {rule.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-accent/50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-accent-foreground" weight="duotone" />
              </div>
              <h3 className="text-xl font-semibold">Key Examples</h3>
            </div>
            
            <div className="grid gap-3">
              {rule.examples.map((example, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-accent/30 border border-accent/50"
                >
                  <div className="mt-0.5 h-7 w-7 flex items-center justify-center flex-shrink-0 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-base leading-relaxed">{example}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" weight="duotone" />
                </div>
                <h4 className="text-lg font-semibold">Do This</h4>
              </div>
              <div className="space-y-2">
                {rule.doExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-success/5 border border-success/20 text-sm"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-destructive" weight="duotone" />
                </div>
                <h4 className="text-lg font-semibold">Don't Do This</h4>
              </div>
              <div className="space-y-2">
                {rule.dontExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-destructive/5 border border-destructive/20 text-sm"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {!isCompleted ? (
              <Button
                size="lg"
                onClick={onComplete}
                className="gap-2 text-lg px-8 shadow-lg shadow-primary/20"
              >
                <Check className="h-5 w-5" weight="bold" />
                Got It! Continue
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                disabled
              >
                <Check className="h-5 w-5" weight="bold" />
                Completed
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
