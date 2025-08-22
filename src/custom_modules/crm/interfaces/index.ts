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
  CLIENT = 'client',
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

  followUp: Date | string;

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

export interface IFollowUp {
  id: string;
  contact: string;
  task: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CrmMetrics {
  label: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string
}
