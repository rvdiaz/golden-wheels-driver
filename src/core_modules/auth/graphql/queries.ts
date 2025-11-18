import { gql } from '@apollo/client';

export const getUserQuery = gql`
  query getUser($tenant: TenantData!, $userId: ID!, $token: String) {
    getUser(tenant: $tenant, userId: $userId, token: $token) {
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
        }
        balance {
          amount
          currency
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
  }
`;

export const onUserUpdatedSubscription = gql`
  subscription onUserUpdated($tenantId: ID!, $userId: ID!) {
    onUserUpdated(tenantId: $tenantId, userId: $userId) {
      tenantId
      userId
      user {
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
        }
        balance {
          amount
          currency
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
    }
  }
`;