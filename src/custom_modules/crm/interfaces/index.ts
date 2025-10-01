export enum ContactCategory {
  AGENT = 'agent',
  BUYER = 'buyer',
  SELLER = 'seller',
  RENTER = 'renter',
  LANDLORD = 'landlord',
  FSBO = 'fsbo',
  FRBO = 'frbo',
  EXPIRED = 'expired',
  INVESTOR = 'investor',
}

export enum ContactType {
  LEAD = 'lead',
  Contact = 'contact',
}

export enum ActiveCrmTabs {
  lead = 'Lead',
  contact = 'contact',
  followUp = 'Follow-ups',
}

export interface IContact {
  id: string;
  tenantId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category?: ContactCategory;
  address?: string;
  priority?: 'low' | 'medium' | 'high';
  notes: string;
  type?: ContactType; // NEW: Lifecycle type
  leadStatus?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'; // NEW: Status for leads
  leadStatusHistory?: string[]; // Optional: Track past statuses
  convertedAt?: string; // Optional: When converted to client
  createdAt: string; // Optional: When converted to client
  updatedAt: string; // Optional: When converted to client
}

export interface IActivity {
  id: string;
  type: 'call' | 'email' | 'meeting';
  contact: string;
  description: string;
  time: string;
}

export interface CrmMetrics {
  label: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
  onPress: () => void;
  active: boolean;
}

// interfaces/followUp.interface.ts
export enum IsDoneValues {
  done = 1,
  notDone = 0,
}

export interface FollowUpIContact {
  contactId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

export interface IFollowUp {
  followUpId: string;
  userId: string;
  tenantId: string;
  date: string;
  time: Date | string;
  notes: string;
  title: string;
  contact: FollowUpIContact;
  isDone: IsDoneValues;
}

export interface IFollowUpResponse {
  followUps: IFollowUp[];
  total: number;
  hasMore: boolean;
}

export interface PhoneContact {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumbers?: Array<{ number: string; label?: string; digits: string }>;
  emails?: Array<{ email: string; label?: string }>;
  company?: string;
  jobTitle?: string;
  addresses?: Array<{ street?: string; city?: string; region?: string; postalCode?: string }>;
}
