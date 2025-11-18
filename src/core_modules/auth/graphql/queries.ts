import { gql } from '@apollo/client';

const UserFragment = gql`
  fragment UserFragment on User {
    email
    id
    activeTemplateId
    firstName
    lastName
    phone
    mlsNumber
    brokerage
    financialGoals {
      avgCommissionByRents
      avgCommissionBySales
      desiredAnnualIncome
    }
    swotAnalysis {
      strengths
      weaknesses
      opportunities
      threats
    }
    visionMission {
      statement
      drivesYou
      oneYear
      fiveYear
    }
    address {
      addressLine1
      locality
      region
      postalCode
      country
      addressLine4
      addressLine3
      addressLine2
    }
    profileSteps {
      id
      title
      subSteps
    }
    profileSetupSkipped
    hasSeenProfileCompletionCongrats
    modules {
      icon
      label
      isBottomBar
      metaData
      moduleKey
      path
      customIcon
      comingSoon
      modules {
        label
        metaData
        icon
        description
        color
        backgroundColor
        moduleKey
        available
        comingSoon
      }
      possiblePermissions {
        label
        slug
      }
    }
    balance {
      amount
      currency
      lastUpdatedAt
    }
    createdAt
    emailVerified
    hasCustomSchedule
    notificationToken
    preferenceLanguage
    subscription {
      billingIssueDetectedDate
      isAutoRenewing
      endDate
      originalStartDate
      originalTransactionId
      platform
      productId
      startDate
      status
    }
  }
`;

export const getUserQuery = gql`
  query getUser($tenant: TenantData!, $userId: ID!, $token: String) {
    getUser(tenant: $tenant, userId: $userId, token: $token) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const onUserUpdatedSubscription = gql`
  subscription onUserUpdated($tenantId: ID!, $userId: ID!) {
    onUserUpdated(tenantId: $tenantId, userId: $userId) {
      tenantId
      userId
      user {
        ...UserFragment
      }
      balance {
        amount
        currency
      }
    }
  }
  ${UserFragment}
`;
