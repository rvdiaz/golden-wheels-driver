import { gql } from '@apollo/client';

export const getTenantConfigQuery = gql`
  query getTenant($id: ID!) {
    getTenant(id: $id) {
      id
      fullName
      solutions {
        name
        slug
        tenantModules {
          label
          moduleKey
          metaData
        }
      }
    }
  }
`;
