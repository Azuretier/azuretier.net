import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Shield, X } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/discord-community/ui/dialog'
import { Button } from '@/components/discord-community/ui/button'
import { ScrollArea } from '@/components/discord-community/ui/scroll-area'
import { Separator } from '@/components/discord-community/ui/separator'
import type { Rule } from '@/lib/discord-community/types'
import { toast } from 'sonner'

interface RulesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rules: Rule[]
  onAgree: () => void
  hasAgreed: boolean
}

export function RulesDialog({ open, onOpenChange, rules, onAgree, hasAgreed }: RulesDialogProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50
    if (isBottom && !scrolledToBottom) {
      setScrolledToBottom(true)
    }
  }

  const handleAgree = () => {
    onAgree()
    toast.success('Welcome to Azure Community!', {
      description: 'You have agreed to the community rules.',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" weight="fill" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Community Rules</DialogTitle>
              <DialogDescription>
                Please read and agree to our community guidelines
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea 
          className="flex-1 px-6 py-4 max-h-[400px]"
          onScrollCapture={handleScroll}
        >
          <div className="space-y-6">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-mono font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-lg text-card-foreground">
                      {rule.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
                {index < rules.length - 1 && <Separator className="mt-4" />}
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border flex-row gap-3">
          {hasAgreed ? (
            <div className="flex items-center gap-2 text-green-500 font-semibold">
              <Check className="h-5 w-5" weight="bold" />
              <span>Rules Agreed</span>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleAgree}
                disabled={!scrolledToBottom}
                className="flex-1 relative overflow-hidden"
              >
                <AnimatePresence>
                  {!scrolledToBottom && (
                    <motion.div
                      className="absolute inset-0 bg-primary/50"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
                <Check className="h-4 w-4 mr-2" weight="bold" />
                {scrolledToBottom ? 'I Agree to Rules' : 'Scroll to Continue'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
