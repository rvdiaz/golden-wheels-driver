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

export enum TaskCategory {
  TRAINING = 'training',
  EDUCATION = 'education',
  NETWORKING = 'networking',
  MLS_RESEARCH = 'MLS Research',
  SOCIAL_MEDIA_WORK = 'Social Media Work',
  SOCIAL_MEDIA_POST = 'Social Media Post',
  CALLING_FRIEND_CONTACTS = 'Calling Friends/Contacts',
  CALLING_FSBO = 'Calling FSBOs',
  CALLING_EXPIRED = 'Calling Expireds',
  RENTALS = 'Rentals',
  LUNCH = 'Lunch',
  VIEW_NEW_LISTING = 'Vie New Listing',
  DINNER = 'Dinner',
  WORK_ON_CRM = 'Work on CRM',
  VISIT_OPEN_HOUSE = 'Visit Open House',
  HOST_OPEN_HOUSE = 'Host Open House',
  FSBO_OUTREACH = 'FSBO Outreach',
  LISTING_APPOINTMENT_FOR_SALE = 'Listing Appointment for Sale',
  LISTING_APPOINTMENT_FOR_RENT = 'Listing Appointment for Rent',
  SHOWING_PROPERTY_FOR_SALE = 'Showing Property for Sale',
  SHOWING_PROPERTY_FOR_RENT = 'Showing Property for Rent',
  PERSONAL_TIME = 'Personal Time',
  FOLLOW_UP_NEW_CONTACT = 'Follow-Ups - New Contacts',
  MAIL_OUTS = 'Mail Outs',
}

export interface ITask {
  id: string;
  title: string;
  scheduledTime: Date | string;
  isCompleted: boolean;
  targetCount?: number;
  currentProgress?: number;
  priority: TaskPriority;
  category: TaskCategory;
  userId: string;
  source: TaskSource;
  status: TaskStatus;
  startTime: Date | string;
  endTime: Date | string;
  date: Date | string;
}

export interface TaskFormValues {
  title: string;
  category: string;
  priority: TaskPriority;
  startTime: Date | null;
  endTime: Date | null;
  date: Date | string;
}
