'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Trophy, 
  Play, 
  Books,
  Lock,
  ArrowRight
} from '@phosphor-icons/react';
import { Button } from '@/components/discord-community/ui/button';
import { Card } from '@/components/discord-community/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/discord-community/ui/tabs';
import { Progress } from '@/components/discord-community/ui/progress';
import { Badge } from '@/components/discord-community/ui/badge';
import { Toaster, toast } from 'sonner';
import { RULES, getQuizzesForRule } from '@/lib/discord-community/rules';
import { RuleLesson } from '@/components/discord-community/RuleLesson';
import { RuleQuiz } from '@/components/discord-community/RuleQuiz';
import { ProgressDashboard } from '@/components/discord-community/ProgressDashboard';
import { QuickReference } from '@/components/discord-community/QuickReference';
import { Confetti } from '@/components/discord-community/Confetti';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { RuleProgress } from '@/types/community';

type TabValue = 'learn' | 'quiz' | 'progress' | 'reference';

export default function CommunityPage() {
  const [progress, setProgress] = useLocalStorage<RuleProgress[]>(
    'rule-progress',
    RULES.map(rule => ({
      ruleId: rule.id,
      read: false,
      quizScore: null,
      quizAttempts: 0,
      mastered: false
    }))
  );
  
  const [currentRuleIndex, setCurrentRuleIndex] = useLocalStorage<number>('current-rule-index', 0);
  const [activeTab, setActiveTab] = useState<TabValue>('learn');
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('total-points', 0);

  const ruleIndex = currentRuleIndex ?? 0;
  const currentRule = RULES[ruleIndex];
  const currentProgress = progress?.find(p => p.ruleId === currentRule?.id);
  const totalRules = RULES.length;
  const completedRules = progress?.filter(p => p.read).length || 0;
  const masteredRules = progress?.filter(p => p.mastered).length || 0;
  const allRulesMastered = progress?.every(p => p.mastered) || false;

  const overallProgress = (completedRules / totalRules) * 100;

  useEffect(() => {
    if (allRulesMastered && masteredRules === totalRules) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [allRulesMastered, masteredRules, totalRules]);

  const handleRuleComplete = () => {
    if (!currentProgress?.read && progress) {
      setProgress(current => 
        current!.map(p => 
          p.ruleId === currentRule.id ? { ...p, read: true } : p
        )
      );
      toast.success('Rule completed! Moving to next rule...', {
        description: `You've read ${completedRules + 1} of ${totalRules} rules`
      });
      
      setTimeout(() => {
        const nextIndex = ruleIndex + 1;
        if (nextIndex < totalRules) {
          setCurrentRuleIndex(nextIndex);
        }
        setActiveTab('quiz');
      }, 1500);
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (!progress) return;

    const newProgress = progress.map(p => {
      if (p.ruleId === currentRule.id) {
        const newAttempts = p.quizAttempts + 1;
        const newScore = Math.max(p.quizScore || 0, score);
        return {
          ...p,
          quizScore: newScore,
          quizAttempts: newAttempts,
          mastered: passed && newScore >= 80
        };
      }
      return p;
    });

    setProgress(newProgress);

    if (passed) {
      const points = Math.round(score * 10);
      setTotalPoints((current) => (current || 0) + points);
      
      toast.success(`🎉 Quiz Passed! +${points} points`, {
        description: `Score: ${score}% on attempt ${(currentProgress?.quizAttempts || 0) + 1}`
      });

      // Move to next rule if available
      setTimeout(() => {
        const nextIndex = ruleIndex + 1;
        if (nextIndex < totalRules) {
          setCurrentRuleIndex(nextIndex);
          setActiveTab('learn');
        } else {
          setActiveTab('progress');
        }
      }, 2000);
    } else {
      toast.error('Try again!', {
        description: `Score: ${score}%. You need 70% to pass.`
      });
    }
  };

  const handleSelectRule = (index: number) => {
    setCurrentRuleIndex(index);
    setActiveTab('learn');
  };

  const getTabIcon = (tab: TabValue) => {
    switch (tab) {
      case 'learn': return <Books className="w-4 h-4" />;
      case 'quiz': return <Play className="w-4 h-4" />;
      case 'progress': return <Trophy className="w-4 h-4" />;
      case 'reference': return <ShieldCheck className="w-4 h-4" />;
    }
  };

  const isTabUnlocked = (tab: TabValue): boolean => {
    if (tab === 'learn' || tab === 'reference' || tab === 'progress') return true;
    if (tab === 'quiz') return currentProgress?.read || false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <Toaster position="top-center" richColors />
      {showConfetti && <Confetti />}

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Azure Community
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Interactive rules learning system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-400">Total Points</div>
                <div className="text-xl font-bold text-yellow-400">{totalPoints || 0}</div>
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {completedRules}/{totalRules} Rules
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <TabsList className="grid w-full grid-cols-4 bg-black/40">
              {(['learn', 'quiz', 'progress', 'reference'] as TabValue[]).map(tab => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  disabled={!isTabUnlocked(tab)}
                  className="relative data-[state=active]:bg-blue-500/20"
                >
                  <span className="flex items-center gap-2">
                    {getTabIcon(tab)}
                    <span className="capitalize">{tab}</span>
                    {!isTabUnlocked(tab) && <Lock className="w-3 h-3 ml-1" />}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="learn" className="p-6">
              {currentRule && (
                <RuleLesson 
                  rule={currentRule}
                  isCompleted={currentProgress?.read || false}
                  onComplete={handleRuleComplete}
                  ruleNumber={ruleIndex + 1}
                  totalRules={totalRules}
                />
              )}
            </TabsContent>

            <TabsContent value="quiz" className="p-6">
              {currentRule && currentProgress?.read && (
                <RuleQuiz
                  rule={currentRule}
                  quizzes={getQuizzesForRule(currentRule.id)}
                  previousScore={currentProgress?.quizScore || null}
                  isMastered={currentProgress?.mastered || false}
                  onComplete={handleQuizComplete}
                />
              )}
              {!currentProgress?.read && (
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-semibold mb-2">Complete the lesson first</h3>
                  <p className="text-gray-400 mb-4">
                    Read the current rule before taking the quiz
                  </p>
                  <Button onClick={() => setActiveTab('learn')}>
                    Go to Lesson
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="p-6">
              <ProgressDashboard
                rules={RULES}
                progress={progress || []}
                totalPoints={totalPoints || 0}
                onRuleSelect={handleSelectRule}
              />
            </TabsContent>

            <TabsContent value="reference" className="p-6">
              <QuickReference rules={RULES} progress={progress || []} />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
