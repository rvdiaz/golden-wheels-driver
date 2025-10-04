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

export const updateUserMutation = gql`
  mutation updateUser($tenant: TenantData!, $updates: UserUpdateInput!, $userId: ID!) {
    updateUser(tenant: $tenant, updates: $updates, userId: $userId) {
      email
      id
      activeTemplateId
      firstName
      lastName
      phone
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
