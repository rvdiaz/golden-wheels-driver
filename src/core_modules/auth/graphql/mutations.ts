import { gql } from '@apollo/client';

export const addUserMutation = gql`
  mutation addUser($tenant: TenantData!, $user: UserInput!) {
    addUser(tenant: $tenant, user: $user) {
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
