import { gql } from '@apollo/client';

export const getCustomerQuery = gql`
  query getCustomer($tenant: TenantData!, $customerId: ID!) {
    getCustomer(tenant: $tenant, customerId: $customerId) {
      email
      id
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
    }
  }
`;
