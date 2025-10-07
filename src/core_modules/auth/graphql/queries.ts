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
      systemData {
        tasksConfiguration {
          key
          description
          goalKey
          goalType
          label
          fields {
            goalKey
            goalType
            label
          }
        }
      }
    }
  }
`;
