import { gql } from '@apollo/client';

export const getCustomerQuery = gql`
  query getCustomer(
    $tenant: TenantData!
    $customerId: ID!
    $token: String
    $appInfo: AppInfoInput
  ) {
    getCustomer(tenant: $tenant, customerId: $customerId) {
      id
      name
      email
      phone
      preferenceLanguage
    }
  }
`;
