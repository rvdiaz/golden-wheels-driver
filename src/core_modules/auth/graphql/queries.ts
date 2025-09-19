import { gql } from '@apollo/client';

export const getUserQuery = gql`
  query getUser($tenant: TenantData!, $userId: ID!, $token: String) {
    getUser(tenant: $tenant, userId: $userId, token: $token) {
      email
      id
      activeTemplateId
      name
      phone
      address {
        addressLine1
        locality
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
        modules {
          label
          metaData
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
