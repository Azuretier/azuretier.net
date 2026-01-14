export interface RuleProgress {
  ruleId: string;
  read: boolean;
  quizScore: number | null;
  quizAttempts: number;
  mastered: boolean;
}
