import { gql } from '@apollo/client';

export const getCarTypesQuery = gql`
  query getCarTypes($tenant: TenantData!, $returnAll: Boolean) {
    getCarTypes(tenant: $tenant, returnAll: $returnAll) {
      id
      name
      description
      image {
        url
        alt
      }
      maxPassengers
    }
  }
`;
