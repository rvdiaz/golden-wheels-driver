import { gql } from '@apollo/client';

export const getSubscriptionPlans = gql`
  query GetSubscriptionPlans($tenant: TenantData!, $active: Boolean) {
    getSubscriptionPlans(tenant: $tenant, active: $active) {
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

export const getAppPaymentProductsQuery = gql`
  query getAppPaymentProductsPlans($tenant: TenantData!, $active: Boolean) {
    getAppPaymentProductsPlans(tenant: $tenant, active: $active) {
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
  mutation validatePurchase(
    $tenant: TenantData!
    $userId: ID!
    $platform: String!
    $appAppleId: Float
    $purchase: AWSJSON!
  ) {
    validatePurchase(
      tenant: $tenant
      userId: $userId
      platform: $platform
      appAppleId: $appAppleId
      purchase: $purchase
    ) {
      id
      status
      error
    }
  }
`;
