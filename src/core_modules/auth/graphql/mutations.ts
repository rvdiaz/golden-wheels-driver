import { gql } from '@apollo/client';

export const addUserMutation = gql`
  mutation addUser($tenant: TenantData!, $user: UserInput!, $userId: ID!) {
    addUser(tenant: $tenant, user: $user, userId: $userId) {
      email
      id
      activeTemplateId
      firstName
      lastName
      phone
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
    }
  }
`;

export const updateUserMutation = gql`
  mutation updateUser($tenant: TenantData!, $updates: UserUpdateInput!, $userId: ID!) {
    updateUser(tenant: $tenant, updates: $updates, userId: $userId) {
      email
      id
      activeTemplateId
      firstName
      lastName
      phone
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
    }
  }
`;

export const deleteUserMutation = gql`
  mutation deleteUser($tenant: TenantData!, $userId: ID!) {
    deleteUser(tenant: $tenant, userId: $userId)
  }
`;
