import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, CaretDown, Check } from '@phosphor-icons/react'
import { Card } from '@/components/discord-community/ui/card'
import { Input } from '@/components/discord-community/ui/input'
import { Badge } from '@/components/discord-community/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/discord-community/ui/collapsible'
import type { Rule } from '@/lib/discord-community/rules'
import type { RuleProgress } from '@/types/community'

interface QuickReferenceProps {
  rules: Rule[]
  progress: RuleProgress[]
}

export function QuickReference({ rules, progress }: QuickReferenceProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set())

  const filteredRules = rules.filter(rule => {
    const query = searchQuery.toLowerCase()
    return (
      rule.title.toLowerCase().includes(query) ||
      rule.description.toLowerCase().includes(query) ||
      rule.examples.some(ex => ex.toLowerCase().includes(query))
    )
  })

  const toggleRule = (ruleId: string) => {
    setExpandedRules(prev => {
      const next = new Set(prev)
      if (next.has(ruleId)) {
        next.delete(ruleId)
      } else {
        next.add(ruleId)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-3">Quick Reference Guide</h2>
        <p className="text-muted-foreground mb-6">
          A quick overview of all community rules
        </p>
        
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" weight="duotone" />
          <Input
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredRules.map((rule, index) => {
            const ruleProgress = progress.find(p => p.ruleId === rule.id)
            const isExpanded = expandedRules.has(rule.id)
            const isMastered = ruleProgress?.mastered || false
            const isRead = ruleProgress?.read || false

            return (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible open={isExpanded} onOpenChange={() => toggleRule(rule.id)}>
                  <Card className={`overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm ${isMastered ? 'border-success/30' : ''}`}>
                    <CollapsibleTrigger className="w-full">
                      <div className="p-6 flex items-center gap-4 hover:bg-accent/50 transition-all">
                        <div className="text-3xl">{rule.icon}</div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{rule.title}</h3>
                            {isMastered && (
                              <Badge className="text-xs font-semibold bg-success text-success-foreground border-0">
                                Mastered
                              </Badge>
                            )}
                            {isRead && !isMastered && (
                              <Badge variant="outline" className="text-xs font-medium">
                                <Check className="h-3 w-3 mr-1" />
                                Read
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {rule.description}
                          </p>
                        </div>

                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CaretDown className="h-6 w-6 text-muted-foreground" weight="bold" />
                        </motion.div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-6 pb-6 pt-2 space-y-4 border-t border-border/50">
                        <div>
                          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                            Key Examples
                          </h4>
                          <ul className="space-y-2">
                            {rule.examples.map((example, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-1">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-success">Do This</h4>
                            <ul className="space-y-1.5">
                              {rule.doExamples.map((example, idx) => (
                                <li key={idx} className="text-sm bg-success/5 p-2.5 rounded-lg border border-success/20">
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-destructive">Don't Do This</h4>
                            <ul className="space-y-1.5">
                              {rule.dontExamples.map((example, idx) => (
                                <li key={idx} className="text-sm bg-destructive/5 p-2.5 rounded-lg border border-destructive/20">
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredRules.length === 0 && (
          <Card className="p-12 text-center border-border/50 bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground">No rules match your search.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
