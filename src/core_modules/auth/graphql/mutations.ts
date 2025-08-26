import { gql } from '@apollo/client';

export const addUserMutation = gql`
  mutation addUser($tenant: TenantData!, $user: UserInput!) {
    addUser(tenant: $tenant, user: $user) {
      email
      id
      activeTemplateId
      image {
        alt
        s3Key
        url
      }
      name
      phone
    }
  }
`;
