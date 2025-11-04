import { gql } from '@apollo/client';

export const getSubscriptionPlans = gql`
  query GetSubscriptionPlans($tenant: TenantData!) {
    getSubscriptionPlans(tenant: $tenant) {
      productId
      name
      description
      price
      hasTrial
      trialPeriodDays
      features {
        id
        label
        description
        meta
      }
      subscriptionId
      tenantId
      active
      platforms
      billingPeriod
      badge
      discount
      order
      createdAt
      updatedAt
    }
  }
`;

export const validatePurchaseMutation = gql`
  mutation validatePurchase($tenant: TenantData!, $userId: ID!, $purchaseData: PurchaseInput!) {
    validatePurchase(tenant: $tenant, userId: $userId, purchaseData: $purchaseData) {
      id
      status
      error
    }
  }
`;
