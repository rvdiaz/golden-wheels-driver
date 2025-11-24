// Base types
export interface TenantData {
  tenantId: string;
  // Add other tenant fields as needed
}

export interface BaseEntity {
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Training Category
export interface TrainingCategory extends BaseEntity {
  categoryId: string;
  name: string;
  description: string;
}

// Training Program
export type TrainingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface TrainingProgram extends BaseEntity {
  trainingId: string;
  categoryId: string;
  createdBy: string;
  title: string;
  description: string;
  level: TrainingLevel;
  tags: string[];
}

// Training Module
export interface TrainingModule extends BaseEntity {
  moduleId: string;
  trainingProgramId: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: number; // in minutes
  tags: string[];
}

// Training Course Content
export type ContentType = 'VIDEO' | 'DOCUMENT' | 'QUIZ' | 'AUDIO' | 'INTERACTIVE' | 'TEXT';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
  passingScore: number;
  allowRetake: boolean;
  timeLimit?: number; // in minutes
}

export interface ContentItem {
  order: number;
  type: ContentType;
  title: string;
  thumbnailUrl?: string;
  description: string;
  url?: string;
  fileSize?: number;
  mimeType?: string;
  estimatedDuration?: number; // in minutes
  quizData?: QuizData;
}

// Training Course
export interface TrainingCourse extends BaseEntity {
  courseId: string;
  trainingProgramId: string;
  moduleId: string;
  title: string;
  description: string;
  htmlDescription: string;
  estimatedDuration: number; // in minutes
  tags: string[];
  order: number;
  contentItems: ContentItem[];
}

// Extended types with relationships
export interface TrainingProgramWithDetails extends TrainingProgram {
  category?: TrainingCategory;
  modules?: TrainingModule[];
  totalDuration?: number;
  moduleCount?: number;
  courseCount?: number;
}

export interface TrainingModuleWithCourses extends TrainingModule {
  courses?: TrainingCourse[];
  totalDuration?: number;
  courseCount?: number;
}

export interface TrainingCourseWithProgress extends TrainingCourse {
  progress?: number; // 0-100
  completed?: boolean;
  lastAccessedAt?: string;
}

// Filter and sort types
export interface TrainingProgramFilters {
  categoryId?: string;
  level?: TrainingLevel;
  tags?: string[];
  searchTerm?: string;
}

export interface TrainingSortOptions {
  field: 'title' | 'createdAt' | 'updatedAt' | 'order' | 'estimatedDuration';
  direction: 'asc' | 'desc';
}

// Form types for mutations (to be used later)
export interface CreateTrainingCategoryInput {
  name: string;
  description: string;
}

export interface UpdateTrainingCategoryInput {
  categoryId: string;
  name?: string;
  description?: string;
}

export interface CreateTrainingProgramInput {
  categoryId: string;
  title: string;
  description: string;
  level: TrainingLevel;
  tags: string[];
}

export interface UpdateTrainingProgramInput {
  trainingId: string;
  categoryId?: string;
  title?: string;
  description?: string;
  level?: TrainingLevel;
  tags?: string[];
}

export interface CreateTrainingModuleInput {
  trainingProgramId: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: number;
  tags: string[];
}

export interface UpdateTrainingModuleInput {
  moduleId: string;
  title?: string;
  description?: string;
  order?: number;
  estimatedDuration?: number;
  tags?: string[];
}

export interface CreateTrainingCourseInput {
  trainingProgramId: string;
  moduleId: string;
  title: string;
  description: string;
  estimatedDuration: number;
  tags: string[];
  order: number;
  contentItems: ContentItem[];
}

export interface UpdateTrainingCourseInput {
  courseId: string;
  title?: string;
  description?: string;
  estimatedDuration?: number;
  tags?: string[];
  order?: number;
  contentItems?: ContentItem[];
}
