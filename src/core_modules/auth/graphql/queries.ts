import { gql } from '@apollo/client';

export const getUserQuery = gql`
  query getUser($tenant: TenantData!, $userId: ID!) {
    getUser(tenant: $tenant, userId: $userId) {
      email
      id
      activeTemplateId
      name
      phone
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
