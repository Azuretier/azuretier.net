import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, Trophy, WarningCircle } from '@phosphor-icons/react'
import { Card } from '@/components/discord-community/ui/card'
import { Button } from '@/components/discord-community/ui/button'
import { Badge } from '@/components/discord-community/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/discord-community/ui/radio-group'
import { Label } from '@/components/discord-community/ui/label'
import { Alert, AlertDescription } from '@/components/discord-community/ui/alert'
import type { Rule, Quiz } from '@/lib/discord-community/rules'

interface RuleQuizProps {
  rule: Rule
  quizzes: Quiz[]
  onComplete: (score: number, perfect: boolean) => void
  previousScore: number | null
  isMastered: boolean
}

export function RuleQuiz({ rule, quizzes, onComplete, previousScore, isMastered }: RuleQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(quizzes.length).fill(false))

  const currentQuestion = quizzes[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer
  const progress = ((currentQuestionIndex + 1) / quizzes.length) * 100

  const handleAnswerSelect = (index: number) => {
    if (!showFeedback) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    setShowFeedback(true)
    
    if (isCorrect) {
      setScore(score + 1)
    }

    const newAnswered = [...answeredQuestions]
    newAnswered[currentQuestionIndex] = true
    setAnsweredQuestions(newAnswered)
  }

  const handleNext = () => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      const finalScore = isCorrect ? score + 1 : score
      const isPerfect = finalScore === quizzes.length
      setIsFinished(true)
      onComplete(finalScore, isPerfect)
    }
  }

  const handleRetake = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setScore(0)
    setIsFinished(false)
    setAnsweredQuestions(new Array(quizzes.length).fill(false))
  }

  if (!currentQuestion) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No quiz questions available for this rule.</p>
      </Card>
    )
  }

  if (isFinished) {
    const finalScore = score
    const percentage = (finalScore / quizzes.length) * 100
    const isPerfect = finalScore === quizzes.length

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-8 text-center space-y-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <div className="text-6xl">
            {isPerfect ? '🎉' : finalScore >= quizzes.length * 0.7 ? '👏' : '📚'}
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">
              {isPerfect ? 'Perfect Score!' : finalScore >= quizzes.length * 0.7 ? 'Well Done!' : 'Keep Learning!'}
            </h2>
            <p className="text-muted-foreground text-lg">
              You scored {finalScore} out of {quizzes.length} questions
            </p>
          </div>

          <div className="flex justify-center">
            <div className="text-center p-8 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Score</p>
              <p className="text-6xl font-bold font-mono tabular-nums bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">{Math.round(percentage)}%</p>
              <p className="text-sm text-muted-foreground mt-3">+{finalScore * 10} points</p>
            </div>
          </div>

          {isPerfect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <Badge className="bg-success text-success-foreground px-4 py-2 text-lg border-0 shadow-lg shadow-success/20">
                <Trophy className="h-5 w-5 mr-2" weight="fill" />
                Rule Mastered!
              </Badge>
            </motion.div>
          )}

          {!isPerfect && (
            <Alert>
              <WarningCircle className="h-4 w-4" />
              <AlertDescription>
                Try again to achieve mastery! Review the lesson and aim for a perfect score.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 justify-center">
            <Button onClick={handleRetake} size="lg" variant="outline">
              Retake Quiz
            </Button>
            {previousScore !== null && (
              <Button onClick={() => window.location.reload()} size="lg" variant="ghost">
                Continue Learning
              </Button>
            )}
          </div>

          {previousScore !== null && (
            <p className="text-sm text-muted-foreground">
              Previous best: {previousScore}/{quizzes.length}
            </p>
          )}
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-medium">
              Question {currentQuestionIndex + 1} of {quizzes.length}
            </Badge>
            {isMastered && (
              <Badge className="bg-success text-success-foreground border-0">
                <Trophy className="h-3 w-3 mr-1" weight="fill" />
                Mastered
              </Badge>
            )}
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`p-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg transition-all ${showFeedback ? (isCorrect ? 'border-success/50 shadow-success/10' : 'border-destructive/50 shadow-destructive/10') : ''}`}>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{rule.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold leading-relaxed mb-4">
                    {currentQuestion.question}
                  </h3>

                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(val) => handleAnswerSelect(parseInt(val))}
                    disabled={showFeedback}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index
                      const isCorrectAnswer = index === currentQuestion.correctAnswer
                      const showCorrect = showFeedback && isCorrectAnswer
                      const showIncorrect = showFeedback && isSelected && !isCorrectAnswer

                      return (
                        <motion.div
                          key={index}
                          whileHover={!showFeedback ? { scale: 1.02 } : {}}
                          whileTap={!showFeedback ? { scale: 0.98 } : {}}
                        >
                          <Label
                            htmlFor={`option-${index}`}
                            className={`
                              flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                              ${isSelected && !showFeedback ? 'border-primary bg-primary/5' : 'border-border'}
                              ${showCorrect ? 'border-success bg-success/10' : ''}
                              ${showIncorrect ? 'border-destructive bg-destructive/10' : ''}
                              ${showFeedback ? 'cursor-default' : 'hover:border-primary/50'}
                            `}
                          >
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <span className="flex-1 text-base">{option}</span>
                            {showCorrect && (
                              <Check className="h-5 w-5 text-success" weight="bold" />
                            )}
                            {showIncorrect && (
                              <X className="h-5 w-5 text-destructive" weight="bold" />
                            )}
                          </Label>
                        </motion.div>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert className={isCorrect ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <Check className="h-5 w-5 text-success mt-0.5" weight="bold" />
                      ) : (
                        <X className="h-5 w-5 text-destructive mt-0.5" weight="bold" />
                      )}
                      <div>
                        <p className="font-semibold mb-1">
                          {isCorrect ? 'Correct!' : 'Not quite right'}
                        </p>
                        <AlertDescription>
                          {currentQuestion.explanation}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              )}

              <div className="flex justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Score: <span className="font-mono font-semibold text-foreground">{score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}</span>
                </div>

                {!showFeedback ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    size="lg"
                    className="gap-2"
                  >
                    Submit Answer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="gap-2"
                  >
                    {currentQuestionIndex < quizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
