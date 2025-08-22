export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum TaskStatus {
  active = 'active',
  overridden = 'inactive',
}

export enum TaskSource {
  user = 'user',
  admin = 'admin',
}

export enum TaskCategory {
  TRAINING = 'training',
  EDUCATION = 'education',
  NETWORKING = 'networking',
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  scheduledTime: Date | string;
  isCompleted: boolean;
  targetCount?: number;
  currentProgress?: number;
  date: string;
  priority: TaskPriority;
  category: TaskCategory;
  userId: string;
  source: TaskSource;
  status: TaskStatus;
  durationMinutes: number;
}

export interface TaskFormValues {
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  scheduledTime: Date | string;
}
