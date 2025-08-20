import { ReactNode } from 'react';

export enum Priority {
  high = 'high',
  medium = 'medium',
  low = 'low',
}

export enum TaskStatus {
  active = 'active',
  overridden = 'inactive',
}

export enum TaskSource {
  user = 'user',
  admin = 'admin',
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  scheduledTime: string;
  isCompleted: boolean;
  targetCount?: number;
  currentProgress?: number;
  date: string;
  priority: Priority;
  category: string;
  userId: string;
  source: TaskSource;
  status: TaskStatus;
  durationMinutes: number;
}

export interface ITaskCategory {
  value: string;
  label: string;
  icon: ReactNode;
  color: string;
}
