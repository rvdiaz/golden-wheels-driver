export enum BillingPeriod {
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
}

export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

export interface SubscriptionPlanFeature {
  id: string;
  label: string;
  included: boolean;
  meta?: unknown;
}

export interface SubscriptionPlan {
  productId: string;
  name: string;
  description: string;
  price: number;
  hasTrial: boolean;
  trialPeriodDays?: number;
  features: SubscriptionPlanFeature[];
  subscriptionId: string;
  tenantId: string;
  active: boolean;
  platforms: Platform[];
  billingPeriod?: BillingPeriod;
  badge?: string;
  discount?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
