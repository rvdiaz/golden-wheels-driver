import { gql } from '@apollo/client';

export const getUserQuery = gql`
  query getUser($tenant: TenantData!, $userId: ID!) {
    getUser(tenant: $tenant, userId: $userId) {
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
