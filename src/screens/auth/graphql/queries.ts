import { gql } from '@apollo/client';

export const getCustomerQuery = gql`
  query getCustomer($tenant: TenantData!, $customerId: ID!) {
    getCustomer(tenant: $tenant, customerId: $customerId) {
      name
      email
      phone
      preferenceLanguage
    }
  }
`;
