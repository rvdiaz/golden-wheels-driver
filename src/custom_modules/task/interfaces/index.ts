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

export enum ActiveTab {
  custom = 'custom',
  admin = 'admin',
}

export enum GoalsMetric {
  Training,
  Marketing,
  ColdCall,
  Networking,
  Education,
  ListingAppoinmentForSale,
  ListingAppoinmentForRent,
  ShowigPropertyForSale,
  ShowigPropertyForRent,
  PersonalTime,
  FollowUps,
  MailOuts,
}

export interface ITask {
  id: string;
  title: string;
  scheduledTime: Date | string;
  isCompleted: boolean;
  targetCount?: number;
  currentProgress?: number;
  priority: TaskPriority;
  category: string;
  userId: string;
  source: TaskSource;
  status: TaskStatus;
  startTime: Date | string;
  endTime: Date | string;
  date: Date | string;
  description: string;
  progress: GoalType[];
}

export interface TaskFormValues {
  title: string;
  category: string;
  priority: TaskPriority;
  startTime: Date | string | null;
  endTime: Date | string | null;
  date: Date | string;
  description: string;
}

export interface GoalType {
  goalKey: string;
  goalType: string;
  value: number | string;
}
