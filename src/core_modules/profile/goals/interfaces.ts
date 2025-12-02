export const Frequencies = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const;

export interface IGoalProgress {
  active: boolean;
  progressId: string;
  goalId: string;
  goalName: string;
  goalDescription: string;
  userId: string;
  frequency: (typeof Frequencies)[number];
  period: string;
  goalKey: string;
  targetValue: number;
  value: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  group: string;
}
