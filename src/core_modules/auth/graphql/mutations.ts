import { gql } from '@apollo/client';

export const addUserMutation = gql`
  mutation addUser($tenant: TenantData!, $user: UserInput!) {
    addUser(tenant: $tenant, user: $user) {
      email
      id
      activeTemplateId
      firstName
      lastName
      phone
      address {
        addressLine1
        localityva
        region
        postalCode
        country
      }
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
